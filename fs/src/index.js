const {createServer} = require('http');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const {MongoClient} = require('mongodb');
const GridFsStorageService = require('./GridFsStorageService');
const fs = require('fs');
require('dotenv').config({path: `.env.${process.env.NODE_ENV}`});

process.on('uncaughtException', function (err) {
  console.error((err && err.stack) ? err.stack : err);
});

const url = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const dbName = process.env.DB_NAME || 'fs';

const client = new MongoClient(url);

async function main() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const fsFiles = db.collection('fs.files');

    const app = express();
    app.use(cors());

    const gridFs = new GridFsStorageService({bucket: 'fs', db: db})
    const multerStorageEngine = {
      _handleFile: async (req, file, cb) => {
        try {
          const uploadedFile = await gridFs.createFile(file);
          // @ts-ignore @obsolete @v1.0
          req.__uploadedFileName = uploadedFile.filename;
          // @ts-ignore @v2.0
          req.__uploadedFile = uploadedFile;
          cb(null, file);
        } catch (e) {
          console.error(e);
          cb(null, null);
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      _removeFile: () => {
      }
    }
    const multerOptions = {storage: multerStorageEngine}
    const uploadFileHandler = multer(multerOptions).any();
    app.get('/', (req, res) => res.send('FS'))
    app.get(`/${process.env.UPLOAD_PAGE}`, (req, res) => {
      const content = fs.readFileSync('./src/upload.html')
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.send(content);
    })
    app.post('/api/1.0.0/', uploadFileHandler, (req, res) => res.send(req.__uploadedFile));
    app.get('/api/1.0.0/:fileName', async (req, res, next) => {
      const fileInfo = await fsFiles.findOne({filename: req.params.fileName})
      if (fileInfo && fileInfo.contentType)
        res.setHeader('Content-Type', fileInfo.contentType);
      res.setHeader('Cache-Control', 'max-age=315360000');
      let file;
      if (req.headers.range) {
        const [start, end] = (req.headers.range.split('=')[1]).split('-')
        const range = {}
        if (start) range.start = +start
        if (end) {
          range.end = +end;
          res.status(206)
        }
        file = await gridFs.getFile(req.params.fileName, range)
      } else {
        file = await gridFs.getFile(req.params.fileName)
      }
      if (!file) {
        res.status(404).end()
        return
      }
      file.on('error', next).pipe(res)
    });
    app.delete('/api/1.0.0/:fileName', async (req, res) => {
      await gridFs.deleteFile(req.params.fileName);
      res.send('OK');
    })
    const httpServer = createServer(app);
    const PORT = process.env.PORT || process.env.API_PORT || 8081;
    httpServer.listen({port: PORT}, () => console.log(`file server ready at http://localhost:${PORT}`));
  } catch (e) {
    console.error(e);
  }
}

main().then(() => console.log('...'));

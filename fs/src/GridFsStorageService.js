const forkStream = require('./forkStream');
const sharp = require('sharp');
const {GridFSBucket} = require('mongodb');
const _ = require('lodash');
const path = require('path');

class GridFsStorageService {
  constructor(options) {
    this.fileCollectionName = `${options.bucket}.files`;
    this.db = options.db;
    this.bucket = new GridFSBucket(this.db, {
      bucketName: options.bucket,
      chunkSizeBytes: 1024 * 128 /*128 kb*/
    });
  }

  createFile(file) {
    return new Promise((resolve, reject) => {
      try {
        const ext = path.extname(file.originalname);
        const fileName = `${Date.now()}-${_.random(1000, 9999, false)}`;
        const fullFileName = `${fileName}${ext}`

        if (file.mimetype.startsWith('image')) {
          console.log('[GridFsStorageService] image file detected, creating thumbnail...')
          const thumbnailFileName = `${fileName}-thumbnail${ext}`;
          let uploadedFile, uploadedThumbnailFile;
          let onFileUploadedFire = 0;
          const onFileUploaded = () => {
            onFileUploadedFire++;
            if (uploadedFile && uploadedThumbnailFile || onFileUploadedFire === 2) {
              resolve(uploadedFile)
            }
          }

          const thumbnailUploadStream = this.bucket.openUploadStream(thumbnailFileName, {contentType: file.mimetype, metadata: {encoding: file.encoding}});
          thumbnailUploadStream.once('error', e => console.error(e, '[GridFsStorageService] error'))
          thumbnailUploadStream.once('finish', result => {
            uploadedThumbnailFile = result;
            onFileUploaded();
          })

          const uploadStream = this.bucket.openUploadStream(fullFileName, {
            contentType: file.mimetype,
            metadata: {
              encoding: file.encoding,
              originalname: file.originalname,
              thumbnail: thumbnailFileName
            }
          });
          uploadStream.once('error', e => {
            console.error(e, 'upload stream error');
            reject(e)
          });
          uploadStream.once('finish', result => {
            uploadedFile = result;
            onFileUploaded();
          });
          const thumbnailWriteStream = sharp().resize(100).jpeg();
          thumbnailWriteStream.pipe(thumbnailUploadStream);
          file.stream.pipe(forkStream([thumbnailWriteStream])).pipe(uploadStream);
        } else {
          const uploadStream = this.bucket.openUploadStream(fullFileName, {
            contentType: file.mimetype,
            metadata: {
              encoding: file.encoding,
              originalname: file.originalname,
            }
          });
          uploadStream.once('error', e => {
            console.error(e, 'upload stream error');
            reject(e)
          });
          uploadStream.once('finish', uploadedFile => resolve(uploadedFile));
          file.stream.pipe(uploadStream);
        }
      } catch (e) {
        reject(e);
      }
    })
  }

  async getFile(fileName, option) {
    return this.bucket.openDownloadStreamByName(fileName, option);
  }

  async getEtag(fileName) {
    const fileInfo = await this.db.collection(this.fileCollectionName).findOne({filename: fileName})
    return fileInfo.md5
  }

  async deleteFile(fileName) {
    const fileInfo = await this.db.collection(this.fileCollectionName).findOne({filename: fileName});
    return this.bucket.delete(fileInfo._id);
  }
}

module.exports = GridFsStorageService

import {create, update, remove} from "../business-logic/file-system/file";
import {addFileToFolder, removeFileFromFolder} from "../business-logic/file-system/folder";
import DataParser from "../utils/data-parser";
import {requireAdmin} from "../middlewares/auth";
import $ from "../utils/safe-call";
import Routerex from '@tvux/routerex';

export default async function useFile(parentRouter) {
   console.log('[route] useFile')

   const router = Routerex()

   router.post('/', {
      title: 'Create file',
      desc: 'Create file',
      schema: {
         body: {
            name: {
               type: 'string',
               desc: 'File name',
               required: true
            },
            src: {
               type: 'string',
               desc: 'File source',
               required: true
            },
            size: {
               type: 'number',
               desc: 'File size',
               required: true
            },
            type: {
               type: 'string',
               desc: 'File type',
               required: true
            },
            thumbnail: {
               type: 'string',
               desc: 'File thumbnail',
            },
            folderId: {
               type: 'string',
               desc: 'Folder id',
               required: true
            }
         }
      },
      response: {
         200: {
            type: 'object',
         }
      }
   }, requireAdmin, $(async req => {
      const {name, src, size, type, thumbnail, folderId} = req.body
      const file = await create({name, src, size, type, thumbnail, createdAt: new Date()})
      if (folderId)
         await addFileToFolder(DataParser.objectId(folderId), file._id)
      return file
   }))
   router.put('/:id', {
      title: 'Update file',
      desc: 'Update file',
      schema: {
         params: {
            id: {
               type: 'string',
               desc: 'File id',
               required: true
            }
         },
         body: {
            change: {
               type: 'object',
               desc: 'Change',
               required: true
            }
         }
      },
      response: {
         200: {
            type: 'object',
         }
      }
   }, requireAdmin, $(async req => {
      return update(DataParser.objectId(req.params.id), req.body.change)
   }))
   router.delete('/:id', {
      title: 'Delete file',
      desc: 'Delete file',
      schema: {
         params: {
            id: {
               type: 'string',
               desc: 'File id',
               required: true
            }
         }
      },
      response: {
         200: {
            type: 'object',
         }
      }
   }, requireAdmin, $(async req => {
      const folderId = DataParser.objectId(req.query.folderId, false)
      const fileId = DataParser.objectId(req.params.id)
      const data = await remove(fileId)
      if (folderId)
         await removeFileFromFolder(folderId, fileId)
      return data
   }))

   parentRouter.use('/file', router)
}

import {addFileToFolder, removeFileFromFolder, getFolderTree, getFiles, create, update, remove} from "../../business-logic/file-system/folder";
import DataParser from "../../utils/data-parser";

import Router from "routerex";
import {requireAdmin, requireUser} from "../../middlewares/auth";
import $ from "../../utils/safe-call";

const router = Router();

router.get('/', {
   title: 'Get folder tree',
   desc: 'Get folder tree',
   response: {
      200: {
         type: 'object',
         desc: 'Folder tree'
      }
   }
}, requireUser, $(async () => getFolderTree()));
router.post('/', {
   title: 'Create folder',
   desc: 'Create folder',
   schema: {
      body: {
         name: {
            type: 'string',
            desc: 'Folder name',
            required: true
         },
         parent: {
            type: 'string',
            desc: 'Parent folder id'
         }
      }
   },
   response: {
      200: {
         type: 'object',
         desc: 'Folder'
      }
   }
}, requireAdmin, $(async req => {
   const {name, parent} = req.body;
   return create(name, DataParser.objectId(parent, false))
}));
router.get('/:id', {
   title: 'Get folder files',
   desc: 'Get folder files',
   schema: {
      params: {
         id: {
            type: 'string',
            desc: 'Folder id',
            required: true
         }
      }
   },
   response: {
      200: {
         type: 'array',
         desc: 'Folder files'
      }
   }
}, requireUser, $(async req => {
   const folderId = DataParser.objectId(req.params.id)
   return getFiles(folderId)
}));
router.put('/:id', {
   title: 'Update folder',
   desc: 'Update folder',
   schema: {
      params: {
         id: {
            type: 'string',
            desc: 'Folder id',
            required: true
         }
      },
      body: {
         name: {
            type: 'string',
            desc: 'Folder name',
            required: true
         }
      }
   },
   response: {
      200: {
         type: 'object',
         desc: 'Folder'
      }
   }
}, requireAdmin, $(async req => {
   const folderId = DataParser.objectId(req.params.id)
   const {name} = req.body
   return update(folderId, {name})
}));
router.delete('/:id', {
   title: 'Delete folder',
   desc: 'Delete folder',
   schema: {
      params: {
         id: {
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
   const folderId = DataParser.objectId(req.params.id)
   return remove(folderId)
}))
router.post('/add-file', {
   title: 'Add file to folder',
   desc: 'Add file to folder',
   schema: {
      body: {
         folderId: {
            type: 'string',
            desc: 'Folder id',
            required: true
         },
         fileId: {
            type: 'string',
            desc: 'File id',
            required: true
         }
      }
   },
   response: {
      200: {
         type: 'object',
         desc: 'Folder'
      }
   }
}, requireAdmin, $(async req => {
   const {folderId, fileId} = req.body
   return addFileToFolder(DataParser.objectId(folderId), DataParser.objectId(fileId))
}));
router.post('/remove-file', {
   title: 'Remove file from folder',
   desc: 'Remove file from folder',
   schema: {
      body: {
         folderId: {
            type: 'string',
            desc: 'Folder id',
            required: true
         },
         fileId: {
            type: 'string',
            desc: 'File id',
            required: true
         }
      }
   },
   response: {
      200: {
         type: 'object',
         desc: 'Folder'
      }
   }
}, requireAdmin, $(async req => {
   const {folderId, fileId} = req.body
   return removeFileFromFolder(DataParser.objectId(folderId), DataParser.objectId(fileId))
}));

export default router

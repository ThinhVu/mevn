import Router from "routerex";
import $ from "../middlewares/safe-call";
import {requireAdmin} from "../middlewares/auth";
import {get, getValue, getAll, set, remove} from "../business-logic/kv";

const router = Router()

const getAllKvsMetadata = {
   title: 'Get all key-value pair',
   desc: 'Get all key-value pair',
   response: {
      type: 'array',
      items: {
         type: 'object',
         properties: {
            key: {type: 'string'},
            value: {type: 'string'}
         }
      }
   }
}
router.get('/', getAllKvsMetadata, requireAdmin, $(async () => getAll()));

const getSpecifiedKvMetadata = {
   title: 'Get specified kv',
   desc: 'Get specified kv',
   schema: {
      params: {
         key: {
            type: 'string',
            desc: 'A string containing the name of the key you want to create/update.'
         }
      }
   },
   response: {
      type: 'string',
      desc: 'The value of the key'
   }
}
router.get('/:key', getSpecifiedKvMetadata, requireAdmin, $(async req => {
   const rs = await getValue(req.params.key)
   return rs && rs.value
}))

const setKvMetadata = {
   title: 'Set system config value',
   desc: 'Set value of system config',
   schema: {
      params: {
         key: {
            type: 'string',
            desc: 'A string containing the name of the key you want to create/update.'
         }
      },
      body: {
         type: 'object',
         properties: {
            payload: {
               type: 'string',
               desc: 'The value of the key'
            }
         }
      }
   },
   response: {
      type: 'object',
      properties: {
         key: {type: 'string'},
         value: {type: 'string'}
      }
   }
}
router.post('/:key', setKvMetadata, requireAdmin, $(async req => {
   const {value, isSecret} = req.body
   const cfg = await set(req.params.key, value, isSecret)
   // @ts-ignore
   global.io.to('system-config').emit(`system-config:set`, cfg)
   return cfg
}))

const unsetKvMetadata = {
   title: 'Delete system config',
   desc: 'Delete system config',
   schema: {
      params: {
         key: {
            type: 'string',
            desc: 'A string containing the name of the key you want to delete.'
         }
      }
   },
   response: {
      type: 'boolean',
      desc: 'Whether the key is deleted'
   }
}
router.delete('/:key', unsetKvMetadata, requireAdmin, $(async req => {
   const {key} = req.params
   const cfg = await get(key)
   if (!cfg) throw new Error("Not found")
   const {deletedCount} = await remove(key)
   const deleted = deletedCount === 1
   if (deleted) {
      // @ts-ignore
      global.io.to('system-config').emit(`system-config:unset`, cfg)
   }
   return deleted
}));

export default router

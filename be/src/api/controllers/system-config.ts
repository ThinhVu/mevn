import $ from "../../middlewares/safe-call";
import {requireAdmin} from "../../middlewares/auth";
import SystemConfigModel from "../../db/models/system-config";
import Router from "routerex";

const router = Router();

router.get('/', {
   title: 'Get all system config',
   desc: 'Get all system config',
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
}, requireAdmin, $(async () => SystemConfigModel.find()));
router.get('/:key', {
   title: 'Get system config value',
   desc: 'Get current value of system config',
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
}, $(async req => {
   const rs = await SystemConfigModel.findOne({key: req.params.key})
   return rs && rs.value
}));
router.post('/:key', {
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
}, requireAdmin, $(async req => {
   const cfg = await SystemConfigModel.updateOne(
      {key: req.params.key},
      {value: req.body.payload},
      {upsert: true}
   )
   // @ts-ignore
   global.io.to('system-config').emit(`system-config:set`, cfg)
   return cfg
}));
router.delete('/:key', {
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
}, requireAdmin, $(async req => {
   const {key} = req.params
   const cfg = await SystemConfigModel.findOne({key})
   // @ts-ignore
   global.io.to('system-config').emit(`system-config:unset`, cfg)
   SystemConfigModel.deleteOne({key})
   return true
}));

export default router;

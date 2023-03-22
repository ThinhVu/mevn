import $ from "../../middlewares/safe-call";
import {requireAdmin} from "../../middlewares/auth";
import SystemConfigModel from "../../db/models/system-config";
import Router from "routerex";

const router = Router();

router.get('/', requireAdmin, $(async () => SystemConfigModel.find()));
router.get('/:key', {
   title: 'Get system config value',
   description: 'Get current value of system config',
   schema: {
      params: {
         key: {
            type: 'string',
            desc: 'A string containing the name of the key you want to create/update.'
         }
      }
   }
}, $(async req => {
   const rs = await SystemConfigModel.findOne({key: req.params.key})
   return rs && rs.value
}));
router.post('/:key', {schema:{params: {key: 'string'}}}, requireAdmin, $(async req => {
   const cfg = await SystemConfigModel.updateOne(
      {key: req.params.key},
      {value: req.body.payload},
      {upsert: true}
   )
   // @ts-ignore
   global.io.to('system-config').emit(`system-config:set`, cfg)
   return cfg
}));
router.delete('/:key', {schema: {params: {key: 'string'}}}, requireAdmin, $(async req => {
   const {key} = req.params
   const cfg = await SystemConfigModel.findOne({key})
   // @ts-ignore
   global.io.to('system-config').emit(`system-config:unset`, cfg)
   return SystemConfigModel.deleteOne({key})
}));

export default router;

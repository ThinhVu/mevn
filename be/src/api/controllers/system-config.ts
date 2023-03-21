import express from "express";
import $ from "../../middlewares/safe-call";
import {requireAdmin} from "../../middlewares/auth";
import SystemConfigModel from "../../db/models/system-config";

const router = express.Router();

router.get('/', requireAdmin, $(async () => SystemConfigModel.find()));
router.get('/:key', $(async req => {
   const rs = await SystemConfigModel.findOne({key: req.params.key})
   return rs && rs.value
}));
router.post('/:key', requireAdmin, $(async req => {
   const cfg = await SystemConfigModel.updateOne(
      {key: req.params.key},
      {value: req.body.payload},
      {upsert: true}
   )
   // @ts-ignore
   global.io.to('system-config').emit(`system-config:set`, cfg)
   return cfg
}));
router.delete('/:key', requireAdmin, $(async req => {
   const {key} = req.params
   const cfg = await SystemConfigModel.findOne({key})
   // @ts-ignore
   global.io.to('system-config').emit(`system-config:unset`, cfg)
   return SystemConfigModel.deleteOne({key})
}));

export default router;

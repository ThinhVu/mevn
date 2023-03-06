import SystemConfigModel from "../db/models/system-config";

export default {
   async getAll() {
      return SystemConfigModel.find()
   },
   async get(key) {
      const rs = await SystemConfigModel.findOne({key})
      return rs && rs.value
   },
   async set(key, value) {
      const cfg = await SystemConfigModel.updateOne({key}, {value}, { upsert: true })
      // @ts-ignore
      global.io.to('system-config').emit(`system-config:set`, cfg)
      return cfg
   },
   async unset(key) {
      const cfg = await SystemConfigModel.findOne({key})
      // @ts-ignore
      global.io.to('system-config').emit(`system-config:unset`, cfg)
      return SystemConfigModel.deleteOne({key})
   }
}

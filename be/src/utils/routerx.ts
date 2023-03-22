import express from "express";
import {last} from "lodash";
import methods from "methods";

export default function RouterX(options?) {
   const router = express.Router(options)
   return new Proxy(router, {
      get(target, p) {
         if (methods.includes(p)) {
            return function(method, metadata, ...args) {
               if (metadata && typeof metadata == 'object') {
                  target[p](method, ...args);
                  const layer = last(router.stack);
                  layer.route.schema = metadata.schema;
                  layer.route.description = metadata.description;
               } else {
                  target[p](method, metadata, ...args);
               }
            }
         } else {
            // @ts-ignore
            // eslint-disable-next-line prefer-rest-params
            return Reflect.get(...arguments);
         }
      }
   })
}

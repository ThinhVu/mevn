import path from 'path'
import {IRouteSchema} from "../db/models/route-schema";

const schema: Array<IRouteSchema> = []
function buildRouteSchema(parentPath, router) {
   for (const stack of router.stack) {
      if (stack.route) {
         schema.push({
            path: path.join(parentPath, stack.route.path),
            schema: stack.route.schema,
            description: stack.route.description
         })
      } else {
         let commonPath = stack.regexp.toString()
         commonPath = commonPath.substr(3, commonPath.length - 16)
         buildRouteSchema(path.join(parentPath, commonPath), stack.handle)
      }
      console.log('stack', stack)
   }
}
type OnSchemaBuiltCallBack = (routeSchemas: Array<IRouteSchema>) => void
export default function routerDocsFactory(onSchemaBuilt: OnSchemaBuiltCallBack) {
   return function (path, middlewares, router) {
      buildRouteSchema(path, router)
      onSchemaBuilt(schema)
      return [path, ...middlewares, router]
   }
}

import createApp from "./app";
async function main() {
   const app = await createApp()
   // @ts-ignore
   app.$httpServer.listen(process.env.PORT, () =>
       console.log(`[http server] ready at http://localhost:${process.env.PORT}`))
}
main()
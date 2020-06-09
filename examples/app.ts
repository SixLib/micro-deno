import { Application, Context } from "../mod.ts";
import { Router } from "../middlewares/router.ts";
const app = new Application();
const router = new Router();

router.add("GET", "/items", async (ctx: Context, next: Function) => {
  ctx.response.body = JSON.stringify(ctx.body);
  await next();
});
router.add("POST", "/getitem/:id", async (ctx: Context, next: Function) => {
  ctx.response.body = JSON.stringify(ctx.body);
  await next();
});

app.use((ctx: Context, next: Function) => {
  ctx.setHeader("Access-Control-Allow-Origin", "*");
  ctx.setHeader("Access-Control-Allow-Credentials", "true");
  ctx.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Connection, User-Agent, Cookie",
  );
  next();
});
app.use(router.routes());

// app.use(async (ctx: Context, next: Function) => {
//   console.log(ctx.method, ctx.path, ctx.params, ctx.body);

//   // Deno.writeFile(`./${ctx.body.file.filename}`,ctx.body.file.content)
//   ctx.response.body = JSON.stringify(ctx.body);
//   console.log(ctx.response)
//   await next();
// })
app.listen({ port: 8000 });

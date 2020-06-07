import { Application, Context } from "../mod.ts";
import { Router } from "../middlewares/router.ts";
const app = new Application();
const router = new Router();

router.add("GET", "/getitem/:we", async (ctx: Context, next: Function) => {
  ctx.response.body = JSON.stringify(ctx.body);
  await next();
});
router.add("GET", "/getitem/:id", async (ctx: Context, next: Function) => {
  ctx.response.body = JSON.stringify(ctx.body);
  await next();
});

app.use((ctx: Context, next: Function) => {
  console.log("中间件");
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

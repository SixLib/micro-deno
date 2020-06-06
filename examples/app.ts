import { Application, Context } from "../mod.ts";

const app = new Application();
app.use((ctx: Context, next: Function) => {
  console.log('中间件');
  next();
})
app.use(async (ctx: Context, next: Function) => {
  console.log(ctx.method, ctx.path, ctx.params);
  ctx.request.respond({ body: 'hello deno!' });

  await next();
})
app.listen({ port: 8000 })
import { Application, Context } from "../mod.ts";

const app = new Application();
app.use((ctx: Context, next: Function) => {
  console.log('中间件');
  next();
})
app.use(async (ctx: Context, next: Function) => {
  console.log(ctx.method, ctx.path, ctx.params, ctx.body);
  // Deno.writeFile(`./${ctx.body.file.filename}`,ctx.body.file.content)
  ctx.response.body = JSON.stringify(ctx.body);
  console.log(ctx.response)
  await next();
})
app.listen({ port: 8000 })
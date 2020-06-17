import { Application, Context, Router, cors } from "../mod.ts";

const app = new Application();
const router = new Router();

router.add("GET", "/items/:id", async (ctx: Context, next: Function) => {
  console.log(router.params);
  ctx.response.body = "items";
  await next();
});
router.add("POST", "/getitem/:id", async (ctx: Context, next: Function) => {
  ctx.response.body = JSON.stringify(ctx.body);
  await next();
});

app.use(cors());
app.use(router.routes());

// app.use(async (ctx: Context, next: Function) => {
//   console.log(ctx.method, ctx.path, ctx.params, ctx.body);

//   // Deno.writeFile(`./${ctx.body.file.filename}`,ctx.body.file.content)
//   ctx.response.body = JSON.stringify(ctx.body);
//   console.log(ctx.response)
//   await next();
// })
app.listen({ port: 8000 });

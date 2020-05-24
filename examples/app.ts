import { Application, Context, Router, FileOptions, HttpMethod, encode, Status } from "../mod.ts";
import { Header } from "../contants.ts";
const app = new Application();
const router = new Router();
router.get('/get', (ctx: Context) => {
  ctx.response = {
    status: Status.OK,
    body: `HELLO ${ctx.queryParams?.name || 'DENO'}!`
  }
});

router.post('/post', async (ctx: Context) => {
  const body = await ctx.body();

  ctx.response = {
    body: JSON.stringify(body)
  }
});

router.batch([
  {
    METHOD: HttpMethod.Post, PATH: '/upload', h: async (ctx: Context) => {
      const body = await ctx.body<{ file: FileOptions }>();
      const { file } = body;
      await Deno.writeFile(file.filename, file.content);
      ctx.response = {
        body: `HELLO POST!`
      }
    }
  }]);
// app.use((ctx: Context) => {
//   ctx.setHeaders(Header.AccessControlAllowMethods, 'POST');
//   ctx.setHeaders(Header.AccessControlAllowOrigin, 'http://127.0.0.1:5500');
// })
app.use((ctx: Context, next: Function) => {
  console.log(1);
  next();
  console.log(3);
});
app.use(router.routing());

app.run({ port: 8000 }, () => {
  console.log('http://localhost:8000');
});
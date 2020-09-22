import { ServerRequest } from "./deps.ts";
import Micro from "./application.ts";
const app = new Micro();
app.use((req: ServerRequest) => {
  req.respond({ body: 'hello world!!!' })
})
app.listen({ port: 8000 }, () => {
  console.log(`http://localhost:8000`)
})

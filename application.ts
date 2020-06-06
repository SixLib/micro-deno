import { serve, Server, HTTPOptions } from "./deps.ts";
import { Context } from "./context.ts";
import { compose } from "./compose.ts";

export class Application {
  server?: Server;
  middlewares: Array<Function> = [];
  #running = async () => {
    for await (const req of this.server!) {
      const ctx = new Context({
        req
      });
      const mw = compose(this.middlewares!);
      mw(ctx);
      req.respond({ body: 'hello deno!' });
    };
  };

  listen(opts: HTTPOptions): void {
    this.server = serve(opts);
    console.log(`http://localhost:${opts.port}`);
    this.#running();
  };
  use(fn: Function): void {
    this.middlewares = [...this.middlewares, fn]
  };
}
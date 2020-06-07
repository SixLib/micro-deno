import { serve, Server, HTTPOptions } from "./deps.ts";
import { Context } from "./context.ts";
import { compose } from "./compose.ts";

export class Application {
  server?: Server;
  middlewares: Array<Function> = [];
  #running = async () => {
    for await (const req of this.server!) {
      const ctx = new Context({
        req,
      });
      ctx.body = await ctx.getBody();
      const mw = compose(this.middlewares);
      mw(ctx);
    }
  };

  listen(opts: HTTPOptions): void {
    this.middlewares = [...this.middlewares, (ctx: Context, next: Function) => {
      next();
      ctx.request.respond(ctx.response);
    }];
    this.server = serve(opts);
    console.log(`http://${opts.hostname || "localhost"}:${opts.port}`);
    this.#running();
  }
  use(fn: Function): void {
    this.middlewares = [...this.middlewares, fn];
  }
}

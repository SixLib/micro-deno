
import { serve, Server, HTTPOptions, Response } from './deps.ts';
import { Header } from "./contants.ts";
import { Context } from "./context.ts";
export class Application {
  server?: Server;
  middlewareFuctions?: Array<Function> = [];
  #start = async () => {
    for await (const req of this.server!) {
      const ctx = new Context({
        app: this,
        req
      })
      this.#compose(this.middlewareFuctions!, ctx)(ctx);
      req.respond(ctx.response);
    };
  }

  #compose = (middleware: Array<Function>, ctx: Context) => async (ctx: Context, next?: Function) => {
    let index = -1
    return dispatch(0)
    function dispatch(i: number): Promise<any> {
      
      if (i <= index) return Promise.reject('next() called multiple times')
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next!
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(ctx, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
  use = (fn: Function | Array<Function>) => {
    if (Array.isArray(fn)) {
      this.middlewareFuctions = fn;
    } else {
      this.middlewareFuctions?.push(fn)
    }
  };
  run = (opts: HTTPOptions, fn?: Function): void => {
    this.server = serve(opts);
    this.#start();
    fn ? fn() : undefined;
  }
}
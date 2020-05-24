import { RouterOptions } from "./types.ts";
import { Context, Status, HttpMethod } from "./mod.ts";

export class Router {
  routes: Array<RouterOptions> = [];
  batch(opts: Array<RouterOptions>): void {
    this.routes = [...this.routes, ...opts];
  };
  get(path: string, h: Function) {
    const opt: RouterOptions = { METHOD: HttpMethod.Get, PATH: path, h }
    this.routes.push(opt)
  }
  post(path: string, h: Function) {
    const opt: RouterOptions = { METHOD: HttpMethod.Post, PATH: path, h }
    this.routes.push(opt)
  }
  put(path: string, h: Function) {
    const opt: RouterOptions = { METHOD: HttpMethod.Put, PATH: path, h }
    this.routes.push(opt)
  }
  delete(path: string, h: Function) {
    const opt: RouterOptions = { METHOD: HttpMethod.Delete, PATH: path, h }
    this.routes.push(opt)
  }

  routing() {
    return async (ctx: Context, next: Function) => {
      const route = this.routes.find(r => r.METHOD == ctx.method && r.PATH === ctx.path);
      const h = route ? route.h : (ctx: Context) => {
        ctx.response = {
          status: Status.NotFound
        }
      };
      console.log(123);
      await h(ctx, next);
      next();
    };
  }
}
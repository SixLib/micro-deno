import { pathtoRegexp } from "../utils/path-to-regexp.ts";
import { Context } from "../context.ts";
type Methods = "GET" | "POST" | "PUT" | "DELETE";
export class Router {
  params: Record<string,unknown> = {};
  stack: Array<{ Method: Methods; Path: string; CallBack: Function }> = [];
  add(method: Methods, path: string, cb: Function) {
    this.stack = [
      ...this.stack!,
      { Method: method, Path: path, CallBack: cb },
    ];
  }
  routes() {
    return async (ctx: Context, next: Function) => {
      const routes = this.stack.filter((f) => f.Method === ctx.method);
      for (let i = 0; i < routes.length; i++) {
        let keys: any[] = [];
        const re = pathtoRegexp(routes[i].Path, keys);
        const regRes = re.exec(ctx.path);
        if (regRes) {
           keys.map((m, i) => {
            this.params[m.name] = regRes[i + 1];
          })
          routes[i].CallBack(ctx, next);
          return;
        }
      }

      await next();
    };
  }
}

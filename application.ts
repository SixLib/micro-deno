
import { listenAndServe, ServerRequest, HTTPOptions } from "./deps.ts";
import compose from "./compose.ts";
import Context from "./context.ts";
export default class micro {
  #middlewares: any[] = []
  constructor() {
  }
  public use(callback: any) {
    this.#middlewares.push(callback)
  }
  public listen(opts: HTTPOptions, callback?: any) {
    const fnMiddleware = compose(this.#middlewares)
    listenAndServe(opts, this.HanderRequest(fnMiddleware))
    callback()
  }
  private HanderRequest(fnMiddleware: any) {
    return (req: ServerRequest) => {
      fnMiddleware(req)
    }
  }
}
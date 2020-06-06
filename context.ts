import { ServerRequest } from "./deps.ts";
export class Context {
  request!: ServerRequest;
  url!: URL;
  get method() { return this.request.method }
  get path() { return this.url.pathname };
  get params() {
    const params: Record<string, string> = {};
    for (const [k, v] of this.url.searchParams) {
      params[k] = v;
    }
    return params
  }
  constructor(opts: { req: ServerRequest }) {
    this.request = opts.req;
    this.url = new URL(this.request.url, 'http://0.0.0.0');
  }
}
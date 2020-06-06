import { ServerRequest, Response, decode } from "./deps.ts";
export class Context {
  request!: ServerRequest;
  url!: URL;
  response: Response = {};
  get method() { return this.request.method };
  get path() { return this.url.pathname };
  get params() {
    const params: Record<string, string> = {};
    for (const [k, v] of this.url.searchParams) {
      params[k] = v;
    };
    return params;
  };
  async body() {
    const contentType = this.request.headers.get('Content-Type');
    const unit8Array = await Deno.readAll(this.request.body);
    if (contentType?.includes('application/json')) {
      return JSON.parse(decode(unit8Array));
    } else if (contentType?.includes('application/x-www-form-urlencoded')) {
      let data: Record<string, unknown> = {};
      console.log(decode(await Deno.readAll(this.request.body)));
      
      for (
        const [k, v] of new URLSearchParams(
          decode(await Deno.readAll(this.request.body)),
        )
      ) {
        data[k] = v;
      }
      return data;
    };
    return ''
  }
  constructor(opts: { req: ServerRequest }) {
    this.request = opts.req;
    this.url = new URL(this.request.url, 'http://0.0.0.0');
  };
};
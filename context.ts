import { ServerRequest, Response, decode, MultipartReader } from "./deps.ts";
export class Context {
  request!: ServerRequest;
  url!: URL;
  response: Response = {};
  body: any = null;
  get method() {
    return this.request.method;
  }
  get path() {
    return this.url.pathname;
  }
  get params() {
    const params: Record<string, string> = {};
    for (const [k, v] of this.url.searchParams) {
      params[k] = v;
    }
    return params;
  }
  // async body() {
  //   const contentType = this.request.headers.get('Content-Type');
  //   if (contentType?.includes('application/json')) {
  //     const unit8Array = await Deno.readAll(this.request.body);
  //     return JSON.parse(decode(await Deno.readAll(this.request.body)));
  //   } else if (contentType?.includes('application/x-www-form-urlencoded')) {
  //     let data: Record<string, unknown> = {};
  //     const unit8Array = await Deno.readAll(this.request.body);
  //     for (
  //       const [k, v] of new URLSearchParams(
  //         decode(await Deno.readAll(this.request.body)),
  //       )
  //     ) {
  //       data[k] = v;
  //     }
  //     return data;
  //   };
  //   return decode(await Deno.readAll(this.request.body));
  // }
  async getBody<T extends unknown>(): Promise<T> {
    const contentType = this.request.headers.get("Content-Type");
    walk: {
      let data: Record<string, unknown> = {};
      if (contentType) {
        if (contentType.includes("application/json")) {
          data = JSON.parse(decode(await Deno.readAll(this.request.body)));
        } else if (contentType.includes("application/x-www-form-urlencoded")) {
          for (
            const [k, v] of new URLSearchParams(
              decode(await Deno.readAll(this.request.body)),
            )
          ) {
            data[k] = v;
          }
        } else if (contentType.includes("multipart/form-data")) {
          const match = contentType.match(/boundary=([^\s]+)/);
          const boundary = match ? match[1] : undefined;
          if (boundary) {
            const mr = new MultipartReader(this.request.body, boundary);
            const form = await mr.readForm();
            for (const [k, v] of form.entries()) {
              data[k] = v;
            }
          }
        } else {
          break walk;
        }
      } else {
        break walk;
      }

      return data as T;
    }

    return decode(await Deno.readAll(this.request.body)) as T;
  }
  constructor(opts: { req: ServerRequest }) {
    this.request = opts.req;
    this.url = new URL(this.request.url, "http://0.0.0.0");
  }
}

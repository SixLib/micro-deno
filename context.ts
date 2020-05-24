import { Application } from "./application.ts";
import { ServerRequest, Response, MultipartReader, Cookie, Cookies, getCookies, setCookie, decode } from "./deps.ts";
import { Header, MIME } from './contants.ts'
export class Context {
  app!: Application;
  request!: ServerRequest;
  response!: Response;
  url!: URL;
  get contentType(): String | null { return this.request.headers.get(Header.ContentType) };
  get cookies(): Cookies { return getCookies(this.request) };
  get method() { return this.request.method };
  get path() { return this.url.pathname };
  get queryParams() {
    const params: Record<string, string> = {};
    for (const [k, v] of this.url.searchParams) {
      params[k] = v;
    }
    return params
  }
  constructor(opts: { app: Application, req: ServerRequest }) {
    this.app = opts.app;
    this.request = opts.req;
    this.url = new URL(this.request.url, 'http://0.0.0.0');
  }

  setCookie(c: Cookie): void { setCookie(this.response, c); }
  setHeaders(key: string, value: string): void { this.response.headers?.set(key, value) }
  
  async body<T extends unknown>(): Promise<T> {
    let data: Record<string, unknown> = {};
    if (this.contentType?.includes(MIME.ApplicationJSON)) {
      data = JSON.parse(decode(await Deno.readAll(this.request.body)));
    } else if (this.contentType?.includes(MIME.ApplicationForm)) {
      for (const [k, v] of new URLSearchParams(decode(await Deno.readAll(this.request.body)))) {
        data[k] = v;
      }
    } else if (this.contentType?.includes(MIME.MultipartForm)) {
      const match = this.contentType.match(/boundary=([^\s]+)/);
      const boundary = match ? match[1] : undefined;
      if (boundary) {
        const mr = new MultipartReader(this.request.body, boundary);
        const form = await mr.readForm();
        for (const [k, v] of form.entries()) {
          data[k] = v;
        }
      }
    }
    return data as T;
  }
} 
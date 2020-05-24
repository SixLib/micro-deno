import { Context } from "./context.ts";
export type RouterOptions = { METHOD?: String, PATH: String, h: Function }
export type FileOptions = { filename: string, type: string, content: Uint8Array }
/* `HandlerFunc` defines a function to serve HTTP requests. */
export type HandlerFunc = (c: Context) => Promise<unknown> | unknown;

/* `MiddlewareFunc` defines a function to process middleware. */
export type MiddlewareFunc = (next: HandlerFunc) => HandlerFunc;

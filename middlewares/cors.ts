import { Context } from "../context.ts";
type corsOpts = { origin: string; credentials: string; headers: string };

/**
 * 
 * @param opts 
 */
export const cors = (opts: corsOpts | null = null) => {
  return (ctx: Context, next: Function) => {
    ctx.setHeader("Access-Control-Allow-Origin", opts?.origin || "*");
    ctx.setHeader(
      "Access-Control-Allow-Credentials",
      opts?.credentials || "true",
    );
    ctx.setHeader(
      "Access-Control-Allow-Headers",
      opts?.headers ||
        "Origin, X-Requested-With, Content-Type, Accept, Connection, User-Agent, Cookie",
    );
    next();
  };
};

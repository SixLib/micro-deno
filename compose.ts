
import type Context from "./context.ts";
function compose(middleware: any[]) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context: Context, next?: () => Promise<void>): Promise<void> {
    // last called middleware #
    let index = -1
    async function dispatch(i: number): Promise<void> {
      if (i <= index) throw new Error('next() called multiple times')
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return
      try {
        return await fn(context, dispatch.bind(null, i + 1));
      } catch (err) {
        return err
      }
    }
    return dispatch(0)
  }
}
export default compose

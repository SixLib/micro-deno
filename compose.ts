

/**
 * Compose `middleware` returning
 * a fully valid middleware comprised
 * of all those which are passed.
 *
 * @param {Array} middleware
 * @return {Function}
 * @api public
 */

export const compose = (middleware: Array<Function>): Function => {
  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context: any, next: any) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch(i: any): Promise<any> {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}

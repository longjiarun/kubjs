/**
 * # cookie
 *
 * 操作cookie方法，`expires` 如果为数字，单位为毫秒
 *
 * 使用方法：
 * ```js
 * //取值
 * var name = Kub.cookie('name')
 *
 * //设置值
 * Kub.cookie('name','kub')
 *
 * //配置cookie相关属性
 * Kub.cookie('name','kub',{
 *     domain:'.weidian.com'
 *
 * })
 * ```
 *
 */
function cookie(key, value, options) {
    var days, time, result, decode

    options = options || {}

    if(!options.hasOwnProperty('path')){
        options.path = '/'
    }

    // A key and value were given. Set cookie.
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        // Enforce object

        if (value === null || value === undefined) options.expires = -1

        if (typeof options.expires === 'number') {
            days = (options.expires)
            time = options.expires = new Date()

            time.setTime(time.getTime() + days)
        }

        value = String(value)

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '',
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''))
    }

    // Key and possibly options given, get cookie
    options = value || {}

    decode = options.raw ? function (s) { return s } : decodeURIComponent

    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null
}

module.exports = cookie

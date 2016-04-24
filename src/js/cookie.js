/**
 * # Kub.cookie
 *
 * copy from `zepto.cookie.js`，将 expires 单位改为毫秒。
 */
/**
 * ## cookie方法
 *
 * @param {String} key key值，
 * @param {String} value   设置值，如果未传递，则表示取值
 * @param {Object} options 配置项
 * @return {String}  如果未取值，则返回取到的值，如果未赋值，则返回空。
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

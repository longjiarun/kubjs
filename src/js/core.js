/**
 * # core
 *
 * 核心模块，该模块提供基础方法。
 *
 */

/**
 * ## Core Constructor
 *
 * `Core` 模块，对外提供的是实例化的对象。
 *
 * 使用方法：
 *
 * ```js
 *
 * //获取url参数
 * var params = Kub.core.getQuerystring()
 *
 * ```
 */
function Core() {

}

//解析 param string 正则表达式
var paramsRegxp = /([^=&]+)(=([^&#]*))?/g

var toString = Object.prototype.toString,
    _window = window,
    _href = _window.location.href,
    _prototype = Core.prototype


//获取 params string
//url地址，未传值取 `window.location.href`。
var getParamsString = function(url) {
    var matchs
    url = url || _href
    return url && (matchs = url.match(/^[^\?#]*\?([^#]*)/)) && matchs[1]
}

/**
 * ## Core.prototype.extend
 *
 * @param {Boolean} [deep] `可选` 是否深度拷贝。
 * @param {Object/Array} target 目标。
 * @param {Object/Array} source 源对象，可为多个。
 * @return {Object/Array} target
 */
_prototype.extend = function(target, source) {
    var deep,
        args = Array.prototype.slice.call(arguments, 1),
        length

    if (this.isBoolean(target)) {
        deep = target
        target = args.shift()
    }
    length = args.length
    for (var i = 0; i < length; i++) {
        source = args[i]
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                if (deep && (this.isArray(source[key]) || this.isObject(source[key]))) {
                    if (this.isArray(source[key]) && !this.isArray(target[key])) {
                        target[key] = []
                    }
                    if (this.isObject(source[key]) && !this.isObject(target[key])) {
                        target[key] = {}
                    }
                    this.extend(deep, target[key], source[key])
                } else {
                    (source[key] !== undefined) && (target[key] = source[key])
                }
            }
        }
    }
    return target
}

/**
 * ## Core.prototype.is[type]
 *
 * 类型检测函数。
 *
 * 具体类型`type`包含
 *
 * `['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Array', 'Object', 'Boolean']`
 *
 */
;
['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Array', 'Object', 'Boolean'].forEach(function(name) {
    _prototype['is' + name] = function(obj) {
        return toString.call(obj) === '[object ' + name + ']'
    }
})

/**
 * ## Core.prototype.setQuerystring
 *
 * 设置 url 参数，如果 url 未传值，则默认取 `window.location.href`。
 *
 * 使用：
 * ```js
 *
 * //设置当前地址参数
 *
 * //默认采用`window.location.href`
 * Kub.core.setQuerystring({
 *     name:'kub'
 * })
 *
 * //传入url
 * Kub.core.setQuerystring('http://www.a.com?userId=123',{
 *     name:'kub'
 * })
 *
 * //追加参数
 *
 * //如果不存在名称为 name 的参数，则新增参数。如果存在则替换其值
 * Kub.core.setQuerystring({
 *     name:'kub',
 *     addr:'hangzhou'
 * })
 *
 * ```
 *
 * @param {String} url    url
 *
 * @param {Object} params 参数对象。
 *
 * @param {Object} opts   配置参数。
 *
 * - raw ：配置是否开启 `encodeURIComponent`，默认为`false`，开启。
 * - append ：是否追加参数，默认为`true`。 true：如果 url 不存在当前参数名称，则追加一个参数。false：不追加，只进行替换。
 */
_prototype.setQuerystring = function(url, params, opts) {
    //验证url是否传值，如果 url 未传值，则使用当前页面 url
    if (this.isObject(url)) {
        opts = params
        params = url
        url = _href
    }
    params = params || {}

    opts = this.extend({
        append: true,
        raw: false
    }, opts || {})

    var queryString = getParamsString(url),
        _queryString = '',
        f = -1,
        _params = {}

    //解析 url 中的参数，存放在对象中
    queryString && queryString.replace(paramsRegxp, function(a, name, c, value) {

        if (params.hasOwnProperty(name)) {
            value = params[name]
        }

        // 获取到的中文参数为编码后的，需decodeURIComponent解码
        _params[name] = value != undefined ? (opts.raw ? value : decodeURIComponent(value)) : ''
    })

    //如果是追加，则合并参数
    if (opts.append) {
        for (var name in params) {
            if (params.hasOwnProperty(name)) {
                _params[name] = params[name] != undefined ? params[name] : ''
            }
        }
    }

    //将参数合并成字符串
    for (name in _params) {
        if (_params.hasOwnProperty(name)) {
            _queryString += (++f ? '&' : '') + name + '=' + (_params[name] !== '' ? (opts.raw ? _params[name] : encodeURIComponent(_params[name])) : '')
        }
    }

    //替换掉原来 url 中的 querystring
    return url.replace(/^([^#\?]*)[^#]*/, function(a, url) {
        return url + (_queryString ? '?' + _queryString : '')
    })
}

/**
 * ## Core.prototype.getQuerystring
 *
 * 获取url中的参数。
 *
 * 设置 url 参数，如果 url 未传值，则默认取 `window.location.href`。
 *
 * 使用：
 * ```js
 *
 * //设置当前地址参数
 *
 * //默认采用`window.location.href`
 * var params = Kub.core.getQuerystring()
 *
 * var name = params.name
 *
 * //传入url
 * var params = Kub.core.getQuerystring('http://www.a.com?userId=123')
 *
 * var userId = params.userId
 *
 * ```
 *
 * @param {String} url  url地址，未传值取 `window.location.href`。
 *
 * @param {Object} opts 配置参数。
 *
 * - raw ：配置是否 `decodeURIComponent`，默认为`true`，开启。
 *
 * @return {Object} 返回参数对象
 */
_prototype.getQuerystring = function(url, opts) {
    var href = _href

    if (this.isObject(url)) {
        opts = url
        url = href
    }

    opts = this.extend({
        raw: false
    }, opts || {})

    url = url || href

    var params = {},
        queryString = getParamsString(url)

    queryString && queryString.replace(paramsRegxp, function(a, name, c, value) {
        params[name] = opts.raw ? value : !!value ? decodeURIComponent(value) : undefined
    })

    return params
}

module.exports = new Core()

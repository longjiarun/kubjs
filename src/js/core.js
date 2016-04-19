/**
 * # Kub.core
 *
 * kubjs 核心模块，该模块只提供最基础的方法。
 */
var os = require('./detect');

/**
 * ## Core Constructor
 *
 * Core 类，对外提供的是实例化的对象。
 *
 * 使用方法：
 * ```js
 * //获取url参数
 * var params = Kub.core.getQuerystring();
 *
 * ```
 */
function Core() {

}

var toString = Object.prototype.toString,
    proto = Core.prototype;

proto.constructor = Core;

proto.os = os;

proto.extend = function(target, source) {
    var deep, args = Array.prototype.slice.call(arguments, 1),
        length;
    if (typeof target === 'boolean') {
        deep = target;
        target = args.shift();
    }
    length = args.length;
    for (var i = 0; i < length; i++) {
        source = args[i];
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                if (deep && (this.isArray(source[key]) || this.isObject(source[key]))) {
                    if (this.isArray(source[key]) && !this.isArray(target[key])) {
                        target[key] = [];
                    }
                    if (this.isObject(source[key]) && !this.isObject(target[key])) {
                        target[key] = {};
                    }
                    this.extend(target[key], source[key], deep);
                } else {
                    (source[key] !== undefined) && (target[key] = source[key]);
                }
            }
        }
    }
    return target;
};

['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Array'].forEach(function(name) {
    proto['is' + name] = function(obj) {
        return toString.call(obj) === '[object ' + name + ']';
    };
});

//function also is object
proto.isObject = function(obj) {
    return this.isFunction(obj) || toString.call(obj) === '[object Object]';
};

/**
 * ## inherit
 *
 * 类的继承
 *
 * @param {Class} c 子类
 * @param {Class} p 父类
 */
proto.inherit = function(c, p) {
    var F = function() {};
    F.prototype = p.prototype;
    c.prototype = new F();
    c.prototype.constructor = c;
    c.uber = p.prototype;
};

/**
 * ## htmlToText
 *
 * 将html转换为text
 *
 * @param {String} value html
 * @return {String} 处理以后的文本
 */
proto.htmlToText = function(value) {
    //.replace(/&nbsp;|&#160;/gi, '')
    return value.replace(/<.[^<>]*?>/g, '').replace(/[\n\r\t]/g, '');
};

/**
 *
 *
 * 获取 params string
 * @param {String} url url地址，未传值取 `window.location.href`。
 * @return {String} params string
 */
var getParamsString = function(url) {
    var matchs;
    url = url || window.location.href;
    return url && (matchs = url.match(/^[^\?#]*\?([^#]*)/)) && matchs[1];
};

//解析 param string 正则表达式
var paramsRegxp = /([^=&]+)(=([^&#]*))?/g;

/**
 * ## setQuerystring
 *
 * 设置 url 参数，如果 url 未传值，则默认取 `window.location.href` 的值。
 *
 * 使用：
 * ```js
 *
 * //设置当前地址参数
 *
 * //默认采用`window.location.href`
 * Kub.core.setQuerystring({
 *     name:'kubjs'
 * });
 *
 * //传入url
 * Kub.core.setQuerystring('http://www.weidian.com?userId=123',{
 *     name:'kubjs'
 * });
 *
 * //追加参数
 *
 * //如果不存在名称为 name 的参数，则新增参数。如果存在则替换其值
 * Kub.core.setQuerystring({
 *     name:'kubjs'
 * },{
 *     append:true
 * });
 *
 * ```
 *
 * @param {String} url    url
 *
 * @param {Object} params 参数对象
 *
 * @param {Object} opts   配置参数。 raw : 配置是否 encodeURIComponent ，append：是否追加参数。true：如果 url 不存在当前参数名称，则追加一个参数。false：不追加，只进行替换
 */
proto.setQuerystring = function(url, params, opts) {
    //验证url是否传值，如果 url 未传值，则使用当前页面 url
    if (this.isObject(url)) {
        opts = params;
        params = url;
        url = window.location.href;
    }
    params = params || {};

    opts = this.extend({
        append: false,
        raw: false
    }, opts || {});

    var queryString = getParamsString(url),
        _queryString = '',
        f = -1,
        _params = {};

    //解析 url 中的参数，存放在对象中
    queryString && queryString.replace(paramsRegxp, function(a, name, c, value) {

        if (params.hasOwnProperty(name)) {
            value = params[name];
        }
        _params[name] = value != undefined ? value : '';
    });

    //如果是追加，则合并参数
    if (opts.append) {
        for (var name in params) {
            if (params.hasOwnProperty(name)) {
                _params[name] = params[name] != undefined ? params[name] : '';
            }
        }
    }

    //将参数合并成字符串
    for (name in _params) {
        if (_params.hasOwnProperty(name)) {
            _queryString += (++f ? '&' : '') + (_params[name] !== '' ? name + '=' + (opts.raw ? _params[name] : encodeURIComponent(_params[name])) : name);
        }
    }

    //替换掉原来 url 中的 querystring
    return url.replace(/^([^#\?]*)[^#]*/, function(a, url, hash) {
        return url + (_queryString ? '?' + _queryString : '');
    });
};

/**
 * ## getQuerystring
 *
 * 获取url中的参数。
 *
 * 设置 url 参数，如果 url 未传值，则默认取 `window.location.href`。
 *
 * @param {String} url url地址，未传值取 `window.location.href`。
 *
 * @param {Object} opts 配置参数，配置是否 decodeURIComponent
 *
 * @return {Object} 返回参数对象
 */
proto.getQuerystring = function(url, opts) {
    var href = window.location.href;

    if (this.isObject(url)) {
        opts = url;
        url = href;
    }

    opts = this.extend({
        raw: false
    }, opts || {});

    url = url || href;

    var params = {},
        queryString = getParamsString(url);

    queryString && queryString.replace(paramsRegxp, function(a, name, c, value) {
        params[name] = opts.raw ? value : !!value ? decodeURIComponent(value) : undefined;
    });

    return params;
};

module.exports = new Core();

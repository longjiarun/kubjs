/*! Kub Mobile JavaScript Library v2.0.0. (https://github.com/longjiarun/kubjs)*/
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(23);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	try {
	    var _window = window,
	        Kub = _window.Kub = _window.Kub || {}

	    Kub.$ = __webpack_require__(6)

	    Kub.core = __webpack_require__(7)

	    Kub.dateHelper = __webpack_require__(9)

	    Kub.cookie = __webpack_require__(10)

	    Kub.LazyLoad = __webpack_require__(11)

	    Kub.Dialog = __webpack_require__(12)

	    Kub.Alert = __webpack_require__(14)

	    Kub.Confirm = __webpack_require__(15)

	    Kub.Prompt = __webpack_require__(16)

	    Kub.Toast = __webpack_require__(18)

	    Kub.Loader = __webpack_require__(19)

	    Kub.Swiper = __webpack_require__(20)

	    Kub.DatePicker = __webpack_require__(21)

	    module.exports = Kub
	} catch (e) {
	    alert(e.message)
	}


/***/ },
/* 6 */
/***/ function(module, exports) {

	var $ = Lite = function Lite(selector, context) {
	    context = context || _document
	    var type = typeof selector;

	    if (!selector) {
	        return wrap()
	    }

	    if (type === 'function') {
	        return $.ready(selector)
	    }

	    if (selector._l) {
	        return selector
	    }

	    if (isArray(selector)) {
	        //$([document,document.body]) not $(window)
	        return wrap(slice.call(selector).filter(function(item){
	            return item != null
	        }), selector)
	    }

	    if (type === 'object') {
	        //$(document)
	        return wrap([selector], '')
	    }

	    if (type === 'string') {
	        selector = selector.trim()

	        if (selector[0] === '<') {
	            var nodes = $.fragment(selector)
	            return wrap(nodes, '')
	        }

	        if (idSelectorRE.test(selector)) {
	            var found = _document.getElementById(RegExp.$1)

	            return wrap(found ? [found] : [],selector)
	        }

	        return wrap($.qsa(selector, context), selector)
	    }

	    return wrap()
	}

	var ELEMENT_NODE = 1

	var slice = Array.prototype.slice,
	    readyRE = /complete|loaded|interactive/,
	    idSelectorRE = /^#([\w-]+)$/,
	    classSelectorRE = /^\.([\w-]+)$/,
	    tagSelectorRE = /^[\w-]+$/,
	    spaceRE = /\s+/g

	var _document = document,
	    _window = window

	function wrap(dom, selector) {
	    dom = dom || []

	    Object.setPrototypeOf ? Object.setPrototypeOf(dom, $.fn): (dom.__proto__ = $.fn)

	    dom.selector = selector || ''
	    return dom
	}

	var isArray = Array.isArray ||
	    function(object) {
	        return object instanceof Array
	    }

	!(function() {

	    //querySelectorAll，如果存在两个相同ID，在ios7下，限定范围内查询 id 会返回两个节点
	    this.qsa = function(selector, context) {
	        context = context || _document
	        selector = selector.trim()
	        return slice.call(classSelectorRE.test(selector) ? context.getElementsByClassName(RegExp.$1) : tagSelectorRE.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector))
	    }

	    this.fragment = function(html) {
	        var div = _document.createElement('div'),
	            nodes
	        div.innerHTML = html
	        nodes = div.children
	        div = null
	        return slice.call(nodes)
	    }

	    this.ready = function(callback) {
	        if (readyRE.test(_document.readyState) && _document.body) {
	            callback($)
	        } else {
	            _document.addEventListener('DOMContentLoaded', function() {
	                callback($)
	            }, false)
	        }
	        return this
	    }

	    this.fn = this.prototype = {

	        _l: true,

	        each: function(callback) {
	            var l = this.length,
	                i, t
	            for (i = 0; i < l; i++) {
	                t = this[i]

	                if (callback.call(t, i, t) === false) {
	                    return this
	                }
	            }
	            return this
	        },

	        slice: function() {
	            return $(slice.apply(this, arguments))
	        },

	        //only support find(selector)
	        //zepto has a bug
	        find: function(selector) {
	            var dom = []

	            this.each(function() {
	                if (!this.querySelectorAll) return

	                var elements = $.qsa(selector, this),
	                    elementsLen = elements.length

	                for (var i = 0; i < elementsLen; i++) {
	                    dom.indexOf(elements[i]) === -1 && dom.push(elements[i])
	                }
	            })
	            return $(dom)
	        },

	        show: function() {
	            return this.each(function() {
	                this.style.display === 'none' && (this.style.display = '')
	            })
	        },

	        hide: function() {
	            return this.each(function() {
	                this.style.display = 'none'
	            })
	        },

	        css: function(property, value) {
	            var isObject = typeof property === 'object'

	            //get
	            if (value == null && !isObject) {
	                var el = this[0]

	                //not element
	                if (el.nodeType !== ELEMENT_NODE) return

	                return _window.getComputedStyle(el).getPropertyValue(property)
	            }

	            var css = ''
	            if (isObject) {
	                for (var key in property) {
	                    property[key] == null ? this.each(function() {
	                        this.style.removeProperty(key)
	                    }) : (css += key + ':' + property[key] + ';')
	                }
	            } else {
	                css += key + ':' + property[key] + ';'
	            }

	            //set
	            return css ? this.each(function() {
	                this.style.cssText += ';' + css
	            }) : this

	        },

	        // only support get
	        offset: function() {
	            if (!this.length) return null

	            var obj = this[0].getBoundingClientRect()
	            return {
	                left: obj.left + _window.pageXOffset,
	                top: obj.top + _window.pageYOffset,
	                width: Math.round(obj.width),
	                height: Math.round(obj.height)
	            }
	        },

	        addClass: function(name) {
	            if (!name) return this

	            return this.each(function() {
	                if (!('className' in this)) return

	                var classList = [],
	                    className = this.className.trim(),
	                    classNameList = className.split(spaceRE)

	                name.trim().split(spaceRE).forEach(function(klass) {
	                    classNameList.indexOf(klass) === -1 && classList.push(klass)
	                })
	                classList.length && (this.className = (className && (className + ' ')) + classList.join(' '))
	            })
	        },

	        removeClass: function(name) {
	            return this.each(function() {
	                if (!('className' in this)) return

	                if (name === undefined) return this.className = ''

	                var className = this.className

	                name.trim().split(spaceRE).forEach(function(klass) {
	                    //zepto has a bug
	                    className = className.replace(new RegExp('(^|\\s)' + klass + '(\\s|$)', 'g'), ' ')
	                })

	                this.className = className
	            })
	        },

	        eq: function(idx) {
	            idx = idx < 0 ? idx + this.length : idx;
	            return $(this[idx]);
	        },

	        off: function(name, callback) {
	            return this.each(function() {
	                this.removeEventListener(name, callback, false)
	            })
	        },

	        on: function(name, callback) {
	            return this.each(function() {
	                this.addEventListener(name, callback, false)
	            })
	        },

	        trigger: function(type, detail) {
	            return this.each(function() {
	                this.dispatchEvent(new CustomEvent(type, {
	                    detail: detail,
	                    bubbles: true,
	                    cancelable: true
	                }))
	            })
	        },

	        attr: function(name, value) {
	            var result

	            return (typeof name === 'string' && value == null) ?
	                (!this.length || this[0].nodeType !== ELEMENT_NODE ? null :
	                    (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
	                ) :
	                this.each(function() {
	                    if (this.nodeType !== ELEMENT_NODE) return

	                    if (typeof name === 'object'){
	                        for (key in name) {
	                            this.setAttribute(key, name[key])
	                        }
	                    }else {
	                        this.setAttribute(name, value)
	                    }
	                })
	        },

	        removeAttr: function(name) {
	            return this.each(function() {
	                var self = this
	                this.nodeType === ELEMENT_NODE && name.split(spaceRE).forEach(function(attribute) {
	                    self.removeAttribute(attribute)
	                })
	            })
	        },

	        remove: function() {
	            return this.each(function() {
	                var parentElement = this.parentElement
	                parentElement && parentElement.removeChild(this)
	            })
	        },

	        appendTo: function(target) {
	            var dom = [],
	                that = this

	            target.each(function() {
	                var node = this
	                that.each(function() {
	                    dom.push(node.appendChild(this))
	                })
	            })

	            return $(dom)
	        },

	        after: function(html) {
	            return this.each(function() {
	                this.insertAdjacentHTML('afterend', html)
	            })
	        },

	        before: function(html) {
	            return this.each(function() {
	                this.insertAdjacentHTML('beforebegin', html)
	            })
	        },

	        append: function(html) {
	            return this.each(function() {
	                this.insertAdjacentHTML('beforeend', html)
	            })
	        },

	        prepend: function(html) {
	            return this.each(function() {
	                this.insertAdjacentHTML('afterbegin', html)
	            })
	        },

	        html: function(html) {
	            return html ?
	                this.each(function() {
	                    this.innerHTML = html
	                }) :
	                (this[0] ? this[0].innerHTML : null)
	        },

	        text: function(text) {
	            return html ?
	                this.each(function() {
	                    this.textContent = text
	                }) :
	                (this[0] ? this[0].textContent : null)
	        }
	    }
	}).call(Lite)

	module.exports = Lite


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Kub.core
	 *
	 * kubjs 核心模块，该模块只提供最基础的方法。
	 */

	/**
	 * ## Core Constructor
	 *
	 * Core 类，对外提供的是实例化的对象。
	 *
	 * 使用方法：
	 * ```js
	 * //获取url参数
	 * var params = Kub.core.getQuerystring()
	 *
	 *
	 * ```
	 */

	var os = __webpack_require__(8)

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
	 * ## os
	 *
	 * 系统版本与类型对象
	 *
	 * 详见 [detect 模块](./detect.js.html)
	 *
	 */
	_prototype.os = os

	/**
	 * ## extend
	 *
	 * @param {Boolean} [deep] `可选` 是否深度拷贝
	 * @param {Object/Array} target 目标
	 * @param {Object/Array} source 源对象，可为多个
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
	                    this.extend(target[key], source[key], deep)
	                } else {
	                    (source[key] !== undefined) && (target[key] = source[key])
	                }
	            }
	        }
	    }
	    return target
	}

	//类型判断
	;
	['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Array', 'Object', 'Boolean'].forEach(function(name) {
	    _prototype['is' + name] = function(obj) {
	        return toString.call(obj) === '[object ' + name + ']'
	    }
	})

	/**
	 * ## htmlToText
	 *
	 * 将html转换为text
	 *
	 * 0. 去掉标签；
	 * 0. 去掉换行符与制表符；
	 * 0. 去掉空格符；
	 *
	 * @param {String} value html
	 * @return {String} 处理以后的文本
	 */
	_prototype.htmlToText = function(value) {
	    return value.replace(/<.[^<>]*?>/g, '').replace(/[\n\r\t]/g, '').replace(/&nbsp|&#160|\s*/gi, '')
	}

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
	 *     name:'kub'
	 * })
	 *
	 * //传入url
	 * Kub.core.setQuerystring('http://www.weidian.com?userId=123',{
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
	 * @param {Object} params 参数对象
	 *
	 * @param {Object} opts   配置参数。 raw : 配置是否 `encodeURIComponent` ，append：是否追加参数。true(default)：如果 url 不存在当前参数名称，则追加一个参数。false：不追加，只进行替换
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
	        _params[name] = value != undefined ? value : ''
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
	            _queryString += (++f ? '&' : '') + (_params[name] !== '' ? name + '=' + (opts.raw ? _params[name] : encodeURIComponent(_params[name])) : name)
	        }
	    }

	    //替换掉原来 url 中的 querystring
	    return url.replace(/^([^#\?]*)[^#]*/, function(a, url) {
	        return url + (_queryString ? '?' + _queryString : '')
	    })
	}

	/**
	 * ## getQuerystring
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
	 * var params = Kub.core.getQuerystring(),name = params.name
	 *
	 * //传入url
	 * var params = Kub.core.getQuerystring('http://www.weidian.com?userId=123'),userId = params.userId
	 *
	 * ```
	 *
	 * @param {String} url url地址，未传值取 `window.location.href`。
	 *
	 * @param {Object} opts 配置参数，配置是否 `decodeURIComponent`
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


/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * # os
	 *
	 * 检测系统类型与版本，包含系统类型与版本信息
	 *
	 * 只检测Android 与 IOS, window phone（window phone 未进行完全测试）
	 */

	var ua = navigator.userAgent,
	    android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
	    ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
	    ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
	    iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
	    wp = ua.match(/Windows Phone ([\d.]+)/),
	    os = {}

	//android
	android ? (os.android = true, os.version = android[2]) : (os.android = false)

	//iphone
	iphone && !ipod ? ( os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.') ) : (os.iphone  = false)

	//ipad
	ipad ? ( os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.') ) : (os.ipad  = false)

	//ipod
	ipod ? ( os.ios = os.ipod = true, os.version = ipod[3].replace(/_/g, '.') ) : (os.ipod = false)

	//window phone
	wp ? ( os.wp = true, os.version = wp[1]) : (os.wp = false)

	//ios
	!os.iphone && !os.ipad && !os.ipod && (os.ios = false)

	//手机
	os.phone = os.android && /mobile/i.test(ua) || os.iphone || os.wp ? true : false

	//平板
	os.tablet = !os.phone && ( os.android || os.ipad || /window/i.test(ua) && /touch/i.test(ua) ) ? true : false

	//移动端
	os.mobile = os.phone || os.tablet

	module.exports = os


/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * # Kub.dateHelper
	 *
	 * 日期格式化组件。
	 *
	 * 格式化字符:
	 *
	    yyyy : 四位年。例如：2015

	    yy   : 二位年份，最后两位。例如 15

	    MMMM : 全称月份。例如 January

	    MMM  : 简称月份。例如 Jan

	    MM   : 两位月份，小于10显示03。例如：11

	    M    : 一位月份，小于10显示3.例如：3或者11

	    dddd : 全称星期。例如：星期一，Sunday

	    ddd  : 简称星期。例如：一，Sun

	    dd   : 两位天数。类似于MM

	    d    : 一位天数。类似于M

	    HH   : 两位小时。类似于MM

	    H    : 一位小时。类似于M

	    mm   : 两位分钟。类似于MM

	    m    : 一位分钟。类似于M

	    ss   : 两位秒数。类似于MM

	    s    : 一位秒数。类似于M

	    aa   : 全称上午或者下午。例如A.M.，P.M.

	    a    : 简称上午或者下午。例如AM.
	*/

	/**
	 * ## DateHelper Constructor
	 *
	 * DateHelper 对外提供的是实例化以后的对象。
	 *
	 * 使用：
	 * ```js
	 * //String to Date
	 * '2015-05-20'.parseDate('yyyy-MM-dd')
	 *
	 * //格式化日期
	 * (new Date()).format('yyyy-MM-dd,hh:mm:ss')
	 * ```
	 */
	function DateHelper() {

	}

	var _prototype = DateHelper.prototype

	var get2Year = function(date) {
	    return (date.getFullYear() + '').replace(/\d{2}$/, '00') - 0
	}

	var get2 = function(value) {
	    return value < 10 ? '0' + value : value
	}

	var getAmPm = function(date) {
	    return date.getHours() < 12 ? 0 : 1
	}

	//获取相对应的日期相关数据
	var getValueByPattern = function(datehelper, fmt, date) {

	    var patterns = {
	        yyyy: date.getFullYear(),
	        yy: date.getFullYear() - get2Year(date),
	        MMMM: datehelper.i18n[datehelper.locale].month.full[date.getMonth()],
	        MMM: datehelper.i18n[datehelper.locale].month.abbr[date.getMonth()],
	        MM: get2(date.getMonth() + 1),
	        M: date.getMonth() + 1,
	        dddd: datehelper.i18n[datehelper.locale].day.full[date.getDay()],
	        ddd: datehelper.i18n[datehelper.locale].day.abbr[date.getDay()],
	        dd: get2(date.getDate()),
	        d: date.getDate(),
	        HH: get2(date.getHours()),
	        H: date.getHours(),
	        mm: get2(date.getMinutes()),
	        m: date.getMinutes(),
	        ss: get2(date.getSeconds()),
	        s: date.getSeconds(),
	        aa: datehelper.i18n[datehelper.locale].amPm.full[getAmPm(date)],
	        a: datehelper.i18n[datehelper.locale].amPm.abbr[getAmPm(date)]
	    }
	    return patterns[fmt]
	}

	//本地化，目前包含`en`与`zh`
	_prototype.i18n = {
	    en: {
	        month: {
	            abbr: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	            full: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	        },
	        day: {
	            abbr: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	            full: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	        },
	        amPm: {
	            abbr: ['AM', 'PM'],
	            full: ['A.M.', 'P.M.']
	        }
	    },
	    zh: {
	        month: {
	            abbr: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
	            full: ['一月份', '二月份', '三月份', '四月份', '五月份', '六月份', '七月份', '八月份', '九月份', '十月份', '十一月份', '十二月份']
	        },
	        day: {
	            abbr: ['日', '一', '二', '三', '四', '五', '六'],
	            full: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
	        },
	        amPm: {
	            abbr: ['上午', '下午'],
	            full: ['上午', '下午']
	        }
	    }
	}

	//默认中文
	_prototype.locale = 'zh'

	/**
	 * ## addLocale
	 *
	 * 添加本地化
	 *
	 * @param {String} name   本地化名称
	 * @param {Object} locale 本地化数据
	 * @return {instance}     当前实例
	 */
	_prototype.addLocale = function(name, locale) {
	    name && locale && (this.i18n[name] = locale)
	    return this
	}

	/**
	 * ## setLocale
	 *
	 * 设置默认本地化
	 *
	 * @param {String} name 本地化名称
	 * @return {instance}     当前实例
	 */
	_prototype.setLocale = function(name) {
	    this.locale = name
	    return this
	}

	/**
	 * ## format
	 *
	 * 格式化日期
	 *
	 * @param {Date} date     日期
	 * @param {String} format 日期格式
	 * @return {String}        格式化以后的日期
	 */
	_prototype.format = function(date, format) {
	    var self = this
	    if (!date) return

	    format = format || 'yyyy-MM-dd'

	    format = format.replace(/(yyyy|yy|MMMM|MMM|MM|M|dddd|ddd|dd|d|HH|H|mm|m|ss|s|aa|a)/g, function(part) {
	        return getValueByPattern(self, part, date)
	    })
	    return format
	}

	/**
	 * ## parse
	 *
	 * 转换日期
	 *
	 * 此方法存在一个BUG，例如：
	 *
	 * ```js
	 * //1112会被计算在MM内。
	 * dateHelper.parse('2015-1112','yyyy-MMdd')
	 * ```
	 *
	 * 所以在使用parse方法时，每一个串使用字符分隔开。类似于：
	 *
	 * ```js
	 * dateHelper.parse('2015-11-12','yyyy-MM-dd')
	 * ```
	 *
	 * @param {String} input  字符串
	 * @param {String} format 格式化字符串
	 * @return {Date}          格式化的日期
	 */
	_prototype.parse = function(input, format) {
	    if (!input || !format) return
	    var parts = input.match(/(\d+)/g),
	        i = 0,
	        fmt = {}

	    // extract date-part indexes from the format
	    format.replace(/(yyyy|yy|MM|M|dd|d|HH|H|mm|m|ss|s)/g, function(part) {
	        fmt[part] = i++
	    })

	    var year = parts[fmt['yyyy']] || (parseInt(parts[fmt['yy']], 10) + get2Year(new Date())) || 0,

	        month = (parts[fmt['MM']] - 1) || (parts[fmt['M']] - 1) || 0,

	        day = parts[fmt['dd']] || parts[fmt['d']] || 0,

	        hour = parts[fmt['HH']] || parts[fmt['H']] || 0,

	        minute = parts[fmt['mm']] || parts[fmt['m']] || 0,

	        second = parts[fmt['ss']] || parts[fmt['s']] || 0

	    return new Date(year, month, day, hour, minute, second)
	}

	var dateHelper = new DateHelper()

	// 将 parseDate 方法绑定在 `String` 原型上
	String.prototype.parseDate = function(format) {
	    return dateHelper.parse(this, format)
	}

	// 将 format 方法绑定在 `Date` 原型上
	Date.prototype.format = function(format) {
	    return dateHelper.format(this, format)
	}

	module.exports = dateHelper


/***/ },
/* 10 */
/***/ function(module, exports) {

	/**
	 * # Kub.cookie
	 *
	 * copy from `zepto.cookie.js`，将 `expires` 单位改为毫秒。
	 */
	/**
	 * ## cookie 方法
	 *
	 * @param {String} key key值，
	 * @param {String} value   设置值，如果未传递，则表示取值
	 * @param {Object} options 配置项
	 * @return {String} 返回取到的值，如果未赋值，则返回空。
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


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Kub.LazyLoad
	 *
	 * 延迟加载组件。
	 *
	 */

	/**
	 * ## LazyLoad Constructor
	 *
	 * LazyLoad 类
	 *
	 * 使用：
	 * ```js
	 * var lazyload = new Kub.LazyLoad($('img'))
	 * ```
	 */

	var $ = __webpack_require__(6),
	    core = __webpack_require__(7)

	function LazyLoad(element, options) {
	    this.$element = $(element)

	    this.options = core.extend({}, _prototype.defaults, options || {})

	    this.$container = $(this.options.container)

	    init(this)
	}

	var _window = window,
	    _prototype = LazyLoad.prototype

	var //横竖屏切换时 ，orientationchange 与 resize事件都会触发，所以只需监听 resize 即可
	    RESIZE_EVENT = 'resize',
	    //三星某款机型在监听非window容器的scroll事件时，会无限次触发，可以使用touchmove替代
	    //但可能会出现 页面加载时触发scroll无法触发scroll与惯性滚动停止时，无法触发的情况
	    //综上：依旧采用scroll解决，对于某些机型进行忽略
	    EVENT_NAME = 'scroll'

	var init = function(lazyload) {
	    var options = lazyload.options,
	        timer

	    var handler = function() {
	        if (lazyload.completed) {
	            return
	        }

	        timer && clearTimeout(timer)

	        timer = setTimeout(function() {

	            loadElementsInViewport(lazyload)

	        }, options.delay)
	    }

	    //页面载入先执行下面
	    loadElementsInViewport(lazyload)

	    //页面紧接着触发scroll，走下面监听
	    lazyload.$container.on(EVENT_NAME, handler)

	    $(_window).on(RESIZE_EVENT, handler)
	}

	//获取所有还未被加载的节点
	var getUnloadedElements = function(lazyload) {
	    var dom = []

	    lazyload.$element.each(function() {
	        !this.loaded && dom.push(this)
	    })

	    return dom
	}

	//加载所有在可视区域内的图片
	var loadElementsInViewport = function(lazyload) {
	    var elements

	    elements = getUnloadedElements(lazyload)

	    lazyload.completed  = elements.length === 0 ? true : false

	    elements.forEach(function(element) {
	        var $this = $(element)

	        lazyload.isVisible($this) && lazyload.load($this)
	    })
	}

	/**
	 * ## defaults
	 *
	 * 默认配置项。
	 *
	 * 配置项说明：
	 *
	 *   `container` : 图片存放容器，容器会监听事件
	 *
	 *   `threshold` : 提前加载距离
	 *
	 *   `delay` : 事件监听时的延迟时间
	 *
	 *   `attributeName` : 属性名称，默认会从dom上取出地址 `data-attributeName`
	 *
	 */
	_prototype.defaults = {
	    container: _window,
	    threshold: 200,
	    delay: 100,
	    attributeName: 'original'
	}

	//更新需要加载的节点，更新以后会立即检测是否有节点在可视区域内
	_prototype.updateElement = function(element) {

	    this.$element = $(element)

	    //更新 dom 以后立即验证是否有元素已经显示
	    loadElementsInViewport(this)

	    return this
	}

	/**
	 * ## loadAll
	 *
	 * 强制加载所有图片，无论节点是否在可视区域内
	 *
	 * @return {instance} 当前实例
	 */
	_prototype.loadAll = function() {
	    var self = this,
	        elements

	    elements = getUnloadedElements(self)

	    this.completed = true

	    elements.forEach(function(element) {
	        var $this = $(element)

	        self.load($this)
	    })
	    return self
	}

	/**
	 * ## isVisible
	 *
	 * 是否可见
	 * @param {$}  $this         元素
	 * @param {Object}  options  参数
	 * @return {Boolean}         true ：可见 false ：不可见
	 */
	_prototype.isVisible = function($this) {
	    var options = this.options

	    if (this.abovethetop($this, options)) {
	        return false
	    } else if (this.belowthefold($this, options)) {
	        return false
	    }
	    if (this.leftofbegin($this, options)) {
	        return false
	    } else if (this.rightoffold($this, options)) {
	        return false
	    }
	    return true
	}

	/**
	 * ## load
	 *
	 * 加载指定元素
	 *
	 * @param {$} $element      加载的节点
	 * @param {String} original 图片地址
	 * @return {instance}       当前实例
	 */
	_prototype.load = function($element) {

	    var original = $element.attr('data-' + this.options.attributeName)

	    //如果原图片为空
	    if (!original) {
	        return
	    }
	    if ($element[0].nodeName === 'IMG') {
	        $element.attr('src', original)
	    } else {
	        $element.css('background-image', 'url(' + original + ')')
	    }
	    //记录该节点已被加载
	    $element[0].loaded = true
	    return this
	}

	/**
	 * ## belowthefold
	 *
	 * 是否在视窗下面
	 *
	 * @param {Element} element 检查的元素
	 * @param {Object} settings 被检查时的参数
	 * @return {Boolean}        是：true 否 ：false
	 */
	_prototype.belowthefold = function(element, settings) {
	    var fold,container = settings.container

	    if (container === _window) {
	        fold = _window.innerHeight  + _window.scrollY
	    } else {
	        var offset = $(container).offset()

	        fold = offset.top + offset.height
	    }

	    return fold <= $(element).offset().top - settings.threshold
	}

	/**
	 * ## abovethetop
	 *
	 * 是否在视窗上面
	 *
	 * @param {Element} element 检查的元素
	 * @param {Object} settings 被检查时的参数
	 * @return {Boolean}        是：true 否 ：false
	 */
	_prototype.abovethetop = function(element, settings) {
	    var fold,container = settings.container

	    if (container === _window) {
	        fold = _window.scrollY
	    } else {
	        fold = $(container).offset().top
	    }

	    var offset = $(element).offset()
	    return fold >= offset.top + settings.threshold + offset.height
	}

	/**
	 * ## rightoffold
	 *
	 * 是否在视窗右侧
	 *
	 * @param {Element} element 检查的元素
	 * @param {Object} settings 被检查时的参数
	 * @return {Boolean}        是：true 否 ：false
	 */
	_prototype.rightoffold = function(element, settings) {
	    var fold,container = settings.container

	    if (container === _window) {
	        fold = _window.innerWidth + _window.scrollX
	    } else {
	        var offset = $(container).offset()
	        fold = offset.left + offset.width
	    }
	    return fold <= $(element).offset().left - settings.threshold
	}

	/**
	 * ## leftofbegin
	 *
	 * 是否在视窗左侧
	 *
	 * @param {Element} element 检查的元素
	 * @param {Object} settings 被检查时的参数
	 * @return {Boolean}        是：true 否 ：false
	 */
	_prototype.leftofbegin = function(element, settings) {
	    var fold,container = settings.container

	    if (container === _window) {
	        fold = _window.scrollX
	    } else {
	        fold = $(container).offset().left
	    }

	    var offset = $(element).offset()

	    return fold >= offset.left + settings.threshold + offset.width
	}

	module.exports = LazyLoad


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Kub.Dialog
	 *
	 * 对话框
	 */

	/**
	 * ## Dialog Constructor
	 *
	 * Dialog 类
	 *
	 * 使用：
	 * ```js
	 *   //可定制多个按钮
	 *   var dialog = new Kub.Dialog({
	 *       message:'这是个弹窗',
	 *       title:'弹窗',
	 *       buttons:[{
	 *           text:'确定',
	 *           handler:function(e,dialog){
	 *
	 *           }
	 *       },{
	 *          text:'取消',
	 *          handler:function(e,dialog){
	 *               //返回 event 与 dialog对象
	 *               dialog.close()
	 *          }
	 *       }]
	 *   })
	 * ```
	 */

	var core = __webpack_require__(7),
	    $ = __webpack_require__(6),
	    template = __webpack_require__(13)

	function Dialog(options) {
	    var opts = this.options = core.extend({}, _prototype.defaults, options || {})
	    init(this)
	}

	var ZOOMIN_CLASS = 'kub-animated kub-zoomin',
	    DIALOG_SELECTOR = '.J_dialog',
	    DIALOG_BUTTON_SELECTOR = '.J_dialogButton',
	    EVENT_NAME = 'click'

	var $body = $(document.body)

	var _window = window;
	    _prototype = Dialog.prototype

	var render = function(dialog,data) {
	    var html = template(data)
	    dialog.$element = $(html).appendTo($body)
	    return this
	}

	var fixed = function(){
	    //解决 iphone 下，fixed定位问题
	    core.os.ios && setTimeout(function() {
	        _window.scrollTo(_window.scrollX, _window.scrollY)
	    }, 5)
	}

	var bindEvents = function(dialog){
	    var options = dialog.options

	    //注册按钮事件
	    dialog.$element.find(DIALOG_BUTTON_SELECTOR).on(EVENT_NAME, function(e) {
	        var index = parseInt($(this).attr('data-index')),
	            button = options.buttons[index]

	        button.handler && button.handler.call(this, e, dialog)
	    })
	}

	var init = function(dialog) {

	    fixed()

	    //渲染数据
	    render(dialog, dialog.options)

	    dialog.$dialog = dialog.$element.find(DIALOG_SELECTOR)

	    dialog.setPosition && dialog.setPosition()

	    dialog.show()

	    bindEvents(dialog)
	}

	/**
	 * ## defaults
	 *
	 * 默认配置项。
	 *
	 * 配置项说明：
	 *
	 * * `modal`: 是否显示遮罩层；
	 *
	 * * `title`: 对话框名称；
	 *
	 * * `showHeader`: 是否显示头部；
	 *
	 * * `message`: 弹窗内容，可设置成`html`；
	 *
	 * * `className`: 弹窗类名；
	 *
	 * * `animated`: 是否开启动画效果；
	 *
	 * * `buttons`: 弹窗按钮；
	 *
	 * ```js
	 * [{
	 *     text:'按钮名称',//按钮名称
	 *     className:'button-name',//按钮class类名
	 *     handler:function(){
	 *         //按钮单击触发事件
	 *     }
	 * }]
	 * ```
	 */
	_prototype.defaults = {
	    modal: true,
	    title: '',
	    showHeader: true,
	    message: '',
	    className: '',
	    animated: true,
	    buttons: null
	}

	/**
	 * ## show
	 *
	 * 显示弹窗
	 * @return {instance} 返回当前实例
	 */
	_prototype.show = function() {

	    this.$element.show()
	    this.options.animated && this.$dialog.addClass(ZOOMIN_CLASS)

	    return this
	}

	/**
	 * ## hide
	 *
	 * 隐藏弹窗
	 * @return {instance} 返回当前实例
	 */
	_prototype.hide = function() {

	    this.$element.hide()
	    this.options.animated && this.$dialog.removeClass(ZOOMIN_CLASS)

	    return this
	}

	/**
	 * ## close
	 *
	 * 关闭弹窗
	 * @return {instance} 返回当前实例
	 */
	_prototype.close = function() {
	    var opts = this.options

	    if (opts.closeHandler && opts.closeHandler.call(this) === false) {
	        return this
	    }

	    this.hide()
	    this.$element.remove()

	    return this
	}

	module.exports = Dialog


/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = function(data){
	var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
	__p+='<div class="kub-dialog-modal '+
	((__t=( data.className))==null?'':__t)+
	' ';
	if( data.modal ){
	__p+=' kub-modal ';
	}
	__p+='"><div class="kub-dialog-wrapper"><div class="kub-dialog-container"><div class="kub-dialog J_dialog"> ';
	if(data.showHeader){
	__p+=' <div class="kub-dialog-header"> '+
	((__t=( data.title))==null?'':__t)+
	' </div> ';
	}
	__p+=' <div class="kub-dialog-body"> '+
	((__t=( data.message))==null?'':__t)+
	' </div> ';
	if(data.buttons && data.buttons.length){
	__p+=' <div class="kub-dialog-footer"> ';
	 for (var i=0,j=data.buttons.length;i<j;i++){
	__p+=' <button class="kub-dialog-button J_dialogButton '+
	((__t=( data.buttons[i].className || ''))==null?'':__t)+
	'" data-index="'+
	((__t=( i))==null?'':__t)+
	'"> '+
	((__t=( data.buttons[i].text))==null?'':__t)+
	' </button> ';
	}
	__p+=' </div> ';
	}
	__p+=' </div></div></div></div>';
	return __p;
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Kub.Alert
	 * alert弹窗，用于提示说明。
	 *
	 * @extend [Dialog](dialog.js.html)
	 */

	/**
	 * ## Alert Constructor
	 *
	 * 初始化`Alert`类，`Alert`并不提供实例方法，实例方法均继承于`Dialog`。
	 *
	 * 使用方法：
	 * ```js
	 * var alert = new Kub.Alert()
	 * ```
	 */

	var core = __webpack_require__(7),
	    Dialog = __webpack_require__(12)

	function Alert(options) {
	    var opts = this.options = core.extend({}, _prototype.defaults, options || {})

	    opts.buttons = [{
	        text: opts.confirmText,
	        handler: this.options.confirm || function(e, dialog) {
	            dialog.close()
	        }
	    }]

	    Dialog.call(this, opts)
	}

	var _prototype = Alert.prototype = Object.create(Dialog.prototype)

	_prototype.constructor = Alert

	/**
	 * ## defaults
	 *
	 * `Alert`默认配置项。
	 *
	 * 配置项说明：
	 *
	 * * `confirm`: 单击确认按钮时触发的事件。如果未传递，单击时会默认关闭弹窗。如果传递，需调用`dialog.close()`手动关闭弹窗。
	 *
	 * * `showHeader`: 是否显示头部。
	 *
	 * * `className`: 弹窗类名，不建议修改，会影响样式。
	 *
	 * * `modal`: 是否显示遮罩层。
	 */

	_prototype.defaults = {
	    confirmText: '确定',
	    confirm: null,
	    showHeader: false,
	    className: 'kub-alert',
	    modal: true
	}

	module.exports = Alert


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Kub.Confirm
	 * confirm弹窗。
	 *
	 * @extend [Dialog](dialog.js.html)
	 */

	/**
	 * ## Confirm Constructor
	 *
	 * 初始化`Confirm`类，`Confirm`并不提供实例方法，实例方法均继承于`Dialog`。
	 *
	 * 使用方法：
	 * ```js
	 * var confirm = new Kub.Confirm({
	 *     confirm:function(e,dialog){
	 *         console.log("确认按钮")
	 *         dialog.close()
	 *     }
	 * })
	 * ```
	 */
	var core = __webpack_require__(7),
	    Dialog = __webpack_require__(12)

	function Confirm(options) {
	    var opts = this.options = core.extend({}, _prototype.defaults, options || {})

	    opts.buttons = [{
	        text: opts.cancelText,
	        handler: opts.cancel || function(e, dialog) {
	            dialog.close()
	        }
	    }, {
	        text: opts.confirmText,
	        handler: opts.confirm
	    }]

	    Dialog.call(this, opts)
	}

	var _prototype = Confirm.prototype = Object.create(Dialog.prototype)

	_prototype.constructor = Confirm

	/**
	 * ## defaults
	 *
	 * `Confirm`默认配置项。
	 *
	 * 配置项说明：
	 *
	 * * `confirm`: 单击确认按钮时触发的事件。一般用于用户单击确认按钮执行事件。需调用`dialog.close()`手动关闭弹窗。
	 *
	 * * `cancel`: 单击取消按钮时触发的事件。如果未传递，单击时会默认关闭弹窗。如果传递，需调用`dialog.close()`手动关闭弹窗。
	 *
	 * * `showHeader`: 是否显示头部。
	 *
	 * * `className`: 弹窗类名，不建议修改，会影响样式。
	 *
	 * * `modal`: 是否显示遮罩层。
	 */
	_prototype.defaults = {
	    confirmText: '确定',
	    confirm: null,
	    cancelText: '取消',
	    cancel: null,
	    showHeader: false,
	    className: "kub-confirm",
	    modal: true
	}

	module.exports = Confirm


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Kub.Prompt
	 *
	 * 输入框
	 * @extend [Dialog](dialog.js.html)
	 */

	/**
	 * ## Prompt Constructor
	 *
	 * 初始化`Prompt`类，`Prompt`并不提供实例方法，实例方法均继承于`Dialog`。
	 *
	 * 使用方法：
	 * ```js
	 * var prompt = new Kub.Prompt({
	 *     confirm:function(event,dialog){
	 *         //输入框输入的值
	 *         console.log(dialog.value)
	 *     }
	 * })
	 * ```
	 */

	var core = __webpack_require__(7),
	    Dialog = __webpack_require__(12),
	    template = __webpack_require__(17)

	function Prompt(options) {
	    var opts = this.options = core.extend({}, _prototype.defaults, options || {})

	    opts.buttons = [{
	        text: opts.cancelText,
	        handler: opts.cancel || function(e, dialog) {
	            dialog.close()
	        }
	    }, {
	        text: opts.confirmText,
	        handler: function(e, dialog) {
	            var value = dialog.$element.find(INPUT_SELECTOR)[0].value
	            opts.confirm && opts.confirm.call(this, e, dialog, value)
	        }
	    }]

	    opts.message = template(opts)

	    Dialog.call(this, opts)
	}

	var INPUT_SELECTOR = '.J_input'

	var _prototype = Prompt.prototype = Object.create(Dialog.prototype)

	_prototype.constructor = Prompt

	/**
	 * ## defaults
	 *
	 * `Prompt`默认配置项。
	 *
	 * 配置项说明：
	 *
	 * * `confirm`: 单击确认按钮时触发的事件。一般用于用户单击确认按钮执行事件。需调用`dialog.close()`手动关闭弹窗。
	 *
	 * * `cancel`: 单击取消按钮时触发的事件。如果未传递，单击时会默认关闭弹窗。如果传递，需调用`dialog.close()`手动关闭弹窗。
	 *
	 * * `showHeader`: 是否显示头部。
	 *
	 * * `className`: 弹窗类名，不建议修改，会影响样式。
	 *
	 * * `modal`: 是否显示遮罩层。
	 *
	 * * `inputType`: 输入框类型。
	 *
	 * * `placeholder`: 输入框 placeholder 属性。
	 *
	 * * `defaultValue`: 输入框默认值。
	 */
	_prototype.defaults = {
	    confirmText: '确定',
	    confirm: null,
	    cancelText: '取消',
	    cancel: null,
	    showHeader: false,
	    className: 'kub-prompt',
	    modal: true,
	    inputType: 'text',
	    placeholder: '',
	    defaultValue: ''
	}

	module.exports = Prompt


/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = function(data){
	var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
	__p+=''+
	((__t=(data.message))==null?'':__t)+
	' <div class="kub-prompt-input-wrapper"><input placeholder="'+
	((__t=( data.placeholder))==null?'':__t)+
	'" type="'+
	((__t=( data.inputType))==null?'':__t)+
	'" value="'+
	((__t=( data.defaultValue))==null?'':__t)+
	'" class="kub-prompt-input J_input"></div>';
	return __p;
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Kub.Toast
	 *
	 * 提示框
	 * @extend [Dialog](dialog.js.html)
	 */

	/**
	 * ## Toast Constructor
	 *
	 * 初始化`Toast`类，`Toast`并不提供实例方法，实例方法均继承于`Dialog`。
	 *
	 * 使用方法：
	 * ```js
	 * var toast = new Kub.Toast({
	 *     message:'操作成功。'
	 * })
	 * ```
	 */

	var core = __webpack_require__(7),
	    Dialog = __webpack_require__(12)

	function Toast(options){
	    var self = this,
	        opts = this.options = core.extend({}, _prototype.defaults, options||{},{
	            showHeader:false,
	            buttons:null
	        })

	    Dialog.call(this, opts)

	    //自动关闭
	    setTimeout(function(){
	        self.close()
	    }, opts.delay)
	}

	var _prototype = Toast.prototype = Object.create(Dialog.prototype)

	_prototype.constructor = Toast

	/**
	 * ## defaults
	 *
	 * `Toast`默认配置项。
	 *
	 * 配置项说明：
	 *
	 * * `message`: 显示文字
	 *
	 * * `className`: 弹窗类名，不建议修改，会影响样式。
	 *
	 * * `top`: 距离顶部高度
	 *
	 * * `delay`: 延迟时间
	 */
	_prototype.defaults = {
	    message:'',
	    className:'kub-toast',
	    top:50,
	    delay:2000,
	    modal:false
	}

	_prototype.setPosition = function(){
	    var top = this.options.top

	    this.$element.css({
	        top:core.isNumber(top) ? top + 'px' : top
	    })
	    return this
	}

	module.exports = Toast


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Kub.Loader
	 *
	 * 加载等待框
	 * @extend [Dialog](dialog.js.html)
	 */

	/**
	 * ## Loader Constructor
	 *
	 * 初始化`Loader`类，`Loader`并不提供实例方法，实例方法均继承于`Dialog`。
	 *
	 * 使用方法：
	 * ```js
	 * var loader = new Kub.Loader()
	 * //隐藏loader
	 * loader.hide()
	 * ```
	 */
	var core = __webpack_require__(7),
	    Dialog = __webpack_require__(12)

	function Loader(options) {
	    var opts = this.options = core.extend({}, _prototype.defaults, options || {}, {
	        showHeader: false,
	        buttons: null
	    })

	    Dialog.call(this, opts)
	}

	var _prototype = Loader.prototype = Object.create(Dialog.prototype)

	_prototype.constructor = Loader

	/**
	 * ## defaults
	 *
	 * `Loader`默认配置项。
	 *
	 * 配置项说明：
	 *
	 * * `className`: 弹窗类名，不建议修改，会影响样式。
	 *
	 * * `message`: 加载文字提示
	 *
	 * * `modal`: 是否显示遮罩层。
	 */
	_prototype.defaults = {
	    className: 'kub-loader',
	    modal: true,
	    message: '加载中…'
	}

	module.exports = Loader


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Kub.Swiper
	 *
	 * 图片切换组件
	 */

	/**
	 * ## Swiper Constructor
	 *
	 * `Swiper`类。
	 *
	 * 使用方法：
	 * ```js
	 *  new Kub.Swiper($swiperWrap.find('.swiper'),{
	 *      slideSelector:$swiperWrap.find('.slide'),
	 *      slideActiveClass:'active',
	 *      paginationSelector:$swiperWrap.find('.pagination li'),
	 *      paginationActiveClass:'pagination-active',
	 *      slide:function(index){
	 *          //console.log('slide:'+index,this)
	 *      }
	 * })
	 * ```
	 */
	var core = __webpack_require__(7),
	    $ = __webpack_require__(6)

	function Swiper(element, options) {

	    this.options = core.extend({}, _prototype.defaults, options || {})

	    this.$element = $(element)

	    var ui = this._ui = {
	        slides: $(options.slideSelector),
	        paginations: $(options.paginationSelector)
	    }

	    ui.slidesLength = ui.slides.length

	    init(this)
	}

	var $document = $(document),
	    isTouch = core.os.mobile

	var START_EVENT = isTouch ? 'touchstart' : 'mousedown',
	    MOVE_EVENT = isTouch ? 'touchmove' : 'mousemove',
	    END_EVENT = isTouch ? 'touchend' : 'mouseup',
	    RESIZE_EVENT = 'resize',
	    TRANSITIONEND_EVENT = 'transitionend',
	    WEBKIT_TRANSITIONEND_EVENT = 'webkitTransitionEnd',
	    HORIZONTAL = 'horizontal',
	    //粘性
	    VISCOSITY = 5,
	    //触摸点偏移量
	    TOUCH_THRESHOLD = 5

	var _window = window,
	    _prototype = Swiper.prototype

	//获取触摸点
	var getCoords = function(event) {
	    var touches = event.touches,
	        data = touches && touches.length ? touches : event.changedTouches

	    return {
	        x: isTouch ? data[0].pageX : event.pageX,
	        y: isTouch ? data[0].pageY : event.pageY
	    }
	}

	//获取偏移
	var getDistance = function(event, startCoords) {
	    var coords = getCoords(event),
	        x = coords.x - startCoords.x,
	        y = coords.y - startCoords.y

	    return {
	        distanceX: x,
	        distanceY: y
	    }
	}

	//获取位置与索引
	var getCoordinates = function(swiper, distanceX, distanceY) {
	    var offset = swiper._ui.slides.offset(),
	        w = offset.width,
	        h = offset.height,
	        l = swiper._ui.slidesLength,
	        index = swiper._ui.active,
	        active = index,
	        threshold = swiper.options.threshold,
	        reach,
	        _distanceY = Math.abs(distanceY),
	        _distanceX = Math.abs(distanceX)

	    if (swiper.options.direction === HORIZONTAL) {

	        //达到门槛
	        reach = threshold < _distanceX

	        //横向
	        if (distanceX > 0 && index == 0) {
	            //最左侧
	            distanceX = distanceX / VISCOSITY

	            index = 0

	        } else if (distanceX < 0 && index == l - 1) {
	            //最右侧
	            distanceX = distanceX / VISCOSITY

	            index = l - 1

	        } else if (reach) {
	            //达到最小偏移量

	            //取整
	            var s = Math.round(_distanceX / w)

	            s = s == 0 ? 1 : s

	            //向右或者向左
	            index = distanceX > 0 ? index - s : index + s
	        }

	        return {
	            x: distanceX + (-w * active),
	            y: 0,
	            index: index,
	            isDefaultPrevented: !(!reach && _distanceX < _distanceY && TOUCH_THRESHOLD < _distanceY)
	        }

	    } else {

	        //达到门槛
	        reach = threshold < _distanceY

	        //垂直
	        if (distanceY > 0 && index == 0) {
	            //最上
	            distanceY = distanceY / VISCOSITY
	            index = 0

	        } else if (distanceY < 0 && index == l - 1) {
	            //最下
	            distanceY = distanceY / VISCOSITY
	            index = l - 1

	        } else if (reach) {
	            //达到最小偏移
	            var s = Math.round(_distanceY / h)

	            s = s == 0 ? 1 : s

	            index = distanceY > 0 ? index - s : index + s
	        }

	        return {
	            x: 0,
	            y: distanceY + (-h * active),
	            index: index,
	            isDefaultPrevented: true
	        }
	    }
	}

	var returnFalse = function() {
	    return false
	}

	//添加重复子节点
	var appendCloneChildren = function(swiper) {

	    if (swiper.options.infinite) {
	        var $slides = swiper._ui.slides,
	            first = $slides[0],
	            last = $slides[swiper._ui.slidesLength - 1],
	            parentElement = first.parentElement

	        parentElement.insertBefore(last.cloneNode(true), first)
	        parentElement.appendChild(first.cloneNode(true))

	        swiper._ui.slidesLength += 2
	    }
	}

	//重置索引值
	var resetSlideIndex = function(swiper) {
	    var index = swiper._ui.active,
	        length = swiper._ui.slidesLength

	    if (swiper.options.infinite) {

	        if (index === length - 1) {
	            swiper.slide(1, 0)
	        }

	        if (index === 0) {
	            swiper.slide(length - 2, 0)
	        }
	    }
	}

	//绑定事件
	var bindEvents = function(swiper) {
	    var flag = false,
	        startCoords

	    var start = function(event) {
	            flag = true
	            event = event.originalEvent || event

	            resetSlideIndex(swiper)

	            startCoords = getCoords(event)

	            setDuration(swiper.$element, null)
	        },
	        move = function(event) {
	            if (!flag) return
	            event = event.originalEvent || event

	            var distance = getDistance(event, startCoords),
	                coordinates = getCoordinates(swiper, distance.distanceX, distance.distanceY)

	            coordinates.isDefaultPrevented && (setTranslate(swiper.$element, coordinates.x, coordinates.y), event.preventDefault())
	        },
	        end = function(event) {
	            if (!flag) return
	            flag = false

	            event = event.originalEvent || event

	            var distance = getDistance(event, startCoords),
	                index = getCoordinates(swiper, distance.distanceX, distance.distanceY).index

	            swiper.slide(index)
	        }

	    //监听横竖屏
	    bindOrientationChangeEvent(swiper)

	    //触发回调函数
	    bindTransitionEndEvent(swiper)

	    swiper.$element.on(START_EVENT, start)
	    $document.on(MOVE_EVENT, move)
	    $document.on(END_EVENT, end)

	    swiper.$element[0].onselectstart = returnFalse
	    swiper.$element[0].ondragstart = returnFalse
	}

	//监听slide完成事件
	var bindTransitionEndEvent = function(swiper) {
	    var $element = swiper.$element

	    var handler = function() {
	        var callback = swiper.options.slide,
	            index = swiper._ui.active

	        resetSlideIndex(swiper)

	        //计算出真实索引值
	        swiper.options.infinite && (index = swiper._ui.active - 1)

	        callback && callback.call(swiper, index)
	    }

	    //duration == 0 无法触发
	    //translate 值未改变也无法触发
	    $element.on(TRANSITIONEND_EVENT, handler).on(WEBKIT_TRANSITIONEND_EVENT, handler)
	}

	//监听横竖屏切换
	var bindOrientationChangeEvent = function(swiper) {
	    var timer

	    function handler() {
	        timer && clearTimeout(timer)
	        timer = setTimeout(function() {
	            swiper.slide(swiper._ui.active)
	        }, 200)
	    }
	    $(_window).on(RESIZE_EVENT, handler)
	}

	//偏移到指定的位置
	var slideTo = function(swiper, index, duration) {
	    var offset = swiper._ui.slides.offset()

	    //由于移动端浏览器 transition 动画不支持百分比，所以采用像素值
	    if (swiper.options.direction === HORIZONTAL) {
	        //横向
	        var w = offset.width

	        setContainerTranslate(swiper, -index * w, 0, duration)
	    } else {
	        //垂直
	        var h = offset.height

	        setContainerTranslate(swiper, 0, -index * h, duration)
	    }
	}

	//添加选中类
	var setActiveClass = function(swiper, index) {
	    var options = swiper.options,
	        slideActiveClass = options.slideActiveClass,
	        paginationActiveClass = options.paginationActiveClass

	    //添加选中的class
	    swiper._ui.slides.removeClass(slideActiveClass).eq(index).addClass(slideActiveClass)

	    swiper._ui.paginations.removeClass(paginationActiveClass).eq(index).addClass(paginationActiveClass)
	}

	//设置容器偏移量
	var setContainerTranslate = function(swiper, x, y, duration) {
	    var $element = swiper.$element

	    duration = duration || 0

	    setDuration($element, duration)
	    setTranslate($element, x, y)
	}

	//设置偏移量
	var setTranslate = function($element, x, y) {
	    core.isNumber(x) && (x += 'px')
	    core.isNumber(y) && (y += 'px')

	    var t = 'translate3d(' + x + ',' + y + ',0)'

	    $element.css({
	        '-webkit-transform': t,
	        'transform': t
	    })
	}

	//设置偏移速度
	var setDuration = function($element, duration) {
	    core.isNumber(duration) && (duration += 'ms')

	    $element.css({
	        '-webkit-transition-duration': duration,
	        'transition-duration': duration
	    })
	}

	var getActualIndex = function(index, length) {
	    return index < 0 ? 0 : index >= length ? length - 1 : index
	}

	//初始化
	var init = function(swiper) {
	    var options = swiper.options

	    appendCloneChildren(swiper)

	    //设置默认样式
	    swiper.$element.css(options.style.swiper)

	    var initialSlide = options.initialSlide || 0
	    options.infinite && (initialSlide = initialSlide + 1)

	    //滚动到默认位置
	    swiper.slide(initialSlide, 0)

	    //绑定事件
	    bindEvents(swiper)
	}

	/**
	 * ## defaults
	 *
	 * `Swiper`默认配置项。
	 *
	 * 配置项说明：
	 *
	 * * `direction`: 切换方向。horizontal：横向， vertical：纵向
	 *
	 * * `threshold`: 最小触发距离。手指移动距离必须超过`threshold`才能切换。
	 *
	 * * `duration`: 切换速度
	 *
	 * * `infinite`: 是否循环滚动 true：循环 false：不循环
	 *
	 * * `initialSlide`: 初始化滚动位置
	 *
	 * * `slideSelector`: 滚动块元素选择器
	 *
	 * * `slideActiveClass`: 滚动块元素选中的类名
	 *
	 * * `paginationSelector`: 缩略图或者icon选择器
	 *
	 * * `paginationActiveClass`: 选中的类名
	 *
	 * * `slide`: 切换回调函数
	 */

	_prototype.defaults = {
	    //vertical
	    direction: HORIZONTAL,
	    threshold: 50,
	    duration: 300,
	    infinite: false,
	    initialSlide: 0,
	    slideSelector: '',
	    slideActiveClass: '',
	    paginationSelector: '',
	    paginationActiveClass: '',
	    slide: null,
	    style: {
	        swiper: {
	            '-webkit-transition-property': '-webkit-transform',
	            'transition-property': 'transform',
	            '-webkit-transition-timing-function': 'ease-out',
	            'transition-timing-function': 'ease-out'
	        }
	    }
	}

	/**
	 * ## slide
	 *
	 * 滚动到指定索引值位置
	 *
	 * @param  {index} index 滚动索引值
	 * @param  {duration} duration 滚动速度，默认使用参数配置的speed
	 * @return {instance}    当前实例
	 */
	_prototype.slide = function(index, duration) {
	    var options = this.options

	    //如果speed为空，则取默认值
	    duration = duration == null ? options.duration : duration

	    //取出实际的索引值,保存当前索引值
	    this._ui.active = index = getActualIndex(index, this._ui.slidesLength)

	    //通过索引值设置偏移
	    slideTo(this, index, duration)

	    //设置选中状态Class
	    setActiveClass(this, options.infinite ? index - 1 : index)

	    return this
	}

	/**
	 * ## next
	 *
	 * 切换到下一个
	 *
	 * @param  {duration} duration 滚动速度，默认使用参数配置的speed
	 * @return {instance}    当前实例
	 */
	_prototype.next = function(duration) {
	    return this.slide(this._ui.active + 1, duration)
	}

	/**
	 * ## prev
	 *
	 * 切换到上一个
	 * @param  {duration} duration 滚动速度，默认使用参数配置的speed
	 * @return {instance}    当前实例
	 */
	_prototype.prev = function(duration) {
	    return this.slide(this._ui.active - 1, duration)
	}

	module.exports = Swiper


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Kub.DatePicker
	 *
	 * 时间选择器。格式化参照 [`date`](date.js.html)
	 *
	 */

	/**
	 * ## DatePicker Constructor
	 *
	 * DatePicker类
	 *
	 * 使用：
	 * ```js
	 *  //采用默认的format yyyy-MM-dd
	 *  var datepicker = new Kub.DatePicker($('#J_datepicker'))
	 *
	 *  //采用默认的format yyyy-MM-dd
	 *  //可配置title 与 本地化
	 *  var datepicker1 = new Kub.DatePicker($('#J_datepicker1'),{
	 *      title:'Date Picker',
	 *      locale:'en'
	 *  })
	 *
	 *  //自定义format
	 *  var datepicker2 = new Kub.DatePicker($('#J_datepicker2'),{
	 *      title:'选择时间',
	 *      format:'yyyy-MM-dd,HH:mm:ss',
	 *      confirm:function(e,datepicker){
	 *          //格式化后的date
	 *          console.log(datepicker.formatDate)
	 *          //手动关闭选择器
	 *          datepicker.hide()
	 *      }
	 *  })
	 * ```
	 */
	var core = __webpack_require__(7),
	    $ = __webpack_require__(6),
	    Dialog = __webpack_require__(12),
	    template = __webpack_require__(22)

	__webpack_require__(9)

	function DatePicker(element, options) {
	    this.$element = $(element)
	    this.options = core.extend({}, _prototype.defaults, options || {})

	    init(this)
	}

	var HEIGHT_UNIT = 50,
	    DURATION = 200,
	    COLUMN_ITEM_SHOW_CLASS = 'kub-datepicker-show',
	    COLUMN_SELECTOR = '.kub-datepicker-column',
	    COLUMN_ITEM_SELECTOR = 'li',
	    COLUMN_CONTAINER_SELECTOR = 'ul'

	var $document = $(document),
	    isTouch = core.os.mobile

	var START_EVENT = isTouch ? 'touchstart' : 'mousedown',
	    MOVE_EVENT = isTouch ? 'touchmove' : 'mousemove',
	    END_EVENT = isTouch ? 'touchend' : 'mouseup',
	    EVENT_NAME = 'click'

	var _prototype = DatePicker.prototype

	//获取触摸点
	var getCoords = function(event) {
	    var touches = event.touches,
	        data = touches && touches.length ? touches : event.changedTouches

	    return {
	        x: isTouch ? data[0].pageX : event.pageX,
	        y: isTouch ? data[0].pageY : event.pageY
	    }
	}

	//获取偏移
	var getDistance = function(event, startCoords) {
	    var coords = getCoords(event),
	        x = coords.x - startCoords.x,
	        y = coords.y - startCoords.y

	    return {
	        distanceX: x,
	        distanceY: y
	    }
	}

	var returnFalse = function() {
	    return false
	}

	//获取当月最大天数
	var getDays = function(year, month) {
	    return new Date(year, month + 1, 0).getDate()
	}

	//根据偏移量算出索引值
	var getIndexByDistance = function(y, max) {
	    //去掉空白的两行
	    max = max - 3
	    y = y > 0 ? 0 : y
	    var index = Math.round(Math.abs(y) / HEIGHT_UNIT)
	    return index > max ? max : index
	}

	//设置偏移速度
	var setDuration = function($this, duration) {
	    var $container = $this[0].$container,
	        transition = 'transform ' + duration + 'ms ease-out',
	        webkiTransition = '-webkit-transform ' + duration + 'ms ease-out'

	    $container.css({
	        '-webkit-transition': duration != null ? webkiTransition : duration,
	        'transition': duration != null ? transition : duration
	    })
	}

	//设置偏移速度
	var setTranslate = function($this, x, y) {
	    var $container = $this[0].$container,
	        t

	    core.isNumber(x) && (x += 'px')
	    core.isNumber(y) && (y += 'px')

	    t = 'translate3d(' + x + ',' + y + ',0)'

	    !$container && ($container = $this[0].$container = $this.find(COLUMN_CONTAINER_SELECTOR))

	    $container.css({
	        '-webkit-transform': t,
	        'transform': t
	    })
	}

	var init = function(datepicker) {
	    var options = datepicker.options,
	        $element,
	        ui

	    //创建对话框
	    render(datepicker)

	    $element = datepicker.$element[0].dialog.$element

	    //缓存dom
	    ui = datepicker._ui = {
	        year: $element.find('.year'),
	        month: $element.find('.month'),
	        day: $element.find('.day'),
	        hour: $element.find('.hour'),
	        minute: $element.find('.minute'),
	        second: $element.find('.second')
	    }
	    ui.columns = $element.find(COLUMN_SELECTOR)

	    //设置块高度
	    HEIGHT_UNIT = ui.columns.find(COLUMN_ITEM_SELECTOR)[0].offsetHeight

	    //隐藏对话框
	    datepicker.hide()

	    //移除
	    removeColumns(options.format, ui)

	    //设置本地化
	    $element.addClass('kub-datepicker-' + options.locale)

	    //设置默认时间
	    datepicker.setDate(options.date)

	    //绑定事件
	    bindEvents(datepicker)
	}

	//移除不需要的列
	var removeColumns = function(format, ui) {
	    format.indexOf('y') === -1 && ui.year.remove()
	    format.indexOf('M') === -1 && ui.month.remove()
	    format.indexOf('d') === -1 && ui.day.remove()
	    format.indexOf('H') === -1 && ui.hour.remove()
	    format.indexOf('m') === -1 && ui.minute.remove()
	    format.indexOf('s') === -1 && ui.second.remove()
	}

	//渲染对话框
	var render = function(datepicker) {
	    var options = datepicker.options,
	        html = template(options)

	    datepicker.$element[0].dialog = new Dialog({
	        title: options.title,
	        message: html,
	        className: options.className,
	        buttons: [{
	            text: options.cancelText,
	            handler: function(e, dialog) {
	                var cancel = options.cancel
	                cancel ? cancel.call(this, e, datepicker) : dialog.hide()
	            }
	        }, {
	            text: options.confirmText,
	            handler: function(e, dialog) {
	                var confirm = options.confirm,
	                    formatDate = datepicker.getDate().format(options.format)

	                confirm ? confirm.call(this, e, datepicker, formatDate) : function() {
	                    datepicker.$element[0].value = formatDate
	                    dialog.hide()
	                }()
	            }
	        }]
	    })
	}

	//绑定事件
	var bindEvents = function(datepicker) {
	    var flag = false,
	        $activeElement

	    var start = function(event) {
	            flag = true
	            event = event.originalEvent || event

	            this.startCoords = getCoords(event)

	            $activeElement = $(this)

	            setDuration($activeElement, null)
	            event.preventDefault()
	        },
	        move = function(event) {
	            if (!flag) return
	            event = event.originalEvent || event

	            var distance = getDistance(event, $activeElement[0].startCoords)

	            setTranslate($activeElement, 0, distance.distanceY - HEIGHT_UNIT * $activeElement[0].index)
	        },
	        end = function(event) {
	            if (!flag) return
	            flag = false
	            event = event.originalEvent || event

	            var distance = getDistance(event, $activeElement[0].startCoords),
	                max = $activeElement.find('.' + COLUMN_ITEM_SHOW_CLASS).length,
	                index = getIndexByDistance(distance.distanceY - HEIGHT_UNIT * $activeElement[0].index, max)

	            $activeElement[0].index = Math.abs(index)

	            resetDays(datepicker, getValue(datepicker, 'year'), getValue(datepicker, 'month'))

	            setDuration($activeElement, DURATION)

	            setTranslate($activeElement, 0, -HEIGHT_UNIT * $activeElement[0].index)
	        }

	    datepicker._ui.columns.on(START_EVENT, function() {
	        start.apply(this, arguments)
	        this.onselectstart = returnFalse
	        this.ondragstart = returnFalse
	    })

	    $document.on(MOVE_EVENT, move)
	    $document.on(END_EVENT, end)

	    bindInputFocusEvent(datepicker)
	}

	//绑定输入框聚焦事件
	var bindInputFocusEvent = function(datepicker) {
	    datepicker.$element.on(EVENT_NAME, function() {
	        //使输入框失去焦点
	        datepicker.$element[0].blur()

	        datepicker.show()

	        return false
	    })
	}

	//重置每月最大天数
	var resetDays = function(datepicker, year, month) {
	    var days = getDays(year, month),
	        day = getValue(datepicker, 'day'),
	        $items = datepicker._ui.day.find(COLUMN_ITEM_SELECTOR)

	    //移除不在本月的日期
	    $items.addClass(COLUMN_ITEM_SHOW_CLASS).slice(days + 1, $items.length - 1).removeClass(COLUMN_ITEM_SHOW_CLASS)

	    days < day && setValue(datepicker, 'day', days)
	}

	//设置时间选择器中某一列的值，可设置年、月、日、时、分、秒的值
	var setValue = function(datepicker, name, value) {
	    var $this = datepicker._ui[name],
	        index,
	        $item = $this.find(COLUMN_ITEM_SELECTOR + '[data-value="' + value + '"]')

	    if ($item.length) {
	        index = parseInt($item.attr('data-index'))

	        $this[0].index = index

	        setTranslate($this, 0, -index * HEIGHT_UNIT)
	    }
	}

	//获取时间选择器中某一列的值，可获取年、月、日、时、分、秒的值
	var getValue = function(datepicker, name) {
	    var $this = datepicker._ui[name],
	        $items = $this.find(COLUMN_ITEM_SELECTOR),
	        index = $this[0].index + 1,
	        value = parseInt($items.eq(index).attr('data-value'))

	    return value ? value : 0
	}

	/**
	 * ## defaults
	 *
	 * 默认配置项
	 *
	 * 配置项说明：
	 *
	 * * `locale`: 本地化。本地化采用CSS实现。
	 *
	 * * `title`: 时间选择器弹窗名称。
	 *
	 * * `confirmText`: 确认按钮文本
	 *
	 * * `confirm`: 单击确认按钮时触发的事件。如果未传递，单击时会默认关闭弹窗，并进行赋值。如果传递，需调用`datepicker.close()`手动关闭弹窗，并且需要手动填充输入框。
	 *
	 * * `cancelText`: 取消按钮文本
	 *
	 * * `cancel`: 单击取消按钮时触发的事件。如果未传递，单击时会默认关闭弹窗。如果传递，需调用`datepicker.close()`手动关闭弹窗。
	 *
	 * * `format`: 日期格式
	 *
	 * * `className`: 弹窗类名，不建议修改，会影响样式。
	 *
	 * * `date`: 默认显示时间
	 *
	 * * `yearRange`: 年份显示区间
	 */
	_prototype.defaults = {
	    locale: 'zh',
	    title: '选择时间',
	    confirmText: '确定',
	    confirm: null,
	    cancelText: '取消',
	    cancel: null,
	    format: 'yyyy-MM-dd',
	    className: 'kub-datepicker-dialog',
	    date: new Date(),
	    yearRange: [1970, 2100]
	}

	/**
	 * ## setDate
	 *
	 * 设置时间选择器时间
	 *
	 * @param {Date} date 时间
	 * @return {instance} 当前实例
	 */
	_prototype.setDate = function(date) {
	    var self = this,
	        year = date.getFullYear(),
	        month = date.getMonth()

	    setValue(self, 'year', year)

	    setValue(self, 'month', month)

	    setValue(self, 'day', date.getDate())

	    setValue(self, 'hour', date.getHours())

	    setValue(self, 'minute', date.getMinutes())

	    setValue(self, 'second', date.getSeconds())

	    //验证是否存在31,30,29天
	    resetDays(self, year, month)

	    return self
	}

	/**
	 * ## getDate
	 *
	 * 获取时间选择器选择的时间
	 *
	 * @return {Date} 获取到的时间
	 */
	_prototype.getDate = function() {
	    var values = {
	        year: getValue(this, 'year'),
	        month: getValue(this, 'month'),
	        day: getValue(this, 'day'),
	        hour: getValue(this, 'hour'),
	        minute: getValue(this, 'minute'),
	        second: getValue(this, 'second')
	    }

	    return new Date(values.year, values.month, values.day, values.hour, values.minute, values.second)
	}

	/**
	 * ## close
	 *
	 * 关闭时间选择器
	 * @return {instance} 当前实例
	 */
	_prototype.close = function() {
	    this.$element[0].dialog.close()
	    return this
	}

	/**
	 * ## show
	 *
	 * 显示时间选择器
	 * @return {instance} 当前实例
	 */
	_prototype.show = function() {
	    this.$element[0].dialog.show()
	    return this
	}

	/**
	 * ## hide
	 *
	 * 隐藏时间选择器
	 * @return {instance} 当前实例
	 */
	_prototype.hide = function() {
	    this.$element[0].dialog.hide()
	    return this
	}

	module.exports = DatePicker


/***/ },
/* 22 */
/***/ function(module, exports) {

	module.exports = function(data){
	var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
	__p+='<div class="kub-datepicker"><div class="kub-datepicker-column year" data-type="year"><ul><li class="kub-datepicker-show"></li> ';
	for(var i=data.yearRange[0],j=0;i<=data.yearRange[1];i++,j++){
	__p+=' <li class="kub-datepicker-show" data-value="'+
	((__t=( i))==null?'':__t)+
	'" data-index="'+
	((__t=( j))==null?'':__t)+
	'"> '+
	((__t=( i ))==null?'':__t)+
	' </li> ';
	}
	__p+=' <li class="kub-datepicker-show"></li></ul></div><div class="kub-datepicker-column month" data-type="month"><ul><li class="kub-datepicker-show"></li> ';
	for(var i=1 ;i<= 12; i++){
	__p+=' <li class="kub-datepicker-show" data-value="'+
	((__t=( i-1))==null?'':__t)+
	'" data-index="'+
	((__t=( i-1))==null?'':__t)+
	'"> '+
	((__t=( ( i < 10 ? ( "0" + i) : i)))==null?'':__t)+
	' </li> ';
	}
	__p+=' <li class="kub-datepicker-show"></li></ul></div><div class="kub-datepicker-column day" data-type="day"><ul><li class="kub-datepicker-show"></li> ';
	for(var i=1 ;i<=31;i++){
	__p+=' <li class="kub-datepicker-show" data-value="'+
	((__t=( i))==null?'':__t)+
	'" data-index="'+
	((__t=( i-1))==null?'':__t)+
	'"> '+
	((__t=(( i < 10 ? ( "0" + i) : i)))==null?'':__t)+
	' </li> ';
	}
	__p+=' <li class="kub-datepicker-show"></li></ul></div><div class="kub-datepicker-column hour" data-type="hour"><ul><li class="kub-datepicker-show"></li> ';
	for(var i=0 ;i<=23;i++){
	__p+=' <li class="kub-datepicker-show" data-value="'+
	((__t=( i))==null?'':__t)+
	'" data-index="'+
	((__t=( i))==null?'':__t)+
	'"> '+
	((__t=(( i < 10 ? ( "0" + i) : i)))==null?'':__t)+
	' </li> ';
	}
	__p+=' <li class="kub-datepicker-show"></li></ul></div><div class="kub-datepicker-column minute" data-type="minute"><ul><li class="kub-datepicker-show"></li> ';
	for(var i=0 ;i<=59;i++){
	__p+=' <li class="kub-datepicker-show" data-value="'+
	((__t=( i))==null?'':__t)+
	'" data-index="'+
	((__t=( i))==null?'':__t)+
	'"> '+
	((__t=( ( i < 10 ? ( "0" + i) : i)))==null?'':__t)+
	' </li> ';
	}
	__p+=' <li class="kub-datepicker-show"></li></ul></div><div class="kub-datepicker-column second" data-type="second"><ul><li class="kub-datepicker-show"></li> ';
	for(var i=0 ;i<=59;i++){
	__p+=' <li class="kub-datepicker-show" data-value="'+
	((__t=( i))==null?'':__t)+
	'" data-index="'+
	((__t=( i))==null?'':__t)+
	'"> '+
	((__t=( ( i < 10 ? ( "0" + i) : i)))==null?'':__t)+
	' </li> ';
	}
	__p+=' <li class="kub-datepicker-show"></li></ul></div><div class="kub-datepicker-overlay"></div></div>';
	return __p;
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(24)
	__webpack_require__(5)


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(25);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(27)(content, {"insertAt":"top"});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./../../node_modules/less-loader/index.js!./kub.less", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/postcss-loader/index.js!./../../node_modules/less-loader/index.js!./kub.less");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(26)();
	// imports


	// module
	exports.push([module.id, ".kub-dialog .kub-dialog-button:focus,.kub-prompt .kub-prompt-input:focus{outline:0}.kub-animated{-webkit-animation-duration:.5s;animation-duration:.5s;-webkit-animation-fill-mode:both;animation-fill-mode:both}@-webkit-keyframes kubZoomIn{0%{opacity:0;-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}100%{opacity:1}}@keyframes kubZoomIn{0%{opacity:0;-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}100%{opacity:1}}.kub-zoomin{-webkit-animation-name:kubZoomIn;animation-name:kubZoomIn}.kub-dialog-modal{position:fixed;top:0;bottom:0;left:0;right:0;width:100%;height:100%;z-index:10000}.kub-modal{background:rgba(0,0,0,.6)}.kub-dialog-wrapper{display:table;width:100%;height:100%}.kub-dialog-wrapper .kub-dialog-container{display:table-cell;vertical-align:middle}.kub-dialog{width:86%;margin:0 auto;font-size:18px;background:#fff;border-radius:6px;color:#333;box-shadow:0 2px 5px rgba(0,0,0,.1)}.kub-dialog .kub-dialog-header{border-radius:6px 6px 0 0;padding:1.1em .5em;text-align:center;background:#f4f4f4}.kub-dialog .kub-dialog-body{line-height:1.5;padding:1.2em 1em;color:#333}.kub-dialog .kub-dialog-button{display:block;background:0 0;border:none;border-right:2px solid #f4f4f4;padding:1em .5em;font-size:100%;text-align:center}.kub-dialog .kub-dialog-footer{border-top:2px solid #f4f4f4;display:-webkit-box;display:-webkit-flex;display:flex}.kub-dialog .kub-dialog-footer .kub-dialog-button{-webkit-box-flex:1;-webkit-flex:1;flex:1}.kub-dialog .kub-dialog-footer .kub-dialog-button:last-child{border:none}.kub-toast{position:fixed;bottom:auto;height:auto;z-index:10002}.kub-toast .kub-dialog{border:1px solid rgba(0,0,0,.1);background:rgba(0,0,0,.7)}.kub-toast .kub-dialog-body{padding:1em .5em;color:#fff;text-align:center}.kub-prompt .kub-prompt-input{font-size:100%;margin-top:5px;width:100%;border:1px solid #f4f4f4;padding:.5em;background:#fff;box-sizing:border-box}.kub-loader{z-index:10001}.kub-loader .kub-dialog{width:36%;background:rgba(0,0,0,.7);border-radius:.8em}.kub-loader .kub-dialog .kub-dialog-body{color:#fff;padding:2em 1em;text-align:center}.kub-datepicker-dialog .kub-dialog-body{padding:.75em}.kub-datepicker{font-size:16px;color:#333;text-align:center;white-space:nowrap;position:relative}.kub-datepicker li,.kub-datepicker ul{list-style:none;margin:0;padding:0}.kub-datepicker .kub-datepicker-overlay{position:absolute;top:50px;left:0;height:50px;width:100%;z-index:0;border:1px solid rgba(0,0,0,.1);border-radius:6px;box-shadow:0 0 100px rgba(0,0,0,.3);box-sizing:border-box}.kub-datepicker .kub-datepicker-column{position:relative;height:150px;padding:0 .6em;display:inline-block;overflow:hidden;z-index:1}.kub-datepicker .kub-datepicker-column:after{position:absolute;font-size:.5em;top:50px;right:0}.kub-datepicker .kub-datepicker-column ul li{line-height:50px;height:50px;display:none}.kub-datepicker .kub-datepicker-column ul .kub-datepicker-show{display:block}.kub-datepicker .year:after{content:\"\\5E74\"}.kub-datepicker .month:after{content:\"\\6708\"}.kub-datepicker .day:after{content:\"\\65E5\"}.kub-datepicker .hour:after{content:\"\\65F6\"}.kub-datepicker .minute:after{content:\"\\5206\"}.kub-datepicker .second:after{content:\"\\79D2\"}.kub-datepicker-en .year:after{content:\"y\"}.kub-datepicker-en .month:after{content:\"m\"}.kub-datepicker-en .day:after{content:\"d\"}.kub-datepicker-en .hour:after{content:\"h\"}.kub-datepicker-en .minute:after{content:\"min\"}.kub-datepicker-en .second:after{content:\"s\"}", ""]);

	// exports


/***/ },
/* 26 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);
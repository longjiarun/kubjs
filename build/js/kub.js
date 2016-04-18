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

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;var Kub = window.Kub = {
	    $: __webpack_require__(2),
	    core: __webpack_require__(3),
	    dateHelper: __webpack_require__(5),
	    cookie: __webpack_require__(6),
	    LazyLoad: __webpack_require__(7),
	    Dialog: __webpack_require__(8),
	    Alert: __webpack_require__(10),
	    Confirm: __webpack_require__(11),
	    Prompt: __webpack_require__(12),
	    Toast: __webpack_require__(14),
	    Loader: __webpack_require__(15)
	};


	if (true) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	        return Kub;
	    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof module !== 'undefined' && module.exports) {
	    module.exports = Kub;
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	var Lite = $ = function(selector, context) {

	    if (!selector) {
	        return wrap();
	    }

	    if (typeof selector === 'function') {
	        return $.ready(selector);
	    }

	    if (typeof selector === 'array') {
	        //$([])
	        return wrap(slice.call(selector), selector);
	    }

	    if (typeof selector === 'object') {
	        if (selector._l) {

	            return selector;
	        } else if ($.isArrayLike(selector)) {

	            return wrap(slice.call(selector), selector);
	        } else {

	            //$(document)
	            return wrap([selector], selector);
	        }
	    }

	    if (typeof selector === 'string') {
	        if (selector[0] === '<'){
	            var nodes = $.fragment(selector);
	            return wrap(nodes, nodes);
	        }

	        return wrap($.qsa(selector, context), selector);
	    }

	    return wrap()
	};

	function wrap(dom, selector) {
	    dom = dom || [];

	    Object.setPrototypeOf(dom, $.fn);

	    dom.selector = selector || '';
	    return dom;
	}

	var slice = Array.prototype.slice,
	    readyRE = /complete|loaded|interactive/,
	    idSelectorRE = /^#([\w-]+)$/,
	    classSelectorRE = /^\.([\w-]+)$/,
	    tagSelectorRE = /^[\w-]+$/;

	(function() {

	    this.qsa = function(selector, context) {
	        selector = selector.trim();
	        context = context || document;

	        if (idSelectorRE.test(selector)) {
	            var found = context.getElementById(RegExp.$1);
	            return found ? [found] : [];
	        }

	        return slice.call(classSelectorRE.test(selector) ? context.getElementsByClassName(RegExp.$1) : tagSelectorRE.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector));
	    }

	    this.fragment = function(html){
	        var div = document.createElement('div'),nodes ;
	        div.innerHTML = html;
	        nodes = div.children;
	        div = null;
	        return slice.call(nodes);
	    }

	    this.isArrayLike = function(obj) {
	        return typeof obj.length == 'number'
	    }

	    this.ready = function(callback) {
	        if (readyRE.test(document.readyState) && document.body) callback($)
	        else document.addEventListener('DOMContentLoaded', function() {
	            callback($)
	        }, false)
	        return this
	    }

	    this.fn = this.prototype = {

	        _l : true,

	        each: function(callback) {
	            var l = this.length,
	                i, t;
	            for (i = 0; i < l; i++) {
	                t = this[i]

	                if (callback.call(t, i, t) === false) {
	                    return this
	                }
	            }
	            return this;
	        },

	        slice: function() {
	            return $(slice.apply(this, arguments));
	        },

	        //only support find(selector)
	        find: function(selector) {
	            var dom = []
	            this.each(function() {
	                if(!this.getElementById) return;

	                var elements = $.qsa(selector, this),
	                    elementsLen = elements.length;

	                for (var i = 0; i < elementsLen; i++) {
	                    dom.indexOf(elements[i]) === -1 && dom.push(elements[i])
	                }
	            })
	            return $(dom);
	        },

	        show: function() {
	            return this.each(function() {
	                this.style.display == 'none' && (this.style.display = '')
	            })
	        },

	        hide: function() {
	            return this.each(function() {
	                this.style.display == 'none'
	            })
	        },

	        css: function(property, value) {
	            //read
	            if (value == null) {
	                var el = this[0]
	                if (el.nodeType !== 1) return

	                return getComputedStyle(el).getPropertyValue(property)
	            }

	            //set
	            return this.each(function() {
	                if (this.nodeType !== 1) return

	                if (typeof property == 'object') {
	                    for (var key in property) {
	                        property[key] == null ? this.style.removeProperty(key) : (this.style[property] = property[key])
	                    }
	                } else {
	                    this.style[property] = value
	                }
	            })
	        },

	        addClass: function(name) {
	            if (!name) return this

	            return this.each(function(idx) {
	                if (!('className' in this)) return

	                var classList = [],
	                    className = this.className;

	                name.trim().split(/\s+/g).forEach(function(klass) {
	                    classList.indexOf(klass) === -1 && classList.push(klass)
	                })

	                this.className = (className && (className + ' ')) + classList.join(' ')
	            })
	        },

	        removeClass: function(name) {
	            return this.each(function(idx) {
	                if (!('className' in this)) return

	                if (name === undefined) return this.className = ''

	                var className = this.className;

	                name.trim().split(/\s+/g).forEach(function(klass) {
	                    className = className.replace(new RegExp('(^|\\s)' + klass + '(\\s|$)', 'g'), " ")
	                })

	                this.className = className;
	            })
	        },

	        eq: function(idx) {
	            return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1)
	        },

	        off: function(name, callback) {
	            return this.each(function() {
	                callback ? this.removeEventListener(name, callback, false) : this.removeEventListener(name) ;
	            });
	        },

	        on: function(name, callback) {
	            return this.each(function() {
	                this.addEventListener(name, callback, false);
	            });
	        },

	        trigger: function(type, detail) {
	            return this.each(function() {
	                this.dispatchEvent(new CustomEvent(type, {
	                    detail: detail,
	                    bubbles: true,
	                    cancelable: true
	                }));
	            });
	        },

	        attr: function(name, value) {
	            var result
	            return (typeof name === 'string' && !value) ?
	                (!this.length || this[0].nodeType !== 1 ? undefined :
	                    (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
	                ) :
	                this.each(function(idx) {
	                    if (this.nodeType !== 1) return
	                    if (typeof name == 'object')
	                        for (key in name) this.setAttribute(key, name[key])
	                    else this.setAttribute(name, value)
	                })
	        },

	        removeAttr: function(name) {
	            return this.each(function() {
	                this.nodeType === 1 && name.split(/\s+/g).forEach(function(attribute) {
	                    this.removeAttribute(attribute)
	                }, this)
	            })
	        },

	        remove: function() {
	            return this.each(function() {
	                var parentElement = this.parentElement;
	                parentElement && parentElement.removeChild(this)
	            })
	        },

	        appendTo : function(target){
	            var dom = [],that = this;

	            target.each(function(){
	                var node = this;
	                that.each(function() {
	                    dom.push(node.appendChild(this));
	                })
	            });

	            return $(dom);
	        },

	        after: function(html) {
	            return this.each(function() {
	                this.insertAdjacentHTML('afterend', html);
	            })
	        },

	        before: function(html) {
	            return this.each(function() {
	                this.insertAdjacentHTML('beforebegin', html);
	            })
	        },

	        append: function(html) {
	            return this.each(function() {
	                this.insertAdjacentHTML('beforeend', html);
	            })
	        },

	        prepend: function(html) {
	            return this.each(function() {
	                this.insertAdjacentHTML('afterbegin', html);
	            })
	        },

	        html: function(html) {
	            return html ?
	                this.each(function() {
	                    this.innerHTML = html;
	                }) :
	                (this[0] ? this[0].innerHTML : null)
	        }
	    }
	}).call(Lite);

	module.exports = Lite;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Kub.core
	 *
	 * kubjs 核心模块，该模块只提供最基础的方法。
	 */
	var os = __webpack_require__(4);

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
	var Core = function() {

	},
	toString = Object.prototype.toString,
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


/***/ },
/* 4 */
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
	    os = {};

	//android
	android ? (os.android = true, os.version = android[2]) : (os.android = false);

	//iphone
	iphone && !ipod ? ( os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.') ) : (os.iphone  = false);

	//ipad
	ipad ? ( os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.') ) : (os.ipad  = false);

	//ipod
	ipod ? ( os.ios = os.ipod = true, os.version = ipod[3].replace(/_/g, '.') ) : (os.ipod = false);

	//window phone
	wp ? ( os.wp = true, os.version = wp[1]) : (os.wp = false);

	//ios
	!os.iphone && !os.ipad && !os.ipod && (os.ios = false);

	//手机
	os.phone = os.android && /mobile/i.test(ua) || os.iphone || os.wp ? true : false;

	//平板
	os.tablet = !os.phone && ( os.android || os.ipad || /window/i.test(ua) && /touch/i.test(ua) ) ? true : false;

	//移动端
	os.mobile = os.phone || os.tablet;

	module.exports = os;


/***/ },
/* 5 */
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
	 * '2015-05-20'.parseDate('yyyy-MM-dd');
	 *
	 * //格式化日期
	 * (new Date()).format('yyyy-MM-dd,hh:mm:ss');
	 * ```
	 */
	var DateHelper = function() {

	};

	var proto = DateHelper.prototype;

	proto.constructor = DateHelper;

	//本地化，目前包含`en`与`zh`
	proto.i18n = {
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
	};

	//默认中文
	proto.locale = 'zh';

	/**
	 * ## addLocale
	 *
	 * 添加本地化
	 *
	 * @param {String} name   本地化名称
	 * @param {Object} locale 本地化数据
	 * @return {instance}     当前实例
	 */
	proto.addLocale = function(name, locale) {
	    name && locale && (this.i18n[name] = locale);
	    return this;
	};

	/**
	 * ## setLocale
	 *
	 * 设置默认本地化
	 *
	 * @param {String} name 本地化名称
	 * @return {instance}     当前实例
	 */
	proto.setLocale = function(name) {
	    this.locale = name;
	    return this;
	};

	var _get2Year = function(date) {
	    return (date.getFullYear() + '').replace(/\d{2}$/, '00') - 0;
	};

	var _get2 = function(value) {
	    return value < 10 ? '0' + value : value;
	};

	var _getAmPm = function(date) {
	    return date.getHours() < 12 ? 0 : 1;
	};

	//获取相对应的日期相关数据
	var _getValueByPattern = function(fmt, date) {
	    var self = this;
	    var patterns = {
	        yyyy: date.getFullYear(),
	        yy: date.getFullYear() - _get2Year(date),
	        MMMM: self.i18n[self.locale].month.full[date.getMonth()],
	        MMM: self.i18n[self.locale].month.abbr[date.getMonth()],
	        MM: _get2(date.getMonth() + 1),
	        M: date.getMonth() + 1,
	        dddd: self.i18n[self.locale].day.full[date.getDay()],
	        ddd: self.i18n[self.locale].day.abbr[date.getDay()],
	        dd: _get2(date.getDate()),
	        d: date.getDate(),
	        HH: _get2(date.getHours()),
	        H: date.getHours(),
	        mm: _get2(date.getMinutes()),
	        m: date.getMinutes(),
	        ss: _get2(date.getSeconds()),
	        s: date.getSeconds(),
	        aa: self.i18n[self.locale].amPm.full[_getAmPm(date)],
	        a: self.i18n[self.locale].amPm.abbr[_getAmPm(date)]
	    };
	    return patterns[fmt];
	};

	/**
	 * ## format
	 *
	 * 格式化日期
	 *
	 * @param {Date} date     日期
	 * @param {String} format 日期格式
	 * @return {String}        格式化以后的日期
	 */
	proto.format = function(date, format) {
	    var self = this;
	    if (!date) return;

	    format = format || 'yyyy-MM-dd';

	    format = format.replace(/(yyyy|yy|MMMM|MMM|MM|M|dddd|ddd|dd|d|HH|H|mm|m|ss|s|aa|a)/g, function(part) {
	        return _getValueByPattern.call(self, part, date);
	    });
	    return format;
	};

	/**
	 * ## parse
	 *
	 * 转换日期
	 *
	 * 此方法存在一个BUG，例如：
	 *
	 * ```js
	 * //1112会被计算在MM内。
	 * dateHelper.parse('2015-1112','yyyy-MMdd');
	 * ```
	 *
	 * 所以在使用parse方法时，每一个串使用字符分隔开。类似于：
	 *
	 * ```js
	 * dateHelper.parse('2015-11-12','yyyy-MM-dd');
	 * ```
	 *
	 * @param {String} input  字符串
	 * @param {String} format 格式化字符串
	 * @return {Date}          格式化的日期
	 */
	proto.parse = function(input, format) {
	    if (!input || !format) return;
	    var parts = input.match(/(\d+)/g),
	        i = 0,
	        fmt = {};

	    // extract date-part indexes from the format
	    format.replace(/(yyyy|yy|MM|M|dd|d|HH|H|mm|m|ss|s)/g, function(part) {
	        fmt[part] = i++;
	    });

	    var year = parts[fmt['yyyy']] || (parseInt(parts[fmt['yy']], 10) + _get2Year(new Date())) || 0,

	        month = (parts[fmt['MM']] - 1) || (parts[fmt['M']] - 1) || 0,

	        day = parts[fmt['dd']] || parts[fmt['d']] || 0,

	        hour = parts[fmt['HH']] || parts[fmt['H']] || 0,

	        minute = parts[fmt['mm']] || parts[fmt['m']] || 0,

	        second = parts[fmt['ss']] || parts[fmt['s']] || 0;

	    return new Date(year, month, day, hour, minute, second);
	};

	var dateHelper = new DateHelper();

	// 将 parseDate 方法绑定在 `String` 原型上
	String.prototype.parseDate = function(format) {
	    return dateHelper.parse(this, format);
	};

	// 将 format 方法绑定在 `Date` 原型上
	Date.prototype.format = function(format) {
	    return dateHelper.format(this, format);
	};

	module.exports = dateHelper;


/***/ },
/* 6 */
/***/ function(module, exports) {

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
	var cookie = function (key, value, options) {
	    var days, time, result, decode;

	    options = options || {};

	    if(!options.hasOwnProperty('path')){
	        options.path = '/';
	    }

	    // A key and value were given. Set cookie.
	    if (arguments.length > 1 && String(value) !== "[object Object]") {
	        // Enforce object

	        if (value === null || value === undefined) options.expires = -1;

	        if (typeof options.expires === 'number') {
	            days = (options.expires);
	            time = options.expires = new Date();

	            time.setTime(time.getTime() + days);
	        }

	        value = String(value);

	        return (document.cookie = [
	            encodeURIComponent(key), '=',
	            options.raw ? value : encodeURIComponent(value),
	            options.expires ? '; expires=' + options.expires.toUTCString() : '',
	            options.path ? '; path=' + options.path : '',
	            options.domain ? '; domain=' + options.domain : '',
	            options.secure ? '; secure' : ''
	        ].join(''));
	    }

	    // Key and possibly options given, get cookie
	    options = value || {};

	    decode = options.raw ? function (s) { return s } : decodeURIComponent;

	    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null
	};

	module.exports = cookie;


/***/ },
/* 7 */
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
	 * var lazyload = new Kub.LazyLoad($('img'));
	 * ```
	 */

	var $ = __webpack_require__(2);
	var LazyLoad = function(element, options) {
	        this.$element = $(element);

	        this.options = $.extend({}, LazyLoad.prototype.defaults, options || {});
	        this.$window = $(window);
	        this.$container = (this.options.container === undefined ||
	            this.options.container === window) ? (this.containerIsWindow = true, this.$window) : ($(this.options.container));
	        _init.call(this);
	    },

	    proto = LazyLoad.prototype;

	proto.constructor = LazyLoad;

	/**
	 * ## defaults
	 *
	 * 默认配置项。
	 *
	 * 配置项说明：
	 *
	 *   `container` : 图片存放容器，容器会监听事件
	 *
	 *   `threshold` : 提前加载距离，默认50px
	 *
	 *   `waitTime` : 等待时间，用户如果在 waitTime 时间内无操作，则会加载剩余默认图片
	 *
	 *   `delay` : 事件监听时的延迟时间
	 *
	 *   `attributeName` : 属性名称，默认会从dom上取出地址 `data-attributeName`
	 *
	 *   `eventName` : 监听的事件名称
	 */
	proto.defaults = {
	    container: window,
	    threshold: 50,
	    waitTime: -1,
	    delay: 150,
	    attributeName: 'original',
	    eventName: 'scroll resize'
	};

	//更新需要加载的节点，更新以后会立即检测是否有节点在可视区域内
	proto.updateElement = function(element) {
	    var self = this;
	    self.$element = element;
	    //更新 dom 以后立即验证是否有元素已经显示
	    self.loadElementsInViewport();
	    return self;
	};

	/**
	 * ## getUnloadedElements
	 *
	 * 获取所有还未被加载的节点
	 *
	 * @return {instance} 当前实例
	 */
	proto.getUnloadedElements = function() {
	    var self = this;
	    return self.$element.filter(function(index) {
	        return !this.loaded;
	    });
	};

	/**
	 * ## loadAll
	 *
	 * 强制加载所有图片，无论节点是否在可视区域内
	 *
	 * @return {instance} 当前实例
	 */
	proto.loadAll = function() {
	    var self = this,
	        options = self.options,
	        elements;
	    elements = self.getUnloadedElements();
	    elements.each(function() {
	        var $this = $(this);
	        self.load($this, $this.attr('data-' + self.options.attributeName));
	    });
	    return self;
	};

	//加载所有在可视区域内的图片
	proto.loadElementsInViewport = function() {
	    var self = this,
	        options = self.options,
	        elements;

	    elements = self.getUnloadedElements();
	    elements.length == 0 && (self.completed = true);
	    elements.each(function() {
	        var $this = $(this),
	            flag = true;

	        flag = self.isVisible($this, options);
	        flag && self.load($this, $this.attr('data-' + self.options.attributeName));
	    });
	    return self;
	};

	/**
	 * ## isVisible
	 *
	 * 是否可见
	 * @param {$}  $this         元素
	 * @param {Object}  options  参数
	 * @return {Boolean}         true ：可见 false ：不可见
	 */
	proto.isVisible = function($this, options) {
	    var self = this;
	    if (self.abovethetop($this, options)) {
	        return false;
	    } else if (self.belowthefold($this, options)) {
	        return false;
	    }
	    if (self.leftofbegin($this, options)) {
	        return false;
	    } else if (self.rightoffold($this, options)) {
	        return false;
	    }
	    return true;
	}

	var _loadAllIfTimeout = function() {
	    var self = this,
	        options = self.options;
	    typeof options.waitTime === 'number' && !(options.waitTime !== +options.waitTime) && options.waitTime > 0 && (self._waitTimer = setTimeout(function() {
	        self.loadAll();
	    }, options.waitTime));
	    return self;
	}

	var _init = function() {
	    var self = this,
	        options = self.options;

	    this._handle = function() {
	        if (self.completed) {
	            return;
	        }
	        self._timer && clearTimeout(self._timer);
	        self._waitTimer && clearTimeout(self._waitTimer);
	        self._timer = setTimeout(function() {
	            self.loadElementsInViewport();
	            _loadAllIfTimeout.call(self);
	        }, options.delay);
	    };

	    self.loadElementsInViewport();
	    _loadAllIfTimeout.call(self);

	    self.$container.on(options.eventName, self._handle);
	    //有可能 window resize 会影响到元素的位置
	    !self.containerIsWindow && self.$window.on('resize', self._handle);
	};

	/**
	 * ## load
	 *
	 * 加载指定元素
	 *
	 * @param {$} $element      加载的节点
	 * @param {String} original 图片地址
	 * @return {instance}       当前实例
	 */
	proto.load = function($element, original) {
	    //如果原图片为空
	    if (!original) {
	        return;
	    }
	    if ($element[0].nodeName === 'IMG') {
	        $element.attr('src', original);
	    } else {
	        $element.css('background-image', 'url(' + original + ')');
	    }
	    $element[0].loaded = true;
	    return this;
	};

	/**
	 * ## destroy
	 *
	 * 销毁对象
	 * @return {instance} 当前实例
	 */
	proto.destroy = function() {
	    var self = this,
	        options = self.options;
	    //取消监听
	    self.$container.off(options.eventName, self._handle);
	    !self.containerIsWindow && self.$window.off('resize', self._handle);
	    //clear timeout
	    self._timer && clearTimeout(self._timer);
	    self._waitTimer && clearTimeout(self._waitTimer);

	    return self;
	};

	/**
	 * 是否在可视区域内
	 *
	 * @param {zepto} element 检查的元素
	 * @return {Boolean} 是：true 否 ：false
	 */
	proto.isInViewport = function($this) {
	    return !this.belowthefold($this[0], this.options) && !this.abovethetop($this[0], this.options) && !this.rightoffold($this[0], this.options) && !this.leftofbegin($this[0], this.options);
	};

	/**
	 * ## belowthefold
	 *
	 * 是否在视窗下面
	 *
	 * @param {Element} element 检查的元素
	 * @param {Object} settings 被检查时的参数
	 * @return {Boolean}        是：true 否 ：false
	 */
	proto.belowthefold = function(element, settings) {
	    var fold, $window = $(window);
	    if (settings.container === undefined || settings.container === window) {
	        fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
	    } else {
	        fold = $(settings.container).offset().top + $(settings.container).height();
	    }

	    return fold <= $(element).offset().top - settings.threshold;
	};

	/**
	 * ## abovethetop
	 *
	 * 是否在视窗上面
	 *
	 * @param {Element} element 检查的元素
	 * @param {Object} settings 被检查时的参数
	 * @return {Boolean}        是：true 否 ：false
	 */
	proto.abovethetop = function(element, settings) {
	    var fold, $window = $(window);

	    if (settings.container === undefined || settings.container === window) {
	        fold = $window.scrollTop();
	    } else {
	        fold = $(settings.container).offset().top;
	    }

	    return fold >= $(element).offset().top + settings.threshold + $(element).height();
	};

	/**
	 * ## rightoffold
	 *
	 * 是否在视窗右侧
	 *
	 * @param {Element} element 检查的元素
	 * @param {Object} settings 被检查时的参数
	 * @return {Boolean}        是：true 否 ：false
	 */
	proto.rightoffold = function(element, settings) {
	    var fold, $window = $(window);
	    if (settings.container === undefined || settings.container === window) {
	        fold = $window.width() + $window.scrollLeft();
	    } else {
	        fold = $(settings.container).offset().left + $(settings.container).width();
	    }
	    return fold <= $(element).offset().left - settings.threshold;
	};

	/**
	 * ## leftofbegin
	 *
	 * 是否在视窗左侧
	 *
	 * @param {Element} element 检查的元素
	 * @param {Object} settings 被检查时的参数
	 * @return {Boolean}        是：true 否 ：false
	 */
	proto.leftofbegin = function(element, settings) {
	    var fold, $window = $(window);
	    if (settings.container === undefined || settings.container === window) {
	        fold = $window.scrollLeft();
	    } else {
	        fold = $(settings.container).offset().left;
	    }
	    return fold >= $(element).offset().left + settings.threshold + $(element).width();
	};

	module.exports = LazyLoad;


/***/ },
/* 8 */
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
	 *               dialog.close();
	 *          }
	 *       }]
	 *   });
	 * ```
	 */

	var core = __webpack_require__(3),
	    $ = __webpack_require__(2),
	    template = __webpack_require__(9);

	var Dialog = function(options) {
	    var opts = this.options = core.extend({}, Dialog.prototype.defaults, options || {});

	    //由于按钮排列采用CSS解决，所以目前限制最大可包含5个按钮
	    //opts.buttons && opts.buttons.length > 5 && (opts.buttons.length = 5);
	    init.call(this);
	};

	var $body = $('body'),
	    proto = Dialog.prototype;

	var ZOOMIN_CLASS = 'kub-animated kub-zoomIn',
	    DIALOG_SELECTOR = '#J_dialog',
	    DIALOG_BUTTON_SELECTOR = '.J_dialogButton';

	proto.constructor = Dialog;

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
	 * * `scrollable`: 是否禁用页面滚动条；
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
	proto.defaults = {
	    modal: true,
	    title: '',
	    showHeader: true,
	    message: '',
	    className: '',
	    scrollable: true,
	    animated: true,
	    buttons: null
	};

	var render = function(data) {
	    var html = template({
	        data: data
	    });
	    this.$element = $(html).appendTo($body);
	    return this;
	};

	var init = function() {
	    var self = this,
	        options = self.options;

	    //解决 iphone 下，fixed定位问题
	    setTimeout(function() {
	        window.scrollTo(window.scrollX, window.scrollY);
	    }, 5);

	    //渲染数据
	    render.call(self, options);

	    self.$dialog = self.$element.find(DIALOG_SELECTOR);

	    self.setPosition && self.setPosition();

	    self.show();

	    //注册按钮事件
	    self.$element.find(DIALOG_BUTTON_SELECTOR).on('click', function(e) {
	        var index = parseInt($(this).attr('data-index')),
	            button = options.buttons[index];

	        button.handler && button.handler.call(this, e, self);
	    });
	};


	/**
	 * ## show
	 *
	 * 显示弹窗
	 * @return {instance} 返回当前实例
	 */
	proto.show = function() {

	    this.$element.show();
	    this.options.animated && this.$dialog.addClass(ZOOMIN_CLASS);

	    return this;
	};

	/**
	 * ## hide
	 *
	 * 隐藏弹窗
	 * @return {instance} 返回当前实例
	 */
	proto.hide = function() {

	    this.$element.hide();
	    this.options.animated && this.$dialog.removeClass(ZOOMIN_CLASS);

	    return this;
	};

	/**
	 * ## close
	 *
	 * 关闭弹窗
	 * @return {instance} 返回当前实例
	 */
	proto.close = function() {
	    var opts = this.options;

	    if (opts.closeHandler && opts.closeHandler.call(this) === false) {
	        return this;
	    }

	    this.hide();
	    this.$element.remove();

	    return this;
	};

	module.exports = Dialog;


/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports=function(obj){
	var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
	with(obj||{}){
	__p+='<div class="kub-dialog-modal '+
	((__t=( data.className))==null?'':__t)+
	' ';
	if( data.modal ){
	__p+=' kub-modal ';
	}
	__p+='"><div class="kub-dialog-wrapper"><div class="kub-dialog-container"><div class="kub-dialog" id="J_dialog"> ';
	if(data.showHeader){
	__p+=' <div class="kub-dialog-header"><strong> '+
	((__t=( data.title))==null?'':__t)+
	' </strong></div> ';
	}
	__p+=' <div class="kub-dialog-body"> '+
	((__t=( data.message))==null?'':__t)+
	' </div> ';
	if(data.buttons && data.buttons.length){
	__p+=' <div class="kub-dialog-footer kub-column'+
	((__t=( data.buttons.length))==null?'':__t)+
	'"> ';
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
	}
	return __p;
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Kub.Alert
	 * alert弹窗，用于提示说明。
	 *
	 * @extend [Dialog](dialog.js.html)
	 */
	var core = __webpack_require__(3),
	    $ = __webpack_require__(2),
	    Dialog = __webpack_require__(8);

	/**
	 * ## Alert Constructor
	 *
	 * 初始化`Alert`类，`Alert`并不提供实例方法，实例方法均继承于`Dialog`。
	 *
	 * 使用方法：
	 * ```js
	 * var alert = new Kub.Alert();
	 * ```
	 */

	var Alert = function(options) {
	        var opts = this.options = core.extend({}, Alert.prototype.defaults, options || {});

	        opts.buttons = [{
	            text: opts.confirmText,
	            handler: this.options.confirm || function(e, dialog) {
	                dialog.close();
	            }
	        }];

	        Dialog.call(this, opts);
	    },
	    proto = Alert.prototype = Object.create(Dialog.prototype);

	proto.constructor = Alert;

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
	 * * `closable`: 是否显示关闭按钮，`showHeader`为`true`时有效。
	 *
	 * * `className`: 弹窗类名，不建议修改，会影响样式。
	 *
	 * * `locale`: 本地化。与`Dialog`保持一致。
	 *
	 * * `modal`: 是否显示遮罩层。
	 */

	proto.defaults = {
	    confirmText:'确定',
	    confirm: null,
	    showHeader: false,
	    closable: false,
	    className: 'kub-alert',
	    locale: 'zh',
	    modal: true
	};

	module.exports = Alert;


/***/ },
/* 11 */
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
	 *         console.log("确认按钮");
	 *         dialog.close();
	 *     }
	 * });
	 * ```
	 */
	var core = __webpack_require__(3),
	    $ = __webpack_require__(2),
	    Dialog = __webpack_require__(8);

	var Confirm = function(options) {

	        var opts = this.options = core.extend({}, Confirm.prototype.defaults, options || {});

	        opts.buttons = [{
	            text: opts.cancelText,
	            handler: opts.cancel || function(e, dialog) {
	                dialog.close();
	            }
	        }, {
	            text: opts.confirmText,
	            handler: opts.confirm
	        }];

	        Dialog.call(this, opts);
	    },
	    proto = Confirm.prototype = Object.create(Dialog.prototype);


	proto.constructor = Confirm;

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
	 * * `locale`: 本地化。与`Dialog`保持一致。
	 *
	 * * `modal`: 是否显示遮罩层。
	 */
	proto.defaults = {
	    confirmText: '确定',
	    confirm: null,
	    cancelText: '取消',
	    cancel: null,
	    showHeader: false,
	    className: "kub-confirm",
	    modal: true
	};

	module.exports = Confirm;


/***/ },
/* 12 */
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
	 *         console.log(dialog.value);
	 *     }
	 * });
	 * ```
	 */

	var core = __webpack_require__(3),
	    $ = __webpack_require__(2),
	    Dialog = __webpack_require__(8),
	    template = __webpack_require__(13);

	var Prompt = function(options) {
	    var self = this,
	        opts = this.options = core.extend({}, Prompt.prototype.defaults, options || {});

	    opts.buttons = [{
	        text: opts.cancelText,
	        handler: opts.cancel || function(e, dialog) {
	            dialog.close();
	        }
	    }, {
	        text: opts.confirmText,
	        handler: function(e, dialog) {
	            dialog.value = dialog.$element.find(INPUT_SELECTOR)[0].value;
	            opts.confirm && opts.confirm.call(this, e, dialog);
	        }
	    }];

	    opts.message = template({
	        data: opts
	    });

	    Dialog.call(this, opts);
	};

	var proto = Prompt.prototype = Object.create(Dialog.prototype);

	var INPUT_SELECTOR = '#J_input';

	proto.constructor = Prompt;

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
	 * * `closable`: 是否显示关闭按钮，`showHeader`为`true`时有效。
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
	proto.defaults = {
	    confirmText: '确定',
	    confirm: null,
	    cancelText: '取消',
	    cancel: null,
	    showHeader: false,
	    closable: false,
	    className: 'kub-prompt',
	    modal: true,
	    inputType: 'text',
	    placeholder: '',
	    defaultValue: ''
	};

	module.exports = Prompt;


/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports=function(obj){
	var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
	with(obj||{}){
	__p+=''+
	((__t=(data.message))==null?'':__t)+
	' <div class="kub-prompt-input-wrapper"><input placeholder="'+
	((__t=( data.placeholder))==null?'':__t)+
	'" type="'+
	((__t=( data.inputType))==null?'':__t)+
	'" id="J_input" value="'+
	((__t=( data.defaultValue))==null?'':__t)+
	'" class="kub-prompt-input"></div>';
	}
	return __p;
	};

/***/ },
/* 14 */
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
	 * });
	 * ```
	 */

	var core = __webpack_require__(3),
	    Dialog = __webpack_require__(8);

	var Toast = function(options){
	    var self = this,
	        opts = this.options = core.extend({},Toast.prototype.defaults, options||{});

	    Dialog.call(this, opts);

	    //自动关闭
	    setTimeout(function(){
	        self.close();
	    }, opts.delay);
	};

	var proto = Toast.prototype = Object.create(Dialog.prototype);

	proto.constructor = Toast;

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
	proto.defaults = {
	    message:'',
	    className:'kub-toast',
	    top:50,
	    delay:2000,

	    showHeader:false,
	    buttons:null,
	    modal:false
	};

	proto.setPosition = function(){
	    var top = this.options.top;

	    this.$element.css({
	        top:core.isNumber(top) ? top + 'px' : top
	    });
	    return this;
	};

	module.exports = Toast;


/***/ },
/* 15 */
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
	 * var loader = new Kub.Loader();
	 * //隐藏loader
	 * loader.hide();
	 * ```
	 */
	var core = __webpack_require__(3),
	    $ = __webpack_require__(2),
	    Dialog = __webpack_require__(8),
	    template = __webpack_require__(16);

	var Loader = function(options) {
	    var self = this,
	        opts = this.options = core.extend({}, Loader.prototype.defaults, options || {});

	    opts.message = template({
	        data: this.options
	    });

	    Dialog.call(this, opts);
	};

	var proto = Loader.prototype = Object.create(Dialog.prototype);

	proto.constructor = Loader;

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
	proto.defaults = {
	    scrollable: true,
	    className: 'kub-loader',
	    modal: true,
	    message: '加载中...',

	    showHeader: false,
	    buttons: null
	};

	module.exports = Loader;


/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports=function(obj){
	var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
	with(obj||{}){
	__p+='<div class="kub-spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div><div class="kub-loader-message">'+
	((__t=( data.message))==null?'':__t)+
	'</div>';
	}
	return __p;
	};

/***/ }
/******/ ]);
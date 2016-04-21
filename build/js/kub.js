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

	var __WEBPACK_AMD_DEFINE_RESULT__;try{
	    var Kub = window.Kub = {
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
	        Loader: __webpack_require__(15),
	        Swiper: __webpack_require__(17)
	    };


	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
	            return Kub;
	        }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined' && module.exports) {
	        module.exports = Kub;
	    }
	}catch(e){
	    alert(e.message)
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	var $ = Lite = function Lite(selector, context) {
	    context = context || document;

	    if (!selector) {
	        return wrap();
	    }

	    if (typeof selector === 'function') {
	        return $.ready(selector);
	    }

	    if (isArray(selector)) {
	        //$([document,document.body]) not $(window)
	        return wrap(slice.call(selector), selector);
	    }

	    if (typeof selector === 'object') {
	        if (selector._l) {

	            return selector;
	        } else {

	            //$(document)
	            return wrap([selector], selector);
	        }
	    }

	    if (typeof selector === 'string') {
	        if (selector[0] === '<') {
	            var nodes = $.fragment(selector);
	            return wrap(nodes, nodes);
	        }

	        if (idSelectorRE.test(selector)) {
	            var found = context.getElementById(RegExp.$1);

	            return wrap(found ? [found] : []);
	        }

	        return wrap($.qsa(selector, context), selector);
	    }

	    return wrap();
	}

	var slice = Array.prototype.slice,
	    readyRE = /complete|loaded|interactive/,
	    idSelectorRE = /^#([\w-]+)$/,
	    classSelectorRE = /^\.([\w-]+)$/,
	    tagSelectorRE = /^[\w-]+$/;

	function wrap(dom, selector) {
	    dom = dom || [];

	    Object.setPrototypeOf ? Object.setPrototypeOf(dom, $.fn): (dom.__proto__ = $.fn);

	    dom.selector = selector || '';
	    return dom;
	}

	function dasherize(str) {
	    return str.replace(/::/g, '/')
	        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
	        .replace(/([a-z\d])([A-Z])/g, '$1_$2')
	        .replace(/_/g, '-')
	        .toLowerCase();
	}

	var isArray = Array.isArray ||
	    function(object) {
	        return object instanceof Array
	    };

	(function() {

	    this.qsa = function(selector, context) {
	        selector = selector.trim();
	        return slice.call(classSelectorRE.test(selector) ? context.getElementsByClassName(RegExp.$1) : tagSelectorRE.test(selector) ? context.getElementsByTagName(selector) : context.querySelectorAll(selector));
	    }

	    this.fragment = function(html) {
	        var div = document.createElement('div'),
	            nodes;
	        div.innerHTML = html;
	        nodes = div.children;
	        div = null;
	        return slice.call(nodes);
	    }

	    this.ready = function(callback) {
	        if (readyRE.test(document.readyState) && document.body) {
	            callback($);
	        } else {
	            document.addEventListener('DOMContentLoaded', function() {
	                callback($);
	            }, false)
	        }
	        return this;
	    }

	    this.fn = this.prototype = {

	        _l: true,

	        each: function(callback) {
	            var l = this.length,
	                i, t;
	            for (i = 0; i < l; i++) {
	                t = this[i];

	                if (callback.call(t, i, t) === false) {
	                    return this;
	                }
	            }
	            return this;
	        },

	        slice: function() {
	            return $(slice.apply(this, arguments));
	        },

	        //only support find(selector)
	        find: function(selector) {
	            var dom = [];

	            this.each(function() {
	                if (!this.querySelectorAll) return;

	                var elements = $.qsa(selector, this),
	                    elementsLen = elements.length;

	                for (var i = 0; i < elementsLen; i++) {
	                    dom.indexOf(elements[i]) === -1 && dom.push(elements[i]);
	                }
	            })
	            return $(dom);
	        },

	        show: function() {
	            return this.each(function() {
	                this.style.display == 'none' && (this.style.display = '');
	            });
	        },

	        hide: function() {
	            return this.each(function() {
	                this.style.display == 'none';
	            });
	        },

	        css: function(property, value) {
	            var isObject = typeof property == 'object';
	            //get
	            if (value == null && !isObject) {
	                var el = this[0];

	                if (el.nodeType !== 1) return;

	                return getComputedStyle(el).getPropertyValue(property);
	            }

	            var css = '';
	            if (isObject) {
	                for (var key in property) {
	                    property[key] == null ? this.each(function() {
	                        this.style.removeProperty(key)
	                    }) : (css += dasherize(key) + ':' + property[key] + ';');
	                }
	            } else {
	                css += dasherize(key) + ':' + property[key] + ';'
	            }

	            //set
	            return this.each(function() {
	                this.style.cssText += ';' + css;
	            });

	        },

	        // only support get
	        offset: function() {
	            if (!this.length) return null;

	            var obj = this[0].getBoundingClientRect();
	            return {
	                left: obj.left + window.pageXOffset,
	                top: obj.top + window.pageYOffset,
	                width: Math.round(obj.width),
	                height: Math.round(obj.height)
	            }
	        },

	        addClass: function(name) {
	            if (!name) return this;

	            return this.each(function(idx) {
	                if (!('className' in this)) return;

	                var classList = [],
	                    className = this.className;

	                name.trim().split(/\s+/g).forEach(function(klass) {
	                    classList.indexOf(klass) === -1 && classList.push(klass);
	                })

	                this.className = (className && (className + ' ')) + classList.join(' ');
	            })
	        },

	        removeClass: function(name) {
	            return this.each(function(idx) {
	                if (!('className' in this)) return;

	                if (name === undefined) return this.className = ''

	                var className = this.className;

	                name.trim().split(/\s+/g).forEach(function(klass) {
	                    className = className.replace(new RegExp('(^|\\s)' + klass + '(\\s|$)', 'g'), "");
	                })

	                this.className = className;
	            })
	        },

	        eq: function(idx) {
	            return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
	        },

	        off: function(name, callback) {
	            return this.each(function() {
	                callback ? this.removeEventListener(name, callback, false) : this.removeEventListener(name);
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
	            var result;

	            return (typeof name === 'string' && !value) ?
	                (!this.length || this[0].nodeType !== 1 ? undefined :
	                    (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
	                ) :
	                this.each(function(idx) {
	                    if (this.nodeType !== 1) return;

	                    if (typeof name == 'object'){
	                        for (key in name) {
	                            this.setAttribute(key, name[key]);
	                        }
	                    }else {
	                        this.setAttribute(name, value);
	                    }
	                })
	        },

	        removeAttr: function(name) {
	            return this.each(function() {
	                var self = this;
	                this.nodeType === 1 && name.split(/\s+/g).forEach(function(attribute) {
	                    self.removeAttribute(attribute);
	                });
	            })
	        },

	        remove: function() {
	            return this.each(function() {
	                var parentElement = this.parentElement;
	                parentElement && parentElement.removeChild(this);
	            })
	        },

	        appendTo: function(target) {
	            var dom = [],
	                that = this;

	            target.each(function() {
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
	function DateHelper() {

	}

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
	function cookie(key, value, options) {
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
	}

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

	var $ = __webpack_require__(2),
	    core = __webpack_require__(3);

	function LazyLoad(element, options) {
	    this.$element = $(element);

	    this.options = core.extend({}, LazyLoad.prototype.defaults, options || {});
	    this.$window = $(window);
	    this.$container = (this.options.container === undefined ||
	        this.options.container === window) ? (this.containerIsWindow = true, this.$window) : ($(this.options.container));
	    _init.call(this);
	}

	var proto = LazyLoad.prototype;

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
	    var self = this,dom = [];

	    return self.$element.each(function(index) {
	        !this.loaded && dom.push(this);
	    });

	    return $(dom);
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
	    var fold;
	    if (settings.container === undefined || settings.container === window) {
	        fold = window.innerHeight  + window.scrollY;
	    } else {
	        var offset = $(settings.container).offset();

	        fold = offset.top + offset.height;
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
	    var fold;

	    if (settings.container === undefined || settings.container === window) {
	        fold = window.scrollY;
	    } else {
	        fold = $(settings.container).offset().top;
	    }

	    var offset = $(element).offset();
	    return fold >= offset.top + settings.threshold + offset.height;
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
	    var fold;
	    if (settings.container === undefined || settings.container === window) {
	        fold = window.innerWidth + window.scrollX;
	    } else {
	        var offset = $(settings.container).offset();
	        fold = offset.left + offset.width;
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
	    var fold;
	    if (settings.container === undefined || settings.container === window) {
	        fold = window.scrollX;
	    } else {
	        fold = $(settings.container).offset().left;
	    }

	    var offset = $(element).offset();

	    return fold >= offset.left + settings.threshold + offset.width;
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

	function Dialog(options) {
	    var opts = this.options = core.extend({}, Dialog.prototype.defaults, options || {});

	    //由于按钮排列采用CSS解决，所以目前限制最大可包含5个按钮
	    //opts.buttons && opts.buttons.length > 5 && (opts.buttons.length = 5);
	    init.call(this);
	}

	var $body = $('body'),
	    proto = Dialog.prototype;

	var ZOOMIN_CLASS = 'kub-animated kub-zoomIn',
	    DIALOG_SELECTOR = '.J_dialog',
	    DIALOG_BUTTON_SELECTOR = '.J_dialogButton',
	    EVENT_NAME = 'click';

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

	var fixed = function(){
	    //解决 iphone 下，fixed定位问题
	    setTimeout(function() {
	        window.scrollTo(window.scrollX, window.scrollY);
	    }, 5);
	};

	var bindEvents = function(){
	    var self = this,
	        options = self.options;

	    //注册按钮事件
	    self.$element.find(DIALOG_BUTTON_SELECTOR).on(EVENT_NAME, function(e) {
	        var index = parseInt($(this).attr('data-index')),
	            button = options.buttons[index];

	        button.handler && button.handler.call(this, e, self);
	    });
	};

	var init = function() {

	    fixed();

	    //渲染数据
	    render.call(this, this.options);

	    this.$dialog = this.$element.find(DIALOG_SELECTOR);

	    this.setPosition && this.setPosition();

	    this.show();

	    bindEvents.call(this);
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
	__p+='"><div class="kub-dialog-wrapper"><div class="kub-dialog-container"><div class="kub-dialog J_dialog"> ';
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

	var core = __webpack_require__(3),
	    $ = __webpack_require__(2),
	    Dialog = __webpack_require__(8);

	function Alert(options) {
	    var opts = this.options = core.extend({}, Alert.prototype.defaults, options || {});

	    opts.buttons = [{
	        text: opts.confirmText,
	        handler: this.options.confirm || function(e, dialog) {
	            dialog.close();
	        }
	    }];

	    Dialog.call(this, opts);
	}

	var proto = Alert.prototype = Object.create(Dialog.prototype);

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

	function Confirm(options) {
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
	}

	var proto = Confirm.prototype = Object.create(Dialog.prototype);

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

	function Prompt(options) {
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
	}

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

	function Toast(options){
	    var self = this,
	        opts = this.options = core.extend({},Toast.prototype.defaults, options||{});

	    Dialog.call(this, opts);

	    //自动关闭
	    setTimeout(function(){
	        self.close();
	    }, opts.delay);
	}

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

	function Loader(options) {
	    var self = this,
	        opts = this.options = core.extend({}, Loader.prototype.defaults, options || {});

	    opts.message = template({
	        data: this.options
	    });

	    Dialog.call(this, opts);
	}

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

/***/ },
/* 17 */
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
	 *      auto:true,
	 *      slideSelector:$swiperWrap.find('.slide'),
	 *      slideActiveClass:'active',
	 *      paginationSelector:$swiperWrap.find('.pagination li'),
	 *      paginationActiveClass:'pagination-active',
	 *      slide:function(index){
	 *          //console.log('slide:'+index,this)
	 *      }
	 * });
	 * ```
	 */
	var core = __webpack_require__(3),
	    $ = __webpack_require__(2);

	var $document = $(document),
	    isTouch = core.os.mobile;

	var START_EVENT = isTouch ? 'touchstart' : 'mousedown',
	    MOVE_EVENT = isTouch ? 'touchmove' : 'mousemove',
	    END_EVENT = isTouch ? 'touchend' : 'mouseup',
	    TRANSITIONEND_EVENT = 'transitionend',
	    WEBKIT_TRANSITIONEND_EVENT = 'webkitTransitionEnd',
	    HORIZONTAL = 'horizontal',
	    //粘性
	    VISCOSITY = 5;

	function Swiper(element, options) {

	    this.options = core.extend({}, Swiper.prototype.defaults, options || {});

	    this.$element = $(element);

	    this._ui = {
	        slides: $(options.slideSelector),
	        paginations: $(options.paginationSelector)
	    };

	    this._slideLength = this._ui.slides.length;

	    init.call(this);
	}

	//获取触摸点
	function getCoords(event) {
	    var touches = event.touches,
	        data = touches && touches.length ? touches : event.changedTouches;

	    return {
	        x: isTouch ? data[0].pageX : event.pageX,
	        y: isTouch ? data[0].pageY : event.pageY
	    }
	}

	//获取偏移
	function getDistance(event, startCoords) {
	    var coords = getCoords(event),
	        x = coords.x - startCoords.x,
	        y = coords.y - startCoords.y;

	    return {
	        distanceX: x,
	        distanceY: y
	    }
	}

	//获取位置与索引
	function getCoordinates(distanceX, distanceY) {
	    var offset = this._ui.slides.offset(),
	        w = offset.width,
	        h = offset.height,
	        l = this._slideLength,
	        index = this._active,
	        _active = index,
	        threshold = this.options.threshold;

	    if (this.options.direction === HORIZONTAL) {
	        //横向
	        if (distanceX > 0 && index == 0) {
	            //最左侧
	            distanceX = Math.round(distanceX / VISCOSITY);
	            index = 0;

	        } else if (distanceX < 0 && index == l - 1) {
	            //最右侧
	            distanceX = Math.round(distanceX / VISCOSITY);
	            index = l - 1;

	        } else if (threshold < Math.abs(distanceX)) {
	            //达到最小偏移量

	            //取整
	            var s = Math.round(Math.abs(distanceX) / w);

	            s = s == 0 ? 1 : s;

	            //向右或者向左
	            index = distanceX > 0 ? index - s : index + s;
	        }

	        return {
	            x: distanceX + (-w * _active),
	            y: 0,
	            index: index
	        }

	    } else {
	        //垂直
	        if (distanceY > 0 && index == 0) {
	            //最上
	            distanceY = Math.round(distanceY / VISCOSITY);
	            index = 0;

	        } else if (distanceY < 0 && index == l - 1) {
	            //最下
	            distanceY = Math.round(distanceY / VISCOSITY);
	            index = l - 1;

	        } else if (threshold < Math.abs(distanceY)) {
	            //达到最小偏移
	            var s = Math.round(Math.abs(distanceY) / h);

	            s = s == 0 ? 1 : s;

	            index = distanceY > 0 ? index - s : index + s;
	        }

	        return {
	            x: 0,
	            y: distanceY + (-h * _active),
	            index: index
	        }
	    }
	}

	function returnFalse() {
	    return false
	}

	//初始化
	function init() {
	    var options = this.options;

	    appendCloneChildren.call(this);

	    //设置默认样式
	    this.$element.css(options.style.swiper);

	    var initialSlide = options.initialSlide  || 0;
	    options.infinite && (initialSlide = initialSlide+ 1);

	    //滚动到默认位置
	    this.slide(initialSlide, 0);

	    //绑定事件
	    bindEvents.call(this);
	}

	//添加重复子节点
	function appendCloneChildren(){

	    if(this.options.infinite){
	        var $slides = this._ui.slides,
	            first = $slides[0],
	            last = $slides[this._slideLength - 1],
	            parentNode = first.parentNode;

	        parentNode.insertBefore(last.cloneNode(true),first);
	        parentNode.appendChild(first.cloneNode(true));

	        this._slideLength += 2;
	    }
	}

	//重置索引值
	function resetSlidePosition(){
	    var index = this._active;
	    if (this.options.infinite) {

	        if (index === this._slideLength - 1) {
	            this.slide(1, 0);
	        }

	        if (index === 0) {
	            this.slide(this._slideLength - 2, 0);
	        }
	    }
	}

	//绑定事件
	function bindEvents() {
	    var self = this,
	        flag = false,
	        startCoords;

	    var start = function(event) {
	        flag = true;
	        event = event.originalEvent || event;

	        resetSlidePosition.call(self);

	        startCoords = getCoords(event);

	        setDuration.call(self, null);

	        event.preventDefault();
	    },
	    move = function(event) {
	        if (!flag) return;
	        event = event.originalEvent || event;

	        var distance = getDistance(event, startCoords),
	            coordinates = getCoordinates.call(self, distance.distanceX, distance.distanceY);

	        setTranslate.call(self, coordinates.x, coordinates.y);
	    },
	    end = function(event) {
	        if (!flag) return;
	        flag = false;

	        event = event.originalEvent || event;

	        var distance = getDistance(event, startCoords),
	            index = getCoordinates.call(self, distance.distanceX, distance.distanceY).index;

	        self.slide(index);
	    };

	    //监听横竖屏
	    bindOrientationChangeEvent.call(self);

	    //触发回调函数
	    bindTransitionEndEvent.call(this);

	    self.$element.on(START_EVENT, start);
	    $document.on(MOVE_EVENT, move);
	    $document.on(END_EVENT, end);

	    self.$element[0].onselectstart = returnFalse;
	    self.$element[0].ondragstart = returnFalse;
	}

	//监听slide完成事件
	function bindTransitionEndEvent() {
	    var self = this,
	        $element = self.$element;

	    var slide = function() {
	        var callback = self.options.slide,index = self._active;

	        resetSlidePosition.call(self);

	        self.options.infinite && (index = self._active - 1);

	        callback && callback.call(self, index);

	        //设置选中状态Class
	        setActiveClass.call(self, index);
	    }

	    $element.on(TRANSITIONEND_EVENT, slide).on(WEBKIT_TRANSITIONEND_EVENT, slide);
	}

	//监听横竖屏切换
	function bindOrientationChangeEvent() {
	    var self = this,
	        timer;

	    function handler() {
	        timer && clearTimeout(timer);
	        timer = setTimeout(function() {
	            self.slide(self._active);
	        }, 200);
	    }
	    $(window).on('onorientationchange' in window ? 'orientationchange' : 'resize', handler);
	}

	//偏移到指定的位置
	function slide(index, duration) {
	    var offset = this._ui.slides.offset();

	    //由于移动端浏览器 transition 动画不支持百分比，所以采用像素值
	    if (this.options.direction === HORIZONTAL) {
	        //横向
	        var w = offset.width;

	        this.setTranslate(-index * w, 0, duration);
	    } else {
	        //垂直
	        var h = offset.height;

	        this.setTranslate(0, -index * h, duration);
	    }
	}

	//添加选中类
	function setActiveClass(index) {
	    var options = this.options,
	        slideActiveClass = options.slideActiveClass,
	        paginationActiveClass = options.paginationActiveClass;

	    //添加选中的class
	    this._ui.slides.removeClass(slideActiveClass).eq(index).addClass(slideActiveClass);

	    this._ui.paginations.removeClass(paginationActiveClass).eq(index).addClass(paginationActiveClass);
	}

	//设置偏移量
	function setTranslate(x, y) {
	    core.isNumber(x) && (x += 'px');
	    core.isNumber(y) && (y += 'px');

	    var t = 'translate(' + x + ',' + y + ')';

	    this.$element.css({
	        '-webkit-transform': t,
	        'transform': t
	    });
	}

	//设置偏移速度
	function setDuration(duration) {
	    core.isNumber(duration) && (duration += 'ms');

	    this.$element.css({
	        '-webkit-transition-duration': duration,
	        'transition-duration': duration
	    });
	}

	function getActualIndex(index) {
	    return index < 0 ? 0 : index >= this._slideLength ? this._slideLength - 1 : index;
	}
	;
	(function() {
	    this.constructor = Swiper;

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
	     * * `duration`: 切换速度。
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

	    this.defaults = {
	        //vertical
	        direction: HORIZONTAL,
	        threshold: 50,
	        duration: 300,
	        infinite:false,
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
	     * ## setTranslate
	     *
	     * 设置偏移量
	     *
	     * @param {String} x     x偏移。注意值应该包含单位。例如 100px,或者10%。
	     * @param {String} y     y偏移。注意值应该包含单位。例如 100px,或者10%。
	     * @param {Number} duration 滚动速度
	     */
	    this.setTranslate = function(x, y, duration) {
	        duration = duration || 0;

	        setDuration.call(this, duration);
	        setTranslate.call(this, x, y);

	        return this;
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
	    this.slide = function(index, duration) {
	        var options = this.options;

	        //如果speed为空，则取默认值
	        duration = duration == null ? options.duration : duration;

	        //取出实际的索引值,保存当前索引值
	        this._active = index = getActualIndex.call(this,index);

	        //通过索引值设置偏移
	        slide.call(this, index, duration);

	        return this;
	    }

	    /**
	     * ## next
	     *
	     * 切换到下一个
	     *
	     * @param  {duration} duration 滚动速度，默认使用参数配置的speed
	     * @return {instance}    当前实例
	     */
	    this.next = function(duration) {
	        return this.slide(this._active + 1, duration);
	    }

	    /**
	     * ## prev
	     *
	     * 切换到上一个
	     * @param  {duration} duration 滚动速度，默认使用参数配置的speed
	     * @return {instance}    当前实例
	     */
	    this.prev = function(duration) {
	        return this.slide(this._active - 1, duration);
	    }

	}).call(Swiper.prototype);

	module.exports = Swiper;


/***/ }
/******/ ]);
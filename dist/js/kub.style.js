/*! Kub Mobile JavaScript Components Library v2.2.0. (https://github.com/longjiarun/kubjs)*/
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

	module.exports = __webpack_require__(25);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Kub
	 *
	 * `Kub` 对象。kub 框架对外暴露的全局变量，所有组件均绑在`Kub`对象中。
	 *
	 */
	var _window = window,
	    Kub = _window.Kub = _window.Kub || {}

	Kub.version = '2.1.0'

	/**
	 * ## Kub.$
	 *
	 * 类 `Zepto` 模块。
	 */
	Kub.$ = __webpack_require__(6)

	/**
	 * ## Kub.core
	 */
	Kub.core = __webpack_require__(8)

	/**
	 * ## Kub.os
	 */
	Kub.os = __webpack_require__(9)

	/**
	 * ## Kub.dateHelper
	 */
	Kub.dateHelper = __webpack_require__(10)

	/**
	 * ## Kub.cookie
	 */
	Kub.cookie = __webpack_require__(11)

	/**
	 * ## Kub.LazyLoad
	 */
	Kub.LazyLoad = __webpack_require__(12)

	/**
	 * ## Kub.Dialog
	 */
	Kub.Dialog = __webpack_require__(13)

	/**
	 * ## Kub.Alert
	 */
	Kub.Alert = __webpack_require__(15)

	/**
	 * ## Kub.Confirm
	 */
	Kub.Confirm = __webpack_require__(16)

	/**
	 * ## Kub.Prompt
	 */
	Kub.Prompt = __webpack_require__(17)

	/**
	 * ## Kub.Toast
	 */
	Kub.Toast = __webpack_require__(19)

	/**
	 * ## Kub.Loader
	 */
	Kub.Loader = __webpack_require__(20)

	/**
	 * ## Kub.Swiper
	 */
	Kub.Swiper = __webpack_require__(21)

	/**
	 * ## Kub.DatePicker
	 */
	Kub.DatePicker = __webpack_require__(22)

	/**
	 * ## Kub.Touch
	 */
	Kub.Touch = __webpack_require__(24)

	module.exports = Kub


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Lite
	 *
	 * 类似于`Zepto`，提供部分与Dom相关的方法，方法使用保持与`Zepto`一致。
	 *
	 */

	/**
	 * @require [polyfill](./polyfill.js.html)
	 */
	__webpack_require__(7)
	var $, Lite

	var ELEMENT_NODE = 1

	var slice = Array.prototype.slice,
	    readyRE = /complete|loaded|interactive/,
	    idSelectorRE = /^#([\w-]+)$/,
	    classSelectorRE = /^\.([\w-]+)$/,
	    tagSelectorRE = /^[\w-]+$/,
	    spaceRE = /\s+/g

	var _document = document,
	    _window = window,
	    _undefined = undefined

	function wrap(dom, selector) {
	    dom = dom || []

	    Object.setPrototypeOf ? Object.setPrototypeOf(dom, $.fn) : (dom.__proto__ = $.fn)

	    dom.selector = selector || ''
	    return dom
	}

	var isArray = Array.isArray ||
	    function(object) {
	        return object instanceof Array
	    }

	$ = Lite = function(selector, context) {
	    context = context || _document
	    var type = typeof selector

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
	        //$([document,document.body])
	        return wrap(slice.call(selector).filter(function(item) {
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

	            return wrap(found ? [found] : [], selector)
	        }

	        return wrap($.qsa(selector, context), selector)
	    }

	    return wrap()
	}

	var createDelegator = function(handler, selector, element) {
	    return function(e) {
	        var match = $(e.target).closest(selector)

	        // 1、存在代理节点
	        // 2、排除$('.className').on('click','.className',handler) 情况
	        if (match.length && match[0] !== element) {
	            handler.apply(match[0], arguments)
	        }
	    }
	}

	!(function() {

	    this.qsa = function(selector, context) {
	        //querySelectorAll，如果存在两个相同ID，在ios7下，限定范围内查询 id 会返回两个节点
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

	    this.Event = function(type, props) {

	        return new _window.CustomEvent(type, props)
	    }

	    this.fn = this.prototype = {

	        _l: true,

	        /**
	         * ## Lite.prototype.each
	         *
	         * 循环所有节点。
	         */
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

	        /**
	         * ## Lite.prototype.slice
	         *
	         * 切割节点。
	         */
	        slice: function() {
	            return $(slice.apply(this, arguments))
	        },

	        /**
	         * ## Lite.prototype.is
	         *
	         * 判断是否是指定的节点。
	         */
	        is: function(selector, element) {
	            element = element ? element : this[0]

	            if (element && element.nodeType === ELEMENT_NODE) {
	                return element === selector ? true : typeof selector === 'string' && element.matches(selector)
	            }

	            return false
	        },

	        /**
	         * ## Lite.prototype.closest
	         *
	         * 查找最近的节点。
	         *
	         * 原生closest不包含本身，`jQuery`与`Zepto`包含本身，保持与`Zepto`一致。
	         *
	         */
	        closest: function(selector) {
	            var element = this[0],dom

	            dom = element && typeof selector === 'string' ? element.closest(selector) : this.is(selector, element) ? element : null

	            return $(dom)
	        },

	        /**
	         * ## Lite.prototype.find
	         *
	         * 查找节点，只支持选择器查找.
	         */
	        find: function(selector) {
	            var dom = []

	            this.each(function() {
	                if (this.nodeType !== ELEMENT_NODE) return

	                var elements = $.qsa(selector, this),
	                    elementsLen = elements.length

	                for (var i = 0; i < elementsLen; i++) {
	                    dom.indexOf(elements[i]) === -1 && dom.push(elements[i])
	                }
	            })
	            return $(dom)
	        },

	        /**
	         * ## Lite.prototype.show
	         *
	         * 显示。
	         */
	        show: function() {
	            return this.each(function() {

	                this.style.display === 'none' && (this.style.display = '')

	                $(this).css('display') === 'none' && (this.style.display = 'block')
	            })
	        },

	        /**
	         * ## Lite.prototype.hide
	         *
	         * 隐藏。
	         */
	        hide: function() {
	            return this.each(function() {
	                this.style.display = 'none'
	            })
	        },

	        /**
	         * ## Lite.prototype.css
	         *
	         * 修改或获取节点样式。
	         */
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
	            css && this.each(function() {
	                this.style.cssText += ';' + css
	            })

	            return this;
	        },

	        /**
	         * ## Lite.prototype.offset
	         *
	         * 获取节点的`offset`，只支持获取，不支持设置。
	         */
	        offset: function() {
	            if (!this.length) return null

	            var ele = this[0],
	                obj = ele.getBoundingClientRect()

	            //why window.pageXOffset
	            //http://www.cnblogs.com/hutaoer/archive/2013/02/25/3078872.html
	            return {
	                left: obj.left + _window.pageXOffset,
	                top: obj.top + _window.pageYOffset,
	                width: ele.offsetWidth,
	                height: ele.offsetHeight
	            }
	        },

	        /**
	         * ## Lite.prototype.addClass
	         *
	         * 添加`class`。
	         */
	        addClass: function(name) {
	            if (name == _undefined) return this

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

	        /**
	         * ## Lite.prototype.removeClass
	         *
	         * 移除`class`。
	         */
	        removeClass: function(name) {
	            return this.each(function() {
	                if (!('className' in this)) return

	                if (name === _undefined) return this.className = ''

	                var className = this.className

	                name.trim().split(spaceRE).forEach(function(klass) {
	                    //zepto
	                    className = className.replace(new RegExp('(^|\\s)' + klass + '(\\s|$)', 'g'), ' ')
	                })

	                this.className = className
	            })
	        },

	        /**
	         * ## Lite.prototype.eq
	         *
	         * 获取指定索引节点。
	         */
	        eq: function(idx) {
	            idx = idx < 0 ? idx + this.length : idx
	            return $(this[idx])
	        },

	        /**
	         * ## Lite.prototype.off
	         *
	         * 取消绑定事件，不支持移除代理事件。
	         */
	        off: function(type, handler) {
	            var types = type && type.trim().split(spaceRE)

	            types && this.each(function() {
	                var element = this

	                types.forEach(function(name) {

	                    if (handler) {

	                        element.removeEventListener(name, handler.delegator || handler, false)
	                    } else {
	                        var handlers = element.listeners && element.listeners[name]

	                        handlers && handlers.forEach(function(_handler) {

	                            element.removeEventListener(name, _handler.delegator || _handler, false)
	                        })
	                    }
	                })
	            })

	            return this
	        },

	        /**
	         * ## Lite.prototype.on
	         *
	         * 监听事件，支持事件代理。
	         *
	         */
	        on: function(type, selector, handler) {
	            var f = true

	            if (typeof selector !== 'string') {
	                f = false
	                handler = selector
	            }

	            if (typeof handler == 'function') {
	                var types = type && type.trim().split(spaceRE)

	                types && this.each(function() {
	                    var element = this, listeners

	                    if (f) {
	                        handler.delegator = createDelegator(handler, selector, element)
	                    }

	                    listeners = element.listeners || {}

	                    types.forEach(function(event) {

	                        if (!listeners[event]) {
	                            listeners[event] = []
	                        }
	                        listeners[event].push(handler)

	                        element.addEventListener(event, handler.delegator || handler, false)
	                    })
	                    element.listeners = listeners
	                })
	            }

	            return this
	        },

	        /**
	         * ## Lite.prototype.trigger
	         *
	         * 触发事件。
	         */
	        trigger: function(type, detail) {
	            return this.each(function() {
	                this && this.dispatchEvent && this.dispatchEvent($.Event(type, {
	                    detail: detail,
	                    bubbles: true,
	                    cancelable: true
	                }))
	            })
	        },

	        /**
	         * ## Lite.prototype.attr
	         *
	         * 获取或者设置节点属性。
	         */
	        attr: function(name, value) {
	            var result,
	                type = typeof name

	            if(type === 'string' && value == null) {

	                if(!this.length || this[0].nodeType !== ELEMENT_NODE){
	                    return _undefined
	                }else{
	                    return (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
	                }
	            }else{
	                return this.each(function() {
	                    if (this.nodeType !== ELEMENT_NODE) return

	                    if (type === 'object') {
	                        for (key in name) {
	                            this.setAttribute(key, name[key])
	                        }
	                    } else {
	                        this.setAttribute(name, value)
	                    }
	                })
	            }
	        },

	        /**
	         * ## Lite.prototype.removeAttr
	         *
	         * 移除节点属性。
	         */
	        removeAttr: function(name) {
	            return this.each(function() {
	                var self = this
	                this.nodeType === ELEMENT_NODE && name.split(spaceRE).forEach(function(attribute) {
	                    self.removeAttribute(attribute)
	                })
	            })
	        },

	        /**
	         * ## Lite.prototype.remove
	         *
	         * 删除节点。
	         */
	        remove: function() {
	            return this.each(function() {
	                var parentNode = this.parentNode
	                parentNode && parentNode.removeChild(this)
	            })
	        },

	        /**
	         * ## Lite.prototype.appendTo
	         *
	         * 将html插入到Dom节点内底部。
	         */
	        appendTo: function(target) {
	            var dom = [],
	                self = this

	            target.each(function() {
	                var node = this
	                self.each(function() {
	                    dom.push(node.appendChild(this))
	                })
	            })

	            return $(dom)
	        },

	        /**
	         * ## Lite.prototype.after
	         *
	         * 在Dom节点之后插入html。
	         */
	        after: function(html) {
	            return this.each(function() {
	                this.insertAdjacentHTML('afterend', html)
	            })
	        },

	        /**
	         * ## Lite.prototype.before
	         *
	         * 在Dom节点之前插入html。
	         */
	        before: function(html) {
	            return this.each(function() {
	                this.insertAdjacentHTML('beforebegin', html)
	            })
	        },

	        /**
	         * ## Lite.prototype.append
	         *
	         * 在Dom节点内底部插入html。
	         */
	        append: function(html) {
	            return this.each(function() {
	                this.insertAdjacentHTML('beforeend', html)
	            })
	        },

	        /**
	         * ## Lite.prototype.prepend
	         *
	         * 在Dom节点内头部插入html。
	         */
	        prepend: function(html) {
	            return this.each(function() {
	                this.insertAdjacentHTML('afterbegin', html)
	            })
	        },

	        /**
	         * ## Lite.prototype.html
	         *
	         * 设置或获取Dom html。
	         *
	         */
	        html: function(html) {
	            return html != _undefined ?
	                this.each(function() {
	                    this.innerHTML = html
	                }) :
	                (this[0] ? this[0].innerHTML : null)
	        },

	        /**
	         * ## Lite.prototype.text
	         * 设置或获取Dom文本内容。
	         */
	        text: function(text) {
	            return text != _undefined ?
	                this.each(function() {
	                    this.textContent = text
	                }) :
	                (this[0] ? this[0].textContent : null)
	        }
	    }
	}).call(Lite)

	module.exports = _window.Zepto || Lite


/***/ },
/* 7 */
/***/ function(module, exports) {

	var _window = window,
	    _document = document

	var ELEMENT_NODE = 1,
	    ELEMENT_PROTOTYPE = Element.prototype

	//CustomEvent polyfill
	//android 4.3
	if (!_window.CustomEvent) {
	    var CustomEvent = function(event, params) {
	        var evt
	        params = params || {
	            bubbles: false,
	            cancelable: false,
	            detail: undefined
	        }
	        evt = _document.createEvent("CustomEvent")
	        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
	        return evt
	    }
	    CustomEvent.prototype = _window.Event.prototype
	    _window.CustomEvent = CustomEvent
	}

	//Element.prototype.matches polyfill
	if (typeof ELEMENT_PROTOTYPE.matches !== 'function') {
	    ELEMENT_PROTOTYPE.matches = ELEMENT_PROTOTYPE.msMatchesSelector || ELEMENT_PROTOTYPE.mozMatchesSelector || ELEMENT_PROTOTYPE.webkitMatchesSelector || function matches(selector) {
	        var element = this,
	            // 查找当前节点的根节点时，必须使用element.ownerDocument
	            // 当节点插入到iframe中时，该节点的document就不是父窗口中的document，而是iframe中的document
	            // 会造成 document.querySelectorAll(selector) 查询不到改节点，所以需要element.ownerDocument替代document
	            elements = element.ownerDocument.querySelectorAll(selector),
	            index = 0

	        while (elements[index] && elements[index] !== element) {
	            ++index
	        }

	        return !!elements[index]
	    }
	}

	//Element.prototype.closest polyfill
	if (typeof ELEMENT_PROTOTYPE.closest !== 'function') {
	    ELEMENT_PROTOTYPE.closest = function closest(selector) {
	        var element = this

	        while (element && element.nodeType === ELEMENT_NODE) {
	            if (element.matches(selector)) {
	                return element
	            }

	            element = element.parentNode
	        }

	        return null
	    }
	}


/***/ },
/* 8 */
/***/ function(module, exports) {

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


/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * # os
	 *
	 * 检测系统类型与版本，包含系统类型与版本信息。
	 *
	 * 只检测Android 与 IOS, window phone（window phone 未进行完全测试）
	 *
	 * `os` 返回以下相关属性：
	 *
	 * `android` ：是否是Android
	 *
	 * `ios` ：是否是IOS系统
	 *
	 * `ipad` ：是否是iPad
	 *
	 * `iphone` ：是否是iPhone
	 *
	 * `ipod` ：是否是iPod
	 *
	 * `mobile` ：是否是移动端
	 *
	 * `phone` ：是否是手机
	 *
	 * `tablet` ：是否是平板
	 *
	 * `version` ：系统版本
	 *
	 * `wp` ： 是否是window phone
	 *
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
/* 10 */
/***/ function(module, exports) {

	/**
	 * # DateHelper
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
	 * `DateHelper` 模块，对外提供的是实例化的对象。
	 *
	 * 使用：
	 * ```js
	 * //String to Date
	 *
	 * '2015-05-20'.parseDate('yyyy-MM-dd')
	 *
	 * //格式化日期
	 * new Date().format('yyyy-MM-dd,HH:mm:ss')
	 *
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
	 * ## DateHelper.prototype.addLocale
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
	 * ## DateHelper.prototype.setLocale
	 *
	 * 设置默认本地化
	 *
	 * @param {String} name   本地化名称
	 * @return {instance}     当前实例
	 */
	_prototype.setLocale = function(name) {
	    this.locale = name
	    return this
	}

	/**
	 * ## DateHelper.prototype.format
	 *
	 * 格式化日期。
	 *
	 * @param {Date} date      日期
	 * @param {String} format  日期格式
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
	 * ## DateHelper.prototype.parse
	 *
	 * 转换日期。
	 *
	 * 此方法存在一个BUG，例如：
	 *
	 * ```js
	 *
	 * //1112会被计算在MM内。
	 * dateHelper.parse('2015-1112','yyyy-MMdd')
	 *
	 *
	 * //所以在使用parse方法时，每一个串使用字符分隔开。类似于：
	 *
	 * dateHelper.parse('2015-11-12','yyyy-MM-dd')
	 *
	 * ```
	 *
	 * @param {String} input   字符串
	 * @param {String} format  格式化字符串
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
/* 11 */
/***/ function(module, exports) {

	/**
	 * # cookie
	 *
	 * 操作cookie方法，`expires` 如果为数字，单位为`毫秒`。
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
	 *     domain:'.a.com'
	 *
	 * })
	 * ```
	 *
	 */
	var _document = document,
	    _encodeURIComponent = encodeURIComponent

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
	            days = options.expires
	            time = options.expires = new Date()

	            time.setTime(time.getTime() + days)
	        }

	        value = String(value)

	        return (_document.cookie = [
	            _encodeURIComponent(key), '=',
	            options.raw ? value : _encodeURIComponent(value),
	            options.expires ? '; expires=' + options.expires.toUTCString() : '',
	            options.path ? '; path=' + options.path : '',
	            options.domain ? '; domain=' + options.domain : '',
	            options.secure ? '; secure' : ''
	        ].join(''))
	    }

	    // Key and possibly options given, get cookie
	    options = value || {}

	    decode = options.raw ? function (s) { return s } : decodeURIComponent

	    return (result = new RegExp('(?:^|; )' + _encodeURIComponent(key) + '=([^;]*)').exec(_document.cookie)) ? decode(result[1]) : null
	}

	module.exports = cookie


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # LazyLoad
	 *
	 * 延迟加载组件。
	 *
	 */

	/**
	 * @require [core](./core.js.html)
	 * @require [Lite](./lite.js.html)
	 */
	var core = __webpack_require__(8),
	    $ = __webpack_require__(6)

	/**
	 * ## LazyLoad Constructor
	 *
	 * `LazyLoad` 构造函数。
	 *
	 * 使用：
	 * ```js
	 * var lazyload = new Kub.LazyLoad($('img'))
	 * ```
	 */
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

	/**
	 * ## LazyLoad.prototype.defaults
	 *
	 * 默认配置项。
	 *
	 * 配置项说明：
	 *
	 *   `container` : `Selector` 图片存放的容器，容器会监听事件。
	 *
	 *   `threshold` : `Number` 提前加载距离。
	 *
	 *   `delay` : `Number` 事件监听时的延迟时间。
	 *
	 *   `attributeName` : `String` 属性名称。默认会从`element`上取出 `data-original` 属性。
	 *
	 *   `load` : `Function` 图片加载事件。
	 *
	 */
	_prototype.defaults = {
	    container: _window,
	    threshold: 200,
	    delay: 100,
	    attributeName: 'original',
	    load:null
	}

	//更新需要加载的节点，更新以后会立即检测是否有节点在可视区域内
	_prototype.updateElement = function(element) {

	    this.$element = $(element)

	    //更新 dom 以后立即验证是否有元素已经显示
	    loadElementsInViewport(this)

	    return this
	}

	/**
	 * ## LazyLoad.prototype.loadAll
	 *
	 * 强制加载所有图片，无论节点是否在可视区域内。
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
	 * ## LazyLoad.prototype.isVisible
	 *
	 * 是否在视窗可见。
	 * @param {$}  $this         元素
	 * @param {Object}  options  参数
	 * @return {Boolean}         true ：可见 false ：不可见
	 */
	_prototype.isVisible = function($this) {
	    var options = this.options,
	        element = $this[0]

	    //如果节点不可见，则不进行加载
	    if(element.offsetWidth == 0 && element.offsetHeight == 0 && element.getClientRects().length == 0){
	        return false
	    }

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
	 * ## LazyLoad.prototype.load
	 *
	 * 加载指定元素。
	 *
	 * @param {$} $element      加载的节点
	 * @param {String} original 图片地址
	 * @return {instance}       当前实例
	 */
	_prototype.load = function($element) {

	    var options = this.options,
	        original = $element.attr('data-' + options.attributeName),
	        load = options.load

	    //如果原图片为空
	    if (!original) {
	        return this
	    }
	    if ($element[0].nodeName === 'IMG') {
	        $element.attr('src', original)
	    } else {
	        $element.css('background-image', 'url(' + original + ')')
	    }
	    //记录该节点已被加载
	    $element[0].loaded = true

	    // 触发 load 事件
	    load && load.call($element[0])

	    return this
	}

	/**
	 * ## LazyLoad.prototype.belowthefold
	 *
	 * 是否在视窗下面。
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
	        var $container = $(container), offset = $container.offset()

	        fold = offset.top + $container[0].offsetHeight
	    }

	    return fold <= $(element).offset().top - settings.threshold
	}

	/**
	 * ## LazyLoad.prototype.abovethetop
	 *
	 * 是否在视窗上面。
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

	    var $element = $(element), offset = $element.offset()
	    return fold >= offset.top + settings.threshold + $element[0].offsetHeight
	}

	/**
	 * ## LazyLoad.prototype.rightoffold
	 *
	 * 是否在视窗右侧。
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
	        var $container = $(container), offset = $container.offset()
	        fold = offset.left + $container[0].offsetWidth
	    }
	    return fold <= $(element).offset().left - settings.threshold
	}

	/**
	 * ## LazyLoad.prototype.leftofbegin
	 *
	 * 是否在视窗左侧。
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

	    var $element = $(element), offset = $element.offset()

	    return fold >= offset.left + settings.threshold + $element[0].offsetWidth
	}

	module.exports = LazyLoad


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Dialog
	 *
	 * 对话框.
	 */

	/**
	 * @require [core](./core.js.html)
	 * @require [Lite](./lite.js.html)
	 */
	var core = __webpack_require__(8),
	    $ = __webpack_require__(6),
	    template = __webpack_require__(14)

	/**
	 * ## Dialog Constructor
	 *
	 * Dialog 构造函数。
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
	function Dialog(options) {
	    this.options = core.extend({}, _prototype.defaults, options || {})
	    init(this)
	}

	var ZOOMIN_CLASS = 'kub-animated kub-zoomin',
	    DIALOG_SELECTOR = '.J_dialog',
	    DIALOG_BUTTON_SELECTOR = '.J_dialogButton',
	    EVENT_NAME = 'click'

	var $body

	var _prototype = Dialog.prototype

	var render = function(dialog,data) {
	    var html = template(data)

	    dialog.$element = $(html).appendTo($body)
	    return this
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

	    !$body && ($body = $(document.body))

	    //渲染数据
	    render(dialog, dialog.options)

	    dialog.$dialog = dialog.$element.find(DIALOG_SELECTOR)

	    dialog.setPosition && dialog.setPosition()

	    dialog.show()

	    bindEvents(dialog)
	}

	/**
	 * ## Dialog.prototype.defaults
	 *
	 * 默认配置项。
	 *
	 * 配置项说明：
	 *
	 * * `modal` : `Boolean` 是否显示遮罩层。
	 *
	 * * `title` : `String` 对话框名称。
	 *
	 * * `showHeader` : `Boolean` 是否显示头部。
	 *
	 * * `message` : `String` 弹窗内容。
	 *
	 * * `className` : `String` 弹窗类名。
	 *
	 * * `animated` : `Boolean` 是否开启动画效果。
	 *
	 * * `buttons`: `Array` 弹窗按钮。
	 *
	 * ```js
	 * //例如：
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
	 * ## Dialog.prototype.show
	 *
	 * 显示弹窗。
	 * @return {instance} 返回当前实例
	 */
	_prototype.show = function() {

	    this.$element.show()
	    this.options.animated && this.$dialog.addClass(ZOOMIN_CLASS)

	    return this
	}

	/**
	 * ## Dialog.prototype.hide
	 *
	 * 隐藏弹窗。
	 * @return {instance} 返回当前实例
	 */
	_prototype.hide = function() {

	    this.$element.hide()
	    this.options.animated && this.$dialog.removeClass(ZOOMIN_CLASS)

	    return this
	}

	/**
	 * ## Dialog.prototype.close
	 *
	 * 关闭弹窗。
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
/* 14 */
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Alert
	 *
	 * alert弹窗。
	 */

	/**
	 * @require [core](./core.js.html)
	 * @extend [Dialog](./dialog.js.html)
	 */
	var core = __webpack_require__(8),
	    Dialog = __webpack_require__(13)

	/**
	 * ## Alert Constructor
	 *
	 * 继承于`Dialog`，可使用`Dialog`类中的方法。
	 *
	 * 使用方法：
	 * ```js
	 * var alert = new Kub.Alert()
	 * ```
	 */
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
	 * ## Alert.defaults
	 *
	 * `Alert` 默认配置项。
	 *
	 * 配置项说明：
	 *
	 * * `confirmText` : `String` 确认按钮名称。
	 *
	 * * `confirm` : `Function` 单击确认按钮时触发的事件。
	 *
	 *    > 如果未传递，单击时会默认关闭弹窗。
	 *    >
	 *    > 如果传递，需调用 `dialog.close()`关闭弹窗。
	 *
	 * * `showHeader` : `Boolean` 是否显示头部。
	 *
	 * * `className` : `String` 弹窗类名，修改时需加上`kub-alert`默认类名。
	 *
	 * * `modal` : `Boolean` 是否显示遮罩层。
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Confirm
	 *
	 * confirm 弹窗。
	 */

	/**
	 * @require [core](./core.js.html)
	 * @extend [Dialog](./dialog.js.html)
	 */
	var core = __webpack_require__(8),
	    Dialog = __webpack_require__(13)

	/**
	 * ## Confirm Constructor
	 *
	 * 继承于`Dialog`，可使用`Dialog`类中的方法。
	 *
	 * 使用方法：
	 * ```js
	 * var confirm = new Kub.Confirm({
	 *     confirm:function(e,dialog){
	 *         //do something
	 *         dialog.close()
	 *     }
	 * })
	 * ```
	 */
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
	 * ## Confirm.defaults
	 *
	 * `Confirm`默认配置项。
	 *
	 * 配置项说明：
	 *
	 * * `confirmText` : `String` 确认按钮名称。
	 *
	 * * `confirm` : `Function` 单击确认按钮时触发的事件。一般用于用户单击确认按钮执行事件。需调用`dialog.close()`手动关闭弹窗。
	 *
	 * * `cancelText` : `String` 取消按钮名称。
	 *
	 * * `cancel` : `Function` 单击取消按钮时触发的事件。
	 *
	 *    > 如果未传递，单击时会默认关闭弹窗。
	 *    >
	 *    > 如果传递，需调用 `dialog.close()`关闭弹窗。
	 *
	 * * `showHeader` : `Boolean` 是否显示头部。
	 *
	 * * `className` : `String` 弹窗类名，修改时需加上`kub-confirm`默认类名。
	 *
	 * * `modal` : `Boolean` 是否显示遮罩层。
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
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Prompt
	 *
	 * prompt 输入框。
	 */

	/**
	 * @require [core](./core.js.html)
	 * @extend [Dialog](./dialog.js.html)
	 */
	var core = __webpack_require__(8),
	    Dialog = __webpack_require__(13),
	    template = __webpack_require__(18)

	var INPUT_SELECTOR = '.J_input'

	/**
	 * ## Prompt Constructor
	 *
	 * 继承于`Dialog`，可使用`Dialog`类中的方法。
	 *
	 * 使用方法：
	 * ```js
	 * var prompt = new Kub.Prompt({
	 *     confirm:function(event,dialog,value){
	 *         //输入框输入的值 value
	 *     }
	 * })
	 * ```
	 */
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

	var _prototype = Prompt.prototype = Object.create(Dialog.prototype)

	_prototype.constructor = Prompt

	/**
	 * ## Prompt.prototype.defaults
	 *
	 * `Prompt`默认配置项。
	 *
	 * 配置项说明：
	 *
	 * * `confirmText` : `String` 确认按钮名称。
	 *
	 * * `confirm` : `Function` 单击确认按钮时触发的事件。用于用户单击确认按钮执行事件。需调用`dialog.close()`手动关闭弹窗。
	 *
	 * * `cancelText` : `String` 取消按钮名称。
	 *
	 * * `cancel` : `Function` 单击取消按钮时触发的事件。
	 *
	 *    > 如果未传递，单击时会默认关闭弹窗。
	 *    >
	 *    > 如果传递，需调用 `dialog.close()`关闭弹窗。
	 *
	 * * `showHeader` : `Boolean` 是否显示头部。
	 *
	 * * `className` : `String` 弹窗类名，修改时需加上`kub-prompt`默认类名。
	 *
	 * * `modal` : `Boolean` 是否显示遮罩层。
	 *
	 * * `message` : `String` 提示内容。
	 *
	 * * `inputType` : `String` 输入框类型。
	 *
	 * * `placeholder` : `String` 输入框 `placeholder` 属性。
	 *
	 * * `defaultValue` : `String` 输入框默认值。
	 */
	_prototype.defaults = {
	    confirmText: '确定',
	    confirm: null,
	    cancelText: '取消',
	    cancel: null,
	    showHeader: false,
	    className: 'kub-prompt',
	    modal: true,
	    message:'',
	    inputType: 'text',
	    placeholder: '',
	    defaultValue: ''
	}

	module.exports = Prompt


/***/ },
/* 18 */
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
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Toast
	 *
	 * 提示框
	 */

	/**
	 * @require [core](./core.js.html)
	 * @extend [Dialog](./dialog.js.html)
	 */
	var core = __webpack_require__(8),
	    Dialog = __webpack_require__(13)

	/**
	 * ## Toast Constructor
	 *
	 * 继承于`Dialog`，可使用`Dialog`类中的方法。
	 *
	 * 使用方法：
	 * ```js
	 * var toast = new Kub.Toast({
	 *     message:'操作成功。'
	 * })
	 * ```
	 */
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
	 * ## Toast.prototype.defaults
	 *
	 * `Toast`默认配置项。
	 *
	 * 配置项说明：
	 *
	 * * `message` : `String` 提示内容。
	 *
	 * * `className` : `String` 弹窗类名，修改时需加上`kub-toast`默认类名。
	 *
	 * * `top` : `Number` 距离顶部高度。
	 *
	 * * `delay` : `Number` 延迟时间。
	 *
	 * * `modal` : `Boolean` 是否显示遮罩层。
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Loader
	 *
	 * 加载等待框。
	 *
	 */

	/**
	 * @require [core](./core.js.html)
	 * @extend [Dialog](./dialog.js.html)
	 */
	var core = __webpack_require__(8),
	    Dialog = __webpack_require__(13)

	/**
	 * ## Loader Constructor
	 *
	 * 继承于`Dialog`，可使用`Dialog`类中的方法。
	 *
	 * 使用方法：
	 *
	 * ```js
	 * var loader = new Kub.Loader()
	 *
	 * //隐藏loader
	 * loader.hide()
	 *
	 * var loader = new Kub.Loader({
	 *     message: '定制提示内容'
	 * })
	 *
	 * ```
	 */
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
	 * ## Loader.prototype.defaults
	 *
	 * `Loader` 默认配置项。
	 *
	 * 配置项说明：
	 *
	 * * `className`: `String` 弹窗类名，修改时需加上`kub-loader`默认类名。
	 *
	 * * `message` : `String` 提示内容。
	 *
	 * * `modal` : `Boolean` 是否显示遮罩层。
	 */
	_prototype.defaults = {
	    className: 'kub-loader',
	    modal: true,
	    message: '加载中…'
	}

	module.exports = Loader


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Swiper
	 *
	 * 切换组件
	 */

	/**
	 * @require [core](./core.js.html)
	 * @require [os](./detect.js.html)
	 * @require [Lite](./lite.js.html)
	 */
	var core = __webpack_require__(8),
	    os = __webpack_require__(9),
	    $ = __webpack_require__(6)

	/**
	 * ## Swiper Constructor
	 *
	 * `Swiper`类。
	 *
	 * 使用方法：
	 * ```js
	 * new Kub.Swiper('.swiper',{
	 *      slideSelector:'.slide',
	 *      slideActiveClass:'active',
	 *      paginationSelector:'.pagination li',
	 *      paginationActiveClass:'pagination-active',
	 *      slide:function(index){
	 *          //当前滚动索引
	 *      }
	 * })
	 * ```
	 */

	function Swiper(element, options) {

	    this.options = core.extend(true, {}, _prototype.defaults, options || {})
	    this.$element = $(element)

	    var ui = this._ui = {
	        slides: $(options.slideSelector),
	        paginations: $(options.paginationSelector)
	    }

	    ui.slidesLength = ui.slides.length

	    init(this)
	}

	var $document = $(document),
	    isTouch = os.mobile

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
	    var element = swiper._ui.slides[0],
	        w = element.offsetWidth,
	        h = element.offsetHeight,
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

	//设置容器偏移量
	var setContainerTranslate = function(swiper, x, y, duration) {
	    var $element = swiper.$element

	    duration = duration || 0

	    setDuration($element, duration)
	    setTranslate($element, x, y)
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

	//监听slide完成事件
	var bindTransitionEndEvent = function(swiper) {
	    var $element = swiper.$element

	    var handler = function() {
	        var options = swiper.options,
	            callback = options.slide,
	            index = swiper._ui.active

	        resetSlideIndex(swiper)

	        //计算出真实索引值
	        options.infinite && (index = swiper._ui.active - 1)

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

	//绑定事件
	var bindEvents = function(swiper) {
	    var flag = false,
	        startCoords

	    var start = function(event) {
	            stopAuto(swiper)

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

	            coordinates.isDefaultPrevented && (event.preventDefault(),setTranslate(swiper.$element, coordinates.x, coordinates.y))
	        },
	        end = function(event) {
	            if (!flag) return
	            flag = false

	            event = event.originalEvent || event

	            var distance = getDistance(event, startCoords),
	                index = getCoordinates(swiper, distance.distanceX, distance.distanceY).index

	            swiper.slide(index)

	            beginAuto(swiper)
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

	//偏移到指定的位置
	var slideTo = function(swiper, index, duration) {
	    var element = swiper._ui.slides[0]

	    //由于移动端浏览器 transition 动画不支持百分比，所以采用像素值
	    if (swiper.options.direction === HORIZONTAL) {
	        //横向
	        var w = element.offsetWidth

	        setContainerTranslate(swiper, -index * w, 0, duration)
	    } else {
	        //垂直
	        var h = element.offsetHeight

	        setContainerTranslate(swiper, 0, -index * h, duration)
	    }
	}

	// 开始自动切换
	var beginAuto = function(swiper){
	    var options = swiper.options,
	        _ui = swiper._ui,
	        auto = options.auto

	    auto && (swiper._timer = setInterval(function(){
	        // 由于一些特殊设计
	        // 对非循环滚动采用自动计算索引值的方式
	        options.infinite ? swiper.next() : swiper.slide( (_ui.active + 1) % _ui.slidesLength )
	    }, auto))
	}

	// 停止自动切换
	var stopAuto = function(swiper){
	    var timer = swiper._timer

	    timer && clearInterval(timer)
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

	    beginAuto(swiper)

	    //绑定事件
	    bindEvents(swiper)
	}

	/**
	 * ## Swiper.prototype.defaults
	 *
	 * `Swiper`默认配置项。
	 *
	 * 配置项说明：
	 *
	 * * `direction`: `String` 切换方向。horizontal ：横向， vertical ：纵向。
	 *
	 * * `threshold`: `Number` 最小触发距离。手指移动距离必须超过`threshold`才允许切换。
	 *
	 * * `duration`: `Number` 切换速度。
	 *
	 * * `auto`: `Number` 自动切换速度。0表示不自动切换，默认为0 。
	 *
	 * * `infinite`: `Boolean` 是否循环滚动 true ：循环 false ：不循环。
	 *
	 * * `initialSlide`: `Number` 初始化滚动位置。
	 *
	 * * `slideSelector`: `Selector` 滚动元素。
	 *
	 * * `slideActiveClass`: `String` 滚动元素选中时的类名。
	 *
	 * * `paginationSelector`: `Selector` 缩略图或icon。
	 *
	 * * `paginationActiveClass`: `String` 缩略图或icon选中时的类名。
	 *
	 * * `slide`: `Function` 切换回调函数。
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
	 * ## Swiper.prototype.slide
	 *
	 * 滚动到指定索引值位置
	 *
	 * @param  {index} index 滚动索引值
	 * @param  {duration} duration 滚动速度，默认配置的`duration`。
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
	 * ## Swiper.prototype.next
	 *
	 * 切换到下一个
	 *
	 * @param  {duration} duration 滚动速度，默认配置的`duration`。
	 * @return {instance}    当前实例
	 */
	_prototype.next = function(duration) {
	    return this.slide(this._ui.active + 1, duration)
	}

	/**
	 * ## Swiper.prototype.prev
	 *
	 * 切换到上一个
	 *
	 * @param  {duration} duration 滚动速度，默认配置的`duration`。
	 * @return {instance}    当前实例
	 */
	_prototype.prev = function(duration) {
	    return this.slide(this._ui.active - 1, duration)
	}

	module.exports = Swiper


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # DatePicker
	 *
	 * 时间选择器。格式化参照 [`DateHelper`](./date.js.html)
	 *
	 */

	/**
	 * @require [core](./core.js.html)
	 * @require [Lite](./lite.js.html)
	 * @require [detect](./detect.js.html)
	 * @require [Dialog](./dialog.js.html)
	 * @require [DateHelper](./date.js.html)
	 */
	var core = __webpack_require__(8),
	    $ = __webpack_require__(6),
	    os = __webpack_require__(9),
	    Dialog = __webpack_require__(13),
	    template = __webpack_require__(23)

	__webpack_require__(10)

	/**
	 * ## DatePicker Constructor
	 *
	 * `DatePicker` 构造函数。
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
	 *      confirm:function(e,datepicker,formatDate){
	 *          //格式化后的 formatDate
	 *          //手动关闭选择器
	 *          datepicker.hide()
	 *      }
	 *  })
	 * ```
	 */
	function DatePicker(element, options) {
	    this.$element = $(element)
	    this.options = core.extend({}, _prototype.defaults, options || {})

	    init(this)
	}

	var HEIGHT_UNIT = 54,
	    DURATION = 200,
	    COLUMN_SELECTOR = '.kub-datepicker-column',
	    COLUMN_ITEM_SELECTOR = 'li',
	    COLUMN_CONTAINER_SELECTOR = 'ul'

	var $document = $(document),
	    isTouch = os.mobile

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


	//设置时间选择器中某一列的值，可设置年、月、日、时、分、秒的值
	var setValue = function(datepicker, name, value) {
	    var $this = datepicker._ui[name],
	        index, $item

	    if ($this && ($item = $this.find(COLUMN_ITEM_SELECTOR + '[data-value="' + value + '"]')).length) {
	        index = parseInt($item.attr('data-index'))

	        $this[0].index = index

	        setTranslate($this, 0, -index * HEIGHT_UNIT)
	    }

	}

	//获取时间选择器中某一列的值，可获取年、月、日、时、分、秒的值
	var getValue = function(datepicker, name) {
	    var $this = datepicker._ui[name],
	        $items, index, value

	    if ($this) {
	        $items = $this.find(COLUMN_ITEM_SELECTOR)
	        index = $this[0].index + 1
	        value = parseInt($items.eq(index).attr('data-value'))
	    }

	    return value ? value : 0
	}

	//移除不需要的列
	var removeColumns = function(format, ui) {
	    format.indexOf('y') === -1 && (ui.year.remove(), ui.year = null)
	    format.indexOf('M') === -1 && (ui.month.remove(), ui.month = null)
	    format.indexOf('d') === -1 && (ui.day.remove(), ui.day = null)
	    format.indexOf('H') === -1 && (ui.hour.remove(), ui.hour = null)
	    format.indexOf('m') === -1 && (ui.minute.remove(), ui.minute = null)
	    format.indexOf('s') === -1 && (ui.second.remove(), ui.second = null)
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

	//重置每月最大天数
	var setActualDays = function(datepicker, year, month) {
	    var days = getDays(year, month),
	        day = getValue(datepicker, 'day')

	    days < day && setValue(datepicker, 'day', days)
	}

	//绑定输入框聚焦事件
	var bindInputFocusEvent = function(datepicker) {
	    datepicker.$element.on(EVENT_NAME, function(event) {
	        //使输入框失去焦点
	        datepicker.$element[0].blur()

	        datepicker.show()

	        event.preventDefault()
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
	        },
	        move = function(event) {
	            if (!flag) return
	            event = event.originalEvent || event

	            var distance = getDistance(event, $activeElement[0].startCoords)

	            setTranslate($activeElement, 0, distance.distanceY - HEIGHT_UNIT * $activeElement[0].index)

	            event.preventDefault()
	        },
	        end = function(event) {
	            if (!flag) return
	            flag = false
	            event = event.originalEvent || event

	            var distance = getDistance(event, $activeElement[0].startCoords),
	                max = $activeElement.find(COLUMN_ITEM_SELECTOR).length,
	                index = getIndexByDistance(distance.distanceY - HEIGHT_UNIT * $activeElement[0].index, max)

	            $activeElement[0].index = Math.abs(index)

	            //验证是否存在31,30,29天
	            setActualDays(datepicker, getValue(datepicker, 'year'), getValue(datepicker, 'month'))

	            setDuration($activeElement, DURATION)

	            setTranslate($activeElement, 0, -HEIGHT_UNIT * $activeElement[0].index)
	        }

	    datepicker._ui.columns.each(function() {

	        $(this).on(START_EVENT, function() {
	            start.apply(this, arguments)
	        })

	        this.onselectstart = returnFalse
	        this.ondragstart = returnFalse
	    })

	    $document.on(MOVE_EVENT, move)
	    $document.on(END_EVENT, end)

	    bindInputFocusEvent(datepicker)
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


	/**
	 * ## DatePicker.prototype.defaults
	 *
	 * 默认配置项
	 *
	 * 配置项说明：
	 *
	 * * `locale`: `String` 本地化。本地化采用CSS实现。
	 *
	 * * `title`: `String` 时间选择器弹窗名称。
	 *
	 * * `confirmText`: `String` 确认按钮名称。
	 *
	 * * `confirm`: `Function` 单击确认按钮时触发的事件。
	 *
	 * > 如果未传递，单击时会默认关闭弹窗，并对输入框赋值。
	 * >
	 * > 如果传递，需调用`datepicker.close()`手动关闭弹窗，并且需要对输入框赋值。
	 *
	 * * `cancelText`: `String` 取消按钮名称。
	 *
	 * * `cancel`: `Function` 单击取消按钮时触发的事件。
	 *
	 * > 如果未传递，单击时会默认关闭弹窗。
	 * >
	 * > 如果传递，需调用`datepicker.close()`关闭弹窗。
	 *
	 * * `format`: `String` 日期格式。
	 *
	 * * `className`: `String` 弹窗类名，修改时需加上`kub-datepicker-dialog`默认类名。
	 *
	 * * `date`: `Date` 默认显示时间。
	 *
	 * * `yearRange`: `Array` 年份显示区间。
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
	    yearRange: [1970, 2050]
	}

	/**
	 * ## DatePicker.prototype.setDate
	 *
	 * 设置时间选择器时间。
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

	    return self
	}

	/**
	 * ## DatePicker.prototype.getDate
	 *
	 * 获取时间选择器选择的时间。
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
	 * ## DatePicker.prototype.close
	 *
	 * 关闭时间选择器。
	 *
	 * @return {instance} 当前实例
	 */
	_prototype.close = function() {
	    this.$element[0].dialog.close()
	    return this
	}

	/**
	 * ## DatePicker.prototype.show
	 *
	 * 显示时间选择器。
	 *
	 * @return {instance} 当前实例
	 */
	_prototype.show = function() {
	    this.$element[0].dialog.show()
	    return this
	}

	/**
	 * ## DatePicker.prototype.hide
	 *
	 * 隐藏时间选择器。
	 *
	 * @return {instance} 当前实例
	 */
	_prototype.hide = function() {
	    this.$element[0].dialog.hide()
	    return this
	}

	module.exports = DatePicker


/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = function(data){
	var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
	__p+='<div class="kub-datepicker"><div class="kub-datepicker-column year" data-type="year"><ul><li></li> ';
	for(var i=data.yearRange[0],j=0;i<=data.yearRange[1];i++,j++){
	__p+=' <li data-value="'+
	((__t=( i))==null?'':__t)+
	'" data-index="'+
	((__t=( j))==null?'':__t)+
	'"> '+
	((__t=( i ))==null?'':__t)+
	' </li> ';
	}
	__p+=' <li></li></ul></div><div class="kub-datepicker-column month" data-type="month"><ul><li></li> ';
	for(var i=1 ;i<= 12; i++){
	__p+=' <li data-value="'+
	((__t=( i-1))==null?'':__t)+
	'" data-index="'+
	((__t=( i-1))==null?'':__t)+
	'"> '+
	((__t=( ( i < 10 ? ( "0" + i) : i)))==null?'':__t)+
	' </li> ';
	}
	__p+=' <li></li></ul></div><div class="kub-datepicker-column day" data-type="day"><ul><li></li> ';
	for(var i=1 ;i<=31;i++){
	__p+=' <li data-value="'+
	((__t=( i))==null?'':__t)+
	'" data-index="'+
	((__t=( i-1))==null?'':__t)+
	'"> '+
	((__t=(( i < 10 ? ( "0" + i) : i)))==null?'':__t)+
	' </li> ';
	}
	__p+=' <li></li></ul></div><div class="kub-datepicker-column hour" data-type="hour"><ul><li></li> ';
	for(var i=0 ;i<=23;i++){
	__p+=' <li data-value="'+
	((__t=( i))==null?'':__t)+
	'" data-index="'+
	((__t=( i))==null?'':__t)+
	'"> '+
	((__t=(( i < 10 ? ( "0" + i) : i)))==null?'':__t)+
	' </li> ';
	}
	__p+=' <li></li></ul></div><div class="kub-datepicker-column minute" data-type="minute"><ul><li></li> ';
	for(var i=0 ;i<=59;i++){
	__p+=' <li data-value="'+
	((__t=( i))==null?'':__t)+
	'" data-index="'+
	((__t=( i))==null?'':__t)+
	'"> '+
	((__t=( ( i < 10 ? ( "0" + i) : i)))==null?'':__t)+
	' </li> ';
	}
	__p+=' <li></li></ul></div><div class="kub-datepicker-column second" data-type="second"><ul><li></li> ';
	for(var i=0 ;i<=59;i++){
	__p+=' <li data-value="'+
	((__t=( i))==null?'':__t)+
	'" data-index="'+
	((__t=( i))==null?'':__t)+
	'"> '+
	((__t=( ( i < 10 ? ( "0" + i) : i)))==null?'':__t)+
	' </li> ';
	}
	__p+=' <li></li></ul></div><div class="kub-datepicker-overlay"></div></div>';
	return __p;
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Touch
	 *
	 * 移动端事件组件。
	 *
	 * 支持的事件包含：
	 *
	 * `tap` `longtap`
	 *
	 * `panstart` `panmove` `panup` `pandown` `panleft` `panright` `panend`
	 *
	 * `swipeleft` `swiperight` `swipeup` `swipedown`
	 *
	 */

	/**
	 * @require [polyfill](./polyfill.js.html)
	 */

	__webpack_require__(7)

	var MOBILE_REGEXP = /mobile|tablet|ip(ad|hone|od)|android/i

	var _window = window,
	    isTouch = 'ontouchstart' in _window && MOBILE_REGEXP.test(navigator.userAgent)

	var EVENTS_METHODS = [
	    'preventDefault',
	    'stopImmediatePropagation',
	    'stopPropagation'
	]

	var SWIPE_THRESHOLD = 10,
	    SWIPE_VELOCITY = 0.25,
	    SWIPE_MAX_MOVEMENT = 6,

	    TAP_TIMEOUT = 200,
	    TAP_THRESHOLD = 9,

	    LONGTAP_TIMEOUT = 500,

	    START_EVENT = isTouch ? 'touchstart' : 'mousedown',
	    MOVE_EVENT = isTouch ? 'touchmove' : 'mousemove',
	    END_EVENT = isTouch ? 'touchend' : 'mouseup',

	    DIRECTION_ANGLE = 25,
	    DIRECTIONS = ['up', 'right', 'down', 'left'],
	    SWIPE_EVENT = 'swipe',

	    PAN_EVENT = 'pan',
	    PAN_START_EVENT = 'panstart',
	    PAN_MOVE_EVENT = 'panmove',
	    PAN_END_EVENT = 'panend',

	    TAP_EVENT = 'tap',

	    LONGTAP_EVENT = 'longtap'

	// 获取位移量
	var distance = function(p1, p2) {
	    return Math.round(Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2)))
	}

	// 获取角度，通过获取角度从而获取方向
	var angle = function(p1, p2) {
	    var d = Math.abs(p2.x - p1.x)
	    return Math.round(Math.acos(d / Math.sqrt(Math.pow(d, 2) + Math.pow(p2.y - p1.y, 2))) * 57.3)
	}

	// 获取方向
	var direction = function(p1, p2) {
	    return (angle(p1, p2) > DIRECTION_ANGLE) ? ((p1.y < p2.y) ? 2 : 0) : ((p1.x < p2.x) ? 1 : 3)
	}

	// 如果触摸点位移大于 SWIPE_THRESHOLD 而且速度大于 SWIPE_VELOCITY
	var matchSwipe = function(threshold, interval) {
	    return threshold != null && threshold > SWIPE_THRESHOLD && threshold / interval > SWIPE_VELOCITY
	}

	// 如果触摸点位置大于 TAP_THRESHOLD 而且间隔时间小于 TAP_TIMEOUT
	var matchTap = function(threshold, interval) {
	    return threshold != null && threshold < TAP_THRESHOLD && interval < TAP_TIMEOUT
	}

	// 获取触摸点数据
	var getCoords = function(event) {
	    var touches = event.touches,
	        data = touches && touches.length ? touches : event.changedTouches
	    return {
	        x: isTouch ? data[0].clientX : event.clientX,
	        y: isTouch ? data[0].clientY : event.clientY,
	        e: isTouch ? data[0].target : event.target
	    }
	}

	// 获取事件位置数据
	var getEventDetail = function(coords) {
	    return {
	        x: coords.x,
	        y: coords.y
	    }
	}

	// 获取偏移值与时间间隔
	var getThresholdAndInterval = function(p1,p2){
	    return {
	        threshold : p1 && p2 && distance(p1, p2),
	        interval  : p1 && p2 && (p2.t.getTime() - p1.t.getTime())
	    }
	}

	// 触发事件
	var trigger = function(element, type, originalEvent, detail) {
	    var event = new _window.CustomEvent(type, {
	        detail: detail,
	        bubbles: true,
	        cancelable: true
	    })

	    // 存储原事件对象
	    event.originalEvent = originalEvent

	    EVENTS_METHODS.forEach(function(name){
	        event[name] = function(){
	            originalEvent[name].apply(originalEvent,arguments)
	        }
	    })

	    element && element.dispatchEvent && element.dispatchEvent(event)
	}

	var on = function(element, type, handler) {
	    element.addEventListener(type, handler, false)
	}

	var clearTime = function(timer) {
	    timer && clearTimeout(timer)
	    timer = null
	}

	var findMatchedDirection = function(actions){
	    var index = 0, max = actions[index]

	    actions.forEach(function(value,i){
	        value > max && (max = value, index = i)
	    })

	    return index
	}

	/**
	 * ## Touch Constructor
	 *
	 * `Touch`类。
	 *
	 * 使用方法：
	 * ```js
	 *
	 * new Kub.Touch(element)
	 *
	 * // swipeleft 事件，支持事件代理
	 * element.addEventListener('swipeleft','div',function(){
	 *     //do something
	 * })
	 *
	 * // tap 事件
	 * element.addEventListener('tap',function(){
	 *     //do something
	 * })
	 *
	 * ```
	 */
	function Touch(element) {
	    var moveFlag = false,
	        target,
	        p1,
	        p2,
	        longTapTimer,
	        cancelTap = false,
	        actions,
	        actionsLength

	    on(element, START_EVENT, function(event) {
	        var coords = getCoords(event)
	        p1 = coords
	        p1.t = new Date()
	        p2 = p1

	        actions = [0,0,0,0]
	        actionsLength = 0

	        cancelTap = false

	        target = coords.e

	        //触发 longtap 事件
	        isTouch && (longTapTimer = setTimeout(function() {
	            trigger(target, LONGTAP_EVENT, event)
	        }, LONGTAP_TIMEOUT))

	    })

	    on(element, MOVE_EVENT, function(event) {
	        if(!target){
	            return
	        }

	        var coords = getCoords(event),
	            detail = getEventDetail(coords),
	            thresholdAndInterval,
	            direct

	        p2 = coords
	        p2.t = new Date()

	        thresholdAndInterval = getThresholdAndInterval(p1,p2)

	        // 如果触摸点不符合 longtap 触发条件，则取消长按事件
	        if(!cancelTap && !matchTap(thresholdAndInterval.threshold, thresholdAndInterval.interval)){
	            clearTime(longTapTimer)
	            cancelTap = true
	        }

	        //触发 panstart 事件
	        !moveFlag && trigger(target, PAN_START_EVENT, event, detail)

	        direct = direction(p1, p2)

	        // 取出前SWIPE_MAX_MOVEMENT移动记录
	        actionsLength < SWIPE_MAX_MOVEMENT && (actions[direct] += 1, actionsLength += 1)

	        //触发 pan['up', 'right', 'down', 'left'] 事件
	        trigger(target, PAN_EVENT + DIRECTIONS[direct], event, detail)

	        //触发 panmove 事件
	        trigger(target, PAN_MOVE_EVENT, event, detail)

	        moveFlag = true
	    })

	    on(element, END_EVENT, function(event) {
	        // 取消 longtap 事件定时器
	        clearTime(longTapTimer)

	        var coords = getCoords(event), thresholdAndInterval

	        p2 = coords
	        p2.t = new Date()

	        thresholdAndInterval = getThresholdAndInterval(p1,p2)

	        // 如果达到 swipe 事件条件
	        if (matchSwipe(thresholdAndInterval.threshold, thresholdAndInterval.interval)) {

	            //触发 swipe['up', 'right', 'down', 'left'] 事件
	            trigger(target, SWIPE_EVENT + DIRECTIONS[findMatchedDirection(actions)], event)
	        } else if (!cancelTap && isTouch && matchTap(thresholdAndInterval.threshold, thresholdAndInterval.interval)) {

	            // 触发 tap 事件
	            trigger(target, TAP_EVENT, event)
	        }

	        // 触发 panend 事件
	        target && moveFlag && trigger(target, PAN_END_EVENT, event, getEventDetail(coords))

	        target = null
	        moveFlag = false
	    })
	}

	module.exports = Touch


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * # Kub
	 *
	 * 与`Kub`对象一致，增加样式文件。
	 *
	 */
	__webpack_require__(26)

	module.exports = __webpack_require__(5)


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(27)({"insertAt":"top","css":".kub-dialog .kub-dialog-button:focus,.kub-prompt .kub-prompt-input:focus{outline:0}.kub-animated{-webkit-animation-duration:.5s;animation-duration:.5s;-webkit-animation-fill-mode:both;animation-fill-mode:both}@-webkit-keyframes kubZoomIn{0%{opacity:0;-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}100%{opacity:1}}@keyframes kubZoomIn{0%{opacity:0;-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}100%{opacity:1}}.kub-zoomin{-webkit-animation-name:kubZoomIn;animation-name:kubZoomIn}.kub-dialog-modal{position:fixed;top:0;bottom:0;left:0;right:0;width:100%;height:100%;z-index:10000}.kub-modal{background:rgba(0,0,0,.6)}.kub-dialog-wrapper{display:table;width:100%;height:100%}.kub-dialog-wrapper .kub-dialog-container{display:table-cell;vertical-align:middle}.kub-dialog{width:86%;margin:0 auto;font-size:18px;background:#fff;border-radius:6px;color:#333;box-shadow:0 2px 5px rgba(0,0,0,.1)}.kub-dialog .kub-dialog-header{border-radius:6px 6px 0 0;padding:16px 8px;text-align:center;background:#f4f4f4}.kub-dialog .kub-dialog-body{line-height:1.5;padding:24px 16px;color:#333}.kub-dialog .kub-dialog-button{display:block;background:0 0;border:none;border-right:2px solid #f4f4f4;padding:16px 8px;font-size:100%;text-align:center}.kub-dialog .kub-dialog-footer{border-top:2px solid #f4f4f4;display:-webkit-box;display:-webkit-flex;display:flex}.kub-dialog .kub-dialog-footer .kub-dialog-button{-webkit-box-flex:1;-webkit-flex:1;flex:1}.kub-dialog .kub-dialog-footer .kub-dialog-button:last-child{border:none}.kub-toast{position:fixed;bottom:auto;height:auto;z-index:10002}.kub-toast .kub-dialog{border:1px solid rgba(0,0,0,.1);background:rgba(0,0,0,.7)}.kub-toast .kub-dialog-body{padding:16px 8px;color:#fff;text-align:center}.kub-prompt .kub-prompt-input{font-size:100%;width:100%;border:1px solid #f4f4f4;padding:8px;background:#fff;box-sizing:border-box}.kub-loader{z-index:10001}.kub-loader .kub-dialog{width:36%;background:rgba(0,0,0,.7);border-radius:16px}.kub-loader .kub-dialog .kub-dialog-body{color:#fff;padding:32px 16px;text-align:center}.kub-datepicker-dialog .kub-dialog-body{padding:12px}.kub-datepicker{font-size:16px;color:#333;text-align:center;white-space:nowrap;position:relative}.kub-datepicker li,.kub-datepicker ul{list-style:none;margin:0;padding:0}.kub-datepicker .kub-datepicker-overlay{position:absolute;top:54px;left:0;height:54px;width:100%;z-index:0;border:1px solid rgba(0,0,0,.1);border-radius:6px;box-shadow:0 0 108px rgba(0,0,0,.3);box-sizing:border-box}.kub-datepicker .kub-datepicker-column{position:relative;height:162px;padding:0 10px;display:inline-block;overflow:hidden;z-index:1}.kub-datepicker .kub-datepicker-column:after{position:absolute;font-size:12px;top:54px;right:0}.kub-datepicker .kub-datepicker-column ul li{line-height:54px;height:54px}.kub-datepicker .year:after{content:\"年\"}.kub-datepicker .month:after{content:\"月\"}.kub-datepicker .day:after{content:\"日\"}.kub-datepicker .hour:after{content:\"时\"}.kub-datepicker .minute:after{content:\"分\"}.kub-datepicker .second:after{content:\"秒\"}.kub-datepicker-en .year:after{content:\"y\"}.kub-datepicker-en .month:after{content:\"m\"}.kub-datepicker-en .day:after{content:\"d\"}.kub-datepicker-en .hour:after{content:\"h\"}.kub-datepicker-en .minute:after{content:\"min\"}.kub-datepicker-en .second:after{content:\"s\"}"})

/***/ },
/* 27 */
/***/ function(module, exports) {

	var _document = document,
		_head = _document.head,
		styleElements = []

	function insertStyleElement(options, styleElement) {
		var lastStyleElement = styleElements[styleElements.length - 1],
			nextSibling

		if (options.insertAt === 'top') {
			if(!lastStyleElement) {
				_head.insertBefore(styleElement, _head.firstChild)
			} else if( (nextSibling = lastStyleElement.nextSibling) ) {
				_head.insertBefore(styleElement, nextSibling)
			} else {
				_head.appendChild(styleElement)
			}
			styleElements.push(styleElement)
		} else if (options.insertAt === 'bottom') {
			_head.appendChild(styleElement)
		}
	}

	module.exports = function(options) {

		var styleElement = _document.createElement('style')

		styleElement.type = 'text/css'

		styleElement.appendChild(_document.createTextNode(options.css))

		insertStyleElement(options, styleElement)
	}

/***/ }
/******/ ]);
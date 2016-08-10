/**
 * # Lite
 *
 * 类似于`Zepto`，提供部分与Dom相关的方法，方法使用保持与`Zepto`一致。
 *
 */

/**
 * @require [polyfill](./polyfill.js.html)
 */
require('./polyfill')
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

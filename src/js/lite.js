var $, Lite

var ELEMENT_NODE = 1,
    ELEMENT_PROTOTYPE = Element.prototype

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

    Object.setPrototypeOf ? Object.setPrototypeOf(dom, $.fn) : (dom.__proto__ = $.fn)

    dom.selector = selector || ''
    return dom
}

var isArray = Array.isArray ||
    function(object) {
        return object instanceof Array
    }

$ = Lite = function Lite(selector, context) {
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
        //$([document,document.body]) not $(window)
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


//polyfill
//android 4.3
if (!_window.CustomEvent) {
    var CustomEvent = function(event, params) {
        var evt
        params = params || {
            bubbles: false,
            cancelable: false,
            detail: undefined
        }
        evt = document.createEvent("CustomEvent")
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
        return evt
    }
    CustomEvent.prototype = _window.Event.prototype
    _window.CustomEvent = CustomEvent
}

var matches = (function() {
    var names = [
        //"mozMatchesSelector",
        "webkitMatchesSelector",
        //"msMatchesSelector",
        "matches"
    ]

    var i = names.length
    while (i--) {
        var name = names[i]
        if (!ELEMENT_PROTOTYPE[name]) continue
        return name
    }
}())

var createDelegator = function(handler, selector) {
    return function(e) {
        if ($(e.target).closest(selector).length) {
            handler.apply(e.target, arguments)
        }
    }
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

    this.Event = function(type, props) {

        return new _window.CustomEvent(type, props)
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

        is: function(selector, element) {
            element = element ? element : this[0]

            if (element && element.nodeType === ELEMENT_NODE) {
                return element === selector ? true : typeof selector === 'string' && element[matches](selector)
            }

            return false
        },

        //原生closest不包含本身，jQuery与Zepto包含本身，保持与Zepto一致
        closest: function(selector) {
            var element = this[0],
                prt = element,
                dom

            if(ELEMENT_PROTOTYPE.closest){
                var child = element.children[0]

                dom = child ? child.closest(selector) : this.is(selector, element) ? element : null

            }else{
                while (prt) {
                    if (this.is(selector, prt)) {
                        dom = prt
                        break
                    }
                    prt = prt.parentElement
                }
            }

            return $(dom)
        },

        //only support find(selector)
        //zepto
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

            var ele = this[0],
                obj = ele.getBoundingClientRect()
            return {
                left: obj.left + _window.pageXOffset,
                top: obj.top + _window.pageYOffset,
                width: ele.offsetWidth,
                height: ele.offsetHeight
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
                    //zepto
                    className = className.replace(new RegExp('(^|\\s)' + klass + '(\\s|$)', 'g'), ' ')
                })

                this.className = className
            })
        },

        eq: function(idx) {
            idx = idx < 0 ? idx + this.length : idx
            return $(this[idx])
        },

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

        on: function(type, selector, handler) {
            var f = true

            if (typeof selector !== "string") {
                f = false
                handler = selector
            }

            if (handler) {
                var types = type && type.trim().split(spaceRE)

                types && this.each(function() {
                    var element = this, listeners

                    if (f) {
                        handler.delegator = createDelegator(handler, selector)
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

        trigger: function(type, detail) {
            return this.each(function() {
                this.dispatchEvent($.Event(type, {
                    detail: detail,
                    bubbles: true,
                    cancelable: true
                }))
            })
        },

        attr: function(name, value) {
            var result,
                type = typeof name

            if(type === 'string' && value == null) {

                if(!this.length || this[0].nodeType !== ELEMENT_NODE){
                    return null

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
                self = this

            target.each(function() {
                var node = this
                self.each(function() {
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

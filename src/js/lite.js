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

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
        if ($.isArrayLike(selector)) {
            return wrap(slice.call(selector), selector);
        } else {
            //$(document)
            return wrap([selector], selector);
        }
    }

    if (typeof selector === 'string') {
        if (selector[0] === '<'){
            var nodes = $.fragment(selector);

            return wrap(slice.call(nodes), nodes);
        }

        return wrap($.qsa(selector, context), selector);
    }

    return wrap();
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
    };

    this.fragment = function(html){
        var div = document.createElement('div'),nodes ;
        div.innerHTML = html;
        nodes = div.children;
        div = null;
        return nodes;
    };

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
                this.removeEventListener(name, callback, false);
            });
        },

        on: function(name, callback) {
            return this.each(function() {
                this.addEventListener(name, callback, false);
            });
        },

        trigger: function(eventType, eventData) {
            return this.each(function() {
                this.dispatchEvent(new CustomEvent(eventType, {
                    detail: eventData,
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

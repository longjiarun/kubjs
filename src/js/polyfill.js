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

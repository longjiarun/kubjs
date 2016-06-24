//CustomEvent polyfill
//android 4.3
var _window = window

var ELEMENT_NODE = 1,
    ELEMENT_PROTOTYPE = Element.prototype

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

//Element.prototype.matches polyfill
if (typeof ELEMENT_PROTOTYPE.matches !== 'function') {
    ELEMENT_PROTOTYPE.matches = ELEMENT_PROTOTYPE.msMatchesSelector || ELEMENT_PROTOTYPE.mozMatchesSelector || ELEMENT_PROTOTYPE.webkitMatchesSelector || function matches(selector) {
        var element = this;
        var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
        var index = 0;

        while (elements[index] && elements[index] !== element) {
            ++index;
        }

        return Boolean(elements[index]);
    };
}

//Element.prototype.closest polyfill
if (typeof ELEMENT_PROTOTYPE.closest !== 'function') {
    ELEMENT_PROTOTYPE.closest = function closest(selector) {
        var element = this;

        while (element && element.nodeType === ELEMENT_NODE) {
            if (element.matches(selector)) {
                return element;
            }

            element = element.parentNode;
        }

        return null;
    };
}

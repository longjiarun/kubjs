//CustomEvent polyfill
//android 4.3
var _window = window

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

/**
 * # Popup
 *
 * 对话框.
 */

/**
 * @require [core](./core.js.html)
 * @require [Lite](./lite.js.html)
 */
var core = require('./core'),
    $ = require('./lite'),
    template = require('./tpl/popup')

/**
 * ## Popup Constructor
 *
 * Popup 构造函数。
 *
 * 使用：
 * ```js
 *   var popup = new Kub.Popup({
 *       message:'popup dialog'
 *   })
 * ```
 */
function Popup(options) {
    this.options = core.extend({}, _prototype.defaults, options || {})
    init(this)
}

var ANIMATION_CLASS = 'kub-popup-animation',
    EVENT_NAME = 'click',
    POPUP_SELECTOR = '.J_popup'

var $body

var _prototype = Popup.prototype

var render = function(popup,data) {
    var html = template(data)

    popup.$element = $(html).appendTo($body)
    return this
}

var bindEvents = function(popup){
    popup.$element.on(EVENT_NAME, function(e) {
        if($(e.target).closest(POPUP_SELECTOR).length){
            return
        }
        popup.close()
    })
}

var init = function(popup) {
    !$body && ($body = $(document.body))

    //渲染数据
    render(popup, popup.options)

    bindEvents(popup)

    popup.show()
}

/**
 * ## Popup.prototype.defaults
 *
 * 默认配置项。
 *
 * 配置项说明：
 *
 * * `message` : `String` 弹窗内容。
 *
 * * `className` : `String` 弹窗类名。
 *
 */
_prototype.defaults = {
    message: '',
    className: '',
    duration:350
}

/**
 * ## Popup.prototype.show
 *
 * 显示弹窗。
 * @return {instance} 返回当前实例
 */
_prototype.show = function() {

    clearTimeout(this._timer)
    this.$element.show().addClass(ANIMATION_CLASS)

    return this
}

/**
 * ## Popup.prototype.hide
 *
 * 隐藏弹窗。
 * @return {instance} 返回当前实例
 */
_prototype.hide = function(callback) {
    var self = this,
        $element = self.$element

    function handler(){
        $element.hide()
        callback && callback()
    }

    $element.removeClass(ANIMATION_CLASS)

    clearTimeout(self._timer)
    self._timer = setTimeout(function(){
        handler()
    },self.options.duration)

    return self
}

/**
 * ## Popup.prototype.close
 *
 * 关闭弹窗。
 * @return {instance} 返回当前实例
 */
_prototype.close = function() {
    var self = this,
        opts = self.options

    if (opts.closeHandler && opts.closeHandler.call(self) === false) {
        return self
    }

    self.hide(function(){
        self.$element.remove()
    })

    return self
}

module.exports = Popup

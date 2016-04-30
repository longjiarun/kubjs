/**
 * # Toast
 *
 * 提示框
 */

/**
 * @require [core](./core.js.html)
 * @extend [Dialog](./dialog.js.html)
 */
var core = require('./core'),
    Dialog = require('./dialog')

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

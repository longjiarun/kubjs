/**
 * # Kub.Confirm
 * confirm弹窗。
 * 
 * @extend [Dialog](dialog.js.html)
 */
!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof define === "function") {
        define(function() {
            return Kub.Confirm = factory(root, root.jQuery||root.Zepto ,Kub.Dialog);
        });
    }else if (typeof exports !== 'undefined') {
        module.exports = factory(root,require("./lib/zepto") ,require("./dialog"));
    } else {
        Kub.Confirm = factory(root, root.jQuery||root.Zepto ,Kub.Dialog);
    }
}(this,function(root,$,Dialog){

    /**
     * ## Confirm Constructor
     *
     * 初始化`Confirm`类，`Confirm`并不提供实例方法，实例方法均继承于`Dialog`。
     *
     * 使用方法：
     * ```js
     * var confirm = new Kub.Confirm({
     *     confirm:function(e,dialog){
     *         console.log("确认按钮");
     *         dialog.close();
     *     }
     * });
     * ```
     */
    
    var Confirm = function(options){

        this.options = $.extend({},Confirm.prototype.defaults, options||{});

        this.options.buttons = [{
            text:this.i18n[this.options.locale].cancel,
            handler: this.options.cancel || function(e,dialog){
                dialog.close();
            }
        },{
            text:this.i18n[this.options.locale].ok,
            handler: this.options.confirm
        }];

        Dialog.call(this,this.options);
    };
    
    //继承于 `Dialog`
    Dialog.prototype.inherit(Confirm,Dialog);

    ;(function(){
        this.constructor = Confirm;

        /**
         * ## defaults
         *
         * `Confirm`默认配置项。
         *
         * 配置项说明：
         * 
         * * `confirm`: 单击确认按钮时触发的事件。一般用于用户单击确认按钮执行事件。需调用`dialog.close()`手动关闭弹窗。
         * 
         * * `cancel`: 单击取消按钮时触发的事件。如果未传递，单击时会默认关闭弹窗。如果传递，需调用`dialog.close()`手动关闭弹窗。
         *
         * * `showHeader`: 是否显示头部。
         * 
         * * `closable`: 是否显示关闭按钮，`showHeader`为`true`时有效。
         *
         * * `className`: 弹窗类名，不建议修改，会影响样式。
         * 
         * * `locale`: 本地化。与`Dialog`保持一致。
         * 
         * * `modal`: 是否显示遮罩层。
         */
        this.defaults = {
            confirm:null,
            cancel:null,
            showHeader:false,
            closable:false,
            className:"kub-confirm",
            locale:"zh",
            modal:true
        };
    }).call(Confirm.prototype);

    return Confirm;
}));
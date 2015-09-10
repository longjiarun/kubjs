/**
 * # Kub.Alert
 * alert弹窗，用于提示说明。
 * 
 * @extend [Dialog](dialog.js.html)
 */
!(function(factory){
    var root =this,Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof module !== "undefined" && module.exports) {
        module.exports = factory(root, root.jQuery||root.Zepto, Kub.Dialog);
    }else if (typeof define === "function") {
        define(function() {
            return Kub.Alert = factory(root, root.jQuery||root.Zepto ,Kub.Dialog);
        });
    } else {
        Kub.Alert = factory(root, root.jQuery||root.Zepto, Kub.Dialog);
    }
}(function(root,$,Dialog){

    /**
     * ## Alert Constructor
     *
     * 初始化`Alert`类，`Alert`并不提供实例方法，实例方法均继承于`Dialog`。
     *
     * 使用方法：
     * ```js
     * var alert = new Kub.Alert();
     * ```
     */
    
    var Alert = function(options){

        this.options = $.extend({},Alert.prototype.defaults, options||{});

        this.options.buttons = [{
            text:this.i18n[this.options.locale].ok,
            handler: this.options.confirm || function(e,dialog){
                dialog.close();
            }
        }];
        
        Dialog.call(this,this.options);
    };

    //继承于 `Dialog`
    Dialog.prototype.inherit(Alert,Dialog);

    ;(function(){
        this.constructor = Alert;

        /**
         * ## defaults
         *
         * `Alert`默认配置项。
         *
         * 配置项说明：
         * 
         * * `confirm`: 单击确认按钮时触发的事件。如果未传递，单击时会默认关闭弹窗。如果传递，需调用`dialog.close()`手动关闭弹窗。
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
            showHeader:false,
            closable:false,
            className:"kub-alert",
            locale:"zh",
            modal:true
        };

    }).call(Alert.prototype);

    return Alert;
}));
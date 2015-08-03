/**
 * # Kub.Prompt
 * 
 * 输入框
 * 
 */
!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof define === "function") {
        define(function() {
            return Kub.Prompt = factory(root,root._,Kub.Dialog);
        });
    }else {
        Kub.Prompt = factory(root,root._,Kub.Dialog);
    }
}(this,function(root,_,Dialog){

    /**
     * ## Prompt Constructor
     *
     * 初始化`Prompt`类，`Prompt`并不提供实例方法，实例方法均继承于`Dialog`。
     *
     * 使用方法：
     * ```js
     * var prompt = new Kub.Prompt();
     * ```
     */
    var Prompt = function(options){
        var self = this;
        this.options = $.extend({},Prompt.prototype.defaults, options||{});

        this.options.buttons = [{
            text:this.i18n[this.options.locale].ok,
            handler: function(e,dialog){
                dialog.value = dialog.$element.find("#"+INPUTID).val();
                self.options.confirm && self.options.confirm.call(this,e,dialog);
            }
        },{
            text:this.i18n[this.options.locale].cancel,
            handler: this.options.cancel || function(e,dialog){
                dialog.close();
            }
        }];

        this.options.message = _.template(TEMPLATE)({data:this.options});

        Dialog.call(this,this.options);
    };
    var INPUTID = "J_input" ,
        // prompt 模板
        TEMPLATE = '<%= data.message%><div class="kub-prompt-input-wrapper"><input placeholder="<%= data.placeholder%>" type="<%= data.inputType%>" id="J_input" value="<%= data.defaultValue%>" class="kub-prompt-input"/></div>';

    //继承于 `Dialog`
    Dialog.prototype.inherit(Prompt,Dialog);

    ;(function(){
        this.constructor = Prompt;

         /**
         * ## defaults
         *
         * `Prompt`默认配置项。
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
         * 
         * * `inputType`: 输入框类型。
         * 
         * * `placeholder`: 输入框 placeholder 属性。
         * 
         * * `defaultValue`: 输入框默认值。
         */
        this.defaults = {
            confirm:null,
            cancel:null,
            showHeader:false,
            closable:false,
            className:"kub-prompt",
            locale:"zh",
            modal:true,
            inputType:"text",
            placeholder:"",
            defaultValue:""
        };
    }).call(Prompt.prototype);

    return Prompt;
}));
!(function(root,factory){
    if (typeof define === "function") {
        define(function() {
            return root.Prompt = factory(root,root._,root.Dialog);
        });
    }else {
        root.Prompt = factory(root,root._,root.Dialog);
    }
}(this,function(root,_,Dialog){
    var Prompt = function(options){
        var self = this;
        this.options = $.extend({},this.defaults, options||{});

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
    var INPUTID = "J_input" ,TEMPLATE = '<%= data.message%><div class="prompt-input-wrapper"><input placeholder="<%= data.placeholder%>" type="<%= data.inputType%>" id="J_input" value="<%= data.defaultValue%>" class="prompt-input"/></div>';

    
    
    Dialog.prototype.inherit(Prompt,Dialog);

    ;(function(){
        this.constructor = Prompt;

        this.defaults = {
            confirm:null,
            cancel:null,
            showHeader:false,
            closable:false,
            className:"prompt",
            locale:"zh",
            modal:true,
            inputType:"text",
            placeholder:"",
            defaultValue:""
        };
    }).call(Prompt.prototype);

    return Prompt;
}));
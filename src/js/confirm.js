!(function(root,factory){
    if (typeof define === "function") {
        define(function() {
            return factory(root,root.Dialog);
        });
    }else {
        root.Confirm = factory(root,root.Dialog);
    }
}(this,function(root,Dialog){
    var Confirm = function(options){

        this.options = $.extend({},this.defaults, options||{});

        this.options.buttons = [{
            text:this.i18n[this.options.locale].ok,
            handler: this.options.confirm
        },{
            text:this.i18n[this.options.locale].cancel,
            handler: this.options.cancel || function(e,dialog){
                dialog.close();
            }
        }];

        Dialog.call(this,this.options);
    };

    
    
    Dialog.prototype.inherit(Confirm,Dialog);

    ;(function(){
        this.constructor = Confirm;
        this.defaults = {
            confirm:null,
            cancel:null,
            showHeader:false,
            closable:false,
            className:"confirm",
            locale:"zh",
            modal:true
        };
    }).call(Confirm.prototype);

    return Confirm;
}));
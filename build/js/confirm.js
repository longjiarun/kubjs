!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof define === "function") {
        define(function() {
            return Kub.Confirm = factory(root,Kub.Dialog);
        });
    }else {
        Kub.Confirm = factory(root,Kub.Dialog);
    }
}(this,function(root,Dialog){
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
    
    Dialog.prototype.inherit(Confirm,Dialog);

    ;(function(){
        this.constructor = Confirm;
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
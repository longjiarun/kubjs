!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof define === "function") {
        define(function() {
            return Kub.Alert = factory(root,Kub.Dialog);
        });
    }else {
        Kub.Alert = factory(root,Kub.Dialog);
    }
}(this,function(root,Dialog){
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

    Dialog.prototype.inherit(Alert,Dialog);

    ;(function(){
        this.constructor = Alert;

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
!(function(root,factory){
    if (typeof define === "function") {
        define(function() {
            return root.Alert = factory(root,root.Dialog);
        });
    }else {
        root.Alert = factory(root,root.Dialog);
    }
}(this,function(root,Dialog){
    var Alert = function(options){

        this.options = $.extend({},this.defaults, options||{});

        this.options.buttons = [{
            text:this.i18n[this.options.locale].ok,
            handler: this.options.confirm || function(e,dialog){
                dialog.close();
            }
        }];
        
        Dialog.call(this,this.options);
    };

    //Alert.defaults = 
    

    Dialog.prototype.inherit(Alert,Dialog);

    ;(function(){
        this.constructor = Alert;

        this.defaults = {
            confirm:null,
            showHeader:false,
            closable:false,
            className:"alert",
            locale:"zh",
            modal:true
        };

    }).call(Alert.prototype);

    return Alert;
}));
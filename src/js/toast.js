!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof define === "function") {
        define(function() {
            return Kub.Toast = factory(root,Kub.Dialog);
        });
    }else {
        Kub.Toast = factory(root,Kub.Dialog);
    }
}(this,function(root,Dialog){
    var Toast = function(options){
        var self = this;
        this.options = $.extend({},Toast.prototype.defaults, options||{},{
            showHeader:false,
            buttons:null,
            modal:false,
            scrollable:true
        });

        Dialog.call(this,this.options);

        //自动关闭
        setTimeout(function(){
            self.close();
        },this.options.delay);
    };

    Dialog.prototype.inherit(Toast,Dialog);

    ;(function(){
        this.constructor = Toast;
        this.defaults = {
            showHeader:false,
            closable:false,
            className:"kub-toast",
            modal:false,
            top:50,
            delay:2000
        };
        this.setPosition = function(){
            this.$element.css({
                top:this.options.top
            });
            return this;
        };

     }).call(Toast.prototype);

    return Toast;
}));
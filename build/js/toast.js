!(function(root,factory){
    if (typeof define === "function") {
        define(function() {
            return factory(root,root.Dialog);
        });
    }else {
        root.Toast = factory(root,root.Dialog);
    }
}(this,function(root,Dialog){
    var Toast = function(options){
        var self = this;
        this.options = $.extend({},this.defaults, options||{},{
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
            className:"toast",
            modal:false,
            top:50,
            delay:2000
        };
        this.setPosition = function(){
            this.$dialog.css({
                top:this.options.top
            });
            return this;
        };

     }).call(Toast.prototype);

    return Toast;
}));
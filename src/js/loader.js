!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof define === "function") {
        define(function() {
            return Kub.Loader = factory(root,root._,Kub.Dialog);
        });
    }else {
        Kub.Loader = factory(root,root._,Kub.Dialog);
    }
}(this,function(root,_,Dialog){
    var Loader = function(options){
        var self = this;
        this.options = $.extend({},this.defaults, options||{},{
            showHeader:false,
            buttons:null
        });
        
        this.options.message = _.template(TEMPLATE)({data:this.options});

        Dialog.call(this,this.options);
    };

    var TEMPLATE = '<div class="kub-spinner"> <div class="rect1"></div> <div class="rect2"></div> <div class="rect3"></div> <div class="rect4"></div> <div class="rect5"></div> </div> <div class="kub-loader-message"><%= data.message%></div>'

    Dialog.prototype.inherit(Loader,Dialog);

    ;(function(){
        this.constructor = Loader;
        this.defaults = {
            showHeader:false,
            scrollable:true,
            closable:false,
            className:"kub-loader",
            modal:true,
            message:"加载中..."
        };

     }).call(Loader.prototype);

    return Loader;
}));
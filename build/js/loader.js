!(function(root,factory){
    if (typeof define === "function") {
        define(function() {
            return root.Loader = factory(root,root._,root.Dialog);
        });
    }else {
        root.Loader = factory(root,root._,root.Dialog);
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

    var TEMPLATE = '<div class="spinner"> <div class="rect1"></div> <div class="rect2"></div> <div class="rect3"></div> <div class="rect4"></div> <div class="rect5"></div> </div> <div class="loader-message"><%= data.message%></div>'

    Dialog.prototype.inherit(Loader,Dialog);

    ;(function(){
        this.constructor = Loader;
        this.defaults = {
            showHeader:false,
            scrollable:true,
            closable:false,
            className:"loader",
            modal:true,
            message:"Loading..."
        };

     }).call(Loader.prototype);

    return Loader;
}));
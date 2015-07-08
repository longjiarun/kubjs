!(function(root,factory){
    if(typeof define === "function"){
        define(function(){
            return root.ScollLoad=factory(root, root.jQuery||root.Zepto, root.core, root.LazyLoad);
        });
    }else{
        root.ScollLoad=factory(root, root.jQuery||root.Zepto, root.core, root.LazyLoad);
    }
}(this,function(root, $, core, LazyLoad){
    'use strict';
    var ScollLoad = function(element,options){
        this.$element = $(element);
        this.$loading = $(options.loading);

        if(!this.$loading.length) return;

        this.options=$.extend({},ScollLoad.prototype.defaults,options||{});
        
        LazyLoad.call(this, this.$loading, $.extend({},this.options,{
            waitTime:0,
            container:this.$element[0]
        }));
    };

    core.inherit(ScollLoad, LazyLoad);

    (function(){
        this.constructor=ScollLoad;
        
        this.defaults={
            callback : null
        };
        
        this.load = function(){
            var self = this,options = this.options;
            
            options.callback && options.callback.apply(self);

            return self;
        };     

    }).call(ScollLoad.prototype);

    return ScollLoad;
}));
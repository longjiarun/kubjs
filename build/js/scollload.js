!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if(typeof define === "function"){
        define(function(){
            return Kub.ScollLoad=factory(root, root.jQuery||root.Zepto, Kub.core, Kub.LazyLoad);
        });
    }else{
        Kub.ScollLoad=factory(root, root.jQuery||root.Zepto, Kub.core, Kub.LazyLoad);
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
        
        this.load = function($this){
            var self = this,options = this.options;
            
            options.callback && options.callback.call(self,$this);

            return self;
        };     

    }).call(ScollLoad.prototype);

    return ScollLoad;
}));
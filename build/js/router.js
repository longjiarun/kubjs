!(function(root,factory){
    if (typeof define === "function") {
        define(function() {
            return root.Router = factory(root,root._);
        });
    } else {
        root.Router = factory(root,root._);
    }
}(this,function(root,_){
    'use strict';
    function Router(options){
        this.options = _.extend({
            defaultRoute:"/",
            routes:[],
            beforeRouteChange:null
        },options||{});
    }
    ;(function(){
        this.constructor = Router;
        //缓存所有路由
        this.routes = [];

        //设置默认路由
        this.setDefaultRoute = function(route){
            this.options.defaultRoute = route;
            return this;
        };

        this.getHash = function(url) {
            var match = url.match(/#(.*)$/);
            return match ? match[1] : '';
        };

        this.getCurrentRoute = function(){
            return this.currentRoute;
        };

        this.start = function(){
            if(this.started) return this;
            var self = this;
            this.started = true;
            //监听url改变事件
            if (window.history.replaceState) {
                this._event = "popstate";
            } else if ('onhashchange' in window) {
                this._event = "hashchange";
            } else{
                throw new Error("Sorrry,your browser is not supported.");
            }
            this._checkUrl = function(){
                self.checkUrl.apply(self,arguments);
            };
            //this._event="hashchange"
            window.addEventListener(this._event, this._checkUrl);

            self.navigate(self.getHash(window.location.href));
            return self;
        };

        this.stop = function(){
            window.removeEventListener(this._event, this._checkUrl);
            this.started = false;
            return this;
        };

        this.checkUrl = function(event){
            return this.navigate(this.getHash(event.target.location.hash));
        }

        var optionalParam = /\((.*?)\)/g;
        var namedParam = /(\(\?)?:\w+/g;
        var splatParam = /\*\w+/g;
        var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g;
        this._routeToRegExp = function(route) {
            route = route.replace(escapeRegExp, '\\$&')
                .replace(optionalParam, '(?:$1)?')
                .replace(namedParam, function(match, optional) {
                    return optional ? match : '([^/?]+)';
                })
                .replace(splatParam, '([^?]*?)');
            return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
        };

        this._extractParameters = function(route, fragment) {
            var params = route.exec(fragment).slice(1);
            return _.map(params, function(param, i) {
                // Don't decode the search params.
                if (i === params.length - 1) return param || null;
                return param ? decodeURIComponent(param) : null;
            });
        };

        this.navigate = function(route,opts){
            var self = this, f = true;
            opts = _.extend({},opts||{},{
                trigger:true,
                replace:false
            });
            //1、解决重复执行问题
            //2、主要是解决不支持replaceState方法的浏览器
            if(this.currentRoute == route) return this;
            self.currentRoute = route;

            if(!this.options.beforeRouteChange || 
                this.currentRoute == void 0 || 
                this.options.beforeRouteChange.call(this,route) !== false){

                opts.trigger && _.each(this.routes,function(value){

                    if(value.route.test(route)){
                        value.callback(self._extractParameters(value.route,route));
                        
                        f = false;
                    }
                });

                f ? this.options.defaultRoute && (location.hash = "#"+this.options.defaultRoute) : 
                    self._updateHash(route, opts.replace);
            }

            return this;
        };

        this._updateHash = function(fragment, replace) {
            var url = window.location.href.replace(/#(.*)$/, "#"+fragment);
            if(this._event == "popstate"){
                window.history[replace ? 'replaceState' : 'pushState']({}, document.title, url);
            }else{
                if (replace) {
                    window.location.replace(url);
                } else {
                    // Some browsers require that `hash` contains a leading #.
                    window.location.hash = '#' + fragment;
                }
            }
            return this;
        }

        this.route = this.add = function(route,callback){
            if (!_.isRegExp(route)) route = this._routeToRegExp(route);

            this.routes.unshift({
                route:route,
                callback:callback
            });
            return this;
        };

        /**
         * 移除 route 函数
         */
        this.remove = function(route,callback){
            if(route){
                this.routes = _.filter(this.routes,function(value){
                    return !value.route.test(route);
                });
            }
            return this;
        };

    }).call(Router.prototype);

    return Router;        
}));
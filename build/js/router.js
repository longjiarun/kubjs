!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof define === "function") {
        define(function() {
            return Kub.Router = factory(root,root._);
        });
    } else {
        Kub.Router = factory(root,root._);
    }
}(this,function(root,_){
    'use strict';
    function Router(options){
        this.options = _.extend({
            defaultRoute:"/",
            routes:{},
            beforeRouteChange:null
        },options||{});

        var routes = this.options.routes || {};
        for(var name in routes){
            if(routes.hasOwnProperty(name)){
                this.route(name,routes[name]);
            }
        }
        
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

        this.updateHash = function(url,route){
            return url && url.replace(/#(.*)$/, "")+"#"+route;
        };

        this.getCurrentRoute = function(){
            return this.currentRoute;
        };

        this.start = function(){
            if(this.started) return this;
            var self = this;
            this.started = true;
            //监听url改变事件
            if (history.replaceState) {
                this._event = "popstate";
            } else if ('onhashchange' in window) {
                this._event = "hashchange";
            } else{
                throw new Error("Sorrry,your browser is not supported.");
            }
            this._checkUrl = function(event){
                return self.navigate(self.getHash(event.target.location.hash),{
                    updateHash:false
                });
            };
            //this._event = "hashchange"
            window.addEventListener(this._event, this._checkUrl);

            self.navigate(self.getHash(location.href),{
                updateHash:false
            });
            return self;
        };

        this.stop = function(){
            window.removeEventListener(this._event, this._checkUrl);
            this.started = false;
            return this;
        };

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
            var self = this, options = self.options, f = true;
            //1、解决重复执行问题
            //2、主要是解决不支持replaceState方法的浏览器
            if(self.currentRoute == route) return self;

            opts = _.extend({
                trigger:true,
                updateHash:true,
                replace:false
            },opts||{});
            
            //缓存当前route
            self.currentRoute = route;
            if(!options.beforeRouteChange || 
                self.currentRoute == void 0 || 
                options.beforeRouteChange.call(self,route) !== false){
                opts.trigger && _.each(self.routes,function(value){
                    if(value.route.test(route)){
                        value.callback.apply(self,self._extractParameters(value.route,route));
                        f = false;
                    }
                });

                //如果当前route没有在route 中，则将其重定向到默认route中。
                //替换会出现一个问题，就是当前路由后续路由都会被替换。造成无法回退上以前的历史记录
                //如果使用location.hash，则会出现后退按钮会一直无效
                f && opts.trigger ? options.defaultRoute && location.replace(self.updateHash(location.href,options.defaultRoute)) 
                  : opts.updateHash && self._updateHash(route, opts.replace);
            }
            return self;
        };

        this._updateHash = function(route, replace) {
            var url = this.updateHash(location.href,route);
            
            if(this._event == "popstate"){
                history[replace ? 'replaceState' : 'pushState']({}, document.title, url);
            }else{
                if (replace) {
                    location.replace(url);
                } else {
                    // Some browsers require that `hash` contains a leading #.
                    location.hash = '#' + route;
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
                    return !(callback && _.isFunction(callback) ? value.route.test(route) && callback === value.callback : value.route.test(route));
                });
            }
            return this;
        };

    }).call(Router.prototype);

    return Router;        
}));
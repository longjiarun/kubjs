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
            if (history.replaceState) {
                this._event = "popstate";
            } else if ('onhashchange' in window) {
                this._event = "hashchange";
            } else{
                throw new Error("Sorrry,your browser is not supported.");
            }
            this._checkUrl = function(event){
                return self.navigate(self.getHash(event.target.location.hash));
            };
            this._event = "hashchange"
            window.addEventListener(this._event, this._checkUrl);

            self.navigate(self.getHash(location.href));
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
            var self = this, f = true;
            opts = _.extend({
                trigger:true,
                replace:false
            },opts||{});
            //1、解决重复执行问题
            //2、主要是解决不支持replaceState方法的浏览器
            if(this.currentRoute == route) return this;

            if(!this.options.beforeRouteChange || 
                this.currentRoute == void 0 || 
                this.options.beforeRouteChange.call(this,route) !== false){
                opts.trigger && _.each(this.routes,function(value){
                    if(value.route.test(route)){
                        value.callback.apply(self,self._extractParameters(value.route,route));
                        f = false;
                    }
                });
                f ? this.options.defaultRoute && (location.hash = "#"+this.options.defaultRoute) : 
                    self._updateHash(route, opts.replace);
            }
            self.currentRoute = route;
            return this;
        };

        this._updateHash = function(route, replace) {
            var url = location.href.replace(/#(.*)$/, "#"+route);
            
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
/**
 * # Kub.Monitor
 *
 * 解决页面js错误（例如 文件被劫持，文件加载出现错误等），检测到页面出现问题，然后重新加载页面。
 * 
 */
!(function(root, factory) {
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof module !== "undefined" && module.exports) {
        module.exports = factory(root);
    }else if (typeof define === "function") {
        define(function() {
            return Kub.Monitor = factory(root);
        });
    } else {
        Kub.Monitor = factory(root);
    }
}(this, function(root) {
    'use strict';

    /**
     * ## Monitor Constructor
     *
     * Monitor 类，全局只会初始化一个实例对象。第一次初始化以后，第二次会返回上一次初始化的实例。
     *
     * 使用方法：
     * ```js
     * new Kub.Monitor();
     * ```
     */
    function Monitor(opts){
        if(Monitor.prototype.instance) return Monitor.prototype.instance;
        Monitor.prototype.instance = this;
        
        var defaults = Monitor.prototype.defaults,options = {};
        if(opts){
            for(var name in defaults){
                if(defaults.hasOwnProperty(name)){
                    opts[name] == undefined ? options[name] = defaults[name] : options[name] = opts[name];
                }
            }
        }else{
            options = defaults;
        }
        this.options = options;
        this._init();
    }

    Monitor.prototype = {
        constructor:Monitor,

        /**
         * ## defaults
         *
         * `defaults`默认配置项。
         *
         * 配置项说明：
         * 
         * * `waitTime`: 延迟刷新时间。立即刷新可能会出现依旧被劫持问题。
         * 
         * * `safeDomains`: 安全域名。
         * 
         * * `validateVar`: 验证变量是否存在。
         */
        
        defaults: {
            waitTime: 500,
            safeDomains: ['koudai.com', 'vdian.com', 'weidian.com', '10.1.22.40'],
            validateVar: function() {
                return !!((root.Zepto || root.jQuery) && root.requirejs && root._paq);
            }
        },
        _init: function() {
            var self = this;
            //如果未被验证过
            if (self.isValidate()) {
                var _handleError = function() {
                        //先执行
                        //如果全局变量未必初始化而且包含有外部域名的js
                        if (self && !self.isError && (!self.validateVar() || !self.validateScript())) {
                            //记录下有错误，但现在不做处理，有可能出现的错误，并不影响页面运行 或者出现的问题是由于js加载未完成
                            self.isError = true;
                        }
                    },
                    _handleDOMContentLoaded = function() {
                        if (self && self.isError && (!self.validateVar() || !self.validateScript())) {
                            //ready以后再次进行检测，是否存在错误
                            self.refresh();
                            self.isError = false;
                        }
                    },
                    _handleLoad = function() {  
                        if (self && self.isError && (!self.validateVar() || !self.validateScript())) {
                            //onload 以后再次进行检测，是否存在错误
                            self.refresh();
                            self.isError = false;
                        }
                        //后执行
                        
                        setTimeout(function() {
                            root.reportError = null;
                            //不进行处理,有可能其他js会注册该事件
                            root.onerror=null;
                            root.onload=null;
                        }, self.options.waitTime + 50);
                    };

                //onerror 无法监听到iframe中的错误 无论是同域还是不同域
                //同域js可以监听到错误,包含具体的文件与错误信息，虽然不同域或者父子域（lj.koudai.com与hd.koudai.com 可以监听到错误，但无法监听到具体文件与错误信息
                //http://www.baidufe.com/item/7ee009bfbcd0fe94bd3e.html
                //每次js错误都会触发到onerror事件
                root.onerror = _handleError;
                root.onload = _handleLoad;
                self.ready(function() {
                    _handleDOMContentLoaded();
                });
            }
        },
        ready: function(callback) {
            //ie9+支持
            if (callback && typeof callback === "function") {
                if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
                    callback();
                } else if (document.addEventListener) {
                    // DOMContentLoaded 有可能会执行两次，几率很小，出现两次后页面会出现js 无法运行问题
                    document.addEventListener('DOMContentLoaded', callback, false);
                } else {
                    //兼容ie9以下，其他不支持 DOMContentLoaded 浏览器
                    root.onload = callback;
                }
            }
        },
        //决定此页面是否做验证，如果验证过一次则不再进行处理
        isValidate: function() {
            return root.location.href.indexOf("_r=1") != -1 ? false : true;
        },

        /**
         * ## refresh
         * 
         * 刷新页面，给页面加上
         * 
         */
        refresh: function() {
            var self = this,
                href = root.location.href,
                hash = root.location.hash;
            //移除hash
            href = href.replace(new RegExp((hash ? hash : "#") + "$"), "");
            //将_r=1 参数添加到地址后
            href.indexOf("?") != -1 ? (href += "&_r=1") : (href += "?_r=1")
            //由于文件劫持立即刷新依旧会被劫持，所以有一个延迟时间
            setTimeout(function() {
                root.location.replace(href + hash);
            }, self.options.waitTime);
        },

        /**
         * ## validateVar
         * 
         * 验证变量是否存在 根据项目情况进行修改
         * 
         * @return {Boolean} 错误 false 正确 true
         */
        validateVar: function() {
            return this.options.validateVar ? this.options.validateVar.call(this) : true;
        },

        /**
         * ## isSafeDomain
         *
         * 是否在安全的域名内
         * 
         * @param {String}  src url地址
         * @return {Boolean} true：在安全域名内 false：不在完全域名内
         */
        isSafeDomain: function(src) {
            var self = this;
            for (var i = 0, j = self.options.safeDomains.length; i < j; i++) {

                //if (src.indexOf(self.options.safeDomains[i]) != -1) {
                if ((new RegExp("http.*"+self.options.safeDomains[i],"gi")).test(src)) {
                    return true;
                }
            }
            return false;
        },

        /**
         * ## validateScript
         * 
         * 验证script是否包含外部文件
         * 
         * @return {Boolean} 错误 false 正确 true
         */
        validateScript: function() {
            var self = this,
                scripts = document.getElementsByTagName("script"),
                length = scripts.length;
            for (var i = 0; i < length; i++) {
                if (scripts[i].src && /^[http|https]/.test(scripts[i].src) && !self.isSafeDomain(scripts[i].src)) {
                    return false;
                }
            }
            return true;
        }
    };

    return Monitor;
}));
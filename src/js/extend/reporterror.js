
/*
解决页面js错误（例如 文件被劫持，文件加载出现错误等），检测到页面出现问题，默认等待1500ms会重刷页面
safeDomain： 安全域名，根据需求进行改变
waitTime:    延迟刷新时间

validateVar：验证变量是否存在，同样根据需求进行改变
使用方法：
建议放在head标签内
<script type="text/javascript" src="../../common/js/lib/reporterror.js"></script>
<script type="text/javascript">
    //some settings
    !window.reportError && (function(){
        var script = document.createElement('script'), head = document.getElementsByTagName('head')[0];
        script.type='text/javascript';
        script.defer=true;
        script.async=true;
        script.src='js/lib/reporterror.js';
        head.appendChild(script);
    })();
</script>
*/
!(function(root, factory) {
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof define === "function") {
        //加上模块名称，防止在require,加载完毕以后加载该js,出现的错误
        define("reporterror",function() {
            return Kub.reportError = factory(root);
        });
    } else {
        Kub.reportError = factory(root);
    }
}(this, function(root) {
    'use strict';
    function ReportError(){
        this.options = ReportError.prototype.defaults;

        this._init();
    }

    ReportError.prototype = {
        constructor:ReportError,
        defaults: {
            waitTime: 500,
            safeDomain: ['koudai.com', 'vdian.com', 'weidian.com', '10.1.22.40']
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
        //刷新页面
        refresh: function() {
            var self = this,
                href = root.location.href,
                hash = root.location.hash;
            //移除hash
            href = href.replace(new RegExp((hash ? hash : "#") + "$"), "");
            //将_r=1 参数添加到地址后
            href.indexOf("?") != -1 ? (href += "&_r=1") : (href += "?_r=1")
            setTimeout(function() {
                root.location.replace(href + hash);
            }, self.options.waitTime);
        },
        //验证变量
        //错误：false
        validateVar: function() {
            return !!((root.Zepto || root.jQuery) && root.requirejs && root._paq);
        },
        //是否在安全的域名内
        isSafeDomain: function(src) {
            var self = this;
            for (var i = 0, j = self.options.safeDomain.length; i < j; i++) {

                //if (src.indexOf(self.options.safeDomain[i]) != -1) {
                if ((new RegExp("http.*"+self.options.safeDomain[i],"gi")).test(src)) {
                    return true;
                }
            }
            return false;
        },
        //验证script是否包含外部文件
        //错误：false
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

    return new ReportError();
}));
/**
 * # Kub.core
 *
 * kubjs 核心模块，该模块只提供最基础的方法。
 */
!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if(typeof define === "function"){
        define(function(){
            return Kub.core = factory(root);
        });
    }else if (typeof exports !== 'undefined') {
        module.exports = factory(root);
    } else{
        Kub.core = factory(root);
    }
}(this,function(root){

     /**
     * ## Core Constructor
     *
     * Core 类，对外提供的是实例化的对象。
     *
     * 使用方法：
     * ```js
     * //获取url参数
     * var params = Kub.core.getParams();
     * 
     * ```
     */
    var Core = function(){
        
    };
    var toString = Object.prototype.toString;

    ;(function(){
        var proto = this,ua = navigator.userAgent,os;
        this.constructor = Core;

        
        var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
            ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
            ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
            iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
            wp = ua.match(/Windows Phone ([\d.]+)/),
            os = {};
        if (android) os.android = true, os.version = android[2];
        if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
        if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
        if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
        if (wp) os.wp = true, os.version = wp[1];

        os.phone = os.android && /mobile/i.test(ua) || os.iphone || os.wp ? true : false;
        os.tablet = !os.phone && ( os.android || os.ipad || /window/i.test(ua) && /touch/i.test(ua) ) ? true : false;
        os.mobile = os.phone || os.tablet;

        /**
         * ##os
         * 
         * 检测系统类型与版本，包含系统类型与版本信息
         *
         * 只检测Android 与 IOS, window phone（window phone 未进行完全测试）
         */
        this.os = os;

        this.extend = function(target,source){
            var deep,args = Array.prototype.slice.call(arguments,1),length;
            if(typeof target === "boolean"){
                deep = target;
                target = args.shift();
            }
            length = args.length;
            for(var i=0;i<length;i++){
                source = args[i];
                for(var key in source){
                    if(source.hasOwnProperty(key)){
                        if(deep && (this.isArray(source[key]) || this.isObject(source[key]) )){
                            if(this.isArray(source[key]) && !this.isArray(target[key])){
                                target[key]=[];
                            }
                            if(this.isObject(source[key]) && !this.isObject(target[key])){
                                target[key]={};
                            }
                            this.extend(target[key],source[key],deep);
                        }else{
                            (source[key] !== undefined )&& (target[key] = source[key]);
                        }
                    }
                }
            }
            return target;
        };

        ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'].forEach(function(name) {
            proto['is' + name] = function(obj) {
                return toString.call(obj) === '[object ' + name + ']';
            };
        });

        //function also is object
        this.isObject = function(obj){
            return toString.call(obj) === "[object Function]" || toString.call(obj) === "[object Object]";
        };

        /**
         * ## inherit
         *
         * 类的继承
         * 
         * @param {Class} c 子类
         * @param {Class} p 父类
         */
        this.inherit = function(c,p){
            var F = function(){};
            F.prototype = p.prototype;
            c.prototype = new F();
            c.prototype.constructor = c;
            c.uber = p.prototype;
        };

        /**
         * ## htmlToText
         * 
         * 将html转换为text
         * 
         * @param {String} value html
         * @return {String} 处理以后的文本
         */
        this.htmlToText = function(value){
            //.replace(/&nbsp;|&#160;/gi, '')
            return value.replace(/<.[^<>]*?>/g, '').replace(/[\n\r\t]/g,"");
        };

        this.getOriginUrl = function(url){
            var matchs;
            url = url || window.location.href;
            return url && (matchs = url.match(/(^[^\?#]*)/) ) && matchs[1];
        };

        /**
         * ## getParamsString
         *
         * 获取 params string
         * @param {String} url url地址，未传值取 `window.location.href`。
         * @return {String} params string
         */
        this.getParamsString = function(url){
            var matchs;
            url = url || window.location.href;
            return url && (matchs = url.match(/^[^\?#]*\?([^#]*)/) ) && matchs[1];
        };

        /**
         * ## setParams
         *
         * 设置 url 参数，如果 url 未传值，则默认取 `window.location.href` 的值。
         *
         * 使用：
         * ```js
         * 
         * //设置当前地址参数
         * 
         * //默认采用`window.location.href`
         * Kub.core.setParams({
         *     name:"kubjs"
         * });
         *
         * //传入url
         * Kub.core.setParams("http://www.weidian.com?userId=123",{
         *     name:"kubjs"
         * });
         * 
         * //追加参数
         * 
         * //如果不存在名称为 name 的参数，则新增参数。如果存在则替换其值
         * Kub.core.setParams({
         *     name:"kubjs"
         * },true);
         * 
         * ```
         * 
         * @param {String} url    url
         * @param {Object} params 参数对象
         * @param {Boolean} add   是否追加参数。true：如果 url 不存在当前参数名称，则追加一个参数。false：不追加，只进行替换
         */
        this.setParams = function(url,params,add){
            //验证url是否传值，如果 url 未传值，则使用当前页面 url
            if(this.isObject(url)){
                add = params;
                params = url;
                url = window.location.href;
            }

            var queryString = this.getParamsString(url), _queryString = queryString || "", f,i=0;
            
            function get(name){
                return params[name] == void 0 ? name : name + "="+ params[name];
            }

            for(var name in params){
                if(params.hasOwnProperty(name)){
                    f= false;
                    i++;
                    //替换原来的参数
                    _queryString = _queryString.replace(new RegExp( name + "(=([^&#]*))?","g"),function(a,b,c){
                        f = true;
                        return get(name);
                    });
                    //如果没有当前参数，则新增参数
                    add && !f && (_queryString += (i == 0 ? "" : "&") + get(name));
                }
            }

            return queryString ? url.replace(queryString , _queryString) : url.replace(/^[^#]*/ , function(url,hash){
                return url + (_queryString ? "?" + _queryString : _queryString);
            });
        };

        /**
         * ## getParams
         *
         * 获取url中的参数。
         * 
         * 设置 url 参数，如果 url 未传值，则默认取 `window.location.href`。
         * 
         * @param {String} url url地址，未传值取 `window.location.href`。
         * @return {Object} 返回参数对象
         */
        this.getParams = function(url){
            if(!url) url=window.location.href;
            var params={}, queryString = this.getParamsString(url);
            
            queryString && queryString.replace(/([^=&]+)(=([^&#]*))?/g,function(a,name,c,value){
                params[name] = value;
            });

            return params;
        };

    }).call(Core.prototype);

    return new Core();
}));
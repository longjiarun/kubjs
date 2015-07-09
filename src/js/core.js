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
    var Core = function(){
        if(Core.prototype.instance && Core.prototype.instance instanceof Core){
            return Core.prototype.instance;
        }
    };
    var toString = Object.prototype.toString;

    ;(function(){
        var proto = this,ua = navigator.userAgent,os;
        this.constructor = Core;

        //设备检测,只检测Android 与 IOS, window phone（window phone 未进行完全测试）
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

        os.mobile = os.android && /mobile/i.test(ua) || os.iphone || os.wp ? true : false;
        os.tablet = !os.mobile && ( os.android || os.ipad || /window/i.test(ua) && /touch/i.test(ua) ) ? true : false;
        
        this.os = os;

        // extend function like $.extend()
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

        this.inherit = function(c,p){
            var F = function(){};
            F.prototype = p.prototype;
            c.prototype = new F();
            c.prototype.constructor = c;
            c.uber = p.prototype;
        };

        this.htmlToText = function(value){
            //.replace(/&nbsp;|&#160;/gi, '')
            return value.replace(/<.[^<>]*?>/g, '').replace(/\s/g,"");
        };

        this.getOriginUrl = function(url){
            var matchs;
            return url && (matchs = url.match(/(^[^\?#]*)/) ) && matchs[1];
        };

        this.getParamsString = function(url){
            var matchs;
            return url && (matchs = url.match(/^[^\?#]*\?([^#]*)/) ) && matchs[1];
        };

        this.setParams = function(url,params,add){
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

        this.getParams = function(url){
            if(!url) url=window.location.href;
            var params={}, queryString = this.getParamsString(url);
            
            queryString && queryString.replace(/([^=&]+)(=([^&#]*))?/g,function(a,name,c,value){
                params[name] = value;
            });

            return params;
        };

    }).call(Core.prototype);

    return (Core.prototype.instance = new Core());
}));
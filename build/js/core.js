!(function(root,factory){
    if(typeof define === "function"){
        define(function(){
            return root.core = factory(root);
        });
    }else if (typeof exports !== 'undefined') {
        exports = factory(root);
    } else{
        root.core = factory(root);
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
        os.tablet = !os.mobile && ( os.android || os.ios || /window/i.test(ua) && /phone/i.test(ua) ) ? true : false;
        
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
            return value.replace(/<.[^<>]*?>/g, '').replace(/&nbsp;|&#160;/gi, '').replace(/\s/g,"");
        };
        
        this.getUrlWithParams = function(url,params){
            var flag=false;
            if(params){
                if(url.indexOf("?")===-1){
                    url+="?";
                    flag=true;
                }
                var i=0;        
                for(var p in params){
                    if(flag&&i==0){             
                    }else{
                        url+="&";               
                    }
                    url+=p+"="+params[p]; 
                    i++;
                }
            }
            return url;
        };
        
        this.getUrlWithoutParams = function(url){
            if(!url){
                url=window.location.href;
            }
            var i=url.indexOf("?");
            if(i!==-1){
                return url.substr(0,i);
            }
            return url;
        };

        this.getParamsOfUrl = function(url){
            if(!url){
                url=window.location.href;
            }
            var params={},str=url.substr(url.indexOf("?")+1),
            str_ary=str.split("&");
            for(var i=str_ary.length-1;i>=0;i--){
                var param=str_ary[i].split("=");
                params[param[0]]=param[1];
            }
            return params;
        };

    }).call(Core.prototype);

    return (Core.prototype.instance = new Core());
}));
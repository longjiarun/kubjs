
!(function(root,factory){
    if(typeof define === "function"){
        define(function(){
            return factory(root);
        });
    }else if (typeof exports !== 'undefined') {
        exports = factory(root);
    } else{
        root.Core = factory(root);
    }
}(this,function(root){
    var Core = function(){
        if(Core.prototype.instance && Core.prototype.instance instanceof Core){
            return Core.prototype.instance;
        }
    };
    var toString = Object.prototype.toString;

    ;(function(){
        this.constructor = Core;

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

        this.isArray = Array.isArray || function(obj){
            return toString.call(obj) === "[object Array]";
        };

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

        this.stripHtml = function(value) {
            // remove html tags and space chars
            return value.replace(/<.[^<>]*?>/g, '').replace(/&nbsp;|&#160;/gi, '')
            // remove punctuation
            .replace(/[.(),;:!?%#$'"_+=\/-]*/g,'');
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
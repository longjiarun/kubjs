!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof define === "function") {
        define(function() {
            return Kub.validate = factory(root,root._);
        });
    }else if (typeof exports !== 'undefined') {
        module.exports = factory(root, require('underscore'));
    }else {
        Kub.validate = factory(root,root._);
    }
}(this,function(root,_){
    function Validate(){

    }
    
    Validate.prototype={
        constructor : Validate,
        isEmail : function(value){
            return !!(value && /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(value));
        },
        isQQ:function(value){
            return (new RegExp(/^[1-9]\d{4,}$/).test(value));
        },
        isIdcard:function(value){
            return (new RegExp(/^\d{15}(\d{2}[A-Za-z0-9])?$/).test(value));
        },
        isChinese:function(value){
            return (new RegExp(/^[\u0391-\uFFE5]+$/).test(value));
        },
        isIp:function(value){
            return (new RegExp(/^([1-9]\d{0,2}){1}\.([1-9]\d{0,2}){1}\.([1-9]\d{0,2}){1}$/).test(value));
        },
        isTelphone:function(value) {
            return (new RegExp(/(^([0-9]{3,4}[-])?\d{3,8}(-\d{1,6})?$)|(^\([0-9]{3,4}\)\d{3,8}(\(\d{1,6}\))?$)|(^\d{7,8}$)/).test(value));
        },
        isMobilephone:function(value){
            return (new RegExp(/^\d{11}$/).test(value));
        },
        isPhone:function(value){
            return (new RegExp(/(^([0-9]{3,4}[-])?\d{3,8}(-\d{1,6})?$)|(^\([0-9]{3,4}\)\d{3,8}(\(\d{1,6}\))?$)|(^\d{7,8}$)|(^\d{11}$)/).test(value));
        },
        isUrl:function(value){
            return (new RegExp(/^[a-zA-z]+:\/\/([a-zA-Z0-9\-\.]+)([-\w .\/?%&=:]*)$/).test(value));
        },
        isExternalUrl:function(value){
            return value.isUrl() && value.indexOf("://"+document.domain) == -1;
        },
        isInteger:function(value){
            return (new RegExp(/^-?\d+$/).test(value));
        },
        isPositiveInteger:function(value){
            return (new RegExp(/^[1-9]\d*$/).test(value));
        },
        isNegativeInteger:function(value){
            return (new RegExp(/^-[1-9]\d*$/).test(value));
        },
        isNumber:function(value) {
            return (new RegExp(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/).test(value));
        },
        isNegativeNumber:function(value){
            return value.isNumber()&&(value<0);
        },
        isPositiveNumber:function(value){
            return value.isNumber()&&(value>0);
        }
    };
    return new Validate();      
}));
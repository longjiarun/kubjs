/**
 * # Kub.validate
 *
 * 验证
 */
!(function(factory){
    var root =this,Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof module !== "undefined" && module.exports) {
        module.exports = factory(root, root._);
    }else if (typeof define === "function") {
        define(function() {
            return Kub.validate = factory(root,root._);
        });
    } else {
        Kub.validate = factory(root,root._);
    }
}(function(root,_){

    /**
     * ## Validate Constructor
     *
     * Validate 类，返回为实例化后的对象。
     *
     * 使用方法：
     * ```js
     * //验证是否为Email
     * Kub.validate.isEmail("weidian.com");
     *
     * ```
     */
    function Validate(){

    }
    
    Validate.prototype={
        constructor : Validate,

        /**
         * ## isEmail
         * 验证邮件
         */
        isEmail : function(value){
            return !!(value && /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(value));
        },

        /**
         * ## isQQ
         * 验证QQ
         */
        isQQ:function(value){
            return (new RegExp(/^[1-9]\d{4,}$/).test(value));
        },
        
        /**
         * ## isIdcard
         * 验证身份证号码
         */
        isIdcard:function(value){
            return (new RegExp(/^\d{15}(\d{2}[A-Za-z0-9])?$/).test(value));
        },
        
        /**
         * ## isChinese
         * 验证中文
         */
        isChinese:function(value){
            return (new RegExp(/^[\u0391-\uFFE5]+$/).test(value));
        },
        
        /**
         * ## isIp
         * 验证Ip
         */
        isIp:function(value){
            return (new RegExp(/^([1-9]\d{0,2}){1}\.([1-9]\d{0,2}){1}\.([1-9]\d{0,2}){1}$/).test(value));
        },
        
        /**
         * ## isTelphone
         * 验证电话号码
         */
        isTelphone:function(value) {
            return (new RegExp(/(^([0-9]{3,4}[-])?\d{3,8}(-\d{1,6})?$)|(^\([0-9]{3,4}\)\d{3,8}(\(\d{1,6}\))?$)|(^\d{7,8}$)/).test(value));
        },
        
        /**
         * ## isMobilephone
         * 验证手机号码
         */
        isMobilephone:function(value){
            return (new RegExp(/^\d{11}$/).test(value));
        },
        
        /**
         * ## isPhone
         * 验证是否是电话号码或者手机号码
         */
        isPhone:function(value){
            return this.isTelphone(value) || this.isMobilephone(value);
        },
        
        /**
         * ## isUrl
         * 验证url地址
         */
        isUrl:function(value){
            return (new RegExp(/^[a-zA-z]+:\/\/([a-zA-Z0-9\-\.]+)([-\w .\/?%&=:]*)$/).test(value));
        },
        
        /**
         * ## isExternalUrl
         * 验证外部url
         */
        isExternalUrl:function(value){
            return value.isUrl() && value.indexOf("://"+document.domain) == -1;
        },
        
        /**
         * ## isInteger
         * 验证整数
         */
        isInteger:function(value){
            return (new RegExp(/^-?\d+$/).test(value));
        },
        
        /**
         * ## isEmail
         * 验证正整数
         */
        isPositiveInteger:function(value){
            return (new RegExp(/^[1-9]\d*$/).test(value));
        },
        
        /**
         * ## isNegativeInteger
         * 验证负整数
         */
        isNegativeInteger:function(value){
            return (new RegExp(/^-[1-9]\d*$/).test(value));
        },
        
        /**
         * ## isNumber
         * 验证数字
         */
        isNumber:function(value) {
            return (new RegExp(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/).test(value));
        },
        
        /**
         * ## isNegativeNumber
         * 验证负数
         */
        isNegativeNumber:function(value){
            return value.isNumber()&&(value<0);
        },
        
        /**
         * ## isPositiveNumber
         * 验证正数
         */
        isPositiveNumber:function(value){
            return value.isNumber()&&(value>0);
        }
    };
    return new Validate();      
}));
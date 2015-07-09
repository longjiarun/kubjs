//copy fromt zepto.cookie.js
//将 expires 单位改为毫秒
!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof define === "function") {
        define(function() {
            return Kub.cookie = factory(root);
        });
    }else {
        Kub.cookie = factory(root);
    }
}(this,function(root){
    return function (key, value, options) {
        var days, time, result, decode;

        options = options || {};

        if(!options.hasOwnProperty('path')){
            options.path = '/';
        }

        // A key and value were given. Set cookie.
        if (arguments.length > 1 && String(value) !== "[object Object]") {
            // Enforce object
            options = $.extend({}, options);

            if (value === null || value === undefined) options.expires = -1;

            if (typeof options.expires === 'number') {
                days = (options.expires);
                time = options.expires = new Date();

                time.setTime(time.getTime() + days)
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=',
                options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '',
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''))
        }

        // Key and possibly options given, get cookie
        options = value || {};

        decode = options.raw ? function (s) { return s } : decodeURIComponent;

        return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null
    }
}));

/**
 * # Kub.Geolocation
 *
 * 获取地址信息，推荐使用 `getAddress` 方法 与 `getAddressByIp`。
 * 
 * 由于地址信息接口数据不统一，目前暂时只包含了 `{country: "中国", province: "浙江", city: "杭州"}`。
 * 
 * 由于html5获取经纬度接口，会请求Google服务，在国内基本不行，使用时请注意。
 */
!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if(typeof define === "function"){
        define(function(){
            return Kub.Geolocation = factory(root,root.jQuery || root.Zepto,Kub.cookie);
        });
    }else{
        Kub.Geolocation = factory(root,root.jQuery || root.Zepto,Kub.cookie);
    }
}(this,function(root,$,cookie){

    /**
     * ## Geolocation Constructor
     *
     * Geolocation类，全局只会初始化一个实例对象。第一次初始化以后，第二次会返回上一次初始化的实例
     *
     * 使用方法：
     * ```js
     * var geolocation = new Kub.Geolocation();
     *
     * geolocation.getAddress(function(address){
     *     console.log(address);
     * });
     * ```
     */
    function Geolocation(options){
        if(Geolocation.prototype.instance) return Geolocation.prototype.instance;
        Geolocation.prototype.instance = this;
        
        this.options = $.extend({},options,Geolocation.prototype.defaults);
    }

    Geolocation.prototype={
        constructor:Geolocation,

        /**
         * ## defaults
         *
         * `Geolocation`默认配置项。
         *
         * 配置项说明：
         * 
         * * `ipUrl`: 通过ip获取位置的接口。
         * 
         * * `positionUrl`: 通过经纬度获取位置的接口
         * 
         * * `expires`: 一天，单位：毫秒。位置cookie 超时时间
         *
         * * `cookieName`: 设置cookie的名称
         * 
         * * `enableHighAcuracy`: 指示浏览器获取高精度的位置，默认为false
         * 
         * * `timeout`: 单位为毫秒 指定获取地理位置的超时时间，默认不限时，单位为毫秒
         * 
         * * `geoWaitTime`: 单位为毫秒  指定 geo 等待超时时间
         * 
         * * `maximumAge`: 一天 单位为毫秒 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
         */
        defaults:{
            ipUrl:"http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js", 
            positionUrl:"http://activity.koudai.com/utils/getAddress",
            expires:86400000, 
            cookieName:"geo",
            enableHighAcuracy: false,
            timeout: 4000,
            geoWaitTime :5000, 
            maximumAge: 86400000 
        },
        log:function(){
            console && console.log && console.log.apply(root.console,arguments);
        },
        format : function(info){
            var address;
            if(info){
                address={};
                address.country = info.country;
                address.province = info.province;
                address.city=info.city;
            }
            return address;
        },

        /**
         * ## removeStoredAddress
         *
         * 移除缓存到cookie中的地理信息
         * 
         * @return {[type]} [description]
         */
        removeStoredAddress:function(){
            var self = this,options = self.options;

            cookie(options.cookieName,null,{
                expires:-1
            });
            return self;
        },

        /**
         * ## storeAddress
         *
         * 缓存地理信息到cookie中
         * 
         * @param {Object} address 地理信息
         * @return {instance} 当前实例
         */
        storeAddress : function(address){
            var self = this,options = self.options,
                address = address && JSON.stringify(address);

            address && cookie(options.cookieName,address,{
                expires:options.expires 
            });
            return self;
        },

        /**
         * ## getStoredAddress
         *
         * 返回缓存到cookie中的地址信息
         * 
         * @return {Object} 地址信息
         */
        getStoredAddress : function(){
            var self = this,options = self.options,
                address = cookie(options.cookieName);

            address = address && JSON.parse(address);

            return address;
        },

        /**
         * ## getCurrentPosition
         * 
         * 通过HTML5获取地址经纬度信息
         * 
         * @param {Function} success  获取成功以后回调，返回HTML5默认的position属性
         * @param {Function} _error   失败以后回调
         * @return {instance} 当前实例
         */
        getCurrentPosition:function(success,_error,_options){
            var self=this,options=self.options,settings,error;

            //如果success  未传递，则返回
            if(!success || success && $.type(success) !== "function"){
                return;
            }

            //参数转换
            if(_error && typeof _error == "object"){
                settings = _error;
            }else{
                error = _error;
                settings = _options;
            }
            
            //与默认参数进行合并处理
            settings = $.extend({
                // 指示浏览器获取高精度的位置，默认为false
                enableHighAcuracy: options.enableHighAcuracy,
                // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
                timeout: options.timeout,
                // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
                maximumAge: options.maximumAge
            },settings||{});

            error = error || function(error){
                switch (error.code) {
                    case error.TIMEOUT:
                        self.log("A timeout occured! Please try again!");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        self.log('We can\'t detect your location. Sorry!');
                        break;
                    case error.PERMISSION_DENIED:
                        self.log('Please allow geolocation access for this to work.');
                        break;
                    case error.UNKNOWN_ERROR:
                        self.log('An unknown error occured!');
                        break;
                }
            };

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success,error,settings);
            }else{
                self.log("Your browser does not support Geolocation!");
                error && error();
            }

            return self;
        },
        /**
         * ## getAddress
         * 
         * 首先通过经纬度获取位置信息，经纬度出现问题。紧接着使用Ip获取地址位置
         * 
         * @param {Function} callback 成功以后回调，返回address对象
         * @param {Function}   error 失败以后回调，超时也会触发该回调
         * @return {instance} 当前实例
         */
        getAddress : function(callback,error){
            var self=this,options = self.options,city,timer,flag,address;

            //计算是否缓存了数据
            address = self.getStoredAddress();
            if(address){
                callback && callback(address);
                return self;
            }

            //如果 getAddressByPosition 一直没有响应，则通过 getAddressByIp 获取地理信息
            self.getAddressByPosition(callback,function(){
                self.getAddressByIp(callback,error);
            });

            return self;
        },

        /**
         * ## getAddressByPosition
         * 
         * 通过经纬度获取位置信息
         * 
         * @param {Function} callback 成功以后回调，参数为address对象
         * @param {Function}   error 失败以后回调，超时也会触发该回调
         * @return {instance} 当前实例
         */
        getAddressByPosition : function(callback,error){
            var self=this,options=self.options,address,timer,flag;

            //计算是否缓存了数据
            address = self.getStoredAddress();
            if(address){
                callback && callback(address);
                return self;
            }

            //设置定时器，如果geo 超过指定时间则强制执行error
            timer = options.geoWaitTime &&  setTimeout(function(){
                flag =true;
                error && error();
            },options.geoWaitTime);

            //通过经度纬度获取城市
            //浏览器会提示用户开启定位权限，如果用户一直未操作，则success与error都不会触发
            self.getCurrentPosition(function(position){
                if(flag){
                    return;
                }
                timer && clearTimeout(timer);

                var coords = position.coords;
                $.ajax({
                    url:options.positionUrl,
                    type:"get",
                    data:{
                        lat:coords.latitude,
                        lng:coords.longitude
                    },
                    dataType:"jsonp",
                    success:function(data){
                        
                        if(data && data.result && data.result.status == "ok"){

                            self.storeAddress((address = self.format(data.result)));

                            callback && callback(address);
                        }else{
                            error && error();
                        }
                    },
                    error:error
                })
            },function(){
                if(flag){
                    return;
                }
                timer && clearTimeout(timer);
                //将错误消息传递出去
                error && error();

                //解决浏览器 getCurrentPosition error回调会重复执行一次问题
                error = null;
            });
            return self;
        },

        /**
         * ## getAddressByIp
         * 
         * 通过第三方Ip接口获取城市信息
         * @param {Function}   callback 成功以后回调，参数为address对象
         * @param {Function}   error    失败以后回调
         * @return {instance} 当前实例
         */
        getAddressByIp:function(callback,error){
            var self=this,options=self.options,address,
                handler = function(){
                    address = root.remote_ip_info && self.format(root.remote_ip_info);
                    if(address){
                        address && self.storeAddress(address);
                        callback && callback(address);
                    }else{
                        error && error();
                    }
                };

            //计算是否缓存了数据
            address = self.getStoredAddress();
            if(address){
                callback && callback(address);
                return self;
            }

            //请求远程IP地址查询接口
            $.ajax({
                url:options.ipUrl,
                type:"get",
                dataType:"jsonp",
                success:handler,
                error:handler
            });
            return self;
        }
    }
    return Geolocation;
}));
/**
 * # os
 *
 * 检测系统类型与版本，包含系统类型与版本信息。
 *
 * 只检测Android 与 IOS, window phone（window phone 未进行完全测试）
 *
 * `os` 返回以下相关属性：
 *
 * `android` ：是否是Android
 *
 * `ios` ：是否是IOS系统
 *
 * `ipad` ：是否是iPad
 *
 * `iphone` ：是否是iPhone
 *
 * `ipod` ：是否是iPod
 *
 * `mobile` ：是否是移动端
 *
 * `phone` ：是否是手机
 *
 * `tablet` ：是否是平板
 *
 * `version` ：系统版本
 *
 * `wp` ： 是否是window phone
 *
 */

var ua = navigator.userAgent,
    android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
    ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
    ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
    iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
    wp = ua.match(/Windows Phone ([\d.]+)/),
    os = {}

//android
android ? (os.android = true, os.version = android[2]) : (os.android = false)

//iphone
iphone && !ipod ? ( os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.') ) : (os.iphone  = false)

//ipad
ipad ? ( os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.') ) : (os.ipad  = false)

//ipod
ipod ? ( os.ios = os.ipod = true, os.version = ipod[3].replace(/_/g, '.') ) : (os.ipod = false)

//window phone
wp ? ( os.wp = true, os.version = wp[1]) : (os.wp = false)

//ios
!os.iphone && !os.ipad && !os.ipod && (os.ios = false)

//手机
os.phone = os.android && /mobile/i.test(ua) || os.iphone || os.wp ? true : false

//平板
os.tablet = !os.phone && ( os.android || os.ipad || /window/i.test(ua) && /touch/i.test(ua) ) ? true : false

//移动端
os.mobile = os.phone || os.tablet

module.exports = os

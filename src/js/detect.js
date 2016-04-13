let ua = navigator.userAgent,
    android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
    ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
    ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
    iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
    wp = ua.match(/Windows Phone ([\d.]+)/),
    os = {};

//android
android ? (os.android = true, os.version = android[2]) : (os.android = false);

//iphone
iphone && !ipod ? ( os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.') ) : (os.iphone  = false);

//ipad
ipad ? ( os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.') ) : (os.ipad  = false);

//ipod
ipod ? ( os.ios = os.ipod = true, os.version = ipod[3].replace(/_/g, '.') ) : (os.ipod = false);

//window phone
wp ? ( os.wp = true, os.version = wp[1]) : (os.wp = false);

!os.iphone && !os.ipad && !os.ipod && (os.ios = false);

os.phone = os.android && /mobile/i.test(ua) || os.iphone || os.wp ? true : false;
os.tablet = !os.phone && ( os.android || os.ipad || /window/i.test(ua) && /touch/i.test(ua) ) ? true : false;
os.mobile = os.phone || os.tablet;

export default os;

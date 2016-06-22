/**
 * # Touch
 *
 * debug 版本，注释暂时未添加
 */

require('./polyfill')

var MOBILE_REGEXP = /mobile|tablet|ip(ad|hone|od)|android/i

var _window = window,
    isTouch = 'ontouchstart' in _window && MOBILE_REGEXP.test(navigator.userAgent)

var EVENTS_METHODS = [
    'preventDefault',
    'stopImmediatePropagation',
    'stopPropagation'
]

var SWIPE_TIMEOUT = 300,
    SWIPE_THRESHOLD = 10,
    SWIPER_VELOCITY = 0.25,

    TAP_DELAY = 50,
    TAP_TIMEOUT = 180,
    TAP_THRESHOLD = 9,

    LONGTAP_TIMEOUT = 500,

    START_EVENT = isTouch ? 'touchstart' : 'mousedown',
    MOVE_EVENT = isTouch ? 'touchmove' : 'mousemove',
    END_EVENT = isTouch ? 'touchend' : 'mouseup',

    DIRECTIONS = ['up', 'right', 'down', 'left'],
    SWIPE_EVENT = 'swipe',

    PAN_START_EVENT = 'panstart',
    PAN_MOVE_EVENT = 'panmove',
    PAN_END_EVENT = 'panend',

    TAP_EVENT = 'tap',

    LONGTAP_EVENT = 'longtap'

var distance = function(p1, p2) {
    return Math.round(Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2)))
}

var angle = function(p1, p2) {
    var d = Math.abs(p2.x - p1.x)
    return Math.round(Math.acos(d / Math.sqrt(Math.pow(d, 2) + Math.pow(p2.y - p1.y, 2))) * 57.3)
}

var direction = function(p1, p2) {
    return (angle(p1, p2) > 45) ? ((p1.y < p2.y) ? 2 : 0) : ((p1.x < p2.x) ? 1 : 3)
}

// 如果触摸点位移大于 SWIPE_THRESHOLD 而且速度大于 SWIPER_VELOCITY
var matchSwipe = function(threshold, interval) {
    return threshold > SWIPE_THRESHOLD && threshold / interval > SWIPER_VELOCITY
}

// 如果触摸点位置大于 TAP_THRESHOLD 而且间隔时间小于 TAP_TIMEOUT
var matchTap = function(threshold, interval) {
    return threshold < TAP_THRESHOLD && interval < TAP_TIMEOUT
}

//获取触摸点
var getCoords = function(event) {
    var touches = event.touches,
        data = touches && touches.length ? touches : event.changedTouches

    return {
        x: isTouch ? data[0].pageX : event.pageX,
        y: isTouch ? data[0].pageY : event.pageY,
        e: isTouch ? data[0].target : event.target
    }
}

var getEventDetail = function(coords) {
    return {
        x: coords.x,
        y: coords.y
    }
}

var getThresholdAndInterval = function(p1,p2){
    return {
        threshold : distance(p1, p2),
        interval  : p2.t.getTime() - p1.t.getTime()
    }
}

var trigger = function(element, type, originalEvent, detail) {
    var event = new _window.CustomEvent(type, {
        detail: detail,
        bubbles: true,
        cancelable: true
    })

    event.originalEvent = originalEvent

    EVENTS_METHODS.forEach(function(name){
        event[name] = function(){
            originalEvent[name].apply(originalEvent,arguments)
        }
    })

    element.dispatchEvent(event)
}

var on = function(element, type, handler) {
    element.addEventListener(type, handler, false)
}

var clearTime = function(timer) {
    timer && clearTimeout(timer)
}

function Touch(element) {
    var startFlag = false,
        moveFlag = false,
        p1,
        p2,
        longTapTimer,
        tapTimer,
        cancelTap = false

    on(element, START_EVENT, function(event) {
        var coords = getCoords(event)
        p1 = coords
        p1.t = new Date()
        p2 = p1

        cancelTap = false

        //触发 longtap 事件
        isTouch && (longTapTimer = setTimeout(function() {
            trigger(coords.e, LONGTAP_EVENT, event)
        }, LONGTAP_TIMEOUT))

        startFlag = true
    })

    on(element, MOVE_EVENT, function(event) {
        if(!startFlag){
            return
        }

        var coords = getCoords(event), thresholdAndInterval

        p2 = coords
        p2.t = new Date()

        thresholdAndInterval = getThresholdAndInterval(p1,p2)

        // 如果触摸点不符合 tap 触发条件，则取消长按事件
        if(!cancelTap && !matchTap(thresholdAndInterval.threshold, thresholdAndInterval.interval)){
            clearTime(longTapTimer)
            cancelTap = true
        }

        //触发 panstart 事件
        !moveFlag && trigger(coords.e, PAN_START_EVENT, event, getEventDetail(coords))

        //触发 panmove 事件
        trigger(coords.e, PAN_MOVE_EVENT, event, getEventDetail(coords))

        moveFlag = true
    })

    on(element, END_EVENT, function(event) {
        // 取消 longtap 事件定时器
        clearTime(longTapTimer)

        var coords = getCoords(event), thresholdAndInterval

        p2 = coords
        p2.t = new Date()

        thresholdAndInterval = getThresholdAndInterval(p1,p2)

        if (matchSwipe(thresholdAndInterval.threshold, thresholdAndInterval.interval)) {

            //触发 swipe['up', 'right', 'down', 'left'] 事件
            trigger(coords.e, SWIPE_EVENT + DIRECTIONS[direction(p1, p2)], event)

        } else if (!cancelTap && matchTap(thresholdAndInterval.threshold, thresholdAndInterval.interval)) {

            // 取消 tap 事件定时器
            clearTime(tapTimer)
            isTouch && (tapTimer = setTimeout(function() {

                // 触发 tap 事件
                trigger(coords.e, TAP_EVENT, event)

            }, TAP_DELAY))
        }

        // 触发 panend 事件
        startFlag && moveFlag && trigger(coords.e, PAN_END_EVENT, event, getEventDetail(coords))

        startFlag = false
        moveFlag = false
    })
}

module.exports = Touch
/**
 * # Kub.Swiper
 *
 * 图片切换组件
 */

/**
 * ## Swiper Constructor
 *
 * `Swiper`类。
 *
 * 使用方法：
 * ```js
 *  new Kub.Swiper($swiperWrap.find('.swiper'),{
 *      auto:true,
 *      slideSelector:$swiperWrap.find('.slide'),
 *      slideActiveClass:'active',
 *      paginationSelector:$swiperWrap.find('.pagination li'),
 *      paginationActiveClass:'pagination-active',
 *      slide:function(index){
 *          //console.log('slide:'+index,this)
 *      }
 * })
 * ```
 */
var core = require('./core'),
    $ = require('./lite')

var $document = $(document),
    isTouch = core.os.mobile

var START_EVENT = isTouch ? 'touchstart' : 'mousedown',
    MOVE_EVENT = isTouch ? 'touchmove' : 'mousemove',
    END_EVENT = isTouch ? 'touchend' : 'mouseup',
    TRANSITIONEND_EVENT = 'transitionend',
    WEBKIT_TRANSITIONEND_EVENT = 'webkitTransitionEnd',
    HORIZONTAL = 'horizontal',
    //粘性
    VISCOSITY = 5

function Swiper(element, options) {

    this.options = core.extend({}, _prototype.defaults, options || {})

    this.$element = $(element)

    var ui = this._ui = {
        slides: $(options.slideSelector),
        paginations: $(options.paginationSelector)
    }

    ui.slideLength = ui.slides.length

    init(this)
}

//获取触摸点
var getCoords = function(event) {
    var touches = event.touches,
        data = touches && touches.length ? touches : event.changedTouches

    return {
        x: isTouch ? data[0].pageX : event.pageX,
        y: isTouch ? data[0].pageY : event.pageY
    }
}

//获取偏移
var getDistance = function(event, startCoords) {
    var coords = getCoords(event),
        x = coords.x - startCoords.x,
        y = coords.y - startCoords.y

    return {
        distanceX: x,
        distanceY: y
    }
}

//获取位置与索引
var getCoordinates = function(swiper, distanceX, distanceY) {
    var offset = swiper._ui.slides.offset(),
        w = offset.width,
        h = offset.height,
        l = swiper._ui.slideLength,
        index = swiper._ui.active,
        active = index,
        threshold = swiper.options.threshold

    if (swiper.options.direction === HORIZONTAL) {
        //横向
        if (distanceX > 0 && index == 0) {
            //最左侧
            distanceX = Math.round(distanceX / VISCOSITY)
            index = 0

        } else if (distanceX < 0 && index == l - 1) {
            //最右侧
            distanceX = Math.round(distanceX / VISCOSITY)
            index = l - 1

        } else if (threshold < Math.abs(distanceX)) {
            //达到最小偏移量

            //取整
            var s = Math.round(Math.abs(distanceX) / w)

            s = s == 0 ? 1 : s

            //向右或者向左
            index = distanceX > 0 ? index - s : index + s
        }

        return {
            x: distanceX + (-w * active),
            y: 0,
            index: index
        }

    } else {
        //垂直
        if (distanceY > 0 && index == 0) {
            //最上
            distanceY = Math.round(distanceY / VISCOSITY)
            index = 0

        } else if (distanceY < 0 && index == l - 1) {
            //最下
            distanceY = Math.round(distanceY / VISCOSITY)
            index = l - 1

        } else if (threshold < Math.abs(distanceY)) {
            //达到最小偏移
            var s = Math.round(Math.abs(distanceY) / h)

            s = s == 0 ? 1 : s

            index = distanceY > 0 ? index - s : index + s
        }

        return {
            x: 0,
            y: distanceY + (-h * active),
            index: index
        }
    }
}

var returnFalse = function() {
    return false
}

//初始化
var init = function(swiper) {
    var options = swiper.options

    appendCloneChildren(swiper)

    //设置默认样式
    swiper.$element.css(options.style.swiper)

    var initialSlide = options.initialSlide || 0
    options.infinite && (initialSlide = initialSlide + 1)

    //滚动到默认位置
    swiper.slide(initialSlide, 0)

    //绑定事件
    bindEvents(swiper)
}

//添加重复子节点
var appendCloneChildren = function(swiper) {

    if (swiper.options.infinite) {
        var $slides = swiper._ui.slides,
            first = $slides[0],
            last = $slides[swiper._ui.slideLength - 1],
            parentNode = first.parentNode

        parentNode.insertBefore(last.cloneNode(true), first)
        parentNode.appendChild(first.cloneNode(true))

        swiper._ui.slideLength += 2
    }
}

//重置索引值
var resetSlideIndex = function(swiper) {
    var index = swiper._ui.active,
        length = swiper._ui.slideLength

    if (swiper.options.infinite) {

        if (index === length - 1) {
            swiper.slide(1, 0)
        }

        if (index === 0) {
            swiper.slide(length - 2, 0)
        }
    }
}

//绑定事件
var bindEvents = function(swiper) {
    var flag = false,
        startCoords

    var start = function(event) {
            flag = true
            event = event.originalEvent || event

            resetSlideIndex(swiper)

            startCoords = getCoords(event)

            setDuration(swiper.$element, null)

            event.preventDefault()
        },
        move = function(event) {
            if (!flag) return
            event = event.originalEvent || event

            var distance = getDistance(event, startCoords),
                coordinates = getCoordinates(swiper, distance.distanceX, distance.distanceY)

            setTranslate(swiper.$element, coordinates.x, coordinates.y)
        },
        end = function(event) {
            if (!flag) return
            flag = false

            event = event.originalEvent || event

            var distance = getDistance(event, startCoords),
                index = getCoordinates(swiper, distance.distanceX, distance.distanceY).index

            swiper.slide(index)
        }

    //监听横竖屏
    bindOrientationChangeEvent(swiper)

    //触发回调函数
    bindTransitionEndEvent(swiper)

    swiper.$element.on(START_EVENT, start)
    $document.on(MOVE_EVENT, move)
    $document.on(END_EVENT, end)

    swiper.$element[0].onselectstart = returnFalse
    swiper.$element[0].ondragstart = returnFalse
}

//监听slide完成事件
var bindTransitionEndEvent = function(swiper) {
    var $element = swiper.$element

    var slide = function() {
        var callback = swiper.options.slide,
            index = swiper._ui.active

        resetSlideIndex(swiper)

        swiper.options.infinite && (index = swiper._ui.active - 1)

        callback && callback.call(swiper, index)

        //设置选中状态Class
        setActiveClass(swiper, index)
    }

    $element.on(TRANSITIONEND_EVENT, slide).on(WEBKIT_TRANSITIONEND_EVENT, slide)
}

//监听横竖屏切换
var bindOrientationChangeEvent = function(swiper) {
    var timer

    function handler() {
        timer && clearTimeout(timer)
        timer = setTimeout(function() {
            swiper.slide(swiper._ui.active)
        }, 200)
    }
    $(window).on('onorientationchange' in window ? 'orientationchange' : 'resize', handler)
}

//偏移到指定的位置
var slide = function(swiper, index, duration) {
    var offset = swiper._ui.slides.offset()

    //由于移动端浏览器 transition 动画不支持百分比，所以采用像素值
    if (swiper.options.direction === HORIZONTAL) {
        //横向
        var w = offset.width

        swiper.setTranslate(-index * w, 0, duration)
    } else {
        //垂直
        var h = offset.height

        swiper.setTranslate(0, -index * h, duration)
    }
}

//添加选中类
var setActiveClass = function(swiper, index) {
    var options = swiper.options,
        slideActiveClass = options.slideActiveClass,
        paginationActiveClass = options.paginationActiveClass

    //添加选中的class
    swiper._ui.slides.removeClass(slideActiveClass).eq(index).addClass(slideActiveClass)

    swiper._ui.paginations.removeClass(paginationActiveClass).eq(index).addClass(paginationActiveClass)
}

//设置偏移量
var setTranslate = function($element, x, y) {
    core.isNumber(x) && (x += 'px')
    core.isNumber(y) && (y += 'px')

    var t = 'translate(' + x + ',' + y + ')'

    $element.css({
        '-webkit-transform': t,
        'transform': t
    })
}

//设置偏移速度
var setDuration = function($element, duration) {
    core.isNumber(duration) && (duration += 'ms')

    $element.css({
        '-webkit-transition-duration': duration,
        'transition-duration': duration
    })
}

var getActualIndex = function(index, length) {
    return index < 0 ? 0 : index >= length ? length - 1 : index
}

var _prototype = Swiper.prototype

/**
 * ## defaults
 *
 * `Swiper`默认配置项。
 *
 * 配置项说明：
 *
 * * `direction`: 切换方向。horizontal：横向， vertical：纵向
 *
 * * `threshold`: 最小触发距离。手指移动距离必须超过`threshold`才能切换。
 *
 * * `duration`: 切换速度。
 *
 * * `initialSlide`: 初始化滚动位置
 *
 * * `slideSelector`: 滚动块元素选择器
 *
 * * `slideActiveClass`: 滚动块元素选中的类名
 *
 * * `paginationSelector`: 缩略图或者icon选择器
 *
 * * `paginationActiveClass`: 选中的类名
 *
 * * `slide`: 切换回调函数
 */

_prototype.defaults =  {
    //vertical
    direction: HORIZONTAL,
    threshold: 50,
    duration: 300,
    infinite: false,
    initialSlide: 0,
    slideSelector: '',
    slideActiveClass: '',
    paginationSelector: '',
    paginationActiveClass: '',
    slide: null,
    style: {
        swiper: {
            '-webkit-transition-property': '-webkit-transform',
            'transition-property': 'transform',
            '-webkit-transition-timing-function': 'ease-out',
            'transition-timing-function': 'ease-out'
        }
    }
}

/**
 * ## setTranslate
 *
 * 设置偏移量
 *
 * @param {String} x     x偏移。注意值应该包含单位。例如 100px,或者10%。
 * @param {String} y     y偏移。注意值应该包含单位。例如 100px,或者10%。
 * @param {Number} duration 滚动速度
 */
_prototype.setTranslate = function(x, y, duration) {
    var $element = this.$element

    duration = duration || 0

    setDuration($element, duration)
    setTranslate($element, x, y)

    return this
}

/**
 * ## slide
 *
 * 滚动到指定索引值位置
 *
 * @param  {index} index 滚动索引值
 * @param  {duration} duration 滚动速度，默认使用参数配置的speed
 * @return {instance}    当前实例
 */
_prototype.slide = function(index, duration) {
    var options = this.options

    //如果speed为空，则取默认值
    duration = duration == null ? options.duration : duration

    //取出实际的索引值,保存当前索引值
    this._ui.active = index = getActualIndex(index, this._ui.slideLength)

    //通过索引值设置偏移
    slide(this, index, duration)

    return this
}

/**
 * ## next
 *
 * 切换到下一个
 *
 * @param  {duration} duration 滚动速度，默认使用参数配置的speed
 * @return {instance}    当前实例
 */
_prototype.next = function(duration) {
    return this.slide(this._ui.active + 1, duration)
}

/**
 * ## prev
 *
 * 切换到上一个
 * @param  {duration} duration 滚动速度，默认使用参数配置的speed
 * @return {instance}    当前实例
 */
_prototype.prev = function(duration) {
    return this.slide(this._ui.active - 1, duration)
}

module.exports = Swiper

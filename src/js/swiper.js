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
 * });
 * ```
 */
var core = require('./core'),
    $ = require('./lite');

var $document = $(document),
    isTouch = core.os.mobile;

var START_EVENT = isTouch ? 'touchstart' : 'mousedown',
    MOVE_EVENT = isTouch ? 'touchmove' : 'mousemove',
    END_EVENT = isTouch ? 'touchend' : 'mouseup',
    TRANSITIONEND_EVENT = 'transitionend',
    WEBKIT_TRANSITIONEND_EVENT = 'webkitTransitionEnd',
    HORIZONTAL = 'horizontal',
    //粘性
    VISCOSITY = 5;

function Swiper(element, options) {

    this.options = core.extend({}, Swiper.prototype.defaults, options || {});

    this.$element = $(element);

    this._ui = {
        slides: $(options.slideSelector),
        paginations: $(options.paginationSelector)
    };

    this._slideLength = this._ui.slides.length;

    init.call(this);
}

//获取触摸点
function getCoords(event) {
    var touches = event.touches,
        data = touches && touches.length ? touches : event.changedTouches;

    return {
        x: isTouch ? data[0].pageX : event.pageX,
        y: isTouch ? data[0].pageY : event.pageY
    }
}

//获取偏移
function getDistance(event, startCoords) {
    var coords = getCoords(event),
        x = coords.x - startCoords.x,
        y = coords.y - startCoords.y;

    return {
        distanceX: x,
        distanceY: y
    }
}

//获取位置与索引
function getCoordinates(distanceX, distanceY) {
    var offset = this._ui.slides.offset(),
        w = offset.width,
        h = offset.height,
        l = this._slideLength,
        index = this._active,
        _active = index,
        threshold = this.options.threshold;

    if (this.options.direction === HORIZONTAL) {
        //横向
        if (distanceX > 0 && index == 0) {
            //最左侧
            distanceX = Math.round(distanceX / VISCOSITY);
            index = 0;

        } else if (distanceX < 0 && index == l - 1) {
            //最右侧
            distanceX = Math.round(distanceX / VISCOSITY);
            index = l - 1;

        } else if (threshold < Math.abs(distanceX)) {
            //达到最小偏移量

            //取整
            var s = Math.round(Math.abs(distanceX) / w);

            s = s == 0 ? 1 : s;

            //向右或者向左
            index = distanceX > 0 ? index - s : index + s;
        }

        return {
            x: distanceX + (-w * _active),
            y: 0,
            index: index
        }

    } else {
        //垂直
        if (distanceY > 0 && index == 0) {
            //最上
            distanceY = Math.round(distanceY / VISCOSITY);
            index = 0;

        } else if (distanceY < 0 && index == l - 1) {
            //最下
            distanceY = Math.round(distanceY / VISCOSITY);
            index = l - 1;

        } else if (threshold < Math.abs(distanceY)) {
            //达到最小偏移
            var s = Math.round(Math.abs(distanceY) / h);

            s = s == 0 ? 1 : s;

            index = distanceY > 0 ? index - s : index + s;
        }

        return {
            x: 0,
            y: distanceY + (-h * _active),
            index: index
        }
    }
}

function returnFalse() {
    return false
}

//初始化
function init() {
    var options = this.options;

    appendCloneChildren.call(this);

    //设置默认样式
    this.$element.css(options.style.swiper);

    var initialSlide = options.initialSlide  || 0;
    options.infinite && (initialSlide = initialSlide+ 1);

    //滚动到默认位置
    this.slide(initialSlide, 0);

    //绑定事件
    bindEvents.call(this);
}

//添加重复子节点
function appendCloneChildren(){

    if(this.options.infinite){
        var $slides = this._ui.slides,
            first = $slides[0],
            last = $slides[this._slideLength - 1],
            parentNode = first.parentNode;

        parentNode.insertBefore(last.cloneNode(true),first);
        parentNode.appendChild(first.cloneNode(true));

        this._slideLength += 2;
    }
}

//重置索引值
function resetSlidePosition(){
    var index = this._active;
    if (this.options.infinite) {

        if (index === this._slideLength - 1) {
            this.slide(1, 0);
        }

        if (index === 0) {
            this.slide(this._slideLength - 2, 0);
        }
    }
}

//绑定事件
function bindEvents() {
    var self = this,
        flag = false,
        startCoords;

    var start = function(event) {
        flag = true;
        event = event.originalEvent || event;

        resetSlidePosition.call(self);

        startCoords = getCoords(event);

        setDuration.call(self, null);

        event.preventDefault();
    },
    move = function(event) {
        if (!flag) return;
        event = event.originalEvent || event;

        var distance = getDistance(event, startCoords),
            coordinates = getCoordinates.call(self, distance.distanceX, distance.distanceY);

        setTranslate.call(self, coordinates.x, coordinates.y);
    },
    end = function(event) {
        if (!flag) return;
        flag = false;

        event = event.originalEvent || event;

        var distance = getDistance(event, startCoords),
            index = getCoordinates.call(self, distance.distanceX, distance.distanceY).index;

        self.slide(index);
    };

    //监听横竖屏
    bindOrientationChangeEvent.call(self);

    //触发回调函数
    bindTransitionEndEvent.call(this);

    self.$element.on(START_EVENT, start);
    $document.on(MOVE_EVENT, move);
    $document.on(END_EVENT, end);

    self.$element[0].onselectstart = returnFalse;
    self.$element[0].ondragstart = returnFalse;
}

//监听slide完成事件
function bindTransitionEndEvent() {
    var self = this,
        $element = self.$element;

    var slide = function() {
        var callback = self.options.slide,index = self._active;

        resetSlidePosition.call(self);

        self.options.infinite && (index = self._active - 1);

        callback && callback.call(self, index);

        //设置选中状态Class
        setActiveClass.call(self, index);
    }

    $element.on(TRANSITIONEND_EVENT, slide).on(WEBKIT_TRANSITIONEND_EVENT, slide);
}

//监听横竖屏切换
function bindOrientationChangeEvent() {
    var self = this,
        timer;

    function handler() {
        timer && clearTimeout(timer);
        timer = setTimeout(function() {
            self.slide(self._active);
        }, 200);
    }
    $(window).on('onorientationchange' in window ? 'orientationchange' : 'resize', handler);
}

//偏移到指定的位置
function slide(index, duration) {
    var offset = this._ui.slides.offset();

    //由于移动端浏览器 transition 动画不支持百分比，所以采用像素值
    if (this.options.direction === HORIZONTAL) {
        //横向
        var w = offset.width;

        this.setTranslate(-index * w, 0, duration);
    } else {
        //垂直
        var h = offset.height;

        this.setTranslate(0, -index * h, duration);
    }
}

//添加选中类
function setActiveClass(index) {
    var options = this.options,
        slideActiveClass = options.slideActiveClass,
        paginationActiveClass = options.paginationActiveClass;

    //添加选中的class
    this._ui.slides.removeClass(slideActiveClass).eq(index).addClass(slideActiveClass);

    this._ui.paginations.removeClass(paginationActiveClass).eq(index).addClass(paginationActiveClass);
}

//设置偏移量
function setTranslate(x, y) {
    core.isNumber(x) && (x += 'px');
    core.isNumber(y) && (y += 'px');

    var t = 'translate(' + x + ',' + y + ')';

    this.$element.css({
        '-webkit-transform': t,
        'transform': t
    });
}

//设置偏移速度
function setDuration(duration) {
    core.isNumber(duration) && (duration += 'ms');

    this.$element.css({
        '-webkit-transition-duration': duration,
        'transition-duration': duration
    });
}

function getActualIndex(index) {
    return index < 0 ? 0 : index >= this._slideLength ? this._slideLength - 1 : index;
}
;
(function() {
    this.constructor = Swiper;

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

    this.defaults = {
        //vertical
        direction: HORIZONTAL,
        threshold: 50,
        duration: 300,
        infinite:false,
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
    this.setTranslate = function(x, y, duration) {
        duration = duration || 0;

        setDuration.call(this, duration);
        setTranslate.call(this, x, y);

        return this;
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
    this.slide = function(index, duration) {
        var options = this.options;

        //如果speed为空，则取默认值
        duration = duration == null ? options.duration : duration;

        //取出实际的索引值,保存当前索引值
        this._active = index = getActualIndex.call(this,index);

        //通过索引值设置偏移
        slide.call(this, index, duration);

        return this;
    }

    /**
     * ## next
     *
     * 切换到下一个
     *
     * @param  {duration} duration 滚动速度，默认使用参数配置的speed
     * @return {instance}    当前实例
     */
    this.next = function(duration) {
        return this.slide(this._active + 1, duration);
    }

    /**
     * ## prev
     *
     * 切换到上一个
     * @param  {duration} duration 滚动速度，默认使用参数配置的speed
     * @return {instance}    当前实例
     */
    this.prev = function(duration) {
        return this.slide(this._active - 1, duration);
    }

}).call(Swiper.prototype);

module.exports = Swiper;

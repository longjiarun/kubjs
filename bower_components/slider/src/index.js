function Slider($container){    
    this.$container = $container;
    this.frameNum = this.$container.children.length;
    this.$container.style.width = this.frameNum * 100 + "%";
    this.frameWidth = this.$container.children[0].getBoundingClientRect().width;

    this.$container.addEventListener('touchstart', this ,false);
    this.$container.addEventListener('mousedown', this ,false);

    this._setIndex(0);
    this._translateX(0);
    this.transitionDuration = 250;
    // 状态机转换   初始化状态  ==>  拖拽状态  ==> 转场动画中  ==>  初始化状态
    this._isDuringDrag = false;
    this._isDuringTransition = false;
    this._isDragReady = false;
}

Slider.prototype._setTransitionDuration = function(ms){
    var self = this;
    self.$container.style.webkitTransition = "-webkit-transform xxms cubic-bezier(0,0,0.25,1)".replace("xx", ms); 
    self.$container.style.webkitTransition = "transform xxms cubic-bezier(0,0,0.25,1)".replace("xx", ms); 
    self.$container.style.transition = "-webkit-transform xxms cubic-bezier(0,0,0.25,1)".replace("xx", ms); 
    self.$container.style.transition = "transform xxms cubic-bezier(0,0,0.25,1)".replace("xx", ms); 
};

Slider.prototype._translateX = function(x, transitionDurationInMs){
    this._setTransitionDuration(transitionDurationInMs || 0);
    // 转场动画中，currentX 为转场动画结束的值
    this.currentX = x;
    this.$container.style.webkitTransform = "translate3d(xxpx, 0, 0)".replace("xx", x); 
    this.$container.style.transform = "translate3d(xxpx, 0, 0)".replace("xx", x);
};

Slider.prototype.isDuringDrag = function(){
    return this._isDuringDrag;
};

Slider.prototype.isDuringTransition = function(){
    return this._isDuringTransition;
};

// 是否是横向滚动的检测
Slider.prototype.isDragReady = function(){
    return this._isDragReady;
};

Slider.prototype._checkDragReady = function(point) {
    var startPoint = this.startPoint;
    // TODO ，检测角度，来阻止滚动
    var distance;
    var angel;

    return true;
};

Slider.prototype._getTouchPoint = function(e){
    return {
        x: e.pageX || e.touches[0].pageX,
        y: e.pageY || e.touches[0].pageY
    };
};

Slider.prototype._decideNextFrame = function(){
    var nextIndex = -1 *  this.currentX / this.frameWidth;

    // 正方向移动，那边 index 往下取整
    if (this.directionX > 0) {
        nextIndex = Math.floor(nextIndex);
    } else if (this.directionX < 0) {
        nextIndex = Math.ceil(nextIndex);
    } else if (this.directionX === 0) {
        nextIndex = Math.round(nextIndex);
    }

    var diffX = this.endPoint.x - this.startPoint.x;
    var threshold = this.frameWidth / 6;

    if (Math.abs(diffX) <= threshold) {
        nextIndex = this.index;
    }

    nextIndex = Math.max(0, nextIndex);
    nextIndex = Math.min(this.frameNum - 1, nextIndex);

    return nextIndex;
};

Slider.prototype.goTo = function(index, immediate){
    if (this.isDuringDrag()) return;
    var self = this;
    var prevIndex = self.getIndex();

    index = Math.min(this.frameNum - 1, index);
    index = Math.max(0, index);
    
    var nextX = index * this.frameWidth * -1;

    // 无过渡效果
    if (immediate || nextX === this.currentX) {
        // console.log('瞬间过渡至:' + index);
        self._setIndex(index);
        self._translateX(nextX);
        self._triggerEvent('snapDidMoved', true, false, {
            prevIndex: prevIndex,
            curIndex: index,
        });
        return;
    }

    var cancelled = !this._triggerEvent('snapWillMove', true, false, {
        prevIndex: prevIndex,
        curIndex: index,
        curX: this.currentX,
        nextX: nextX
    });

    self._isDuringTransition = true;
    var callback = function(){
        // console.log('过渡动画结束');

        self._isDuringTransition = false;
        self.$container.removeEventListener('transitionend', callback);
        self.$container.removeEventListener('webkitTransitionEnd', callback);
        self._triggerEvent('snapDidMoved', true, false, {
            prevIndex: prevIndex,
            curIndex: index,
        });
    };
    self.$container.addEventListener('transitionend', callback);
    self.$container.addEventListener('webkitTransitionEnd', callback);

    self._setIndex(index);
    self._translateX(nextX, self.transitionDuration);
};

Slider.prototype.prev = function() {
    this.goTo(this.getIndex() - 1);
};

Slider.prototype.next = function(){
    this.goTo(this.getIndex() + 1);
};

Slider.prototype.getIndex = function(){
    return this.index;
};

Slider.prototype._setIndex = function(index){
    this.index = index;
};

Slider.prototype._triggerEvent = function(type, bubbles, cancelable, data){
    var event = document.createEvent('Event');
    event.initEvent(type, bubbles, cancelable);

    if (data) {
        for (var d in data) {
            if (data.hasOwnProperty(d)) {
                event[d] = data[d];
            }
        }
    }

    return this.$container.dispatchEvent(event);
};

Slider.prototype.addEventListener = function(type, callback, useCapture) {
    this.$container.addEventListener(type, callback, useCapture);
};

/**
 * @private
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
Slider.prototype.handleEvent = function(e){
    switch (e.type) {
        case "touchstart":
        case "mousedown":
            this._touchStart(e, e.type);
            break;
        case "touchmove":
        case "mousemove":
            this._touchMove(e, e.type);
            break;
        case "touchend":
        case "mouseup":
            this._touchEnd(e, e.type);
            break;
    }
};

Slider.prototype._touchStart = function(e){
    if (this.isDuringTransition()) return;

    var point = this._getTouchPoint(e);

    this._isDuringDrag = true;
    this._isDragReady = false;

    // 起点、终点 和 上一个点
    this.startPoint = point;
    this.endPoint = null;
    this.lastPoint = point;

    // 初始化方向
    this.directionX = 0;

    this.$container.addEventListener('touchmove', this ,false);
    this.$container.addEventListener('mousemove', this ,false);
    document.addEventListener('touchend', this ,false);
    document.addEventListener('mouseup', this ,false);

    this._triggerEvent('dragStart', true, false);
};

Slider.prototype._touchMove = function(e){
    if (this.isDuringTransition()) {
        e.preventDefault();
        return;
    }

    if (!this.isDuringDrag()) {
        // 禁止上下滑动，A hack，please notice
        e.preventDefault();
        return;
    }

    var curPoint = this._getTouchPoint(e);
    var diffX = curPoint.x - this.lastPoint.x;
    var self = this;

    // 检测是否是 drag 动作
    if (!this.isDragReady()) {
        this._isDragReady = this._checkDragReady(curPoint);
        if (!this.isDragReady()) return;
    }

    e.preventDefault();

    var nextX = (function determineNextX(diffX) {
        var newX = self.currentX + diffX;

        // 边界增加阻力
        var maxX = 0;
        var minX = (self.frameNum - 1) * self.frameWidth * -1;
        var outOfMinBoundary = newX < minX && diffX < 0;
        var outOfMaxBoundary = newX > maxX && diffX > 0;
        if (outOfMinBoundary || outOfMaxBoundary) {
            newX  = self.currentX + diffX / 4;
        } 

        return newX;
    })(diffX);

    this.directionX = (function determineDiretion(diffX, lastDirection){
        var directionX;

        if (diffX > 0) {
            directionX = 1;
        } else if (diffX < 0) {
            directionX = -1;
        } else if (diffX === 0) {
            directionX = lastDirection; 
        }

        return directionX;
    })(diffX, this.directionX);
 
    this._translateX(nextX);
    this.lastPoint = curPoint;
};

Slider.prototype._touchEnd = function(e){
    if (this.isDuringTransition()) return;

    this._isDuringDrag = false;
    this._isDragReady = false;
    this.$container.removeEventListener('touchmove', this ,false);
    this.$container.removeEventListener('mousemove', this ,false);
    document.removeEventListener('touchend', this ,false);
    document.removeEventListener('mouseup', this ,false);

    var self = this;
    this.endPoint = this.lastPoint;

    window.setTimeout(function(){
        self.goTo(self._decideNextFrame());
        self._triggerEvent('dragEnd', true, false);
    }, 0);
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = Slider;
} else {
    window.Kub = window.Kub || {};
    window.Kub.Slider = Slider;
}
function Slider(t){this.$container=t,this.frameNum=this.$container.children.length,this.$container.style.width=100*this.frameNum+"%",this.frameWidth=this.$container.children[0].getBoundingClientRect().width,this.$container.addEventListener("touchstart",this,!1),this.$container.addEventListener("mousedown",this,!1),this._setIndex(0),this._translateX(0),this.transitionDuration=250,this._isDuringDrag=!1,this._isDuringTransition=!1,this._isDragReady=!1}Slider.prototype._setTransitionDuration=function(t){var e=this;e.$container.style.webkitTransition="-webkit-transform xxms cubic-bezier(0,0,0.25,1)".replace("xx",t),e.$container.style.webkitTransition="transform xxms cubic-bezier(0,0,0.25,1)".replace("xx",t),e.$container.style.transition="-webkit-transform xxms cubic-bezier(0,0,0.25,1)".replace("xx",t),e.$container.style.transition="transform xxms cubic-bezier(0,0,0.25,1)".replace("xx",t)},Slider.prototype._translateX=function(t,e){this._setTransitionDuration(e||0),this.currentX=t,this.$container.style.webkitTransform="translate3d(xxpx, 0, 0)".replace("xx",t),this.$container.style.transform="translate3d(xxpx, 0, 0)".replace("xx",t)},Slider.prototype.isDuringDrag=function(){return this._isDuringDrag},Slider.prototype.isDuringTransition=function(){return this._isDuringTransition},Slider.prototype.isDragReady=function(){return this._isDragReady},Slider.prototype._checkDragReady=function(t){this.startPoint;return!0},Slider.prototype._getTouchPoint=function(t){return{x:t.pageX||t.touches[0].pageX,y:t.pageY||t.touches[0].pageY}},Slider.prototype._decideNextFrame=function(){var t=-1*this.currentX/this.frameWidth;this.directionX>0?t=Math.floor(t):this.directionX<0?t=Math.ceil(t):0===this.directionX&&(t=Math.round(t));var e=this.endPoint.x-this.startPoint.x,i=this.frameWidth/6;return Math.abs(e)<=i&&(t=this.index),t=Math.max(0,t),t=Math.min(this.frameNum-1,t)},Slider.prototype.goTo=function(t,e){if(!this.isDuringDrag()){var i=this,n=i.getIndex();t=Math.min(this.frameNum-1,t),t=Math.max(0,t);var r=t*this.frameWidth*-1;if(e||r===this.currentX)return i._setIndex(t),i._translateX(r),void i._triggerEvent("snapDidMoved",!0,!1,{prevIndex:n,curIndex:t});!this._triggerEvent("snapWillMove",!0,!1,{prevIndex:n,curIndex:t,curX:this.currentX,nextX:r});i._isDuringTransition=!0;var s=function(){i._isDuringTransition=!1,i.$container.removeEventListener("transitionend",s),i.$container.removeEventListener("webkitTransitionEnd",s),i._triggerEvent("snapDidMoved",!0,!1,{prevIndex:n,curIndex:t})};i.$container.addEventListener("transitionend",s),i.$container.addEventListener("webkitTransitionEnd",s),i._setIndex(t),i._translateX(r,i.transitionDuration)}},Slider.prototype.prev=function(){this.goTo(this.getIndex()-1)},Slider.prototype.next=function(){this.goTo(this.getIndex()+1)},Slider.prototype.getIndex=function(){return this.index},Slider.prototype._setIndex=function(t){this.index=t},Slider.prototype._triggerEvent=function(t,e,i,n){var r=document.createEvent("Event");if(r.initEvent(t,e,i),n)for(var s in n)n.hasOwnProperty(s)&&(r[s]=n[s]);return this.$container.dispatchEvent(r)},Slider.prototype.addEventListener=function(t,e,i){this.$container.addEventListener(t,e,i)},Slider.prototype.handleEvent=function(t){switch(t.type){case"touchstart":case"mousedown":this._touchStart(t,t.type);break;case"touchmove":case"mousemove":this._touchMove(t,t.type);break;case"touchend":case"mouseup":this._touchEnd(t,t.type)}},Slider.prototype._touchStart=function(t){if(!this.isDuringTransition()){var e=this._getTouchPoint(t);this._isDuringDrag=!0,this._isDragReady=!1,this.startPoint=e,this.endPoint=null,this.lastPoint=e,this.directionX=0,this.$container.addEventListener("touchmove",this,!1),this.$container.addEventListener("mousemove",this,!1),document.addEventListener("touchend",this,!1),document.addEventListener("mouseup",this,!1),this._triggerEvent("dragStart",!0,!1)}},Slider.prototype._touchMove=function(t){if(this.isDuringTransition())return void t.preventDefault();if(!this.isDuringDrag())return void t.preventDefault();var e=this._getTouchPoint(t),i=e.x-this.lastPoint.x,n=this;if(this.isDragReady()||(this._isDragReady=this._checkDragReady(e),this.isDragReady())){t.preventDefault();var r=function(t){var e=n.currentX+t,i=0,r=(n.frameNum-1)*n.frameWidth*-1,s=r>e&&0>t,o=e>i&&t>0;return(s||o)&&(e=n.currentX+t/4),e}(i);this.directionX=function(t,e){var i;return t>0?i=1:0>t?i=-1:0===t&&(i=e),i}(i,this.directionX),this._translateX(r),this.lastPoint=e}},Slider.prototype._touchEnd=function(t){if(!this.isDuringTransition()){this._isDuringDrag=!1,this._isDragReady=!1,this.$container.removeEventListener("touchmove",this,!1),this.$container.removeEventListener("mousemove",this,!1),document.removeEventListener("touchend",this,!1),document.removeEventListener("mouseup",this,!1);var e=this;this.endPoint=this.lastPoint,window.setTimeout(function(){e.goTo(e._decideNextFrame()),e._triggerEvent("dragEnd",!0,!1)},0)}},"undefined"!=typeof module&&module.exports?module.exports=Slider:(window.Kub=window.Kub||{},window.Kub.Slider=Slider);
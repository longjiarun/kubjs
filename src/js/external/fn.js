!function(root){
    var $ = root.jQuery||root.Zepto;
    
    /**
     * 解决iPhone下同时进行错误提示与focus，会出现错误提示框出不来。
     * 错误提示框被隐藏下键盘下。是由于iPhone对页面适配做出的处理，iPhone并没有将这个页面进行滚动处理
     */
    $.fn.focuson = function(){
        var $this = this.eq(0),scrollTop = $(document.body).scrollTop(),top = $this.offset().top;
        if(scrollTop > top){
            $(document.body).scrollTop(top);
        }
        $this.focus();
        return this;
    };
}.call(this);
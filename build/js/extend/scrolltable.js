/**
 * # Kub.ScrollTable
 *
 * 滚动分页
 */
!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if(typeof define === "function"){
        define(function(){
            return Kub.ScrollTable = factory(root, root.jQuery || root.Zepto, root.template, Kub.core, Kub.LazyLoad);
        });
    }else if (typeof exports !== 'undefined') {
        module.exports = factory(root,require("../lib/zepto"),require("../lib/arttemplate"),require("../core"),require("../lazyLoad"));
    } else{
        Kub.ScrollTable = factory(root, root.jQuery || root.Zepto, root.template, Kub.core, Kub.LazyLoad);
    }
}(this,function(root,$,template, core, LazyLoad){

    /**
     * ## ScrollTable Constructor
     *
     * ScrollTable 类
     *
     * 使用方法：
     * ```js
     * 
     * new Kub.ScrollTable();
     *
     * ```
     */
    function ScrollTable(element,options){
        var self = this;
        
        this.options = $.extend({},options,ScrollTable.prototype.defaults,options||{});

        this.$list = $(options.listSelector);
        this.$loading = $(options.loadingTemplate).appendTo($(element));

        if(!this.$loading.length) return;

        this.page = this.options.defaultPage;
        LazyLoad.call(this, this.$loading, $.extend(this.options,{
            waitTime:0,
            container:window
        }));

        this.$element = $(element);
    }

    Kub.core.inherit(ScrollTable, LazyLoad);

    ;(function(){
        this.constructor = ScrollTable;

        /**
         * ## defaults
         *
         * `defaults`默认配置项。
         *
         * 配置项说明：
         * 
         * * `url`: url地址
         * 
         * * `type`: 请求类型
         * 
         * * `dataType`: 数据类型
         * 
         * * `listSelector`: 列表选择器
         * 
         * * `itemSelector`: item选择器，用于删除
         * 
         * * `loadingTemplate`: loading 图标模板
         * 
         * * `noDataTemplate`: 无数据模板
         * 
         * * `completedTempalte`: 数据加载以后模板
         * 
         * * `template`: item模板
         * 
         * * `success`: 成功回调函数
         * 
         * * `error`: 失败回调函数
         * 
         * * `defaultPage`: 默认页数
         * 
         * * `pageSize`: 页面大小
         * 
         * * `countKey`: 总数的key
         * 
         * * `resultKey`: 数据结果的key
         * 
         * * `format`: 格式化后端数据方法，由于每个请求过来的数据可能不一致，所以需要手动格式化。
         * 
         * * `formatAjaxData`: 格式化Ajax请求参数，由于每个请求发送的数据格式可能不一致，所以需要手动格式化。
         */
        this.defaults = {
            url:"",
            type:"get",
            dataType:"jsonp",
            listSelector:"ul",
            itemSelector:".J_scrollTable",
            loadingTemplate : '',
            noDataTemplate:'',
            completedTempalte:'',
            template:'',
            success:null,
            error:null,
            defaultPage:0,
            pageSize:10,
            countKey:"count",
            resultKey:"result",
            format:function(data){
                return data;
            },
            formatAjaxData:function(data){
                return data;
            }
        }

        this.page = 0;
        this.pages = null;
        this.data=[];

        //获取页数
        this.getPages = function(total,pageSize){
            var p = total / pageSize,  _p = parseInt(p);
            return p !== _p ? _p + 1 : _p;
        }

        /**
         * 继承自LazyLoad，不对外提供接口
         * @return {Element} 返回还未加载的节点
         */
        this.getUnloadedElements = function(){
            var self =this;
            return self.$loading.filter(function(index){
                return !this.loaded;
            });
        };

        /**
         * ## refresh
         * 
         * 重新刷新table
         * 
         * @return {instance} 当前实例
         */
        this.refresh = function(){

            this.$list.empty();

            this.$loading.show();
            this.$loading[0].loaded=false;

            this.$complete && this.$complete.remove();
            this.$nodata && this.$nodata.remove();

            this.completed = false;
            this.page = 0;
            this.pages = null;

            this.load();
            return this;
        };

        /**
         * ## load
         * 
         * 加载下一页数据
         * 
         * @return {instance} 当前实例
         */
        this.load = function(){
            var self = this,options = this.options,page = self.page+1;

            //如果加载图片被隐藏，或者加载已完成则不进行加载
            if(self.$loading[0].offsetWidth <= 0 && self.$loading[0].offsetHeight <= 0 || self.completed){
                return self;
            }

            self.page = page;
            
            if(self.pages == void 0 || self.page <= self.pages){

                self.getData({
                    page:self.page,
                    pagesize:options.pageSize
                },function(data){
                    data = options.format ? options.format(data) : data;

                    //如果没有数据
                    if(data[options.countKey] == 0 && self.page == 1){
                        self.setNoDataStatus();
                        return self;
                    }

                    self.pages = self.getPages(data[options.countKey],options.pageSize);


                    self.add(data[options.resultKey]);

                    //判断数据是否加载完成
                    self.page == self.pages && self.setCompletedStatus();
                    self.$container.trigger("scroll");
                });
            }else{
                self.setCompletedStatus();
            }
            return self;
        };

        this.setCompletedStatus = function(){
            //加载完成
            this.$loading.hide();
            this.$loading[0].loaded=true;
            this.$complete = $(this.options.completedTempalte).appendTo(this.$element);
                        
            this.completed = true;
            return this;
        };

        this.setNoDataStatus = function(){
            this.$loading.hide();
            this.$loading[0].loaded=true;
            this.$nodata = $(this.options.noDataTemplate).appendTo(this.$element);
                        
            this.completed = true;
            return this;
        };

        this.getRenderHtml = function(data){
            var length,html="";
            if(data && (length =data.length)){
                for(var i=0; i<length; i++){
                    html += template.compile(this.options.template)({
                        data:data[i]
                    });
                }
            }
            
            return html;
        }

        /**
         * ## add/append
         * 
         * 往后添加数据
         * 
         * @param {Array} data   需要被添加的数据数组
         * @return {instance} 当前实例
         */
        this.add = this.append = function(data){
            var self = this,options = this.options,html;

            self.data = self.data.concat(data);

            self.data.length > 0 && self.$nodata && self.$nodata.remove();

            html = self.getRenderHtml(data);
            $(html).appendTo(self.$list);
            return self;
        };

        /**
         * ## preappend
         * 
         * 往前添加数据
         * 
         * @param {Array} data   需要被添加的数据数组
         * @return {instance} 当前实例
         */
        this.preappend = function(data){
            var self = this,options = this.options,html;

            self.data = data.concat(self.data);

            self.data.length > 0 && self.$nodata && self.$nodata.remove();

            html = self.getRenderHtml(data);
            $(html).prependTo(self.$list);
            return self;
        };

        /**
         * ## remove
         * 
         * 删除数据
         * 
         * @param {Object} data   被删除的数据
         * @return {instance} 当前实例
         */
        this.remove = function(data){
            var length;
            if (this.data && (length = this.data.length)) {
                for (var i = 0; i < length; i++) {
                    if (this.data[i] == data){

                        this.data.splice(i,1);
                        this.$element.find(this.options.itemSelector+data.id).remove();

                        this.data.length == 0 && !self.completed && this.$complete && this.$complete.remove() && this.setNoDataStatus();
                        this.$container.trigger("scroll");
                        return this;
                    }
                }
            }
            return this;
        };

        /**
         * ## getById
         * 
         * 通过ID获取数据
         * 
         * @param {Number} id   需要被删除的数据ID
         * @param {String} name ID名称，有可能Id名称不一定是 ”id“
         * @return {Object}      筛选出来的数据
         */
        this.getById = function(id,name){
            var data, name = name ? name :"id", param = {};
            param[name] = id;

            return (data = this.filter(param)) ? data[0] :null;
        };

        /**
         * ## removeById
         * 
         * 通过ID移除数据
         * 
         * @param {Number} id   需要被删除的数据ID
         * @param {String} name ID名称，有可能Id名称不一定是 ”id“
         * @return {instance} 当前实例
         */
        this.removeById = function(id,name){
            var length, 
                name = name ? name :"id";

            if (this.data && (length = this.data.length)) {
                for (var i = 0; i < length; i++) {
                    if (this.data[i][name] == id){
                        this.data.splice(i,1);
                        this.$element.find(this.options.itemSelector+id).remove();

                        this.data.length == 0 && !self.completed && this.$complete && this.$complete.remove() && this.setNoDataStatus();
                        this.$container.trigger("scroll");
                        return this;
                    }
                }
            }
            return this;
        };

        /**
         * ## filter
         * 
         * 筛选数据方法
         * 
         * @param {Object} params 参数
         * @return {Array}         返回筛选出来的方法
         */
        this.filter = function(params){
            var length,d,_datas=[];

            if (this.data && (length = this.data.length)) {
                for (var i = 0; i < length; i++) {
                    d = this.data[i], flag = true;
                    for (var name in params) {
                        if (params[name] !== d[name]) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        _datas.push(d);
                    }
                }
            }

            return _datas;
        };

        /**
         * ## getData
         * 
         * 获取数据
         * 
         * @param {Object} data    Ajax请求参数
         * @param {Function} success 请求成功以后回调
         * @param {Function} error   请求失败以后回调
         * @return {instance} 当前实例
         */
        this.getData = function(data,success,error){
            var self = this,options = self.options;
            $.ajax({
                url:options.url,
                type:options.type || "get",
                dataType:options.dataType,
                data:options.formatAjaxData ? options.formatAjaxData(data) : data,
                success:function(){
                    if(options.success && options.success.apply(this,arguments) === false){
                    }else{
                        success && success.apply(this,arguments);
                    }
                },
                error:function(){
                    options.error && options.error.apply(this,arguments);
                    error && error.apply(this,arguments);
                }
            });
            return self;
        };

    }).call(ScrollTable.prototype);

    return ScrollTable;
}));
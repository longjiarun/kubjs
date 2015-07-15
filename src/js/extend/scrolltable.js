!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if(typeof define === "function"){
        define(function(){
            return Kub.ScrollTable = factory(root, root.jQuery || root.Zepto, root.template, Kub.core, Kub.LazyLoad);
        });
    }else{
        Kub.ScrollTable = factory(root, root.jQuery || root.Zepto, root.template, Kub.core, Kub.LazyLoad);
    }
}(this,function(root,$,template, core, LazyLoad){
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
            },
            render : function(){

            }
        }

        this.page = 0;
        this.pages = null;
        this.data=[];

        //获取页数
        this.getPages = function(total,pageSize){
            var p = total / pageSize,  _p = parseInt(p);
            return p > _p ? _p + 1 : _p;
        }

        this.getUnloadedElements = function(){
            var self =this;
            return self.$loading.filter(function(index){
                return !this.loaded;
            });
        };

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

        this.load = function(){
            var self = this,options = this.options,page = self.page+1;

            //如果加载图片被隐藏，或者加载已完成则不进行加载
            if(self.$loading[0].offsetWidth <= 0 && self.$loading[0].offsetHeight <= 0 || self.completed){
                return self;
            }
            // return;
            self.page = page;
            
            if(self.pages == void 0 || self.page <= self.pages){

                self.getData({
                    page:self.page,
                    pagesize:options.pageSize
                },function(data){
                    data = options.format(data);

                    //如果没有数据
                    if(data[options.countKey] == 0 && self.page == 1){
                        self.setNoDataStatus();
                        return self;
                    }

                    self.pages = self.getPages(data[options.countKey],options.pageSize);

                    self.add(data[options.resultKey]);

                    self.$container.trigger("scroll");
                });
            }else{
                self.setCompletedStatus();
            }
            return self;
        };

        this.setCompletedStatus = function(flag){
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
            var length =data.length,html="";
            for(var i=0; i<length ;i++){
                html += template.compile(this.options.template)({
                    data:data[i]
                });
            }
            return html;
        }

        this.add = this.push = function(data){
            var self = this,options = this.options,html;

            self.data = self.data.concat(data);

            self.data.length > 0 && self.$nodata && self.$nodata.remove();

            html = self.getRenderHtml(data);
            $(html).appendTo(self.$list);
            return self;
        };

        this.unshift = function(data){
            var self = this,options = this.options,html;

            self.data = data.concat(self.data);

            self.data.length > 0 && self.$nodata && self.$nodata.remove();

            html = self.getRenderHtml(data);
            $(html).prependTo(self.$list);
            return self;
        };

        this.remove = function(data){
            if (data) {
                for (var i = 0; i < length; i++) {
                    if (this.data[i] == data){
                        this.data.splice(i,1);
                        this.$element.find(this.options.itemSelector+data.id).remove();

                        this.data.length == 0 && !self.completed && this.$complete && this.$complete.remove() && this.setNoDataStatus();

                        return this;
                    }
                }
            }
            return this;
        };

        this.getById = function(id,name){
            var data, name = name ? name :"id", param = {};
            param[name] = id;

            return (data = this.filter(param)) ? data[0] :null;
        };

        this.removeById = function(id,name){
            var length, 
                name = name ? name :"id", 
                param = {};

            if (this.data && (length = this.data.length)) {
                for (var i = 0; i < length; i++) {
                    if (this.data[i][name] == id){
                        this.data.splice(i,1);
                        this.$element.find(this.options.itemSelector+id).remove();

                        this.data.length == 0 && !self.completed && this.$complete && this.$complete.remove() && this.setNoDataStatus();
                        
                        return this;
                    }
                }
            }
            return this;
        };

        this.filter = function(params){
            var length,d,_datas=[];

            if(this.data&&(length=this.data.length)){
                for(var i=0;i<length;i++){
                    var d=this.data[i],flag=true;
                    for(var name in params){
                        if(params[name]!==d[name]){
                            flag=false;
                            break;
                        }
                    }
                    if(flag){
                        _datas.push(d);
                    }               
                }
            }

            return _datas;
        };

        this.getData = function(data,success,error){
            var self = this,options = self.options;
            $.ajax({
                url:options.url,
                type:options.type || "get",
                dataType:options.dataType,
                data:options.formatAjaxData ? options.formatAjaxData(data) : data,
                success:function(){
                    options.success && options.success.apply(this,arguments);
                    success && success.apply(this,arguments);
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
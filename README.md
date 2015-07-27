## 移动端类库 kubjs

### 为什么取名kubjs?

>在开发中本来就很苦逼（kubi），每天很繁琐。希望有了此框架以后，你的人生将不在苦逼。所以取名为kub。

### 设计思想

>kubjs由非常多的组件构成，组件之间依赖较低。每个组件基本都能独立拿出来使用。然而这些组件结合在一起时，能形成一个非常酷的类库。这也是以后框架的发展趋势。

>底层采用开源类库zepto.js,unerscore.js。每个组件根据需要决定是否依赖底层类库。

>组件采用类的方式进行编写，每个组件提供丰富稳定的接口。用户在使用时可以通过参数配置或者继承实现自己定制化的组件。

### 结构图
![](http://img.geilicdn.com/kub1437990758940.png)

### 关于实现
<pre>
1、kubjs不提供模块管理，由第三方提供(requirejs,seajs)

//模块写法
!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof define === "function") {
        //CDM/AMD
        define(function() {
            return Kub.calculator = factory(root);
        });
    }else if (typeof exports !== 'undefined') {
        //nodejs
        module.exports = factory(root);
    } else {
        //浏览器直接引入
        Kub.calculator = factory(root);
    }
}(this,function(root){
    //some code
}));

2、底层库采用zepto,underscore

</pre>

### 关于测试
预计采用Jasmine

### 关于发布
1、前期跟随项目文件走

2、后期稳定以后，发布到cdn

### 关于文档
API文档采用jsdoc生成，API文档写在js中

### 使用
<pre>
//类(工厂)
var dialog = new Kub.Dialog({
    //配置参数
});
dialog.close();

//类(单例)
var rem1 = new Kub.Rem({
    //配置参数
});

var rem2 = new Kub.Rem({
    //配置参数
});

rem1 === rem2 //true


//单例
Kub.cookie("name","kubjs");
Kub.cookie("name");
</pre>

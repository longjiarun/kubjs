## 移动端类库 kubjs

### 为什么取名kubjs?

> 在开发中本来就很苦逼（kubi），每天很繁琐。希望有了此框架以后，你的人生将不在苦逼。所以取名为kub。

### 设计思想

> kubjs由非常多的组件构成，组件之间依赖较低。每个组件基本都能独立拿出来使用。然而这些组件结合在一起时，能形成一个非常酷的类库。这也是以后框架的发展趋势。

> 底层采用开源类库zepto.js,unerscore.js。每个组件根据需要决定是否依赖底层类库。

> 组件采用类的方式进行编写，每个组件提供丰富稳定的接口。用户在使用时可以通过参数配置或者继承实现自己定制化的组件。

### 结构图
![](http://img.geilicdn.com/kub1437990758940.png)

### 关于实现

```javascript
1、kubjs不提供模块管理，由第三方提供(requirejs,seajs)

//模块写法，兼容node,amd/cmd,浏览器直接引入
!(function(root,factory){
    var Kub = root.Kub = root.Kub ? root.Kub : {};
    if (typeof module !== "undefined" && module.exports) {
        module.exports = factory(root);
    }else if(typeof define === "function"){
        define(function(){
            return Kub.core = factory(root);
        });
    } else{
        Kub.core = factory(root);
    }
}(this,function(root){
    //some code
}));

2、底层库采用zepto,underscore，部分依赖于hammer

```

### 关于测试

预计采用Jasmine

### 关于发布

- 前期跟随项目文件走

- 后期稳定以后，发布到cdn

### 关于文档

API文档写在js中，采用 [Docker](https://github.com/jbt/docker) 生成文档。语法可参照文档。

文档地址：http://test.hd.koudai.com/api/kub/

>   1、安装 Docker，参照 Docker 文档。

```javascript
    npm install -g docker
```

>   2、运行下面命名，监听js并生成文档。

```javascript
    //生成文档
    docker -i src/js -o docs/html/kub -x lib

    //监听并生成文档
    docker -i src/js -o docs/html/kub -x lib -w
```

>   3、运行下面命名发布文档。

```javascript
    gulp publishdoc;
```

### 关于使用

- 组件依赖关系表，大部分组件默认依赖 zepto 与 underscore；

- swiper 与 datepicker 组件依赖于 hammer 。

- 模块依赖关系表未将基础库放入依赖中，所以在页面中要默认引入基础库；

#### 依赖关系表

```javascript

// require 依赖关系配置

require.config({
    baseUrl:"./js/",
    shim:{
        "lib/kub/alert":{
            deps:["lib/kub/dialog"]
        },
        "lib/kub/confirm":{
            deps:["lib/kub/dialog"]
        },
        "lib/kub/toast":{
            deps:["lib/kub/dialog"]
        },
        "lib/kub/loader":{
            deps:["lib/kub/dialog"]
        },
        "lib/kub/prompt":{
            deps:["lib/kub/dialog"]
        },
        "lib/kub/datepicker":{
            deps:["lib/kub/dialog","lib/kub/date"]
        },
        "lib/kub/datepicker":{
            deps:["lib/kub/dialog","lib/kub/date"]
        },
        "lib/kub/extend/scrolltable":{
            deps:["lib/kub/core","lib/kub/lazyload"]
        },
        "lib/kub/extend/geolocation":{
            deps:["lib/kub/cookie"]
        }
    }
});
```
#### 使用

```javascript
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
```

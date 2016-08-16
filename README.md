# 轻量级移动端组件库 Kub

## 设计

0. Kub 由多个组件构成，组件之间依赖较低；

0. 组件尽量做到轻量且扩展性良好；

0. 组件对外提供稳定的API，在使用时可通过参数配置或者继承实现定制化的组件；

0. 组件采用`commonjs`规范，采用`webpack`编译，对外提供源文件与编译后的文件；

0. 提供模板源文件与预编译后的文件；

0. `Kub`对外提供暴露全局的`Kub`变量，所有组件绑定在该变量中；

0. 样式采用`less`编写，对外提供源文件与编译后的文件；

0. 样式可统一在`variables.less`文件中配置；

0. 对外提供不包含样式的`kub.js`以及包含样式的`kub.style.js`;

## 兼容性

0. ios7及以上版本；
    
0. Android4.0及以上版本；

## 版本

0. 遵循[语义化版本规范](http://semver.org/lang/zh-CN/)；

0. `master`分支为最新的稳定的发布版本；

0. `tags`中的分支对应每一个发布版本；

0. 其余分支为开发分支，为不稳定版本；

0. `1.*` 版本将不再升级与维护，除非有重大bug；

## 安装

### CDN

```
<link rel="stylesheet" type="text/css" href="//assets.geilicdn.com/v-components/kubjs/2.2.0/index.css">

<script type="text/javascript" src="//assets.geilicdn.com/v-components/kubjs/2.2.0/index.js"></script>

<script type="text/javascript" src="//assets.geilicdn.com/v-components/kubjs/2.2.0/index.style.js"></script>
```

### git

```
git clone https://github.com/longjiarun/kubjs.git kub
```

### npm

```
npm install kub --save

//指定版本
npm install kub@version --save
```

### bower

```
bower install kub --save

//指定版本
bower install kub#version --save
```

## 使用

### 使用编译后的文件`kub.js`及`kub.style.js`。

1、如果组件名称首字母大小，则暴露的是类，需实例化；

```
//组件为类
var dialog = new Kub.Dialog({
    //配置参数
});
```

2、如果组件名称首字母小写，则暴露的是对象或函数，无需实例化；

```
//组件为实例化后的对象
Kub.dateHelper.format(new Date(),'yyyy-MM-dd')

//组件为函数
Kub.cookie('name','kub');

//组件为对象
Kub.os.ios
```

### 使用源文件。

1、bower

```
//引用kub.js
var Kub = require('../../bower_components/kub/src/js/kub')

new Kub.Dialog()

//引用单个组件
var Dialog = require('../../bower_components/kub/src/js/dialog')

new Dialog()

//使用less
require('../../bower_components/kub/src/less/dialog.less')
```

2、npm

```
//引用kub.js
var Kub = require('kub')

new Kub.Dialog()

//引用单个组件
var Dialog = require('kub/src/js/dialog')

new Dialog()

//使用less
require('kub/src/less/dialog.less')
```

## 与V1版本的区别

描述与版本V1的区别，方便迁移到版本V2。

0. 模块规范由`umd`修改为`commonjs`;

0. 去除`zepto`、`underscore`、`hammerjs`依赖；

0. 去除`js/extend`目录中的组件；

0. 去除`calculator`组件；

0. 将`os`模块迁移到`detect`中，绑定由`Kub.core.os`迁移到`Kub.os`;

0. 增加`kub.js`与`kub.style.js`文件；

0. 将模板从组件中抽离，提供模板预编译文件；

0. 去除多余API，详见API文档；

0. 将`css`文件夹名称修改为`less`；

0. 将样式可配置项统一配置在`variables.less`中；

0. 在`variables.less`中提供单位可配置变量`@unit: 1px;`;

## 问题

0. 通过[Github issues](https://github.com/longjiarun/kubjs/issues)反馈；

0. 通过[Email](mailto:longjiarun@qq.com)反馈；

## API文档

[查看文档](http://h5.weidian.com/v-components/kubjs/docs/v2.2.0/kub.js.html)

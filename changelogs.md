# 更新日志

## v2.2.0

### 解决的bug

0. 修复 `Datepicker.prototype.getDate` 方法返回多余时间区间问题；

0. 修复 `Dialog` 代码放到 `head` 区域时，无法插入节点；

0. 修复 `Lite.prototype.html` 无法插入 0 问题；

0. 修复 `Lite.prototype.text` 无法插入 0 问题；

0. 修复 `LazyLoad.prototype.isVisible` 对不可见元素检测失败问题；

### 新增功能

0. `LazyLoad` 组件增加`load`加载事件；

## v2.1.0

### 解决的bug

0. 修复`core.setQuerystring`在获取中文参数编码错误问题；

0. 修复`LazyLoad.prototype.load` 链式调用问题；

0. 修复`Lite`事件代理`this`指针指向问题；

0. 修复`Lite`事件代理不允许代理自身问题；

0. 修复`Lite.prototype.remove`无法移除文本节点问题；

### 优化点

0. 将兼容性解决代码抽离到`polyfill.js`中；

### 新增功能

0. 增加`Touch`移动事件组件；

0. 增加`Kub.version`版本号；

0. `Kub.Swiper`增加`auto`自动滚动功能；

## v2.0.3

### 解决的bug

0. 修复`Datepicker`键盘会弹出问题；

0. 修复`core.setQuerystring`会生成不符合规范的`a&a=1`地址；

## v2.0.2

### 解决的bug

0. 修复`Lite.prototype.text`问题；

## v2.0.1

### 解决的bug

0. 修复`swiper`组件切换失效问题；

0. 修复`core.extend`递归问题；

### 优化点

0. 去除`zepto`、`underscore`、`hammerjs`依赖；

0. 去除多余组件；

0. 去除多余不常用的API；

0. 将`os`模块抽离出`core`模块；

0. 增加`Lite`模块；

0. 增加嵌入样式到js中；

0. `Loader`组件增加可配置文案功能；

0. `setQuerystring`方法中`append`默认设置为`true`;

0. 增加样式可配置功能；

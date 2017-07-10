# 更新日志

## V2.4.0

### 新增功能

0. `lazyload` 组件新增校验是否支持webp格式方法`lazyload.prototype.isSoupportWebp`;
1. `lazyload` 组件初始化入参新增`imgToWebp`配置项，是否开启webp格式；

### 解决的bug

0. 修复`Datepicker`组件 && `swiper`组件在andriod7.0机型上面时间轴浮层滚动透传的问题；
1. `Datepicker`界面样式渐变属性`linear-gradient`写法向上兼容；

## v2.3.0

### 新增功能

0. 新增 `Popup` 组件；

1. 将 `Datepicker` 界面从 `Dialog` 换成 `Popup`;

## v2.2.0

### 解决的bug

0. 修复 `Datepicker.prototype.getDate` 方法返回多余时间区间问题；

1. 修复 `Dialog` 代码放到 `head` 区域时，无法插入节点；

2. 修复 `Lite.prototype.html` 无法插入 0 问题；

3. 修复 `Lite.prototype.text` 无法插入 0 问题；

4. 修复 `LazyLoad.prototype.isVisible` 对不可见元素检测失败问题；

### 新增功能

0. `LazyLoad` 组件增加`load`加载事件；

## v2.1.0

### 解决的bug

0. 修复`core.setQuerystring`在获取中文参数编码错误问题；

1. 修复`LazyLoad.prototype.load` 链式调用问题；

2. 修复`Lite`事件代理`this`指针指向问题；

3. 修复`Lite`事件代理不允许代理自身问题；

4. 修复`Lite.prototype.remove`无法移除文本节点问题；

### 优化点

0. 将兼容性解决代码抽离到`polyfill.js`中；

### 新增功能

0. 增加`Touch`移动事件组件；

1. 增加`Kub.version`版本号；

2. `Kub.Swiper`增加`auto`自动滚动功能；

## v2.0.3

### 解决的bug

0. 修复`Datepicker`键盘会弹出问题；

1. 修复`core.setQuerystring`会生成不符合规范的`a&a=1`地址；

## v2.0.2

### 解决的bug

0. 修复`Lite.prototype.text`问题；

## v2.0.1

### 解决的bug

0. 修复`swiper`组件切换失效问题；

1. 修复`core.extend`递归问题；

### 优化点

0. 去除`zepto`、`underscore`、`hammerjs`依赖；

1. 去除多余组件；

2. 去除多余不常用的API；

3. 将`os`模块抽离出`core`模块；

4. 增加`Lite`模块；

5. 增加嵌入样式到js中；

6. `Loader`组件增加可配置文案功能；

7. `setQuerystring`方法中`append`默认设置为`true`;

8. 增加样式可配置功能；

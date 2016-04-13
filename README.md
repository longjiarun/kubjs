# 开发中，勿用

## 移动端类库 kubjs

### 为什么取名kubjs?

> 在开发中本来就很苦逼（kubi），每天很繁琐。希望有了此框架以后，你的人生将不在苦逼。所以取名为kub。

### 设计思想


### 结构图
![](http://img.geilicdn.com/kub1437990758940.png)

#### 使用

```
//类(工厂)
var dialog = new Kub.Dialog({
    //配置参数
});
dialog.close();

//单例
Kub.cookie("name","kubjs");
Kub.cookie("name");
```

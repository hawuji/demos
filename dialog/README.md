## 功能说明
- 实现对话框的基本功能
- 弹出对话框的按钮样式及个数的自定义
- 弹出对话框的类型及文字说明
- 回调函数的实现
- 演示地址[http://hawuji.github.io/js-demos/dialog/](http://hawuji.github.io/js-demos/dialog/)，PC端在模拟移动端环境中查看。

## 默认配置
```javascript
width: "auto", //对话框宽高
height: "auto",
message: null, //信息框
type: "waiting", //对话框类型
buttons: null, //按钮组配置
delay: null, //弹出框延时多久关闭
delayCallback:null, //延时回调函数
maskOpacity: null, //对话框透明度
maskClose: null, //点击遮罩层是否关闭
effect: null //是否开启动画
```

## 知识点
- 弹出框组件的基本结构及参数配置
- 基本的DOM结构操作
- 弹性布局的简单应用
- CSS3实现图标设计（未完成）
- 事件冒泡
- 移动端click事件300ms
- 移动端常用的mate标签如是否允许缩放，是否全屏等
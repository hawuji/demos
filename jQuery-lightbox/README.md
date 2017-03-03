##插件说明
- 基于jQuery的Lightbox插件
- 支持IE9+
- 演示地址：[http://hawuji.com/js-demos/jQuery-lightbox/](http://hawuji.com/js-demos/jQuery-lightbox/)

##参数配置
```js
speed:400,
maxWidth:900, //未完善
maxHeight:600 //未完善
```

##图片结构说明
```html
class="js-lightbox"		//是否启用Lightbox
data-role="light"		//是否启用Lightbox，功能同上
data-source="images/1.jpg" //图片的原始地址
data-group="grout-1"	//图片所在组
data-id="title1"		//图片的id,唯一，用来判断当前图片所在位置
data-caption="图片" 		//图片的描述文字
```

##知识点
- 基本的DOM节点的获取、创建、添加
- jQuery API的应用
	- 添加事件、事件委托、事件冒泡、创建添加节点
	- DOM位置、尺寸、动画过度、显示隐藏
	- 数组的基本操作
- 熟悉原生JS的this、prototype、new等使用方法
- 面向对象化编程（工厂模式、原型模式、混合模式）









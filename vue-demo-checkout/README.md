## 使用Vue2.0实现购物车结算功能
熟悉Vue的基本使用，实现购物车的基本功能：
- 商品列表展示
- 全选和取消全选商品
- 商品数量的变动和删除
- 实时计算的单个商品的总价和全部商品的总价
- 配送地址删除及限制展示个数
- 设置默认收货地址
- 选择配送方式

演示地址：[http://hawuji.github.io/js-demos/vue-demo-checkout/chart.html](http://hawuji.github.io/js-demos/vue-demo-checkout/chart.html)
##知识点
- Vue的基本结构：
```js
var vm = new Vue({
	el:'',
	var data :{},
	filters:{},
	mounted:function(){},
	methods:{},
})
```
- 模板语法的使用：v-for,v-on,v-if,v-bind,Filters(过滤器)
- 在复杂交互及组件化开发中适合使用
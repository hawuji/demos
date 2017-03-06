var vm = new Vue({
    el: "#app",
    data: {
        totalMoney: 0,
        productList: [],
        checkAllFlag: false,
        delFlag: false,
        curProduct: '',
        checkNum: 0
    },
    filters: {
        formatMoney: function(value) {
            return "￥" + value.toFixed(2);
        }
    },
    mounted: function() {
        this.cartView();
    },
    methods: {
        //获取购物车中的商品
        cartView: function() {
            var self = this;
            this.$http.get("data/cart.json", { "id": 123 }).then(function(res) {
                self.productList = res.body.result.productList;
                //在工作中这些计算都是要由后台返回数据的
                //self.totalMoney = res.body.result.totalMoney;
            });
        },
        //改变单个商品的总价
        changeMoney: function(product, way) {
            if (way > 0) {
                product.productQuentity++;
            } else {
                if (product.productQuentity > 1) {
                    product.productQuentity--;
                }
            }
            //自动选中当前商品
            this.$set(product, "checked", true);
            this.allCheckde(product);
            this.calcTotalPrice();
        },
        //设置单项选择
        selectedProduct: function(item) {
            if (typeof item.checked == "undefined") {
                this.$set(item, "checked", true);
                //另一种设置未监听的变量方法
                //Vue.set(item,"checked",true);
            } else {
                item.checked = !item.checked;
            }
            this.allCheckde(item);
            this.calcTotalPrice();
        },
        //检查是否已经全选
        allCheckde: function(item) {
            var self = this;
            self.checkNum = 0;
            //当选中全部产品时，全选按钮为选中状态
            this.productList.forEach(function(item) {
                if (item.checked) {
                    self.checkNum++;
                }
            });
            self.checkAllFlag = self.checkNum == this.productList.length ? true : false;
        },
        //设置全选
        checkAll: function(flag) {
            var self = this;
            this.checkAllFlag = flag;
            this.productList.forEach(function(item, index) {
                if (typeof item.checked == "undefined") {
                    self.$set(item, "checked", self.checkAllFlag);
                } else {
                    item.checked = self.checkAllFlag;
                }
            });
            this.calcTotalPrice();
        },
        //计算总金额
        calcTotalPrice: function() {
            var self = this
            this.totalMoney = 0;
            this.productList.forEach(function(item, index) {
                if (item.checked) {
                    self.totalMoney += item.productPrice * item.productQuentity;
                }
            })
        },
        //删除商品
        delConfirm: function(item) {
            this.delFlag = true;
            this.curProduct = item;
        },
        delProduct: function() {
            var index = this.productList.indexOf(this.curProduct);
            this.productList.splice(index, 1);
            this.delFlag = false;
            this.calcTotalPrice();
        }
    }
});

new Vue({
    el: '.container',
    data: {
        limitNum: 3,
        currentIndex: 0,
        shippingMethod: 0,
        addressList: []
    },
    mounted: function() {
        this.$nextTick(function() {
            this.getAddressList();
        })
    },
    computed: {
        fiterAddress: function() {
            return this.addressList.slice(0, this.limitNum);
        }
    },
    methods: {
        getAddressList: function() {
            var self = this;
            this.$http.get("data/address.json").then(function(response) {
                var res = response.data;
                if (res.status == "1") {
                    self.addressList = res.result;
                }
            })
        },
        //加载更多地址
        loadMore: function() {
            if (this.limitNum == this.addressList.length) {
                this.limitNum = 3;
            } else {
                this.limitNum = this.addressList.length;
            }
        },
        //设置默认地址
        setDefault: function(addressId) {
            this.addressList.forEach(function(address, index) {
                if (address.addressId == addressId) {
                    address.isDefault = true;
                } else {
                    address.isDefault = false;
                }
            })
        },
        //删除地址
        delAddress: function(item) {
            var index = this.addressList.indexOf(item);
            console.log(index);
            this.addressList.splice(index, 1);
        }
    }
})
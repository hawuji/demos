(function($) {
    "use strict";

    function CusScrollBar(options) {
        this._init(options);
    }

    $.extend(CusScrollBar.prototype, {
        _init: function(options) {
            var self = this;
            self.options = {
                scrollDir: "y", // 滚动的方向
                contSelector: "", // 滚动内容区选择器
                barSelector: "", // 滚动条选择器
                sliderSelector: "", // 滚动滑块选择器
                tabItemSelector: "", // 标签选择器
                tabActiveClass: "active", // 选中时标签类名
                anchorSelector: "", // 锚点选择器
                wheelStep: 10, // 滚轮步长
                correctSelector: ".correct-bot", //校正元素
                articleSelector: "" // 文章选择器
            }
            $.extend(true, self.options, options || {});

            console.log(self.options.contSelector);
            self._initDomEvent();
            return self;

        },
        /**
         * 初始化DOM引用
         * @method _initDomEvent
         * @return {CusScrollBar}
         */
        _initDomEvent: function() {
            var opts = this.options;
            // 滚动内容区对象
            this.$cont = $(opts.contSelector);
            // 滚动条滑块对象,必填
            this.$slider = $(opts.sliderSelector);
            // 滚动条对象
            this.$bar = opts.barSelector ? $(opts.barSelector) : self.$slider.parent();
            //获取文档对象
            this.$doc = $(document);
            //标签项
            this.$tabItem = $(opts.tabItemSelector);
            //锚点
            this.$anchor = $(opts.anchorSelector);
            //正文
            this.$article = $(opts.articleSelector);
            //校正元素
            this.$correct = $(opts.correctSelector);
            this._initArticleHeight()
                ._initSliderDragEvent()
                ._initTabEvent()
                ._bindContScroll()
                ._bindMousewheel();
        },
        /**
         * 初始化文档高度
         */
        _initArticleHeight: function() {
            var self = this,
                lastArticle = self.$article.last();

            var lastArticleHeight = lastArticle.height(),
                contHeight = self.$cont.height();

            if (lastArticleHeight < contHeight) {
                self.$correct[0].style.height = contHeight - lastArticleHeight - self.$anchor.outerHeight() + "px";
            }
            return self;
        },
        /**
         * 初始化滑块拖动功能
         * @type {[type]}
         */
        _initSliderDragEvent: function() {
            var slider = this.$slider,
                sliderEl = slider[0];
            var self = this;
            if (sliderEl) {
                var doc = this.$doc,
                    dragStartPagePosition,
                    dragStartScrollPosition,
                    dragContBarRate;

                function mousemoveHandler(e) {
                    e.preventDefault();
                    console.log("mousemove");
                    if (dragStartPagePosition == null) {
                        return;
                    }
                    self.scrollTo(dragStartScrollPosition + (e.pageY - dragStartPagePosition) * dragContBarRate);
                }
                slider.on("mousedown", function(e) {
                    e.preventDefault();
                    console.log("mousedown");
                    dragStartPagePosition = e.pageY;
                    dragStartScrollPosition = self.$cont[0].scrollTop;
                    dragContBarRate = self.getMaxScrollPosition() / self.getMaxSliderPosition();
                    doc.on("mousemove.scroll", mousemoveHandler).on("mouseup.scroll", function(e) {
                        console.log("mouseup");
                        doc.off(".scroll");
                    });
                })
            }
            return self;
        },
        //初始化标签切换功能
        _initTabEvent: function() {
            var self = this;
            self.$tabItem.on("click", function(e) {
                e.preventDefault();
                var index = $(this).index();
                self.changeTabSelect(index);
                self.scrollTo(self.$cont[0].scrollTop + self.getAnchorPosition(index));
            })
            return self;
        },
        //监听内容的滚动，同步滑块的位置
        _bindContScroll: function() {
            var self = this;
            self.$cont.on("scroll", function() {
                var sliderEl = self.$slider && self.$slider[0];
                if (sliderEl) {
                    sliderEl.style.top = self.getSliderPosition() + "px";
                }
            });
            return self;
        },

        //滚轮事件
        _bindMousewheel: function() {
            var self = this;

            self.$cont.on("mousewheel DOMMouseScroll", function(e) {
                e.preventDefault();
                var oEv = e.originalEvent,
                    wheelRange = oEv.wheelDelta ? -oEv.wheelDelta / 120 : (oEv.detail || 0) / 3;
                self.scrollTo(self.$cont[0].scrollTop + wheelRange * self.options.wheelStep);
            });
        },

        //计算滑块的当前位置
        getSliderPosition: function() {
            var self = this,
                maxSliderPostion = self.getMaxSliderPosition();
            return Math.min(maxSliderPostion, maxSliderPostion * self.$cont[0].scrollTop / self.getMaxScrollPosition());
        },
        //内容可滚动高度
        getMaxScrollPosition: function() {
            var self = this;
            //如果到这一步没有效果，输出一下返回值，也许是$cont的参数传错了应该传“.scroll-cont”
            return Math.max(self.$cont.height(), self.$cont[0].scrollHeight) - self.$cont.height();
        },
        // 滑块可移动的矩离
        getMaxSliderPosition: function() {
            var self = this;
            return self.$bar.height() - self.$slider.height();
        },
        //切换标签选中
        changeTabSelect: function(index) {
            var self = this,
                active = self.options.tabActiveClass;
            return self.$tabItem.eq(index).addClass(active).siblings().removeClass(active);
        },
        //获取指定锚点到上边界的像素数
        getAnchorPosition: function(index) {
            return this.$anchor.eq(index).position().top;
        },
        //获取每个锚点位置信息的数组
        getAllAnchorPosition: function() {
            var self = this,
                allPositionArr = [];
            for (var i = 0; i < self.$anchor.length; i++) {
                allPositionArr.push(self.$cont[0].scrollTop + self.getAnchorPosition(i));
            };
            return allPositionArr;
        },
        scrollTo: function(positionVal) {
            var self = this;
            var posArr = self.getAllAnchorPosition();
            //滚动条的位置与tab标签的位置对应
            function getIndex(positionVal) {
                for (var i = posArr.length - 1; i >= 0; i--) {
                    if (positionVal >= posArr[i]) {
                        return i;
                    } else {
                        continue;
                    }
                };
            }
            //锚点数与标签数相同
            if (posArr.length == self.$tabItem.length) {
                self.changeTabSelect(getIndex(positionVal));
            }
            self.$cont.scrollTop(positionVal);
        }
    });

    window.CusScrollBar = CusScrollBar;
})(jQuery);

//实例化
new CusScrollBar({
    contSelector: ".scroll-cont", // 滚动内容区选择器（必须）
    barSelector: ".scroll-bar", // 滚动条选择器
    sliderSelector: ".scroll-slider", // 滚动滑块选择器
    tabItemSelector: ".tab-item", // 标签选择器（必须）
    tabActiveClass: "active", // 选中标签类名
    anchorSelector: ".anchor", // 苗点选择器（必须）
    wheelStep: 15, // 滚轮步长
    correctSelector: ".correct-bot", //校正元素
    articleSelector: ".scroll-ol" // 文章选择器
});

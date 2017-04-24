(function($) {
    "use strict";

    var Tab = function(tab) {
        var self = this;
        //保存单个tab
        this.tab = tab;
        //默认配置参数
        this.config = {
            "triggerType": "mouseover",
            "effect": "default",
            "invoke": 1,
            "auto": false
        };

        //如果配置参数不存在就扩展掉默认的配置参数
        if (this.getConfig()) {
            $.extend(this.config, this.getConfig());
        };

        //保存tab标签列表，对应的内容列表
        this.tabItems = this.tab.find("ul.tab-nav li");
        this.contentItems = this.tab.find("div.content-wrap div.content-item");

        //保存配置参数
        var config = this.config;

        if (config.triggerType === "click") {
            this.tabItems.bind(config.triggerType, function() {
                self.invoke($(this));
            });
        } else if (config.triggerType === "mouseover" || config.triggerType != "click") {
            this.tabItems.mouseover(function(e) {
                self.invoke($(this));
                //阻止事件冒泡否则自动切换功能会失效
                e.stopPropagation();
            });
        };

        //自动切换功能
        if (config.auto) {
            //定义一个全局定时器
            this.timer = null;
            //计数器
            this.loop = 0;

            this.autoPlay();
            this.tab.hover(function() {
                window.clearInterval(self.timer);
            }, function() {
                self.autoPlay();
            });
        };

        //设置默认显示第几个
        if (config.invoke > 1) {
            this.invoke(this.tabItems.eq(config.invoke - 1));
        }

    };

    Tab.prototype = {

        //自动切换
        autoPlay: function() {
            var self = this,
                tabItems = this.tabItems,
                tabLength = tabItems.size(),
                config = this.config;

            this.timer = window.setInterval(function() {

                self.loop++;

                if (self.loop >= tabLength) {
                    self.loop = 0;
                };
                tabItems.eq(self.loop).trigger(config.triggerType);
            }, config.auto);
        },

        //事件驱动函数
        invoke: function(currentTab) {

            var self = this;
            /**
             * 要执行Tab的选中状态，当前选中的加上active
             * 切换对应的tab内容，要根据配置参数中的effect是default还是fade
             */
            var index = currentTab.index();

            //tab选中状态
            currentTab.addClass('active').siblings().removeClass('active');
            //切换对应的内容区域
            var effect = this.config.effect;
            var conItems = this.contentItems;
            console.log(effect);

            if (effect === "default" || effect != "fade") {
                conItems.eq(index).addClass('current').siblings().removeClass('current');
            } else if (effect === "fade") {
                conItems.eq(index).fadeIn().siblings().fadeOut();
            };

            //index和loop同步
            if (this.config.auto) {
                this.loop = index;
            }
        },

        //获取配置参数
        getConfig: function() {

            //获取tab elem节点上的data-config
            var config = this.tab.attr("data-config");

            //确保有配置参数
            if (config && config != "") {
                return $.parseJSON(config);
            } else {
                return null;
            }
        }
    };

    //多个tab自动处理
    Tab.init = function(tabs) {
        var self = this;
        tabs.each(function() {
            new self($(this));
        })
    }

    //注册成jQuery方法
    $.fn.extend({
        tab: function() {
            this.each(function() {
                new Tab($(this));
            });

            return this;
        }
    });

    window.Tab = Tab;

})(jQuery);
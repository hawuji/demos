;(function($) {

    var Dialog = function(config) {
        var _this_ = this;
        //默认配置
        this.config = {
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

        };

        //默认参数扩展
        if (config && $.isPlainObject(config)) {
            $.extend(this.config, config);
        } else {
            this.isConfig = true;
        }
        console.log(this.config);

        //创建基本的DOM
        this.body = $("body");
        //创建遮罩
        this.mask = $('<div class="g-dialog-contianer">');
        //创建弹出框
        this.win = $('<div class="dialog-window">');
        //创建弹出框头部
        this.winHeader = $('<div class="dialog-header"></div>');
        //创建提示信息
        this.winContent = $('<div class="dialog-content">');
        //创建弹出框按钮
        this.winFooter = $('<div class="dialog-footer">');

        //渲染Dom
        this.creat();


    };

    Dialog.index = 10000;

    Dialog.prototype = {
        //创建弹出框
        creat: function() {
            var _this_ = this;
                config = this.config,
                mask = this.mask,
                win = this.win,
                header = this.winHeader,
                content = this.winContent,
                footer = this.winFooter,
                body = this.body;
            Dialog.index++;
            this.mask.css("zIndex", Dialog.index++)

            //如果没有传递任何配置参数就弹出一个等待的对话框
            if (this.isConfig) {
                win.append(header.addClass('waiting'));
                if (config.effect) this.animate();
                mask.append(win);
                body.append(mask);
            } else {
                //根据配置参数创建相应的弹框
                header.addClass(config.type);
                win.append(header);

                //设置提示信息
                if (config.message) {
                    win.append(content.html(config.message));
                };

                //按钮组
                if (config.buttons) {
                    this.creatButtons(footer, config.buttons);
                    win.append(footer);
                };

                //插入到页面
                mask.append(win);
                body.append(mask);
                //设置弹出框的宽高
                if (config.width != "auto") {
                    win.width(config.width);
                };
                if (config.height != "auto") {
                    win.height(config.height);
                };
                //对话框的遮罩层透明度
                if (config.maskOpacity) {
                    mask.css("backgroundColor", "rgba(0,0,0," + config.maskOpacity + ")")
                };
                //设置遮罩层
                if (config.maskClose) {
                    mask.click(function() {
                        _this_.close();
                    });
                };
                //设置弹出框显示多久关闭
                if (config.delay && config.delay != 0) {
                    window.setTimeout(function() {
                        _this_.close();
                        //执行延时的回调函数
                        config.delayCallback && config.delayCallback();
                    }, config.delay);
                };
                //设置动画效果
                if (config.effect) {
                    this.animate();
                };
            };
        },
        //根据配置参数的buttons创建按钮的个数
        creatButtons: function(footer, buttons) {
            var _this_ = this;

            $(buttons).each(function() {
                /**
                 {
                    type:"red",
                    text:"不好",
                    callback:function(){

                    }
                }
                 */
                //获取按钮的样式及回调
                var type = this.type ? " class='" + this.type + "'" : "";
                var btnText = this.text ? this.text : "按钮" + (++i);
                var callback = this.callback ? this.callback : null;
                var button = $("<button" + type + ">" + btnText + "</button>");

                footer.append(button);
                if (callback) {
                    button.click(function(e) {
                        var isClose = callback();
                        //阻止事件冒泡
                        e.stopPropagation();
                        if (isClose != false) {
                            _this_.close();
                        }
                    });
                } else {
                    button.click(function() {
                        //阻止事件冒泡
                        e.stopPropagation();
                        _this_.close();
                    });
                }
            });
        },
        close: function() {
            this.mask.remove();
        },
        //动画效果
        animate: function() {
            this.win.css("-webkit-transform", "scale(0,0)");
            window.setTimeout(function() {
                this.win.css("-webkit-transform", "scale(1,1)");
            }, 100);
        }

    };

    window.Dialog = Dialog;

    $.dialog = function(config) {
        return new Dialog(config);
    }

})(Zepto);
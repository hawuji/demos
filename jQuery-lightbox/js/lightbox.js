;(function() {
    var LightBox = function(settings) {
        var self = this;
        this.settings = {
            speed: 500
        };
        $.extend(this.settings, settings || {});
        //创建遮罩层和弹出层
        this.popupMask = $('<div id="lightbox-mask"></div>');
        this.popupWin = $('<div id="lightbox-popup">');

        //保存body
        this.bodyNode = $(document.body);

        //渲染剩余的DOM并且插入到body
        this.renderDOM();

        this.picViewArea = this.popupWin.find(".lightbox-pic-view");
        this.popupPic = this.popupWin.find(".light-img");
        this.picCaptionArea = this.popupWin.find(".lightbox-caption-area");
        this.nextBtn = this.popupWin.find("span.btn-right");
        this.prevBtn = this.popupWin.find("span.btn-left");
        this.captionText = this.popupWin.find(".lightbox-tit");
        this.currentIndex = this.popupWin.find(".lightbox-of-index");
        this.closeBtn = this.popupWin.find(".lightbox-close");

        //准备开发事件委托，获取图片数组
        this.groupName = null;
        this.groupData = [];
        this.bodyNode.delegate(".js-lightbox,*[data-role=light]", "click", function(e) {
            e.stopPropagation();

            var currentGroupName = $(this).attr("data-group");
            if (currentGroupName != self.groupName) {
                self.groupName = currentGroupName;
                //更新当前组名获取同一组的数据
                self.getGroup();
            };
            //初始化弹出
            self.initPopup($(this));

        });
        //关闭弹出
        this.popupMask.click(function() {
            $(this).fadeOut();
            self.popupWin.fadeOut();
            self.clear = false;
        });
        this.closeBtn.click(function() {
            self.popupMask.fadeOut();
            self.popupWin.fadeOut();
            this.clear = false;
        });

        //绑定上下切换按钮
        this.flag = true;
        this.nextBtn.hover(function() {
            if (!$(this).hasClass('disabled') && self.groupData.length > 1) {
                $(this).addClass('btn-show-right');
            };
        }, function() {
            if (!$(this).hasClass('disabled') && self.groupData.length > 1) {
                $(this).removeClass('btn-show-right');
            };
        }).click(function(e) {
            if (!$(this).hasClass("disabled") && self.flag) {
                self.flag = false;
                e.stopPropagation();
                self.goto("next");
            }
        });

        this.prevBtn.hover(function() {
            if (!$(this).hasClass('disabled') && self.groupData.length > 1) {
                $(this).addClass('btn-show-left');
            };
        }, function() {
            if (!$(this).hasClass('disabled') && self.groupData.length > 1) {
                $(this).removeClass('btn-show-left');
            };
        }).click(function(e) {
            if (!$(this).hasClass('disabled') && self.flag) {
                self.flag = false;
                e.stopPropagation();
                self.goto("prev");
            };
        });
        //绑定窗口调整事件及键盘方向键控制
        var timer = null;
        this.clear = false;
        $(window).resize(function() {
            if (self.clear) {
                window.clearTimeout(timer);
                timer = window.setTimeout(function() {
                    self.loadPicSize(self.groupData[self.index].src)
                }, 500);
            };
        }).keyup(function(e) {
            var keyValue = e.which;
            if (keyValue == 38 || keyValue == 37) {
                self.prevBtn.click();
            } else if (keyValue == 40 || keyValue == 39) {
                self.nextBtn.click();
            }
        });
    };
    LightBox.prototype = {
        goto: function(dir) {
            if (dir === "next") {
                this.index++;
                if (this.index >= this.groupData.length - 1) {
                    this.nextBtn.addClass('disabled').removeClass('btn-show-right');
                }
                if (this.index != 0) {
                    this.prevBtn.removeClass('disabled');
                }
                var src = this.groupData[this.index].src;
                this.loadPicSize(src);
            } else if (dir === "prev") {
                this.index--;
                if (this.index <= 0) {
                    this.prevBtn.addClass('disabled').removeClass("btn-show-left");
                };
                if (this.index != this.groupData.length - 1) {
                    this.nextBtn.removeClass('disabled');
                };

                var src = this.groupData[this.index].src;
                this.loadPicSize(src);
            }
        },
        loadPicSize: function(sourceSrc) {
            var self = this;
            self.popupPic.css({
                width: "auto",
                height: "auto"
            }).hide();
            this.picCaptionArea.hide();
            this.preLoadImg(sourceSrc, function() {
                self.popupPic.attr("src", sourceSrc);
                var picWidth = self.popupPic.width(),
                    picHeight = self.popupPic.height();
                console.log(picWidth + ":" + picHeight);

                self.changePic(picWidth, picHeight);
            })
        },
        changePic: function(width, height) {
            var self = this,
                winWidth = $(window).width(),
                winHeight = $(window).height();

            //如果图片的宽高是否溢出
            var scale = Math.min(winWidth / (width + 10), winHeight / (height + 10), 1);

            width = width * scale;
            height = height * scale;

            this.picViewArea.animate({
                width: width - 10,
                height: height - 10
            }, self.settings.speed);

            this.popupWin.animate({
                width: width,
                height: height,
                marginLeft: -(width / 2),
                top: (winHeight - height) / 2
            }, self.settings.speed, function() {
                self.popupPic.css({
                    width: width - 10,
                    height: height - 10
                }).fadeIn();
                self.picCaptionArea.fadeIn();
                self.flag = true;
                self.clear = true;
            });

            //设置描述文字和当前索引
            this.captionText.text(this.groupData[this.index].caption);
            this.currentIndex.text("当前索引： " + (this.index + 1) + " of " + this.groupData.length);
        },
        //加载图片
        preLoadImg: function(src, callback) {
            var img = new Image();
            if (!!window.ActiveXobject) {
                img.onreadstatechange = function() {
                    if (this.readState == "complete") {
                        callback();
                    };
                };
            } else {
                img.onload = function() {
                    callback();
                };
            };
            img.src = src;
        },
        //显示遮罩层
        showMaskAndPopup: function(sourceSrc, currentId) {
            var self = this;
            this.popupPic.hide();
            this.picCaptionArea.hide();
            this.popupMask.fadeIn();

            var winWidth = $(window).width(),
                winHeight = $(window).height();

            this.picViewArea.css({
                width: winWidth / 2,
                height: winHeight / 2
            });

            this.popupWin.fadeIn();
            var viewHeight = winHeight / 2 + 10;
            this.popupWin.css({
                width: winWidth / 2 + 10,
                height: winHeight / 2 + 10,
                marginLeft: -(winWidth / 2 + 10) / 2,
                top: -winHeight
            }).animate({
                top: (winHeight - viewHeight) / 2,
            }, self.settings.speed, function() {
                //加载图片
                self.loadPicSize(sourceSrc);
            });

            //根据当前点击的元素ID获取在当前组里的索引
            this.index = this.getIndexOf(currentId);
            //判断当前图片的位置来决定是否显示上下按钮
            var groupDataLength = this.groupData.length;
            if (groupDataLength > 1) {
                if (this.index === 0) {
                    this.prevBtn.addClass("disabled");
                    this.nextBtn.removeClass('disabled');
                } else if (this.index === groupDataLength - 1) {
                    this.nextBtn.addClass('disabled');
                    this.prevBtn.removeClass('disabled');
                } else {
                    this.nextBtn.removeClass('disabled');
                    this.prevBtn.removeClass('disabled');
                }
            }

        },

        //获取当前图片
        getIndexOf: function(currentId) {
            var index = 0;
            $(this.groupData).each(function(i) {
                index = i;
                if (this.id === currentId) {
                    return false;
                };
            });
            return index;
        },
        initPopup: function(currentObj) {
            var self = this,
                sourceSrc = currentObj.attr("data-source"),
                currentId = currentObj.attr("data-id");

            this.showMaskAndPopup(sourceSrc, currentId);

        },
        getGroup: function() {
            var self = this;
            //根据当前组别名获取所有相同组别数据
            var groupList = this.bodyNode.find("[data-group=" + this.groupName + "]");

            //清空数组数据，防止点击下一组时还保留当前组中的图片
            self.groupData.length = 0;
            groupList.each(function() {
                self.groupData.push({
                    src: $(this).attr("data-source"),
                    id: $(this).attr("data-id"),
                    caption: $(this).attr("data-caption")
                })
            });
            console.log(self.groupData);
        },

        renderDOM: function() {
            var strDOM = '<div class="lightbox-pic-view">' +
                            '<span class="light-btn btn-left"></span>' +
                            '<img class="light-img" src="images/1.jpg" alt="">' +
                            '<span class="light-btn btn-right"></span>' +
                        '</div>' +
                        '<div class="lightbox-pic-caption">' +
                            '<div class="lightbox-caption-area">' +
                                '<p class="lightbox-tit">图片名称</p>' +
                                '<span class="lightbox-of-index">当前索引: 1/4</span>' +
                                '<sapn class="lightbox-close"></sapn>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
            this.popupWin.html(strDOM);
            //把遮罩和弹出框插入到body
            this.bodyNode.append(this.popupMask, this.popupWin);
        }
    }
    window['LightBox'] = LightBox;
})(jQuery);
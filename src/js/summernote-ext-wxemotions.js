(function(factory) {
    /* global define */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function($) {

    // Extends plugins for adding wxemotions.
    //  - plugin is external module for customizing.
    $.extend($.summernote.plugins, {
        /**
         * @param {Object} context - context object has status of editor.
         */
        'wxemotions': function(context) {

            // ui has renders to build ui elements.
            //  - you can create a button with `ui.button`
            var ui = $.summernote.ui;
            var url = "https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/";

            var emoticondata = [
                ["微笑", "撇嘴", "色", "发呆", "得意", "流泪", "害羞", "闭嘴", "睡", "大哭", "尴尬", "发怒", "调皮", "呲牙", "惊讶"],
                ["难过", "酷", "冷汗", "抓狂", "吐", "偷笑", "可爱", "白眼", "傲慢", "饥饿", "困", "惊恐", "流汗", "憨笑", "大兵"],
                ["奋斗", "咒骂", "疑问", "嘘", "晕", "折磨", "衰", "骷髅", "敲打", "再见", "擦汗", "抠鼻", "鼓掌", "糗大了", "坏笑"],
                ["左哼哼", "右哼哼", "哈欠", "鄙视", "委屈", "快哭了", "阴险", "亲亲", "吓", "可怜", "菜刀", "西瓜", "啤酒", "篮球", "乒乓"],
                ["咖啡", "饭", "猪头", "玫瑰", "凋谢", "示爱", "爱心", "心碎", "蛋糕", "闪电", "炸弹", "刀", "足球", "瓢虫", "便便"],
                ["月亮", "太阳", "礼物", "拥抱", "强", "弱", "握手", "胜利", "抱拳", "勾引", "拳头", "差劲", "爱你", "NO", "OK"],
                ["爱情", "飞吻", "跳跳", "发抖", "怄火", "转圈", "磕头", "回头", "跳绳", "挥手", "激动", "街舞", "献吻", "左太极", "右太极"],
            ];
            var emoticonInit = function(options, $node) {
                var contents = [];
                for (var row = 0, rowSize = options.emoticons.length; row < rowSize; row++) {
                    var eventName = options.eventName;
                    var emoticons = options.emoticons[row];
                    var buttons = [];
                    for (var col = 0, colSize = emoticons.length; col < colSize; col++) {
                        var em = emoticons[col];
                        var left = row * 15 * 24 + col * 24;
                        var idx = row * 15 + col;
                        buttons.push([
                            '<div class="emotions_item">',
                            '<i data-event="', eventName, '" ',
                            'data-value="', idx, '" ',
                            'data-title="', em, '" ',
                            'title="', em, '" ',
                            'tabindex="-1" style="background-position:-', left, 'px"></i></div>'
                        ].join(''));
                    }
                    contents.push('<div class="note-emo-row">' + buttons.join('') + '</div>');
                }
                $node.html(contents.join(''));

                $node.find('.emotions_item').tooltip({
                    container: 'body',
                    trigger: 'hover',
                    placement: 'bottom'
                });
            };
            // add wxemotions button
            context.memo('button.wxemotions', function() {
                // create button
                var button = ui.buttonGroup({
                    className: 'emotion_wrp',
                    children: [
                        ui.button({
                            contents: '<i class="fa fa-smile-o"/> 表情',
                            tooltip: '表情',
                            data: {
                                toggle: 'dropdown'
                            },
                            click: function(e) {
                                context.invoke('editor.saveRange');
                            }
                        }),
                        ui.dropdownCheck({
                            items: [
                                '<div class="btn-group">',
                                '  <div class="note-holder" data-event="insertNode"/>',
                                '</div><div class="emotionsGif"></div>',
                            ].join(''),
                            callback: function($dropdown) {
                                $dropdown.find('.note-holder').each(function() {
                                    var $holder = $(this);
                                    $holder.append(emoticonInit({
                                        emoticons: emoticondata,
                                        eventName: $holder.data('event')
                                    }, $(this)));
                                }).on("mouseover", function(event) {
                                    var $button = $(event.target);
                                    var eventName = $button.data('event');
                                    var value = $button.data('value');
                                    var egif = $button.closest(".btn-group").siblings('.emotionsGif');
                                    if (eventName && value) {
                                        $(egif).show();
                                        var imgurl = url + value.toString() + ".gif";
                                        var img = new Image();
                                        img.src = imgurl;
                                        var $img = $(img);
                                        img.onload = function() {
                                            if (egif.length > 0) {
                                                $(egif).empty().append($img)
                                            }
                                        }
                                    } else {
                                        $(egif).hide();
                                    }
                                });
                            },
                            click: function(event) {
                                var $button = $(event.target);
                                var eventName = $button.data('event');
                                var value = $button.data('value');
                                context.invoke('editor.restoreRange');
                                context.invoke('editor.focus');
                                if (eventName && value) {
                                    var title = $button.data('title');
                                    var imgurl = url + value.toString() + ".gif";

                                    // context.invoke('editor.insertImage', imgurl, function($image) {
                                    //     $image.attr('alt', "mo-" + title);
                                    // });
                                    var node = document.createElement('img');
                                    node.src = imgurl;
                                    node.alt = "mo-" + title;
                                    // @param {Node} node
                                    context.invoke('editor.insertNode', node);
                                }
                            }
                        })
                    ]
                });

                // create jQuery object from button instance.
                var $wxemotions = button.render();
                return $wxemotions;
            });
            //设置微信表情
            context.wxinit = function(html) {
                if (!html) {
                    html = context.code();
                }
                var t, n, r = url,
                    ext = ".gif",
                    o = emoticondata;
                for (i in o) {
                    for (j in o[i]) {
                        var t = i * 15 + parseInt(j);
                        n = new RegExp("/" + o[i][j], "g");
                        if (n.test(html)) {
                            var src = r + t + ext;
                            var alt = o[i][j];
                            html = html.replace(n, '<img src="' + src + '" alt="mo-' + alt + '"/>');
                        }
                    }
                }
                context.code(html);
            };
            //获取转换微信表情代码
            context.wxcode = function(html) {
                return context.code().replace(/<img.*?alt=["]{0,1}mo-([^"\s]*).*?>/ig, "/$1");
            };
        }
    });
}));
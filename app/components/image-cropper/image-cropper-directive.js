'use strict';

app.directive('imageCropper', function($timeout, ImageUploadService) {
    return {
        restrict: 'E',
        require: '^uploadForm',
        templateUrl: 'components/image-cropper/image-cropper.html',
        link: function(scope, element, attrs) {

            var cropper;

            // Add image to database
            ImageUploadService.getTempImage(scope.authUser.username, scope.token).then(function(response) {

                scope.data = response;
                init();

            });

            var init = function() {

                cropper = new CROP();
                cropper.init('.cropper');

                // Display Thumbnail
                cropper.loadImg( scope.data.url );

            };

            // Crop
            $timeout(function() {
                $('#crop').on('click', function() {

                    console.log('process');

                    var coords = scope.coordinates(cropper);

                    // Add to queue for processing
                    ImageUploadService.processImage(scope.token, scope.authUser.username, scope.data, coords);

                });
            });

            /**
             *
             *  jQuery Image Cropper
             *  http://danielhellier.com/imagecrop/
             *
             */
            var coordinates;

            var CROP = (function () {

                return function () {

                    // Code Dependant Variables
                    this.eles = {
                        ele: undefined,
                        container: undefined,
                        img: undefined,
                        overlay: undefined
                    };

                    this.img = undefined;
                    this.imgInfo = {
                        aw: 0,
                        ah: 0,
                        w: 0,
                        h: 0,
                        at: 0,
                        al: 0,
                        t: 0,
                        l: 0,
                        s: 1 // scale
                    };

                    this.init = function (ele) {

                        // link slider
                        this.settings = {
                            slider: ele + ' .cropSlider'
                        };

                        /*
                            Elements
                        */
                        var ele = $(ele + ' .cropMain')
                            , img
                            , container
                            , overlay
                            , that = this;

                        /*
                            Container
                        */
                        container = $('<div />')
                            .attr({
                                class: 'crop-container'
                            })
                            .css({
                                width: ele.width(),
                                height: ele.height()
                            });

                        /*
                            Image
                        */
                        img = $('<img />')
                            .attr({
                                class: 'crop-img'
                            })
                            .css({
                                zIndex: 5999,
                                top: 0,
                                left: 0
                            });

                        /*
                            Crop Overlay
                        */
                        overlay = $('<div />')
                            .attr({
                                class: 'crop-overlay'
                            })
                            .css({
                                zIndex: 6000
                            });


                        // Add Elements
                        container.append(overlay);
                        container.append(img);
                        ele.append(container);

                        this.eles.ele = ele;
                        this.eles.container = container;
                        this.eles.img = img;
                        this.eles.overlay = overlay;


                        /*
                            Bind Events
                        */
                        container.resize(function () {
                            that.imgSize();
                        });


                        /*
                            Overlay Movement
                        */
                        overlay.bind(((document.ontouchstart !== null) ? 'mousedown':'touchstart'), function (e) {

                            var o = $(this),
                                mousedown = {
                                    x: (e.pageX || e.originalEvent.pageX),
                                    y: (e.pageY || e.originalEvent.pageY),
                                },
                                elepos = {
                                    x: o.parent().offset().left,
                                    y: o.parent().offset().top
                                };

                            e.preventDefault();

                            $(document).bind(((document.ontouchmove !== null) ? 'mousemove':'touchmove'), function (e) {

                                if (e.pageX || typeof e.originalEvent.changedTouches[0] !== undefined) {

                                    var mousepos = {
                                        x: (e.pageX || e.originalEvent.changedTouches[0].pageX),
                                        y: (e.pageY || e.originalEvent.changedTouches[0].pageY)
                                    };

                                    if (parseInt(o.css('top')) == 0) {
                                        o.css({
                                            top: that.eles.ele.offset().top,
                                            left: that.eles.ele.offset().left
                                        });
                                    }

                                    // Move Image
                                    that.imgMove({
                                        t: parseInt(o.css('top')) - (elepos.y - (mousedown.y - mousepos.y)),
                                        l: parseInt(o.css('left')) - (elepos.x - (mousedown.x - mousepos.x))
                                    });

                                    // Reposition Overlay
                                    o.css({
                                        left: elepos.x - (mousedown.x - mousepos.x),
                                        top: elepos.y - (mousedown.y - mousepos.y)
                                    });
                                }
                            });

                            $(document).bind(((document.ontouchend !== null) ? 'mouseup':'touchend'), function (e) {

                                $(document).unbind(((document.ontouchmove !== null) ? 'mousemove':'touchmove'));
                                overlay.css({
                                    top: 0,
                                    left: 0
                                });
                            });

                            return false;
                        });

                        /*
                            Configure Slider
                        */
                        this.slider();

                    };

                    this.loadImg = function (url) {
                        var that = this;

                        this.eles.img
                            .attr('src', url)
                            .load(function () {
                                that.imgSize();
                            });
                    };

                    this.imgSize = function () {
                        var img = this.eles.img
                            , imgSize = {
                                w: img.css('width', '').width(),
                                h: img.css('height', '').height()
                            }
                            , c = this.eles.container;

                        var holderRatio = {
                            wh: this.eles.container.width()/this.eles.container.height(),
                            hw:this.eles.container.height()/this.eles.container.width()
                        };

                        this.imgInfo.aw = imgSize.w;
                        this.imgInfo.ah = imgSize.h;

                        if (imgSize.w * holderRatio.hw < imgSize.h * holderRatio.wh) {

                            this.imgInfo.w = c.width() - (40*2);
                            this.imgInfo.h = this.imgInfo.w * (imgSize.h / imgSize.w);
                            this.imgInfo.al = 40;

                        } else {

                            this.imgInfo.h = c.height() - (40*2);
                            this.imgInfo.w = this.imgInfo.h * (imgSize.w / imgSize.h);
                            this.imgInfo.at = 40;
                        }

                        this.imgResize();
                    };


                    this.imgResize = function (scale) {

                        var img = this.eles.img,
                            imgInfo = this.imgInfo,
                            oldScale = imgInfo.s;

                        imgInfo.s = scale || imgInfo.s;

                        img.css({
                            width: imgInfo.w * imgInfo.s,
                            height: imgInfo.h * imgInfo.s
                        });

                        // Move Image Based on Size Changes
                        this.imgMove({
                            t: -((imgInfo.h * oldScale) - (imgInfo.h * imgInfo.s))/2,
                            l: -((imgInfo.w * oldScale) - (imgInfo.w * imgInfo.s))/2
                        });
                    };

                    this.imgMove = function (move) {

                        var img = this.eles.img,
                            imgInfo = this.imgInfo,
                            c = this.eles.container;

                        imgInfo.t += move.t;
                        imgInfo.l += move.l;

                        var t = imgInfo.at - imgInfo.t,
                            l = imgInfo.al - imgInfo.l;

                        if (t > 40) {
                            t = 40;
                            imgInfo.t = (imgInfo.at == 40) ? 0 : -40;
                        } else if (t < -((imgInfo.h * imgInfo.s) - (c.height() - 40))) {
                            t = -((imgInfo.h * imgInfo.s) - (c.height() - 40));
                            imgInfo.t = ((imgInfo.at == 40) ? (imgInfo.h * imgInfo.s) - (c.height() - 80) : (imgInfo.h * imgInfo.s) - (c.height() - 40));
                        }

                        if (l > 40) {
                            l = 40;
                            imgInfo.l = (imgInfo.al == 40) ? 0 : -40;
                        } else if (l < -((imgInfo.w * imgInfo.s) - (c.width() - 40))) {
                            l = -((imgInfo.w * imgInfo.s) - (c.width() - 40));
                            imgInfo.l = ((imgInfo.al == 40) ? (imgInfo.w * imgInfo.s) - (c.width() - 80) : (imgInfo.w * imgInfo.s) - (c.width() - 40));
                        }

                        // Set Position
                        img.css({
                            top: t,
                            left: l
                        });

                    };

                    /*
                        Slider
                    */
                    this.slider = function () {

                        var that = this;
                        $(this.settings.slider).noUiSlider({
                             range: [1, 4]
                           , start: 1
                           , step: 0.002
                           , handles: 1
                           , slide: function(){
                              var val = $(this).val();

                              that.imgResize(val);
                           }
                        });
                    };

                    // get cropped coordinates
                    scope.coordinates = function coordinates(self) {

                        var imgInfo = self.imgInfo,
                            c = self.eles.container,
                            img = self.eles.img,
                            imgsrc = img.attr('src'),
                            s = (imgInfo.aw / (imgInfo.w * imgInfo.s)),
                            sX = -(parseInt(img.css('left')) - (40)),
                            sY = -(parseInt(img.css('top')) - (40)),

                            coordinates = {
                                w: ((s * 400) - (80 * s)),
                                h: ((s * 400) - (80 * s)),
                                x: (s * sX),
                                y: (s * sY),
                                image: imgsrc
                            };

                        // return coodinates
                        return coordinates;
                    }

                };

            }());

            // nouislider.min.js - http://refreshless.com/nouislider/
            (function(e,p){if(e.zepto&&!e.fn.removeData)throw new ReferenceError("Zepto is loaded without the data module.");e.fn.noUiSlider=function(D){function r(a,b,c){e.isArray(a)||(a=[a]);e.each(a,function(a,l){"function"===typeof l&&l.call(b,c)})}function x(a){return a instanceof e||e.zepto&&e.zepto.isZ(a)}function E(a){a.preventDefault();var b=0===a.type.indexOf("touch"),c=0===a.type.indexOf("mouse"),d=0===a.type.indexOf("pointer"),l,h,g=a;0===a.type.indexOf("MSPointer")&&(d=!0);a.originalEvent&&(a=a.originalEvent);b&&(l=a.changedTouches[0].pageX,h=a.changedTouches[0].pageY);if(c||d)d||window.pageXOffset!==p||(window.pageXOffset=document.documentElement.scrollLeft,window.pageYOffset=document.documentElement.scrollTop),l=a.clientX+window.pageXOffset,h=a.clientY+window.pageYOffset;return e.extend(g,{x:l,y:h})}function q(a,b,c,d,l){a=a.replace(/\s/g,u+" ")+u;if(l)return 1<l&&(d=e.extend(b,d)),b.on(a,e.proxy(c,d));d.handler=c;return b.on(a,e.proxy(function(a){if(this.target.is('[class*="noUi-state-"], [disabled]'))return!1;this.handler(E(a))},d))}function m(a){return!isNaN(parseFloat(a))&&isFinite(a)}function F(a){return parseFloat(this.style[a])}function G(a,b){function c(a){return x(a)||"string"===typeof a||!1===a}var d={handles:{r:!0,t:function(a){a=parseInt(a,10);return 1===a||2===a}},range:{r:!0,t:function(a,b,c){if(2!==a.length)return!1;a=[parseFloat(a[0]),parseFloat(a[1])];if(!m(a[0])||!m(a[1])||"range"===c&&a[0]===a[1]||a[1]<a[0])return!1;b[c]=a;return!0}},start:{r:!0,t:function(a,b,c){return 1===b.handles?(e.isArray(a)&&(a=a[0]),a=parseFloat(a),b.start=[a],m(a)):this.parent.range.t(a,b,c)}},connect:{t:function(a,b){return!0===a||!1===a||"lower"===a&&1===b.handles||"upper"===a&&1===b.handles}},orientation:{t:function(a){return"horizontal"===a||"vertical"===a}},margin:{r:!0,t:function(a,b,c){a=parseFloat(a);b[c]=a;return m(a)}},serialization:{r:!0,t:function(a,b){if(a.resolution)switch(a.resolution){case 1:case 0.1:case 0.01:case 0.001:case 1E-4:case 1E-5:break;default:return!1}else b.serialization.resolution=0.01;if(a.mark)return"."===a.mark||","===a.mark;b.serialization.mark=".";return a.to?1===b.handles?(e.isArray(a.to)||(a.to=[a.to]),b.serialization.to=a.to,c(a.to[0])):2===a.to.length&&c(a.to[0])&&c(a.to[1]):!1}},slide:{t:function(a){return"function"===typeof a}},set:{t:function(a,b){return this.parent.slide.t(a,b)}},step:{t:function(a,b,c){return this.parent.margin.t(a,b,c)}},init:function(){var a=this;e.each(a,function(b,c){c.parent=a});delete this.init;return this}}.init();e.each(d,function(c,d){if(d.r&&!a[c]&&0!==a[c]||(a[c]||0===a[c])&&!d.t(a[c],a,c))throw console&&console.log&&console.group&&(console.group("Invalid noUiSlider initialisation:"),console.log("Option:\t",c),console.log("Value:\t",a[c]),console.log("Slider:\t",b[0]),console.groupEnd()),new RangeError("noUiSlider");})}function y(a,b){a=a.toFixed(b.data("decimals"));return a.replace(".",b.data("mark"))}function v(a,b,c){var d=a.data("nui").options,e=a.data("nui").base.data("handles"),h=a.data("nui").style;if(!m(b)||b===a[0].gPct(h))return!1;b=0>b?0:100<b?100:b;if(d.step&&!c){var g=t.from(d.range,d.step);b=Math.round(b/g)*g}if(b===a[0].gPct(h)||a.siblings("."+f[1]).length&&!c&&e&&(a.data("nui").number?(c=e[0][0].gPct(h)+d.margin,b=b<c?c:b):(c=e[1][0].gPct(h)-d.margin,b=b>c?c:b),b===a[0].gPct(h)))return!1;0===a.data("nui").number&&95<b?a.addClass(f[13]):a.removeClass(f[13]);a.css(h,b+"%");a.data("store").val(y(t.is(d.range,b),a.data("nui").target));return!0}function H(a,b){var c=a.data("nui").number,d={target:a.data("nui").target,options:a.data("nui").options,handle:a,i:c};if(x(b.to[c]))return q("change blur",b.to[c],z[0],d,2),q("change",b.to[c],d.options.set,d.target,1),b.to[c];if("string"===typeof b.to[c])return e('<input type="hidden" name="'+b.to[c]+'">').appendTo(a).addClass(f[3]).change(z[1]);if(!1===b.to[c])return{val:function(a){if(a===p)return this.handleElement.data("nui-val");this.handleElement.data("nui-val",a)},hasClass:function(){return!1},handleElement:a}}function I(a){var b=this.base,c=b.data("style"),d=a.x-this.startEvent.x,e="left"===c?b.width():b.height();"top"===c&&(d=a.y-this.startEvent.y);d=this.position+100*d/e;v(this.handle,d);r(b.data("options").slide,b.data("target"))}function A(){var a=this.base,b=this.handle;b.children().removeClass(f[4]);w.off(n.move);w.off(n.end);e("body").off(u);a.data("target").change();r(b.data("nui").options.set,a.data("target"))}function J(a){var b=this.handle,c=b[0].gPct(b.data("nui").style);b.children().addClass(f[4]);q(n.move,w,I,{startEvent:a,position:c,base:this.base,target:this.target,handle:b});q(n.end,w,A,{base:this.base,target:this.target,handle:b});e("body").on("selectstart"+u,function(){return!1})}function K(a){a.stopPropagation();A.call(this)}function L(a){if(!this.base.find("."+f[4]).length){var b,c,d=this.base;c=this.handles;var e=d.data("style");a=a["left"===e?"x":"y"];var h="left"===e?d.width():d.height(),g=[],k={left:d.offset().left,top:d.offset().top};for(b=0;b<c.length;b++)g.push({left:c[b].offset().left,top:c[b].offset().top});b=1===c.length?0:(g[0][e]+g[1][e])/2;c=1===c.length||a<b?c[0]:c[1];d.addClass(f[5]);setTimeout(function(){d.removeClass(f[5])},300);v(c,100*(a-k[e])/h);r([c.data("nui").options.slide,c.data("nui").options.set],d.data("target"));d.data("target").change()}}function M(){var a=[];e.each(e(this).data("handles"),function(b,c){a.push(c.data("store").val())});return 1===a.length?a[0]:a}function N(a,b){if(a===p)return M.call(this);b=!0===b?{trigger:!0}:b||{};e.isArray(a)||(a=[a]);return this.each(function(c,d){d=e(d);e.each(e(this).data("handles"),function(c,f){if(null!==a[c]&&a[c]!==p){var g,k;k=f.data("nui").options.range;g=a[c];b.trusted=!0;if(!1===b.trusted||1===a.length)b.trusted=!1;2===a.length&&0<=e.inArray(null,a)&&(b.trusted=!1);"string"===e.type(g)&&(g=g.replace(",","."));g=t.to(k,parseFloat(g));g=v(f,g,b.trusted);b.trigger&&r(f.data("nui").options.set,d);g||(g=f.data("store").val(),k=t.is(k,f[0].gPct(f.data("nui").style)),g!==k&&f.data("store").val(y(k,d)))}})})}var u=".nui",w=e(document),n={start:"mousedown touchstart",move:"mousemove touchmove",end:"mouseup touchend"},O=e.fn.val,f="noUi-base noUi-origin noUi-handle noUi-input noUi-active noUi-state-tap noUi-target -lower -upper noUi-connect noUi-vertical noUi-horizontal noUi-background noUi-z-index".split(" "),s=[f[0]],B=[f[1]],C=[f[2]],t={to:function(a,b){b=0>a[0]?b+Math.abs(a[0]):b-a[0];return 100*b/this.len(a)},from:function(a,b){return 100*b/this.len(a)},is:function(a,b){return b*this.len(a)/100+a[0]},len:function(a){return a[0]>a[1]?a[0]-a[1]:a[1]-a[0]}},z=[function(){this.target.val([this.i?null:this.val(),this.i?this.val():null],{trusted:!1})},function(a){a.stopPropagation()}];window.navigator.pointerEnabled?n={start:"pointerdown",move:"pointermove",end:"pointerup"}:window.navigator.msPointerEnabled&&(n={start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"});e.fn.val=function(){return this.hasClass(f[6])?N.apply(this,arguments):O.apply(this,arguments)};return function(a){return this.each(function(b,c){c=e(c);c.addClass(f[6]);var d,l,h,g,k=e("<div/>").appendTo(c),m=[],p=[B.concat([f[1]+f[7]]),B.concat([f[1]+f[8]])],r=[C.concat([f[2]+f[7]]),C.concat([f[2]+f[8]])];a=e.extend({handles:2,margin:0,orientation:"horizontal"},a)||{};a.serialization||(a.serialization={to:[!1,!1],resolution:0.01,mark:"."});G(a,c);a.S=a.serialization;a.connect?"lower"===a.connect?(s.push(f[9],f[9]+f[7]),p[0].push(f[12])):(s.push(f[9]+f[8],f[12]),p[0].push(f[9])):s.push(f[12]);l="vertical"===a.orientation?"top":"left";h=a.S.resolution.toString().split(".");h="1"===h[0]?0:h[1].length;"vertical"===a.orientation?s.push(f[10]):s.push(f[11]);k.addClass(s.join(" ")).data("target",c);c.data({base:k,mark:a.S.mark,decimals:h});for(d=0;d<a.handles;d++)g=e("<div><div/></div>").appendTo(k),g.addClass(p[d].join(" ")),g.children().addClass(r[d].join(" ")),q(n.start,g.children(),J,{base:k,target:c,handle:g}),q(n.end,g.children(),K,{base:k,target:c,handle:g}),g.data("nui",{target:c,decimals:h,options:a,base:k,style:l,number:d}).data("store",H(g,a.S)),g[0].gPct=F,m.push(g),v(g,t.to(a.range,a.start[d]));k.data({options:a,handles:m,style:l});c.data({handles:m});q(n.end,k,L,{base:k,target:c,handles:m})})}.call(this,D)}})($);

        }
    };
});
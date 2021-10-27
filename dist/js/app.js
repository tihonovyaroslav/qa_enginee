function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function (factory) {
  typeof define === 'function' && define.amd ? define('app', factory) : factory();
})(function () {
  'use strict';

  var Slider = /*#__PURE__*/function () {
    function Slider() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, Slider);

      this.bind();
      this.opts = {
        el: options.el || ".draggable-wrapper",
        ease: options.ease || 0.1,
        speed: options.speed || 1.5,
        velocity: 25,
        scroll: options.scroll || false
      };
      this.slider = document.querySelector(".draggable-wrapper");
      this.sliderInner = this.slider.querySelector(".draggable");
      this.slides = _toConsumableArray(this.slider.querySelectorAll(".photostory__card"));
      this.slidesNumb = this.slides.length;
      this.rAF = undefined;
      this.sliderWidth = 0;
      this.onX = 0;
      this.offX = 0;
      this.currentX = 0;
      this.lastX = 0;
      this.min = 0;
      this.max = 0;
      this.centerX = window.innerWidth / 2;
    }

    _createClass(Slider, [{
      key: "bind",
      value: function bind() {
        var _this = this;

        ["setPos", "run", "scroll", "on", "off", "resize"].forEach(function (fn) {
          return _this[fn] = _this[fn].bind(_this);
        });
      }
    }, {
      key: "setBounds",
      value: function setBounds() {
        var sliderBlock = this.sliderInner.getBoundingClientRect();
        this.sliderInner.left = sliderBlock.left;
        this.sliderWidth = sliderBlock.left + sliderBlock.width + 40;
        this.max = -(this.sliderWidth - window.innerWidth);
      }
    }, {
      key: "setPos",
      value: function setPos(e) {
        if (!this.isDragging) return;

        if (e.type == "touchmove") {
          this.currentX = this.offX + (e.touches[0].clientX - this.onX) * this.opts.speed;
        } else {
          this.currentX = this.offX + (e.clientX - this.onX) * this.opts.speed;
        }

        this.clamp();
      }
    }, {
      key: "clamp",
      value: function clamp() {
        this.currentX = Math.max(Math.min(this.currentX, this.min), this.max);
      }
    }, {
      key: "lerp",
      value: function lerp(a, b, n) {
        return (1 - n) * a + n * b;
      }
    }, {
      key: "run",
      value: function run() {
        this.lastX = this.lerp(this.lastX, this.currentX, this.opts.ease);
        this.lastX = Math.floor(this.lastX * 100) / 100;
        this.currentX - this.lastX;
        this.sliderInner.style.transform = "translate3d(".concat(this.lastX++, "px, 0, 0)");
        this.requestAnimationFrame();
      }
    }, {
      key: "on",
      value: function on(e) {
        this.isDragging = true;

        if (e.type == "touchstart") {
          this.onX = e.touches[0].clientX;
        } else {
          this.onX = e.clientX;
        }

        this.slider.classList.add("is-grabbing");
      }
    }, {
      key: "off",
      value: function off(e) {
        this.isDragging = false;
        this.offX = this.currentX;
        this.slider.classList.remove("is-grabbing");
      }
    }, {
      key: "closest",
      value: function closest() {
        var _this2 = this;

        var numbers = [];
        this.slides.forEach(function (slide, index) {
          var bounds = slide.getBoundingClientRect();
          var diff = _this2.currentX - _this2.lastX;
          var center = bounds.x + diff + bounds.width / 2 + 40;
          var fromCenter = _this2.centerX - center;
          numbers.push(fromCenter);
        });
        var closest = number(0, numbers);
        closest = numbers[closest];
        return {
          closest: closest
        };
      }
    }, {
      key: "scroll",
      value: function scroll() {
        var sliderLeft = this.currentX;

        if (sliderLeft > this.max) {
          this.sliderInner.style.transform = "translate3d(".concat(sliderLeft, "px, 0, 0) ");
          sliderLeft -= 0.2;
        }

        this.currentX = sliderLeft;
        this.offX = sliderLeft;
        this.requestAnimationFrame();
      }
    }, {
      key: "snap",
      value: function snap() {
        var _this$closest = this.closest(),
            closest = _this$closest.closest;

        this.currentX = this.currentX + closest;
        this.clamp();
      }
    }, {
      key: "requestAnimationFrame",
      value: function requestAnimationFrame() {
        this.rAF = this.isDragging ? window.requestAnimationFrame(this.run) : window.requestAnimationFrame(this.scroll);
      }
    }, {
      key: "cancelAnimationFrame",
      value: function (_cancelAnimationFrame) {
        function cancelAnimationFrame() {
          return _cancelAnimationFrame.apply(this, arguments);
        }

        cancelAnimationFrame.toString = function () {
          return _cancelAnimationFrame.toString();
        };

        return cancelAnimationFrame;
      }(function () {
        cancelAnimationFrame(this.rAF);
      })
    }, {
      key: "addEvents",
      value: function addEvents() {
        this.run();
        this.slider.addEventListener("mousemove", this.setPos, {
          passive: true
        });
        this.slider.addEventListener("mousedown", this.on, false);
        this.slider.addEventListener("mouseup", this.off, false);
        this.slider.addEventListener("touchstart", this.on, false);
        this.slider.addEventListener("touchend", this.off, false);
        this.slider.addEventListener("touchmove", this.setPos, {
          passive: true
        });
        window.addEventListener("resize", this.resize, false);
      }
    }, {
      key: "removeEvents",
      value: function removeEvents() {
        this.cancelAnimationFrame(this.rAF);
        this.slider.removeEventListener("mousemove", this.setPos, {
          passive: true
        });
        this.slider.removeEventListener("mousedown", this.on, false);
        this.slider.removeEventListener("mouseup", this.off, false);
        this.slider.removeEventListener("touchstart", this.on, false);
        this.slider.removeEventListener("touchend", this.off, false);
        this.slider.removeEventListener("touchmove", this.setPos, {
          passive: true
        });
      }
    }, {
      key: "resize",
      value: function resize() {
        this.setBounds();
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.removeEvents();
        this.opts = {};
      }
    }, {
      key: "init",
      value: function init() {
        this.setBounds();
        this.addEvents();
      }
    }]);

    return Slider;
  }();
  /**
   *  app.js
   */


  window.onload = function () {
    //side-scroll
    var width = 4470 - $(window).width();
    var controller = new ScrollMagic.Controller();
    var tween = TweenMax.to('.rs-service__items', {
      x: -width
    });
    new ScrollMagic.Scene({
      triggerElement: '.rs-service',
      duration: 3000,
      triggerHook: 0
    }).setTween(tween).setPin('.rs-service').addTo(controller); // rs-about line

    var tween2 = TweenMax.from('.rs-about__path-img', {
      height: 0
    });
    new ScrollMagic.Scene({
      triggerElement: '.rs-about',
      triggerHook: 0.5,
      duration: '100%',
      tweenChanges: true
    }).setTween(tween2).addTo(controller); // rs-metrics line

    var tween3 = TweenMax.from('.rs-metrics__path-img', {
      height: 0
    });
    new ScrollMagic.Scene({
      triggerElement: '.rs-metrics',
      triggerHook: 0.8,
      duration: '100%',
      tweenChanges: true
    }).setTween(tween3).addTo(controller); // rs-service line

    var tl = gsap.timeline();
    tl.from('.rs-service__path-img', {
      width: 0
    });
    tl.from('.rs-service__path2-img', {
      width: 0
    });
    new ScrollMagic.Scene({
      triggerElement: '.rs-service',
      triggerHook: 0,
      duration: '3000',
      tweenChanges: true
    }).setTween(tl).addTo(controller); //slider run

    var slider = new Slider();
    slider.init(); //map

    var points = document.querySelectorAll('.map__points circle');
    var currentPoint = 0;
    setInterval(function () {
      points[currentPoint].classList.remove('hide');
      currentPoint = Math.floor(Math.random() * points.length);
      points[currentPoint].classList.add('hide');
    }, 250); //advantage

    var advantageBlock = document.querySelector('.rs-advantage');
    var advantageItems = advantageBlock.querySelectorAll('.rs-advantage__item');
    advantageItems.forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        this.classList.add('active');
      });
      item.addEventListener('mouseleave', function () {
        this.classList.remove('active');
      });
    }); // counter numbers

    function countup(className, options) {
      var countBlockTop = $('.' + className).offset().top;
      var windowHeight = window.innerHeight;
      var show = true;
      $(window).scroll(function () {
        if (show && countBlockTop < $(window).scrollTop() + windowHeight - windowHeight / 4) {
          show = false;
          $('.' + className).spincrement(options);
        }
      });
    }

    countup('spincrement', {
      from: 1,
      duration: 3000
    });
    countup('spincrement-plus', {
      from: 1,
      duration: 1000,
      complete: function complete(e) {
        e.text(e.text() + '+');
      }
    }); //click event handling

    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    document.addEventListener('click', documentActions);

    function documentActions(e) {
      var targetElement = e.target; //open-close menu burger

      if (window.innerWidth < 992) {
        if (targetElement.closest('.rs-menu-form__burger')) {
          targetElement.closest('.rs-menu-form__burger').classList.toggle('active');
          document.body.classList.toggle('_lock');
          document.querySelector('.rs-menu-form__menu').classList.toggle('active');
        }
      }
    }
  }; //.window-onload

});
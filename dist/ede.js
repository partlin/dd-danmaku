
(function(){
var skipInnerModule=false;
try{throw new Error()}catch(e){skipInnerModule=!!(e.stack&&e.stack.includes('CustomCssJS'));}
if(!skipInnerModule){
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).Danmaku=e()}(this,(function(){"use strict";var t=function(){if("undefined"==typeof document)return"transform";for(var t=["oTransform","msTransform","mozTransform","webkitTransform","transform"],e=document.createElement("div").style,i=0;i<t.length;i++)if(t[i]in e)return t[i];return"transform"}();function e(t){var e=document.createElement("div");if(e.style.cssText="position:absolute;","function"==typeof t.render){var i=t.render();if(i instanceof HTMLElement)return e.appendChild(i),e}if(e.textContent=t.text,t.style)for(var n in t.style)e.style[n]=t.style[n];return e}var i={name:"dom",init:function(){var t=document.createElement("div");return t.style.cssText="overflow:hidden;white-space:nowrap;transform:translateZ(0);",t},clear:function(t){for(var e=t.lastChild;e;)t.removeChild(e),e=t.lastChild},resize:function(t,e,i){t.style.width=e+"px",t.style.height=i+"px"},framing:function(){},setup:function(t,i){var n=document.createDocumentFragment(),s=0,r=null;for(s=0;s<i.length;s++)(r=i[s]).node=r.node||e(r),n.appendChild(r.node);for(i.length&&t.appendChild(n),s=0;s<i.length;s++)(r=i[s]).width=r.width||r.node.offsetWidth,r.height=r.height||r.node.offsetHeight},render:function(e,i){i.node.style[t]="translate("+i.x+"px,"+i.y+"px)"},remove:function(t,e){t.removeChild(e.node),this.media||(e.node=null)}},n="undefined"!=typeof window&&window.devicePixelRatio||1,s=Object.create(null);function r(t,e){if("function"==typeof t.render){var i=t.render();if(i instanceof HTMLCanvasElement)return t.width=i.width,t.height=i.height,i}var r=document.createElement("canvas"),h=r.getContext("2d"),o=t.style||{};o.font=o.font||"10px sans-serif",o.textBaseline=o.textBaseline||"bottom";var a=1*o.lineWidth;for(var d in a=a>0&&a!==1/0?Math.ceil(a):1*!!o.strokeStyle,h.font=o.font,t.width=t.width||Math.max(1,Math.ceil(h.measureText(t.text).width)+2*a),t.height=t.height||Math.ceil(function(t,e){if(s[t])return s[t];var i=12,n=t.match(/(\d+(?:\.\d+)?)(px|%|em|rem)(?:\s*\/\s*(\d+(?:\.\d+)?)(px|%|em|rem)?)?/);if(n){var r=1*n[1]||10,h=n[2],o=1*n[3]||1.2,a=n[4];"%"===h&&(r*=e.container/100),"em"===h&&(r*=e.container),"rem"===h&&(r*=e.root),"px"===a&&(i=o),"%"===a&&(i=r*o/100),"em"===a&&(i=r*o),"rem"===a&&(i=e.root*o),void 0===a&&(i=r*o)}return s[t]=i,i}(o.font,e))+2*a,r.width=t.width*n,r.height=t.height*n,h.scale(n,n),o)h[d]=o[d];var u=0;switch(o.textBaseline){case"top":case"hanging":u=a;break;case"middle":u=t.height>>1;break;default:u=t.height-a}return o.strokeStyle&&h.strokeText(t.text,a,u),h.fillText(t.text,a,u),r}function h(t){return 1*window.getComputedStyle(t,null).getPropertyValue("font-size").match(/(.+)px/)[1]}var o={name:"canvas",init:function(t){var e=document.createElement("canvas");return e.context=e.getContext("2d"),e._fontSize={root:h(document.getElementsByTagName("html")[0]),container:h(t)},e},clear:function(t,e){t.context.clearRect(0,0,t.width,t.height);for(var i=0;i<e.length;i++)e[i].canvas=null},resize:function(t,e,i){t.width=e*n,t.height=i*n,t.style.width=e+"px",t.style.height=i+"px"},framing:function(t){t.context.clearRect(0,0,t.width,t.height)},setup:function(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.canvas=r(n,t._fontSize)}},render:function(t,e){t.context.drawImage(e.canvas,e.x*n,e.y*n)},remove:function(t,e){e.canvas=null}},a=("undefined"!=typeof window&&(window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame)||function(t){return setTimeout(t,50/3)}).bind(window),d=("undefined"!=typeof window&&(window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame)||clearTimeout).bind(window);function u(t,e,i){for(var n=0,s=0,r=t.length;s<r-1;)i>=t[n=s+r>>1][e]?s=n:r=n;return t[s]&&i<t[s][e]?s:r}function m(t){return/^(ltr|top|bottom)$/i.test(t)?t.toLowerCase():"rtl"}function c(){var t=9007199254740991;return[{range:0,time:-t,width:t,height:0},{range:t,time:t,width:0,height:0}]}function l(t){t.ltr=c(),t.rtl=c(),t.top=c(),t.bottom=c()}function f(){return void 0!==window.performance&&window.performance.now?window.performance.now():Date.now()}function p(t){var e=this,i=this.media?this.media.currentTime:f()/1e3,n=this.media?this.media.playbackRate:1;function s(t,s){if("top"===s.mode||"bottom"===s.mode)return i-t.time<e._.duration;var r=(e._.width+t.width)*(i-t.time)*n/e._.duration;if(t.width>r)return!0;var h=e._.duration+t.time-i,o=e._.width+s.width,a=e.media?s.time:s._utc,d=o*(i-a)*n/e._.duration,u=e._.width-d;return h>e._.duration*u/(e._.width+s.width)}for(var r=this._.space[t.mode],h=0,o=0,a=1;a<r.length;a++){var d=r[a],u=t.height;if("top"!==t.mode&&"bottom"!==t.mode||(u+=d.height),d.range-d.height-r[h].range>=u){o=a;break}s(d,t)&&(h=a)}var m=r[h].range,c={range:m+t.height,time:this.media?t.time:t._utc,width:t.width,height:t.height};return r.splice(h+1,o-h-1,c),"bottom"===t.mode?this._.height-t.height-m%this._.height:m%(this._.height-t.height)}function g(){if(!this._.visible||!this._.paused)return this;if(this._.paused=!1,this.media)for(var t=0;t<this._.runningList.length;t++){var e=this._.runningList[t];e._utc=f()/1e3-(this.media.currentTime-e.time)}var i=this,n=function(t,e,i,n){return function(s){t(this._.stage);var r=(s||f())/1e3,h=this.media?this.media.currentTime:r,o=this.media?this.media.playbackRate:1,a=null,d=0,u=0;for(u=this._.runningList.length-1;u>=0;u--)a=this._.runningList[u],h-(d=this.media?a.time:a._utc)>this._.duration&&(n(this._.stage,a),this._.runningList.splice(u,1));for(var m=[];this._.position<this.comments.length&&(a=this.comments[this._.position],!((d=this.media?a.time:a._utc)>=h));)h-d>this._.duration||(this.media&&(a._utc=r-(this.media.currentTime-a.time)),m.push(a)),++this._.position;for(e(this._.stage,m),u=0;u<m.length;u++)(a=m[u]).y=p.call(this,a),this._.runningList.push(a);for(u=0;u<this._.runningList.length;u++){a=this._.runningList[u];var c=(this._.width+a.width)*(r-a._utc)*o/this._.duration;"ltr"===a.mode&&(a.x=c-a.width),"rtl"===a.mode&&(a.x=this._.width-c),"top"!==a.mode&&"bottom"!==a.mode||(a.x=this._.width-a.width>>1),i(this._.stage,a)}}}(this._.engine.framing.bind(this),this._.engine.setup.bind(this),this._.engine.render.bind(this),this._.engine.remove.bind(this));return this._.requestID=a((function t(e){n.call(i,e),i._.requestID=a(t)})),this}function _(){return!this._.visible||this._.paused||(this._.paused=!0,d(this._.requestID),this._.requestID=0),this}function v(){if(!this.media)return this;this.clear(),l(this._.space);var t=u(this.comments,"time",this.media.currentTime);return this._.position=Math.max(0,t-1),this}function w(t){t.play=g.bind(this),t.pause=_.bind(this),t.seeking=v.bind(this),this.media.addEventListener("play",t.play),this.media.addEventListener("pause",t.pause),this.media.addEventListener("playing",t.play),this.media.addEventListener("waiting",t.pause),this.media.addEventListener("seeking",t.seeking)}function y(t){this.media.removeEventListener("play",t.play),this.media.removeEventListener("pause",t.pause),this.media.removeEventListener("playing",t.play),this.media.removeEventListener("waiting",t.pause),this.media.removeEventListener("seeking",t.seeking),t.play=null,t.pause=null,t.seeking=null}function x(t){this._={},this.container=t.container||document.createElement("div"),this.media=t.media,this._.visible=!0,this.engine=(t.engine||"DOM").toLowerCase(),this._.engine="canvas"===this.engine?o:i,this._.requestID=0,this._.speed=Math.max(0,t.speed)||144,this._.duration=4,this.comments=t.comments||[],this.comments.sort((function(t,e){return t.time-e.time}));for(var e=0;e<this.comments.length;e++)this.comments[e].mode=m(this.comments[e].mode);return this._.runningList=[],this._.position=0,this._.paused=!0,this.media&&(this._.listener={},w.call(this,this._.listener)),this._.stage=this._.engine.init(this.container),this._.stage.style.cssText+="position:relative;pointer-events:none;",this.resize(),this.container.appendChild(this._.stage),this._.space={},l(this._.space),this.media&&this.media.paused||(v.call(this),g.call(this)),this}function b(){if(!this.container)return this;for(var t in _.call(this),this.clear(),this.container.removeChild(this._.stage),this.media&&y.call(this,this._.listener),this)Object.prototype.hasOwnProperty.call(this,t)&&(this[t]=null);return this}var L=["mode","time","text","render","style"];function T(t){if(!t||"[object Object]"!==Object.prototype.toString.call(t))return this;for(var e={},i=0;i<L.length;i++)void 0!==t[L[i]]&&(e[L[i]]=t[L[i]]);if(e.text=(e.text||"").toString(),e.mode=m(e.mode),e._utc=f()/1e3,this.media){var n=0;void 0===e.time?(e.time=this.media.currentTime,n=this._.position):(n=u(this.comments,"time",e.time))<this._.position&&(this._.position+=1),this.comments.splice(n,0,e)}else this.comments.push(e);return this}function E(){return this._.visible?this:(this._.visible=!0,this.media&&this.media.paused||(v.call(this),g.call(this)),this)}function k(){return this._.visible?(_.call(this),this.clear(),this._.visible=!1,this):this}function C(){return this._.engine.clear(this._.stage,this._.runningList),this._.runningList=[],this}function z(){return this._.width=this.container.offsetWidth,this._.height=this.container.offsetHeight,this._.engine.resize(this._.stage,this._.width,this._.height),this._.duration=this._.width/this._.speed,this}var D={get:function(){return this._.speed},set:function(t){return"number"!=typeof t||isNaN(t)||!isFinite(t)||t<=0?this._.speed:(this._.speed=t,this._.width&&(this._.duration=this._.width/t),t)}};function M(t){t&&x.call(this,t)}return M.prototype.destroy=function(){return b.call(this)},M.prototype.emit=function(t){return T.call(this,t)},M.prototype.show=function(){return E.call(this)},M.prototype.hide=function(){return k.call(this)},M.prototype.clear=function(){return C.call(this)},M.prototype.resize=function(){return z.call(this)},Object.defineProperty(M.prototype,"speed",D),M}));
}else if(typeof Emby!=='undefined'&&Emby.importModule){
var p=localStorage.getItem('danmakuCustomeDanmakuUrl')||'https://danmaku.7o7o.cc/danmaku.min.js';
Emby.importModule(p).then(function(f){window.Danmaku=f;}).catch(function(e){console.error('Danmaku load error:',e);});
}
})();
(function () {
  'use strict';

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithHoles(r) {
    if (Array.isArray(r)) return r;
  }
  function _arrayWithoutHoles(r) {
    if (Array.isArray(r)) return _arrayLikeToArray(r);
  }
  function _classCallCheck(a, n) {
    if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
  }
  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var o = r[t];
      o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
      writable: !1
    }), e;
  }
  function _createForOfIteratorHelper(r, e) {
    var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (!t) {
      if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
        t && (r = t);
        var n = 0,
          F = function () {};
        return {
          s: F,
          n: function () {
            return n >= r.length ? {
              done: !0
            } : {
              done: !1,
              value: r[n++]
            };
          },
          e: function (r) {
            throw r;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var o,
      a = !0,
      u = !1;
    return {
      s: function () {
        t = t.call(r);
      },
      n: function () {
        var r = t.next();
        return a = r.done, r;
      },
      e: function (r) {
        u = !0, o = r;
      },
      f: function () {
        try {
          a || null == t.return || t.return();
        } finally {
          if (u) throw o;
        }
      }
    };
  }
  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[r] = t, e;
  }
  function _iterableToArray(r) {
    if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
  }
  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e,
        n,
        i,
        u,
        a = [],
        f = !0,
        o = !1;
      try {
        if (i = (t = t.call(r)).next, 0 === l) {
          if (Object(t) !== t) return;
          f = !1;
        } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
      } catch (r) {
        o = !0, n = r;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
        _defineProperty(e, r, t[r]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
      });
    }
    return e;
  }
  function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
  }
  function _toConsumableArray(r) {
    return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }

  /**
   * 通用工具函数
   * 从 ede.js 迁移，未修改原有实现逻辑
   */

  /**
   * 将对象转为 [key, value] 数组，兼容非对象
   * @param {object} obj
   * @returns {Array<[string, any]>}
   */
  function objectEntries(obj) {
    if (obj && _typeof(obj) === 'object') {
      return Object.keys(obj).map(function (key) {
        return [key, obj[key]];
      });
    }
    return [];
  }

  /**
   * 获取选项的值或执行函数
   * @param {object} option - 选项对象
   * @param {string|function} keyOrFunc - 键名或取值函数
   * @param {number} [index] - 可选索引
   * @returns {any}
   */
  function getValueOrInvoke(option, keyOrFunc, index) {
    return typeof keyOrFunc === 'function' ? keyOrFunc(option, index) : option[keyOrFunc];
  }

  /**
   * 获取当前设置 JSON 字符串
   * @param {object} lsKeys - 配置键对象
   * @param {function} lsGetItem - 获取存储项函数
   * @param {number} [space=4] - 缩进空格数
   * @returns {string}
   */
  function getSettingsJson(lsKeys, lsGetItem) {
    var space = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;
    return JSON.stringify(Object.fromEntries(objectEntries(lsKeys).map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2);
        _ref2[0];
        var value = _ref2[1];
      return [value.id, lsGetItem(value.id)];
    })), null, space);
  }

  /**
   * 重置设置为默认值
   * @param {object} lsKeys - 配置键对象
   * @param {function} lsBatchSet - 批量设置函数
   */
  function settingsReset(lsKeys, lsBatchSet) {
    var defaultSettings = Object.fromEntries(objectEntries(lsKeys).filter(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2);
        _ref4[0];
        var value = _ref4[1];
      return lsKeys.filterKeywords.id !== value.id;
    }).map(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2);
        _ref6[0];
        var value = _ref6[1];
      return [value.id, value.defaultValue];
    }));
    lsBatchSet(defaultSettings);
  }

  function refreshEventListener(eventsMap) {
    objectEntries(eventsMap).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        eventName = _ref2[0],
        fn = _ref2[1];
      document.removeEventListener(eventName, fn);
      document.addEventListener(eventName, fn);
    });
  }

  /**
   * 绑定播放器事件（playbackManager）
   * @param {object} eventsMap - { eventName: fn }
   */
  async function playbackEventsRefresh(eventsMap) {
    if (typeof require !== 'function') return;
    try {
      var _playbackManager$getC;
      var _await$require = await require(['playbackManager', 'events']),
        _await$require2 = _slicedToArray(_await$require, 2),
        playbackManager = _await$require2[0],
        events = _await$require2[1];
      var player = playbackManager === null || playbackManager === void 0 || (_playbackManager$getC = playbackManager.getCurrentPlayer) === null || _playbackManager$getC === void 0 ? void 0 : _playbackManager$getC.call(playbackManager);
      if (!player) return;
      objectEntries(eventsMap).forEach(function (_ref3) {
        var _events$off, _events$on;
        var _ref4 = _slicedToArray(_ref3, 2),
          eventName = _ref4[0],
          fn = _ref4[1];
        (_events$off = events.off) === null || _events$off === void 0 || _events$off.call(events, player, eventName, fn);
        (_events$on = events.on) === null || _events$on === void 0 || _events$on.call(events, player, eventName, fn);
      });
    } catch (e) {
      console.warn('playbackEventsRefresh:', e);
    }
  }

  /**
   * 常量配置
   * 从 ede.js 迁移，未修改原有实现逻辑
   */

  var check_interval = 200;
  var LOAD_TYPE = {
    CHECK: 'check',
    INIT: 'init',
    REFRESH: 'refresh',
    RELOAD: 'reload',
    // 优先走缓存,其余类型走接口
    SEARCH: 'search'
  };
  var isVersionOld = false;
  var setVersionOld = function setVersionOld(v) {
    isVersionOld = v;
  };

  // htmlVideoPlayerContainer
  var mediaContainerQueryStr = '.graphicContentContainer';
  var setMediaContainerQueryStr = function setMediaContainerQueryStr(v) {
    mediaContainerQueryStr = v;
  };
  var notHide = ':not(.hide)';
  var mediaQueryStr = 'video';

  /** emoji 正则，用于弹幕过滤 */
  var emojiRegex = /(?:[\u2600-\u27BF]|\uD83C[\uDDE6-\uDDFF\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]|\uD83E[\uDD00-\uDDFF])/g;

  /**
   * DOM 工具函数
   * 从 ede.js 迁移，未修改原有实现逻辑
   */

  /**
   * 按 ID 获取元素
   * @param {string} childId - 元素 ID（不带 #）
   * @param {Document|Element} [parentNode=document] - 父节点
   * @returns {Element|null}
   */
  function getById(childId) {
    var parentNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    if (!parentNode) {
      return null;
    }
    return parentNode.querySelector("#".concat(childId));
  }

  /**
   * 按类名获取单个元素
   * @param {string} className - 类名（不带点）
   * @param {Document|Element} [parentNode=document] - 父节点
   * @returns {Element|null}
   */
  function getByClass(className) {
    var parentNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
    if (!parentNode) {
      return null;
    }
    return parentNode.querySelector(".".concat(className));
  }

  /**
   * 仅适用于 input 元素和下一个临近元素的事件
   * @param {Event} e
   * @returns {HTMLInputElement}
   */
  function getTargetInput(e) {
    return e.target.tagName === 'INPUT' ? e.target : e.target.previousElementSibling;
  }

  /**
   * 等待目标元素出现
   * @param {string|object} target - 选择器字符串，或 { element: ele, needParent: true }
   * @param {function} [callback] - 找到后的回调，参数为元素
   * @param {number} [timeout=10000] - 超时毫秒，0 表示不超时
   * @param {number} [interval=check_interval] - 检查间隔
   * @param {number[]} [destroyIntervalIds] - 用于清理的 interval id 数组，可选
   * @returns {Promise<HTMLElement|null>}
   */
  function waitForElement(target, callback) {
    var _target$element;
    var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10000;
    var interval = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : check_interval;
    var destroyIntervalIds = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
    var intervalId = null;
    var timeoutId = null;
    var isSelector = typeof target === 'string';
    var elementMark = isSelector ? target : (_target$element = target.element) === null || _target$element === void 0 ? void 0 : _target$element.tagName;
    var promise = new Promise(function (resolve, reject) {
      function checkElement() {
        var element = null;
        if (isSelector) {
          element = document.querySelector(target);
        } else if (target !== null && target !== void 0 && target.element) {
          if (target.needParent) {
            element = target.element.parentNode;
          } else {
            element = target.element;
          }
        }
        if (element) {
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          if (typeof callback === 'function') {
            callback(element);
          }
          resolve(element);
        }
      }
      intervalId = setInterval(checkElement, interval);
      if (destroyIntervalIds && Array.isArray(destroyIntervalIds)) {
        destroyIntervalIds.push(intervalId);
      }
      if (timeout > 0) {
        timeoutId = setTimeout(function () {
          clearInterval(intervalId);
          reject(new Error("Element [".concat(elementMark, "] not found within ").concat(timeout, "ms")));
        }, timeout);
      }
    });
    return promise;
  }

  function safeApiClient() {
    try {
      return typeof window !== 'undefined' && window.ApiClient || null;
    } catch (_unused) {
      return null;
    }
  }
  var OS = {
    isAndroid: function isAndroid() {
      return /android/i.test(navigator.userAgent);
    },
    isIOS: function isIOS() {
      return /iPad|iPhone|iPod/i.test(navigator.userAgent);
    },
    isMacOS: function isMacOS() {
      return /Macintosh|MacIntel/i.test(navigator.userAgent);
    },
    isApple: function isApple() {
      return OS.isMacOS() || OS.isIOS();
    },
    isWindows: function isWindows() {
      return /compatible|Windows/i.test(navigator.userAgent);
    },
    isMobile: function isMobile() {
      return OS.isAndroid() || OS.isIOS();
    },
    isUbuntu: function isUbuntu() {
      return /Ubuntu/i.test(navigator.userAgent);
    },
    isAndroidEmbyNoisyX: function isAndroidEmbyNoisyX() {
      var _api$appVersion;
      var api = safeApiClient();
      return api && OS.isAndroid() && ((_api$appVersion = api.appVersion) === null || _api$appVersion === void 0 ? void 0 : _api$appVersion.call(api).includes('-'));
    },
    isEmbyNoisyX: function isEmbyNoisyX() {
      var _api$appVersion2;
      var api = safeApiClient();
      return api && ((_api$appVersion2 = api.appVersion) === null || _api$appVersion2 === void 0 ? void 0 : _api$appVersion2.call(api).includes('-'));
    },
    isEmbyTheater: function isEmbyTheater() {
      var _api$appName;
      var api = safeApiClient();
      return api && ((_api$appName = api.appName) === null || _api$appName === void 0 ? void 0 : _api$appName.call(api)) === 'Emby Theater';
    },
    isEmbyUWP: function isEmbyUWP() {
      var _api$appName2;
      var api = safeApiClient();
      return api && ((_api$appName2 = api.appName) === null || _api$appName2 === void 0 ? void 0 : _api$appName2.call(api)) === 'Emby Windows';
    },
    isOthers: function isOthers() {
      return objectEntries(OS).filter(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 1),
          key = _ref2[0];
        return key !== 'isOthers';
      }).every(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
          val = _ref4[1];
        return !val();
      });
    }
  };

  /**
   * UI 通用组件：图片、链接、图标等
   * 从 ede.js 迁移，未修改原有实现逻辑
   */

  /**
   * 创建 Material Design 图标元素
   * @param {string} iconKey - 图标键名
   * @param {string} [extClassName] - 额外类名
   * @returns {HTMLElement}
   */
  function embyI(iconKey, extClassName) {
    var iNode = document.createElement('i');
    iNode.className = 'md-icon' + (extClassName ? ' ' + extClassName : '');
    iNode.style = 'pointer-events: none;';
    iNode.innerHTML = iconKey;
    return iNode;
  }

  /**
   * 创建图片元素
   * @param {string} src - 图片地址
   * @param {string} [style] - 样式
   * @param {string} [id] - 元素 ID
   * @param {boolean} [draggable=false] - 是否可拖拽
   * @returns {HTMLImageElement}
   */
  function embyImg(src, style, id) {
    var draggable = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var img = document.createElement('img');
    img.id = id;
    img.src = src;
    img.style = style;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.draggable = draggable;
    img.className = 'coveredImage-noScale cardImage';
    return img;
  }

  /**
   * 创建带图片的按钮
   * @param {HTMLElement} childNode - 子节点（通常为图片）
   * @param {string} [btnStyle] - 按钮样式
   * @returns {HTMLButtonElement}
   */
  function embyImgButton(childNode, btnStyle) {
    var btn = document.createElement('button');
    btn.style = btnStyle;
    btn.className = 'cardContent-button cardImageContainer cardPadder-portrait defaultCardBackground';
    btn.append(childNode);
    btn.addEventListener('focus', function () {
      btn.style.boxShadow = '0 0 0 5px green';
    });
    btn.addEventListener('blur', function () {
      btn.style.boxShadow = '';
    });
    return btn;
  }

  /**
   * 创建链接元素
   * @param {string} href - 链接地址
   * @param {string} [text] - 显示文本
   * @returns {HTMLAnchorElement}
   */
  function embyALink(href, text) {
    var aEle = document.createElement('a');
    aEle.setAttribute('is', 'emby-linkbutton');
    aEle.href = href;
    aEle.textContent = text || href;
    aEle.target = '_blank';
    aEle.className = 'button-link button-link-color-inherit button-link-fontweight-inherit emby-button';
    if (OS && OS.isMobile && OS.isMobile()) {
      aEle.addEventListener('click', function (event) {
        event.preventDefault();
        navigator.clipboard.writeText(href).then(function () {
          console.log('Link copied to clipboard:', href);
          var label = document.createElement('label');
          label.textContent = '已复制';
          label.style.color = 'green';
          label.style.paddingLeft = '0.5em';
          aEle.append(label);
          setTimeout(function () {
            aEle.removeChild(label);
          }, 3000);
        }, function (err) {
          console.error('Failed to copy link:', err);
        });
      });
    }
    return aEle;
  }

  /**
   * DOM 元素 ID 集合
   * 从 ede.js 迁移，未修改原有实现逻辑
   */

  var eleIds = {
    danmakuSwitchBtn: 'danmakuSwitchBtn',
    danmakuCtr: 'danmakuCtr',
    danmakuWrapper: 'danmakuWrapper',
    h5VideoAdapter: 'h5VideoAdapter',
    dialogContainer: 'dialogContainer',
    danmakuSwitchDiv: 'danmakuSwitchDiv',
    danmakuSwitch: 'danmakuSwitch',
    filterLevelDiv: 'filterLevelDiv',
    danmakuSearchNameDiv: 'danmakuSearchNameDiv',
    danmakuSearchName: 'danmakuSearchName',
    danmakuEpisodeFlag: 'danmakuEpisodeFlag',
    danmakuAnimeDiv: 'danmakuAnimeDiv',
    danmakuSwitchEpisode: 'danmakuSwitchEpisode',
    danmakuEpisodeNumDiv: 'danmakuEpisodeNumDiv',
    danmakuEpisodeLoad: 'danmakuEpisodeLoad',
    danmakuRemark: 'danmakuRemark',
    danmakuAnimeSelect: 'danmakuAnimeSelect',
    danmakuEpisodeNumSelect: 'danmakuEpisodeNumSelect',
    searchImgDiv: 'searchImgDiv',
    searchImg: 'searchImg',
    searchApiSource: 'searchApiSource',
    apiCheckboxListDiv: 'apiCheckboxListDiv',
    apiPriorityDiv: 'apiPriorityDiv',
    customApiPrefixInputDiv: 'customApiPrefixInputDiv',
    clearLocalMatchCacheBtn: 'clearLocalMatchCacheBtn',
    extCommentSearchDiv: 'extCommentSearchDiv',
    extUrlsDiv: 'extUrlsDiv',
    currentMatchedDiv: 'currentMatchedDiv',
    filteringDanmaku: 'filteringDanmaku',
    danmakuTypeFilterDiv: 'danmakuTypeFilterDiv',
    danmakuTypeFilterSelectName: 'danmakuTypeFilterSelectName',
    danmakuSourceFilterDiv: 'danmakuSourceFilterDiv',
    danmakuSourceFilterSelectName: 'danmakuSourceFilterSelectName',
    danmakuShowSourceDiv: 'danmakuShowSourceDiv',
    danmakuShowSourceSelectName: 'danmakuShowSourceSelectName',
    danmakuAutoFilterCountDiv: 'danmakuAutoFilterCountDiv',
    danmakuFilterProDiv: 'danmakuFilterProDiv',
    mergeSimilarPercentDiv: 'mergeSimilarPercentDiv',
    mergeSimilarTimeDiv: 'mergeSimilarTimeDiv',
    posterImgDiv: 'posterImgDiv',
    danmuListDiv: 'danmuListDiv',
    danmuListText: 'danmakuListText',
    extInfoCtrlDiv: 'extInfoCtrlDiv',
    extInfoDiv: 'extInfoDiv',
    characterImgHeihtDiv: 'characterImgHeihtDiv',
    characterImgHeihtLabel: 'characterImgHeihtLabel',
    charactersDiv: 'charactersDiv',
    filterKeywordsDiv: 'filterKeywordsDiv',
    danmakuChConverDiv: 'danmakuChConverDiv',
    danmakuEngineDiv: 'danmakuEngineDiv',
    heightPercentDiv: 'heightPercentDiv',
    danmakuSizeDiv: 'danmakuSizeDiv',
    danmakuOpacityDiv: 'danmakuOpacityDiv',
    danmakuSpeedDiv: 'danmakuSpeedDiv',
    danmakuFontWeightDiv: 'danmakuFontWeightDiv',
    danmakuFontStyleDiv: 'danmakuFontStyleDiv',
    timelineOffsetDiv: 'timelineOffsetDiv',
    fontFamilyCtrl: 'fontFamilyCtrl',
    fontFamilyDiv: 'fontFamilyDiv',
    fontFamilyLabel: 'fontFamilyLabel',
    fontFamilySelect: 'fontFamilySelect',
    fontFamilyInput: 'fontFamilyInput',
    fontStylePreview: 'fontStylePreview',
    settingsCtrl: 'settingsCtrl',
    settingsText: 'settingsText',
    settingsImportBtn: 'settingsImportBtn',
    settingReloadBtn: 'settingReloadBtn',
    filterKeywordsEnableId: 'filterKeywordsEnableId',
    filterKeywordsId: 'filterKeywordsId',
    timeoutCallbackDiv: 'timeoutCallbackDiv',
    timeoutCallbackLabel: 'timeoutCallbackLabel',
    timeoutCallbackTypeDiv: 'timeoutCallbackTypeDiv',
    timeoutCallbackUnitDiv: 'timeoutCallbackUnitDiv',
    bangumiEnableLabel: 'bangumiEnableLabel',
    bangumiSettingsDiv: 'bangumiSettingsDiv',
    bangumiTokenInput: 'bangumiTokenInput',
    bangumiTokenInputDiv: 'bangumiTokenInputDiv',
    bangumiTokenLabel: 'bangumiTokenInputLabel',
    bangumiTokenLinkDiv: 'bangumiTokenLinkDiv',
    bangumiPostPercentDiv: 'bangumiPostPercentDiv',
    customeUrlsDiv: 'customeUrlsDiv',
    customeCorsProxyDiv: 'customeCorsProxyDiv',
    customeDanmakuDiv: 'customeDanmakuDiv',
    customeGetCommentDiv: 'customeGetCommentDiv',
    customeGetExtcommentDiv: 'customeGetExtcommentDiv',
    customePosterImgDiv: 'customePosterImgDiv',
    consoleLogCtrl: 'consoleLogCtrl',
    consoleLogInfo: 'consoleLogInfo',
    consoleLogText: 'consoleLogText',
    consoleLogTextInput: 'consoleLogTextInput',
    consoleLogCountLabel: 'consoleLogCountLabel',
    debugCheckbox: 'debugCheckbox',
    debugButton: 'debugButton',
    tabIframe: 'tabIframe',
    tabIframeHeightDiv: 'tabIframeHeightDiv',
    tabIframeHeightLabel: 'tabIframeHeightLabel',
    tabIframeCtrlDiv: 'tabIframeCtrlDiv',
    tabIframeSrcInputDiv: 'tabIframeSrcInputDiv',
    openSourceLicenseDiv: 'openSourceLicenseDiv',
    videoOsdDanmakuTitle: 'videoOsdDanmakuTitle',
    extCheckboxDiv: 'extCheckboxDiv',
    osdCheckboxDiv: 'osdCheckboxDiv',
    osdLineChartDiv: 'osdLineChartDiv',
    osdLineChartTimeDiv: 'osdLineChartTimeDiv',
    danmuPluginDiv: 'danmuPluginDiv',
    danmakuSettingBtnDebug: 'danmakuSettingBtnDebug',
    progressBarLineChart: 'progressBarLineChart'
  };

  /**
   * 用户可配置项
   * 从 ede.js 迁移，未修改原有实现逻辑
   * note01: 部分 AndroidTV 仅支持最高 ES9 (支持 webview 内核版本 60 以上)
   * note02: url 禁止使用相对路径,非 web 环境的根路径为文件路径,非 http
   */

  var requireDanmakuPath = 'https://danmaku.7o7o.cc/danmaku.min.js';
  var corsProxy = 'https://ddplay-api.7o7o.cc/cors/';
  function setRequireDanmakuPath(v) {
    requireDanmakuPath = v;
  }
  function setCorsProxy(v) {
    corsProxy = v;
  }

  var openSourceLicense = {
    self: {
      version: '1.47',
      name: 'Emby Danmaku Extension(Forked from original:1.11)',
      license: 'MIT License',
      url: 'https://github.com/chen3861229/dd-danmaku'
    },
    original: {
      version: '1.11',
      name: 'Emby Danmaku Extension',
      license: 'MIT License',
      url: 'https://github.com/RyoLee/emby-danmaku'
    },
    jellyfinFork: {
      version: '1.52',
      name: 'Jellyfin Danmaku Extension',
      license: 'MIT License',
      url: 'https://github.com/Izumiko/jellyfin-danmaku'
    },
    danmaku: {
      version: '2.0.8',
      name: 'Danmaku',
      license: 'MIT License',
      url: 'https://github.com/weizhenye/Danmaku'
    },
    dandanplayApi: {
      version: 'v2',
      name: '弹弹 play API',
      license: 'MIT License',
      url: 'https://github.com/kaedei/dandanplay-libraryindex'
    },
    dandanplayDoc: {
      version: 'PC',
      name: '赞助弹弹 play 官方',
      license: 'None',
      url: 'https://doc.dandanplay.com/other/donate.html'
    },
    bangumiApi: {
      version: '2025-02-5',
      name: 'Bangumi API',
      license: 'None',
      url: 'https://github.com/bangumi/api'
    },
    embyPluginDanmu: {
      version: '1.0.2',
      name: 'EmbyPluginDanmu',
      license: 'None',
      url: 'https://github.com/fengymi/emby-plugin-danmu'
    }
  };
  var getApiTl = function getApiTl(fn) {
    if (!fn || typeof fn.toString !== 'function') {
      return '';
    }
    var match = fn.toString().match(/\=>\s*(.*)$/);
    if (!match || !match[1]) {
      return '';
    }
    return match[1].trim().replace(/`/g, '');
  };

  // dandanplayApi 需在 lsKeys 之前定义，getter 运行时才需要 lsGetItem/lsKeys
  var dandanplayApi = {
    get prefix() {
      var custom = lsGetItem(lsKeys.customApiPrefix.id);
      if (custom && custom.length > 0 && !lsGetItem(lsKeys.useOfficialApi.id)) {
        return custom;
      }
      return corsProxy + 'https://api.dandanplay.net/api/v2';
    },
    getSearchEpisodes: function getSearchEpisodes(anime, episode, tmdbId) {
      return "".concat(dandanplayApi.prefix, "/search/episodes?anime=").concat(anime).concat(episode ? "&episode=".concat(episode) : '').concat(tmdbId ? "&tmdbId=".concat(tmdbId) : '');
    },
    getComment: function getComment(episodeId, chConvert) {
      return "".concat(dandanplayApi.prefix, "/comment/").concat(episodeId, "?withRelated=true&chConvert=").concat(chConvert);
    },
    getExtcomment: function getExtcomment(url) {
      return "".concat(dandanplayApi.prefix, "/extcomment?url=").concat(encodeURI(url));
    },
    getBangumi: function getBangumi(animeId) {
      return "".concat(dandanplayApi.prefix, "/bangumi/").concat(animeId);
    },
    posterImg: function posterImg(animeId) {
      return "https://img.dandanplay.net/anime/".concat(animeId, ".jpg");
    }
  };
  var bangumiApi = {
    prefix: 'https://api.bgm.tv/v0',
    accessTokenUrl: 'https://next.bgm.tv/demo/access-token',
    getCharacters: function getCharacters(subjectId) {
      return "".concat(bangumiApi.prefix, "/subjects/").concat(subjectId, "/characters");
    },
    getMe: function getMe() {
      return "".concat(bangumiApi.prefix, "/me");
    },
    getUserCollection: function getUserCollection(userName, subjectId) {
      return "".concat(bangumiApi.prefix, "/users/").concat(userName, "/collections/").concat(subjectId);
    },
    postUserCollection: function postUserCollection(subjectId) {
      return "".concat(bangumiApi.prefix, "/users/-/collections/").concat(subjectId);
    },
    getUserSubjectEpisodeCollection: function getUserSubjectEpisodeCollection(subjectId) {
      return "".concat(bangumiApi.prefix, "/users/-/collections/").concat(subjectId, "/episodes?offset=0&limit=100");
    },
    putUserEpisodeCollection: function putUserEpisodeCollection(episodeId) {
      return "".concat(bangumiApi.prefix, "/users/-/collections/-/episodes/").concat(episodeId);
    }
  };

  // lsKeys 需在 dandanplayApi 之后，因 defaultValue 使用 getApiTl(dandanplayApi.getComment)
  var lsKeys = {
    chConvert: {
      id: 'danmakuChConvert',
      defaultValue: 1,
      name: '简繁转换'
    },
    switch: {
      id: 'danmakuSwitch',
      defaultValue: true,
      name: '弹幕开关'
    },
    filterLevel: {
      id: 'danmakuFilterLevel',
      defaultValue: 0,
      name: '过滤强度',
      min: 0,
      max: 3,
      step: 1
    },
    heightPercent: {
      id: 'danmakuHeightPercent',
      defaultValue: 100,
      name: '显示区域',
      min: 3,
      max: 100,
      step: 1
    },
    fontSizeRate: {
      id: 'danmakuFontSizeRate',
      defaultValue: 1,
      name: '弹幕大小',
      min: 0.1,
      max: 3,
      step: 0.1
    },
    fontOpacity: {
      id: 'danmakuFontOpacity',
      defaultValue: 1,
      name: '透明度',
      min: 0.1,
      max: 1,
      step: 0.1
    },
    speed: {
      id: 'danmakuBaseSpeed',
      defaultValue: 1,
      name: '速度',
      min: 0.1,
      max: 3,
      step: 0.1
    },
    timelineOffset: {
      id: 'danmakuTimelineOffset',
      defaultValue: 0,
      name: '轴偏秒'
    },
    fontWeight: {
      id: 'danmakuFontWeight',
      defaultValue: 400,
      name: '弹幕粗细',
      min: 100,
      max: 1000,
      step: 100
    },
    fontStyle: {
      id: 'danmakuFontStyle',
      defaultValue: 0,
      name: '弹幕斜体',
      min: 0,
      max: 2,
      step: 1
    },
    fontFamily: {
      id: 'danmakuFontFamily',
      defaultValue: 'sans-serif',
      name: '字体'
    },
    danmuList: {
      id: 'danmakuDanmuList',
      defaultValue: 0,
      name: '弹幕列表'
    },
    typeFilter: {
      id: 'danmakuTypeFilter',
      defaultValue: [],
      name: '屏蔽类型'
    },
    sourceFilter: {
      id: 'danmakuSourceFilter',
      defaultValue: [],
      name: '屏蔽来源平台'
    },
    showSource: {
      id: 'danmakuShowSource',
      defaultValue: [],
      name: '显示每条来源'
    },
    autoFilterCount: {
      id: 'danmakuAutoFilterCount',
      defaultValue: 0,
      name: '自动过滤弹幕数阈值',
      min: 0,
      max: 10000,
      step: 500
    },
    mergeSimilarEnable: {
      id: 'danmakuMergeSimilarEnable',
      defaultValue: false,
      name: '合并相似弹幕'
    },
    mergeSimilarPercent: {
      id: 'danmakuMergeSimilarPercent',
      defaultValue: 80,
      name: '相似度百分比',
      min: 20,
      max: 100,
      step: 1
    },
    mergeSimilarTime: {
      id: 'danmakuMergeSimilarTime',
      defaultValue: 10,
      name: '相似度时间窗口秒',
      min: 1,
      max: 60,
      step: 1
    },
    filterKeywords: {
      id: 'danmakuFilterKeywords',
      defaultValue: '',
      name: '屏蔽关键词'
    },
    filterKeywordsEnable: {
      id: 'danmakuFilterKeywordsEnable',
      defaultValue: true,
      name: '屏蔽关键词启用'
    },
    engine: {
      id: 'danmakuEngine',
      defaultValue: 'canvas',
      name: '弹幕引擎'
    },
    osdTitleEnable: {
      id: 'danmakuOsdTitleEnable',
      defaultValue: false,
      name: '播放界面右下角显示弹幕信息'
    },
    osdLineChartEnable: {
      id: 'danmakuOsdLineChartEnable',
      defaultValue: false,
      name: '弹幕高能进度条'
    },
    osdLineChartSkipFilter: {
      id: 'danmakuOsdLineChartSkipFilter',
      defaultValue: false,
      name: '弹幕高能进度条免过滤'
    },
    osdLineChartTime: {
      id: 'danmakuOsdLineChartTime',
      defaultValue: 10,
      name: '弹幕高能进度条颗粒度秒',
      min: 1,
      max: 60,
      step: 1
    },
    osdHeaderClockEnable: {
      id: 'danmakuOsdHeaderClockEnable',
      defaultValue: false,
      name: '播放界面头中显示时钟'
    },
    timeoutCallbackUnit: {
      id: 'danmakuTimeoutCallbackUnit',
      defaultValue: 1,
      name: '定时单位'
    },
    timeoutCallbackValue: {
      id: 'danmakuTimeoutCallbackValue',
      defaultValue: 0,
      name: '定时值'
    },
    bangumiEnable: {
      id: 'danmakuBangumiEnable',
      defaultValue: false,
      name: '启用并填写个人令牌'
    },
    bangumiToken: {
      id: 'danmakuBangumiToken',
      defaultValue: '',
      name: '个人令牌'
    },
    bangumiPostPercent: {
      id: 'danmakuBangumiPostPercent',
      defaultValue: 95,
      name: '时长比',
      min: 1,
      max: 99,
      step: 1
    },
    consoleLogEnable: {
      id: 'danmakuConsoleLogEnable',
      defaultValue: false,
      name: '控制台日志'
    },
    useFetchPluginXml: {
      id: 'danmakuUseFetchPluginXml',
      defaultValue: false,
      name: '加载媒体服务端xml弹幕'
    },
    debugShowDanmakuWrapper: {
      id: 'danmakuDebugShowDanmakuWrapper',
      defaultValue: false,
      name: '弹幕容器边界'
    },
    debugShowDanmakuCtrWrapper: {
      id: 'danmakuDebugShowDanmakuCtrWrapper',
      defaultValue: false,
      name: '按钮容器边界'
    },
    debugReverseDanmu: {
      id: 'danmakuDebugReverseDanmu',
      defaultValue: false,
      name: '反转弹幕方向'
    },
    debugRandomDanmuColor: {
      id: 'danmakuDebugRandomDanmuColor',
      defaultValue: false,
      name: '随机弹幕颜色'
    },
    debugForceDanmuWhite: {
      id: 'danmakuDebugForceDanmuWhite',
      defaultValue: false,
      name: '强制弹幕白色'
    },
    debugTopBottomToScroll: {
      id: 'danmakuDebugTopBottomToScroll',
      defaultValue: false,
      name: '顶底弹幕滚动'
    },
    debugGenerateLarge: {
      id: 'danmakuDebugGenerateLarge',
      defaultValue: false,
      name: '测试大量弹幕'
    },
    debugDialogHyalinize: {
      id: 'danmakuDebugDialogHyalinize',
      defaultValue: false,
      name: '透明弹窗背景'
    },
    debugDialogWindow: {
      id: 'danmakuDebugDialogWindow',
      defaultValue: false,
      name: '弹窗窗口化'
    },
    debugDialogRight: {
      id: 'danmakuDebugDialogRight',
      defaultValue: false,
      name: '弹窗靠右布局'
    },
    debugTabIframeEnable: {
      id: 'danmakuDebugTabIframeEnable',
      defaultValue: false,
      name: '打开内嵌网页'
    },
    debugH5VideoAdapterEnable: {
      id: 'danmakuDebugH5VideoAdapterEnable',
      defaultValue: false,
      name: '查看视频适配器情况'
    },
    debugDanmuAnywhereEnable: {
      id: 'danmakuDebugDanmuAnywhereEnable',
      defaultValue: false,
      name: '在任意处测试弹幕'
    },
    quickDebugOn: {
      id: 'danmakuQuickDebugOn',
      defaultValue: false,
      name: '快速调试'
    },
    customeCorsProxyUrl: {
      id: 'danmakuCustomeCorsProxyUrl',
      defaultValue: corsProxy,
      name: '跨域代理前缀'
    },
    customeDanmakuUrl: {
      id: 'danmakuCustomeDanmakuUrl',
      defaultValue: requireDanmakuPath,
      name: '弹幕引擎依赖'
    },
    customeGetCommentUrl: {
      id: 'danmakuCustomeGetCommentUrl',
      defaultValue: getApiTl(dandanplayApi.getComment),
      name: '获取指定弹幕库的所有弹幕'
    },
    customeGetExtcommentUrl: {
      id: 'danmakuCustomeGetExtcommentUrl',
      defaultValue: getApiTl(dandanplayApi.getExtcomment),
      name: '获取指定第三方url的弹幕'
    },
    customePosterImgUrl: {
      id: 'danmakuCustomePosterImgUrl',
      defaultValue: getApiTl(dandanplayApi.posterImg),
      name: '媒体海报'
    },
    customApiPrefix: {
      id: 'danmakuCustomApiPrefix',
      defaultValue: '',
      name: '自定义弹弹play API地址'
    },
    useOfficialApi: {
      id: 'danmakuUseOfficialApi',
      defaultValue: true,
      name: '使用官方API'
    },
    useCustomApi: {
      id: 'danmakuUseCustomApi',
      defaultValue: false,
      name: '使用自定义API'
    },
    apiPriority: {
      id: 'danmakuApiPriority',
      defaultValue: ['official', 'custom'],
      name: 'API 优先级'
    }
  };
  function lsGetKeyById(id) {
    return Object.keys(lsKeys).find(function (key) {
      return lsKeys[key].id === id;
    });
  }
  function lsGetItem(id) {
    var key = lsGetKeyById(id);
    if (!key) {
      return null;
    }
    var defaultValue = lsKeys[key].defaultValue;
    var item = localStorage.getItem(id);
    if (item === null) {
      return defaultValue;
    }
    if (Array.isArray(defaultValue) || _typeof(defaultValue) === 'object' && defaultValue !== null) {
      return JSON.parse(item);
    }
    if (typeof defaultValue === 'boolean') {
      return item === 'true';
    }
    if (typeof defaultValue === 'number') {
      return parseFloat(item);
    }
    return item;
  }

  function lsSetItem(id, value) {
    if (!lsGetKeyById(id)) {
      return;
    }
    var stringValue;
    if (Array.isArray(value)) {
      stringValue = JSON.stringify(value);
    } else if (_typeof(value) === 'object' && value !== null) {
      stringValue = JSON.stringify(value);
    } else {
      stringValue = String(value);
    }
    localStorage.setItem(id, stringValue);
  }
  function lsCheckOld(id, value) {
    return JSON.stringify(lsGetItem(id)) === JSON.stringify(value);
  }
  function lsCheckSet(id, value) {
    if (lsCheckOld(id, value)) {
      return false;
    }
    lsSetItem(id, value);
    return true;
  }

  /**
   * 批量设置缓存
   * @param {object} keyValues - 键值对对象，如 { key1: value1, key2: value2 }
   * @param {boolean} [needCheck=true] - 是否检查后设置
   * @returns {boolean|undefined} - needCheck 为 true 时返回是否有更新
   */
  function lsBatchSet(keyValues) {
    var needCheck = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    if (needCheck) {
      return objectEntries(keyValues).reduce(function (acc, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          id = _ref2[0],
          value = _ref2[1];
        return acc || lsCheckSet(id, value);
      }, false);
    }
    objectEntries(keyValues).forEach(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
        id = _ref4[0],
        value = _ref4[1];
      return lsSetItem(id, value);
    });
  }

  /**
   * 按前缀批量移除 localStorage
   * @param {string[]} prefixes - 键前缀数组
   * @returns {boolean} - 是否有移除
   */
  function lsBatchRemove(prefixes) {
    return Object.keys(localStorage).filter(function (key) {
      return prefixes.some(function (prefix) {
        return key.startsWith(prefix);
      });
    }).map(function (key) {
      return localStorage.removeItem(key);
    }).length > 0;
  }

  var EDE = /*#__PURE__*/_createClass(function EDE() {
    _classCallCheck(this, EDE);
    this.chConvert = lsGetItem(lsKeys.chConvert.id);
    this.danmaku = null;
    this.episode_info = null;
    this.ob = null;
    this.loading = false;
    this.danmuCache = {}; // 只包含 comment 未解析
    this.commentsParsed = []; // 包含 comment 和 extComment 解析后全量
    this.extCommentCache = {}; // 只包含 extComment 未解析
    this.destroyIntervalIds = [];
    this.searchDanmakuOpts = {}; // 手动搜索变量
    this.appLogAspect = null; // 应用日志切面
    this.bangumiInfo = {};
    this.itemId = '';
    this.tempLsValues = {}; // 临时存储的由程序更改后的 ls 值
  });

  /**
   * 控制台日志切面
   * 用于高级设置中的控制台日志展示
   * 从 ede.js 迁移，未修改原有实现逻辑
   */

  var AppLogAspect = /*#__PURE__*/function () {
    function AppLogAspect() {
      _classCallCheck(this, AppLogAspect);
      this.initialized = false;
      this.originalError = console.error;
      this.originalWarn = console.warn;
      this.originalLog = console.log;
      this.originalOnerror = null;
      this.value = '';
      this.listeners = [];
      this.ERROR = {
        text: 'ERROR',
        emoji: '❗️'
      };
      this.WARN = {
        text: 'WARN',
        emoji: '⚠️'
      };
      this.INFO = {
        text: 'INFO',
        emoji: '❕'
      };
    }
    return _createClass(AppLogAspect, [{
      key: "init",
      value: function init() {
        var _this = this;
        if (this.initialized) {
          return this;
        }
        console.error = function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this.originalError.apply(console, args);
          _this.value += _this.format(_this.ERROR, args);
          _this.notifyListeners();
        };
        console.warn = function () {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
          _this.originalWarn.apply(console, args);
          _this.value += _this.format(_this.WARN, args);
          _this.notifyListeners();
        };
        console.log = function () {
          for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }
          _this.originalLog.apply(console, args);
          _this.value += _this.format(_this.INFO, args);
          _this.notifyListeners();
        };
        this.originalOnerror = window.onerror;
        window.onerror = function () {
          for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }
          console.error(args);
          if (typeof _this.originalOnerror === 'function') {
            _this.originalOnerror.apply(_this, args);
          }
        };
        this.initialized = true;
        return this;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        var clearValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        if (this.initialized) {
          console.error = this.originalError;
          console.warn = this.originalWarn;
          console.log = this.originalLog;
          window.onerror = this.originalOnerror;
          if (clearValue) {
            this.value = '';
          }
          this.listeners = [];
          this.initialized = false;
        }
        return this;
      }
    }, {
      key: "format",
      value: function format(level, args) {
        var emoji = level.emoji ? "[".concat(level.emoji, "] ") : '';
        return "[".concat(new Date(Date.now()).toLocaleString(), "] [").concat(level.text, "] ").concat(emoji, ": ") + args.map(function (arg) {
          return arg instanceof Error ? arg.message : typeof arg === 'string' ? arg : JSON.stringify(arg);
        }).join(' ') + '\n';
      }
    }, {
      key: "on",
      value: function on(valueChangedCallback) {
        var _this2 = this;
        if (valueChangedCallback.toString().includes('console.log') || valueChangedCallback.toString().includes('console.error')) {
          throw new Error('The callback function must not contain console.log or console.error to avoid infinite loops.');
        }
        this.listeners.push(function () {
          return valueChangedCallback(_this2.value);
        });
      }
    }, {
      key: "notifyListeners",
      value: function notifyListeners() {
        this.listeners.forEach(function (listener) {
          return listener();
        });
      }
    }, {
      key: "clearValue",
      value: function clearValue() {
        this.value = '';
        this.notifyListeners();
      }
    }]);
  }();

  /**
   * core 模块统一导出
   */

  /**
   * 清理所有由 waitForElement 创建的 interval
   * @param {EDE} [ede] - EDE 实例，不传时使用 window.ede
   */
  function destroyAllInterval(ede) {
    var target = ede !== null && ede !== void 0 ? ede : window.ede;
    if (target !== null && target !== void 0 && target.destroyIntervalIds) {
      target.destroyIntervalIds.forEach(function (id) {
        return clearInterval(id);
      });
      target.destroyIntervalIds = [];
    }
  }

  /**
   * 图标、样式、类名配置
   * 从 ede.js 迁移，未修改原有实现逻辑
   */

  // https://fonts.google.com/icons
  var iconKeys = {
    replay_30: 'replay_30',
    replay_10: 'replay_10',
    replay_5: 'replay_5',
    replay: 'replay',
    reset: 'repeat',
    forward_media: 'forward_media',
    // electron 中图标不正确,使用 replay 反转
    forward_5: 'forward_5',
    forward_10: 'forward_10',
    forward_30: 'forward_30',
    comment: 'comment',
    comments_disabled: 'comments_disabled',
    switch_on: 'toggle_on',
    switch_off: 'toggle_off',
    setting: 'tune',
    search: 'search',
    done: 'done_all',
    done_disabled: 'remove_done',
    more: 'more_horiz',
    close: 'close',
    refresh: 'refresh',
    block: 'block',
    text_format: 'translate',
    person: 'person',
    sentiment_very_satisfied: 'sentiment_very_satisfied',
    check: 'check',
    edit: 'edit'
  };
  var embyOffsetBtnStyle = 'margin: 0;padding: 0;';
  var timeOffsetBtns = [{
    label: '-30',
    valueOffset: '-30',
    iconKey: iconKeys.replay_30,
    style: embyOffsetBtnStyle
  }, {
    label: '-10',
    valueOffset: '-10',
    iconKey: iconKeys.replay_10,
    style: embyOffsetBtnStyle
  }, {
    label: '-5',
    valueOffset: '-5',
    iconKey: iconKeys.replay_5,
    style: embyOffsetBtnStyle
  }, {
    label: '-1',
    valueOffset: '-1',
    iconKey: iconKeys.replay,
    style: embyOffsetBtnStyle
  }, {
    label: '0',
    valueOffset: '0',
    iconKey: iconKeys.reset,
    style: embyOffsetBtnStyle
  }, {
    label: '+1',
    valueOffset: '1',
    iconKey: iconKeys.replay,
    style: embyOffsetBtnStyle + ' transform: rotateY(180deg);'
  }, {
    label: '+5',
    valueOffset: '5',
    iconKey: iconKeys.forward_5,
    style: embyOffsetBtnStyle
  }, {
    label: '+10',
    valueOffset: '10',
    iconKey: iconKeys.forward_10,
    style: embyOffsetBtnStyle
  }, {
    label: '+30',
    valueOffset: '30',
    iconKey: iconKeys.forward_30,
    style: embyOffsetBtnStyle
  }];

  // emby ui class
  var classes = {
    dialogContainer: 'dialogContainer',
    dialogBackdropOpened: 'dialogBackdropOpened',
    dialogBlur: 'dialog-blur',
    // Emby Theater (魔改版)上的毛玻璃背景
    dialog: 'dialog',
    formDialogHeader: 'formDialogHeader',
    formDialogFooter: 'formDialogFooter',
    formDialogFooterItem: 'formDialogFooterItem',
    dialogFullscreen: 'dialog-fullscreen',
    dialogFullscreenLowres: 'dialog-fullscreen-lowres',
    // Emby Android (魔改版)特殊全屏
    videoOsdTitle: 'videoOsdTitle',
    // 播放页媒体次级标题
    videoOsdBottomButtons: 'videoOsdBottom-buttons',
    // 新老客户端播放页通用的底部按钮,但在 TV 下是 hide
    videoOsdBottomButtonsTopRight: 'videoOsdBottom-buttons-topright',
    // 新客户端播放页右上方的按钮
    videoOsdBottomButtonsRight: 'videoOsdBottom-buttons-right',
    // 老客户端上的右侧按钮
    videoOsdPositionSliderContainer: 'videoOsdPositionSliderContainer',
    cardImageIcon: 'cardImageIcon',
    headerRight: 'headerRight',
    headerUserButton: 'headerUserButton',
    mdlSpinner: 'mdl-spinner',
    collapseContentNav: 'collapseContent navDrawerCollapseContent',
    embyLabel: 'inputLabel',
    embyInput: 'emby-input emby-input-smaller',
    embySelectWrapper: 'emby-select-wrapper',
    embySelectTv: 'emby-select-tv',
    // highlight on tv layout
    embyCheckboxList: 'checkboxList',
    embyFieldDesc: 'fieldDescription',
    embyTabsMenu: 'headerMiddle headerSection sectionTabs headerMiddle-withSectionTabs',
    embyTabsDiv1: 'tabs-viewmenubar tabs-viewmenubar-backgroundcontainer focusable scrollX hiddenScrollX smoothScrollX scrollFrameX emby-tabs',
    embyTabsDiv2: 'tabs-viewmenubar-slider emby-tabs-slider padded-left padded-right nohoverfocus scrollSliderX',
    embyTabsButton: 'emby-button secondaryText emby-tab-button main-tab-button',
    embyButtons: {
      basic: 'raised emby-button',
      submit: 'button-submit',
      help: 'button-help',
      link: 'button-link',
      iconButton: 'flex-shrink-zero paper-icon-button-light'
    }
  };
  var styles = {
    embyCheckboxList: 'display: flex;flex-wrap: wrap;',
    embySliderList: 'display: flex;flex-direction: column;justify-content: center;align-items: center;',
    embySlider: 'display: flex; align-items: center; margin-bottom: 0.3em;',
    embySliderLabel: 'width: 4em; margin-left: 1em;',
    rightLayout: 'position: fixed; right: 0; width: 40%; min-width: auto; min-height: auto; max-width: 100%; max-height: 100%;',
    colors: {
      info: 0xffffff,
      // 白色
      success: 0x00ff00,
      // 绿色
      warn: 0xffff00,
      // 黄色
      error: 0xff0000,
      // 红色
      highlight: 'rgba(115, 160, 255, 0.3)',
      // 尽量接近浏览器控制台选定元素的淡蓝色背景色
      switchActiveColor: '#52b54b'
    },
    fontStyles: [{
      id: 'normal',
      name: '正常'
    }, {
      id: 'italic',
      name: '原生斜体'
    }, {
      id: 'oblique',
      name: '形变斜体'
    }]
  };

  /**
   * 创建 Emby 风格按钮
   * @param {object} props - { id, label, style, iconKey, ... }
   * @param {function} [onClick] - 点击回调
   * @returns {HTMLButtonElement}
   */
  function embyButton(props, onClick) {
    var button = document.createElement('button');
    button.setAttribute('is', 'emby-button');
    button.setAttribute('type', 'button');
    objectEntries(props).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];
      if (key !== 'iconKey' && typeof value !== 'function') {
        button.setAttribute(key, value);
      }
    });
    if (props.iconKey) {
      button.setAttribute('title', props.label);
      button.setAttribute('aria-label', props.label);
      button.innerHTML = embyI(props.iconKey).outerHTML;
      button.className = classes.embyButtons.iconButton;
    } else {
      var _button$classList;
      (_button$classList = button.classList).add.apply(_button$classList, _toConsumableArray(classes.embyButtons.basic.split(' ')));
      button.textContent = props.label;
    }
    if (typeof onClick === 'function') {
      button.addEventListener('click', onClick);
    }
    return button;
  }

  /**
   * 创建 Emby 风格输入框
   * @param {object} props - { id, value, type, style, ... }
   * @param {function} [onEnter] - 回车回调
   * @param {function} [onChange] - 变更回调
   * @returns {HTMLInputElement}
   */
  function embyInput(props, onEnter, onChange) {
    var input = document.createElement('input', {
      is: 'emby-input'
    });
    objectEntries(props).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];
      if (typeof value !== 'function') {
        input.setAttribute(key, value);
      }
    });
    input.className = classes.embyInput;
    if (typeof onEnter === 'function') {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') onEnter(e);
      });
    }
    if (typeof onChange === 'function') {
      input.addEventListener('change', onChange);
    }
    input.addEventListener('keydown', function (event) {
      if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && (input.selectionStart === 0 && event.key === 'ArrowLeft' || input.selectionEnd === input.value.length && event.key === 'ArrowRight')) {
        event.stopPropagation();
        event.preventDefault();
        var options = {
          sourceElement: event.target,
          repeat: event.repeat,
          originalEvent: event
        };
        if (typeof require === 'function') {
          require(['inputmanager'], function (inputmanager) {
            inputmanager.trigger(event.key.replace('Arrow', '').toLowerCase(), options);
          });
        }
      }
    });
    return input;
  }

  /**
   * 创建 Emby 风格文本域
   * @param {object} props - { id, value, rows, style, styleResize, readonly, ... }
   * @param {function} [onBlur] - 失焦回调
   * @returns {HTMLTextAreaElement}
   */
  function embyTextarea(props, onBlur) {
    var defaultProps = {
      rows: 10,
      styleResize: 'vertical',
      readonly: false
    };
    props = _objectSpread2(_objectSpread2({}, defaultProps), props);
    var textarea = document.createElement('textarea', {
      is: 'emby-textarea'
    });
    objectEntries(props).forEach(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
        key = _ref4[0],
        value = _ref4[1];
      if (typeof value !== 'function' && key !== 'readonly' && key !== 'styleResize' && key !== 'value') {
        textarea.setAttribute(key, value);
      }
    });
    textarea.className = 'txtOverview emby-textarea';
    textarea.readOnly = props.readonly;
    textarea.style.resize = props.styleResize;
    textarea.value = props.value;
    if (typeof onBlur === 'function') {
      textarea.addEventListener('blur', onBlur);
    }
    return textarea;
  }

  /**
   * 创建 Emby 风格下拉选择
   * @param {object} props - 属性
   * @param {number|string} selectedIndexOrValue - 选中索引或值
   * @param {Array} options - 选项数组
   * @param {string|function} optionValueKey - 值键名或取值函数
   * @param {string|function} optionTitleKey - 标题键名或取值函数
   * @param {function} [onChange] - 变更回调
   * @param {function} [onFocus] - 聚焦回调
   * @returns {HTMLLabelElement}
   */
  function embySelect(props, selectedIndexOrValue, options, optionValueKey, optionTitleKey, onChange, onFocus) {
    var defaultProps = {
      class: 'emby-select'
    };
    props = _objectSpread2(_objectSpread2({}, defaultProps), props);
    if (!Number.isInteger(selectedIndexOrValue)) {
      selectedIndexOrValue = options.indexOf(selectedIndexOrValue);
    }
    var selectElement = document.createElement('select', {
      is: 'emby-select'
    });
    if (typeof require === 'function') {
      require(['browser'], function (browser) {
        if (browser.tv) {
          selectElement.classList.add(classes.embySelectTv);
        }
      });
    }
    objectEntries(props).forEach(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
        key = _ref6[0],
        value = _ref6[1];
      if (typeof value !== 'function') {
        selectElement.setAttribute(key, value);
      }
    });
    options.forEach(function (option, index) {
      var value = getValueOrInvoke(option, optionValueKey, index);
      var title = getValueOrInvoke(option, optionTitleKey, index);
      var optionElement = document.createElement('option');
      optionElement.value = value;
      optionElement.textContent = title;
      if (index === selectedIndexOrValue) {
        optionElement.selected = true;
      }
      selectElement.append(optionElement);
    });
    if (typeof onChange === 'function') {
      selectElement.addEventListener('change', function (e) {
        onChange(e.target.value, e.target.selectedIndex, options[e.target.selectedIndex]);
      });
    }
    if (typeof onFocus === 'function') {
      selectElement.addEventListener('focus', onFocus);
    }
    var selectLabel = document.createElement('label');
    selectLabel.classList.add('selectLabel');
    selectLabel.appendChild(selectElement);
    return selectLabel;
  }

  /**
   * 创建 Emby 风格 Tab 切换
   * @param {Array} options - 选项数组
   * @param {string|number} selectedValue - 选中值
   * @param {string|function} optionValueKey - 值键名或取值函数
   * @param {string|function} optionTitleKey - 标题键名或取值函数
   * @param {function} [onChange] - 切换回调
   * @returns {HTMLElement}
   */
  function embyTabs(options, selectedValue, optionValueKey, optionTitleKey, onChange) {
    var tabs = document.createElement('div', {
      is: 'emby-tabs'
    });
    tabs.setAttribute('data-index', '0');
    tabs.className = classes.embyTabsDiv1;
    tabs.style.width = 'fit-content';
    var tabsSlider = document.createElement('div');
    tabsSlider.className = classes.embyTabsDiv2;
    tabsSlider.style.padding = '0.25em';
    options.forEach(function (option, index) {
      var value = getValueOrInvoke(option, optionValueKey);
      var title = getValueOrInvoke(option, optionTitleKey);
      var tabButton = document.createElement('button');
      tabButton.id = option.id + 'Btn';
      tabButton.className = "".concat(classes.embyTabsButton).concat(value == selectedValue ? ' emby-tab-button-active' : '');
      tabButton.setAttribute('data-index', index);
      tabButton.textContent = title;
      tabButton.style.display = option.hidden ? 'none' : '';
      tabsSlider.append(tabButton);
    });
    tabs.append(tabsSlider);
    if (typeof onChange === 'function') {
      tabs.addEventListener('tabchange', function (e) {
        return onChange(options[e.detail.selectedTabIndex], e.detail.selectedTabIndex);
      });
    }
    return tabs;
  }

  /**
   * 创建单个复选框
   * @param {object} opts - { id, name, label, value }
   * @param {boolean} [checked=false]
   * @param {function} [onChange]
   * @returns {HTMLLabelElement}
   */
  function embyCheckbox(_ref) {
    var id = _ref.id,
      name = _ref.name,
      label = _ref.label,
      value = _ref.value;
    var checked = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var onChange = arguments.length > 2 ? arguments[2] : undefined;
    var checkboxLabel = document.createElement('label');
    checkboxLabel.classList.add('emby-checkbox-label');
    checkboxLabel.setAttribute('style', 'width: auto;');
    var checkbox = document.createElement('input', {
      is: 'emby-checkbox'
    });
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('id', id);
    checkbox.setAttribute('name', name);
    checkbox.setAttribute('value', value);
    checkbox.checked = checked;
    checkbox.classList.add('emby-checkbox', 'chkEnableLiveTvAccess');
    if (typeof onChange === 'function') {
      checkbox.addEventListener('change', function (e) {
        return onChange(e.target.checked);
      });
    }
    var span = document.createElement('span');
    span.setAttribute('class', 'checkboxLabel');
    span.innerHTML = label;
    checkboxLabel.append(checkbox);
    checkboxLabel.append(span);
    return checkboxLabel;
  }

  /**
   * 创建复选框列表
   * @param {string} id - 容器 ID
   * @param {string} checkBoxName - 复选框 name
   * @param {string[]} [selectedStrArray] - 已选值数组
   * @param {Array} options - 选项数组 { id, name }
   * @param {function} [onChange]
   * @param {boolean} [isVertical=false]
   * @returns {HTMLElement}
   */
  function embyCheckboxList(id, checkBoxName, selectedStrArray, options, onChange) {
    var isVertical = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    var checkboxContainer = document.createElement('div');
    checkboxContainer.setAttribute('class', classes.embyCheckboxList);
    checkboxContainer.setAttribute('style', isVertical ? '' : styles.embyCheckboxList);
    checkboxContainer.setAttribute('id', id);
    options.forEach(function (option) {
      checkboxContainer.append(embyCheckbox({
        name: checkBoxName,
        label: option.name,
        value: option.id
      }, selectedStrArray ? selectedStrArray.indexOf(option.id) > -1 : false, onChange));
    });
    return checkboxContainer;
  }

  /**
   * 创建滑块
   * @param {object} opts - { id, labelId, value, min, max, step, orient, lsKey, ... }
   * @param {function} [onChange] - 变更回调 (value, opts)
   * @param {function} [onSliding] - 滑动中回调
   * @returns {HTMLInputElement}
   */
  function embySlider() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var onChange = arguments.length > 1 ? arguments[1] : undefined;
    var onSliding = arguments.length > 2 ? arguments[2] : undefined;
    var defaultOpts = {
      min: 0.1,
      max: 3,
      step: 0.1,
      orient: 'horizontal',
      'data-bubble': false,
      'data-hoverthumb': true,
      style: ''
    };
    var options = _objectSpread2(_objectSpread2({}, defaultOpts), opts);
    var slider = document.createElement('input', {
      is: 'emby-slider'
    });
    slider.setAttribute('type', 'range');
    if (opts.id) {
      slider.setAttribute('id', opts.id);
    }
    objectEntries(options).forEach(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
        key = _ref3[0],
        value = _ref3[1];
      if (key === 'lsKey') {
        var optsKeys = Object.keys(opts);
        if (!optsKeys.includes('value')) {
          options.value = lsGetItem(value.id);
        }
        if (!optsKeys.includes('min')) {
          slider.setAttribute('min', value.min);
        }
        if (!optsKeys.includes('max')) {
          slider.setAttribute('max', value.max);
        }
        if (!optsKeys.includes('step')) {
          slider.setAttribute('step', value.step);
        }
      } else {
        slider.setAttribute(key, value);
      }
    });
    if (typeof onChange === 'function') {
      slider.addEventListener('change', function (e) {
        opts.isManual = e.isManual;
        var nextEle = e.target.parentNode.nextElementSibling;
        opts.labelEle = nextEle.children.length > 0 ? nextEle.children[0] : nextEle;
        return onChange(e.target.value, opts);
      });
    }
    if (typeof onSliding === 'function') {
      slider.addEventListener('input', function (e) {
        var nextEle = e.target.parentNode.nextElementSibling;
        opts.labelEle = nextEle.children.length > 0 ? nextEle.children[0] : nextEle;
        return onSliding(e.target.value, opts);
      });
    }
    if (options.value || options.value === 0) {
      slider.setValue(options.value);
      waitForElement({
        element: slider,
        needParent: true
      }, function (ele) {
        var e = new Event('change');
        e.isManual = true;
        slider.dispatchEvent(e);
      });
    }
    slider.addEventListener('keydown', function (e) {
      var orient = slider.getAttribute('orient') || 'horizontal';
      if (orient === 'horizontal' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') || orient === 'vertical' && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.stopPropagation();
      }
    });
    return slider;
  }

  /**
   * 选项配置（弹幕类型、来源、列表等）
   * 从 ede.js 迁移，未修改原有实现逻辑
   */
  var currentDanmakuInfoContainerId = 'danmakuTab2';
  var tabIframeId = 'danmakuTab5';

  // 弹幕类型过滤
  var danmakuTypeFilterOpts = {
    bottom: {
      id: 'bottom',
      name: '底部弹幕'
    },
    top: {
      id: 'top',
      name: '顶部弹幕'
    },
    ltr: {
      id: 'ltr',
      name: '从左至右'
    },
    rtl: {
      id: 'rtl',
      name: '从右至左'
    },
    rolling: {
      id: 'rolling',
      name: '滚动弹幕'
    },
    onlyWhite: {
      id: 'onlyWhite',
      name: '彩色弹幕'
    },
    emoji: {
      id: 'emoji',
      name: 'emoji'
    }
  };
  var danmakuSource = {
    AcFun: {
      id: 'AcFun',
      name: 'A站(AcFun)'
    },
    BiliBili: {
      id: 'BiliBili',
      name: 'B站(BiliBili)'
    },
    DanDanPlay: {
      id: 'DanDanPlay',
      name: '弹弹(DanDanPlay)'
    },
    // 无弹幕来源的默认值
    D: {
      id: 'D',
      name: 'D'
    },
    // 未知平台
    Gamer: {
      id: 'Gamer',
      name: '巴哈(Gamer)'
    },
    iqiyi: {
      id: 'iqiyi',
      name: '爱奇艺(iqiyi)'
    },
    QQ: {
      id: 'QQ',
      name: '腾讯视频(QQ)'
    },
    Youku: {
      id: 'Youku',
      name: '优酷(Youku)'
    },
    '5dm': {
      id: '5dm',
      name: 'D站(5dm)'
    },
    '异世界动漫': {
      id: '异世界动漫',
      name: '异世界动漫'
    }
  };
  var showSource = {
    source: {
      id: 'source',
      name: '来源平台'
    },
    originalUserId: {
      id: 'originalUserId',
      name: '用户ID'
    },
    cid: {
      id: 'cid',
      name: '弹幕CID'
    } // 非弹幕 id,唯一性需自行用 uid + cid 拼接的 cuid
  };
  var danmakuEngineOpts = [{
    id: 'canvas',
    name: 'canvas'
  }, {
    id: 'dom',
    name: 'dom'
  }];
  var danmakuChConverOpts = [{
    id: '0',
    name: '未启用'
  }, {
    id: '1',
    name: '转换为简体'
  }, {
    id: '2',
    name: '转换为繁体'
  }];
  var toastPrefixes = {
    system: '[系统通知] : '
  };
  var hasToastPrefixes = function hasToastPrefixes(comment, prefixes) {
    return Object.values(prefixes).some(function (prefix) {
      return comment.text.startsWith(prefix);
    });
  };
  var getDanmakuComments = function getDanmakuComments(ede) {
    if (ede.danmaku && ede.danmaku.comments) {
      return ede.danmaku.comments.filter(function (c) {
        return !hasToastPrefixes(c, toastPrefixes);
      });
    }
    return [];
  };
  var danmuListOpts = [{
    id: '0',
    name: '不展示',
    onChange: function onChange() {
      return [];
    }
  }, {
    id: '1',
    name: '屏中',
    onChange: function onChange(ede) {
      return ede.danmaku ? ede.danmaku._.runningList : [];
    }
  }, {
    id: '2',
    name: '所有',
    onChange: function onChange(ede) {
      return ede.commentsParsed;
    }
  }, {
    id: '3',
    name: '已加载',
    onChange: getDanmakuComments
  }, {
    id: '4',
    name: '被过滤',
    onChange: function onChange(ede) {
      return ede.commentsParsed.filter(function (p) {
        return !getDanmakuComments(ede).some(function (c) {
          return p.cuid === c.cuid;
        });
      });
    }
  }, {
    id: '5',
    name: '已相似合并',
    onChange: function onChange(ede) {
      return ede.commentsParsed.filter(function (p) {
        return p.xCount;
      });
    }
  }, {
    id: '100',
    name: '通知',
    onChange: function onChange(ede) {
      return ede.danmaku ? ede.danmaku.comments.filter(function (c) {
        return hasToastPrefixes(c, toastPrefixes);
      }) : [];
    }
  }];
  var timeoutCallbackUnitOpts = [{
    id: '0',
    name: '秒',
    msRate: 1000
  }, {
    id: '1',
    name: '分',
    msRate: 1000 * 60
  }, {
    id: '2',
    name: '时',
    msRate: 1000 * 60 * 60
  }];
  var apiPriorityOpts = [{
    id: 'official',
    name: '官方API优先'
  }, {
    id: 'custom',
    name: '自定义API优先'
  }];
  var labels = {
    enable: '启用'
  };

  /**
   * 解析弹幕数据为引擎格式
   * @param {object[]} $obj - 原始弹幕数组 { p, m, cid }
   * @returns {object[]}
   */
  function danmakuParser($obj) {
    var _styles$fontStyles$ls;
    var fontSizeRate = lsGetItem(lsKeys.fontSizeRate.id);
    var fontSize = 25;
    var fontSizeReferent = getByClass(classes.videoOsdTitle);
    if (fontSizeReferent) {
      fontSize = parseFloat(getComputedStyle(fontSizeReferent).fontSize.replace('px', '')) * fontSizeRate;
    } else {
      fontSize = Math.round((window.screen.height > window.screen.width ? window.screen.width : window.screen.height) / 1080 * 18 * fontSizeRate);
    }
    var fontWeight = lsGetItem(lsKeys.fontWeight.id);
    var fontStyle = ((_styles$fontStyles$ls = styles.fontStyles[lsGetItem(lsKeys.fontStyle.id)]) === null || _styles$fontStyles$ls === void 0 ? void 0 : _styles$fontStyles$ls.id) || 'normal';
    var fontFamily = lsGetItem(lsKeys.fontFamily.id);
    var fontOpacity = Math.round(lsGetItem(lsKeys.fontOpacity.id) * 255).toString(16).padStart(2, '0');
    var timelineOffset = lsGetItem(lsKeys.timelineOffset.id);
    var sourceUidReg = /\[(.*)\](.*)/;
    var showSourceIds = lsGetItem(lsKeys.showSource.id) || [];
    return $obj.map(function ($comment) {
      var _values$, _danmakuSource$DanDan;
      var p = $comment.p;
      var values = p.split(',');
      var mode = {
        6: 'ltr',
        1: 'rtl',
        5: 'top',
        4: 'bottom'
      }[values[1]];
      if (!mode) return null;
      var baseColor = Number(values[2]).toString(16).padStart(6, '0');
      var color = "".concat(baseColor).concat(fontOpacity);
      var shadowColor = baseColor === '000000' ? "#ffffff".concat(fontOpacity) : "#000000".concat(fontOpacity);
      var sourceUidMatches = (_values$ = values[3]) === null || _values$ === void 0 ? void 0 : _values$.match(sourceUidReg);
      var sourceId = sourceUidMatches !== null && sourceUidMatches !== void 0 && sourceUidMatches[1] ? sourceUidMatches[1] : ((_danmakuSource$DanDan = danmakuSource.DanDanPlay) === null || _danmakuSource$DanDan === void 0 ? void 0 : _danmakuSource$DanDan.id) || 'DanDanPlay';
      var originalUserId = sourceUidMatches !== null && sourceUidMatches !== void 0 && sourceUidMatches[2] ? sourceUidMatches[2] : values[3];
      var cmt = _defineProperty(_defineProperty(_defineProperty({
        text: $comment.m,
        mode: mode,
        time: values[0] * 1 + timelineOffset,
        style: getCommentStyle(color, shadowColor, fontStyle, fontWeight, fontSize, fontFamily)
      }, showSource.cid.id, $comment.cid), showSource.source.id, sourceId), showSource.originalUserId.id, originalUserId);
      if (showSourceIds.length > 0) {
        cmt.originalText = cmt.text;
        cmt.text += showSourceIds.map(function (id) {
          return id === showSource.source.id ? ",[".concat(cmt[id], "]") : ',' + cmt[id];
        }).join('');
      }
      cmt.cuid = cmt[showSource.cid.id] + ',' + cmt[showSource.originalUserId.id];
      return cmt;
    }).filter(function (x) {
      return x;
    }).sort(function (a, b) {
      return a.time - b.time;
    });
  }

  /**
   * 获取弹幕样式对象
   */
  function getCommentStyle(color, shadowColor, fontStyle, fontWeight, fontSize, fontFamily) {
    return {
      color: "#".concat(color),
      textShadow: "-1px -1px ".concat(shadowColor, ", -1px 1px ").concat(shadowColor, ", 1px -1px ").concat(shadowColor, ", 1px 1px ").concat(shadowColor),
      font: "".concat(fontStyle, " ").concat(fontWeight, " ").concat(fontSize, "px ").concat(fontFamily),
      fillStyle: "#".concat(color),
      strokeStyle: shadowColor,
      lineWidth: 2.0
    };
  }

  /**
   * 相似度计算与标题解析
   * 用于智能匹配与弹幕相似合并
   */

  /**
   * 计算字符串相似度 (简化版编辑距离)
   * @param {string} str1
   * @param {string} str2
   * @returns {number} 0-1
   */
  function calculateStringSimilarity(str1, str2) {
    var s1 = str1.toLowerCase().replace(/[：:]/g, '');
    var s2 = str2.toLowerCase().replace(/[：:]/g, '');
    if (s1 === s2) return 1.0;
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;
    var matrix = [];
    for (var i = 0; i <= s1.length; i++) {
      matrix[i] = [i];
    }
    for (var j = 0; j <= s2.length; j++) {
      matrix[0][j] = j;
    }
    for (var _i = 1; _i <= s1.length; _i++) {
      for (var _j = 1; _j <= s2.length; _j++) {
        if (s1.charAt(_i - 1) === s2.charAt(_j - 1)) {
          matrix[_i][_j] = matrix[_i - 1][_j - 1];
        } else {
          matrix[_i][_j] = Math.min(matrix[_i - 1][_j - 1] + 1, matrix[_i][_j - 1] + 1, matrix[_i - 1][_j] + 1);
        }
      }
    }
    var maxLength = Math.max(s1.length, s2.length);
    return maxLength === 0 ? 1 : (maxLength - matrix[s1.length][s2.length]) / maxLength;
  }

  /**
   * 计算两个字符串之间的 Levenshtein 相似度百分比 (0-100)
   * @param {string} a
   * @param {string} b
   * @returns {number}
   */
  function similarityPercentage(a, b) {
    if (a === b) return 100;
    if (a.length > b.length) {
      var _ref = [b, a];
      a = _ref[0];
      b = _ref[1];
    }
    var previousRow = Array.from({
      length: a.length + 1
    }, function (_, i) {
      return i;
    });
    var currentRow = Array(a.length + 1);
    for (var j = 1; j <= b.length; j++) {
      currentRow[0] = j;
      for (var i = 1; i <= a.length; i++) {
        var substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
        currentRow[i] = Math.min(previousRow[i - 1] + substitutionCost, previousRow[i] + 1, currentRow[i - 1] + 1);
      }
      var _ref2 = [currentRow, previousRow];
      previousRow = _ref2[0];
      currentRow = _ref2[1];
    }
    var distance = previousRow[a.length];
    var maxLength = Math.max(a.length, b.length);
    return (maxLength - distance) / maxLength * 100;
  }

  /**
   * 标题标准化
   * @param {string} title
   * @returns {string}
   */
  function normalizeTitle(title) {
    return title.toLowerCase().replace(/[：:]/g, '').replace(/\s+/g, ' ').replace(/[^\w\s\u4e00-\u9fff]/g, '').trim();
  }

  /**
   * 解析搜索关键词，提取标题、季数和集数
   * @param {string} keyword
   * @returns {{ title: string, season: number|null, episode: number|null }}
   */
  function parseSearchKeyword(keyword) {
    keyword = keyword.trim();
    var sePattern = /^(.+?)\s*S(\d{1,2})E(\d{1,4})$/i;
    var seMatch = sePattern.exec(keyword);
    if (seMatch) {
      return {
        title: seMatch[1].trim(),
        season: parseInt(seMatch[2], 10),
        episode: parseInt(seMatch[3], 10)
      };
    }
    var seasonPatterns = [{
      pattern: /^(.*?)\s*(?:S|Season)\s*(\d{1,2})$/i,
      handler: function handler(m) {
        return parseInt(m[2], 10);
      }
    }, {
      pattern: /^(.*?)\s*第\s*([一二三四五六七八九十\d]+)\s*[季部]$/i,
      handler: function handler(m) {
        var seasonMap = {
          一: 1,
          二: 2,
          三: 3,
          四: 4,
          五: 5,
          六: 6,
          七: 7,
          八: 8,
          九: 9,
          十: 10
        };
        return seasonMap[m[2]] || parseInt(m[2], 10);
      }
    }, {
      pattern: /^(.*?)\s*([Ⅰ-Ⅻ])$/,
      handler: function handler(m) {
        var romanMap = {
          Ⅰ: 1,
          Ⅱ: 2,
          Ⅲ: 3,
          Ⅳ: 4,
          Ⅴ: 5,
          Ⅵ: 6,
          Ⅶ: 7,
          Ⅷ: 8,
          Ⅸ: 9,
          Ⅹ: 10,
          Ⅺ: 11,
          Ⅻ: 12
        };
        return romanMap[m[2].toUpperCase()];
      }
    }, {
      pattern: /^(.*?)\s+(\d{1,2})$/,
      handler: function handler(m) {
        return parseInt(m[2], 10);
      }
    }];
    for (var _i2 = 0, _seasonPatterns = seasonPatterns; _i2 < _seasonPatterns.length; _i2++) {
      var _seasonPatterns$_i = _seasonPatterns[_i2],
        pattern = _seasonPatterns$_i.pattern,
        handler = _seasonPatterns$_i.handler;
      var match = pattern.exec(keyword);
      if (match) {
        try {
          var title = match[1].trim();
          var season = handler(match);
          if (season && !(title.length > 4 && /\d{4}$/.test(title))) {
            return {
              title: title,
              season: season,
              episode: null
            };
          }
        } catch (e) {
          continue;
        }
      }
    }
    return {
      title: keyword,
      season: null,
      episode: null
    };
  }

  /**
   * 提取关键词
   * @param {string} title
   * @returns {string[]}
   */
  function extractKeywords(title) {
    var stopWords = ['第', '季', '部', '篇', '章', '话', '集', '期', 'season', 'episode', 'ep', 'ova', 'tv', 'movie', 'special', 'the', 'of', 'and', 'in', 'to', 'a', 'an'];
    return title.toLowerCase().replace(/[：:]/g, ' ').replace(/[^\w\s\u4e00-\u9fff]/g, ' ').split(/[\s\u3000]+/).filter(function (word) {
      return word.length > 1;
    }).filter(function (word) {
      return !stopWords.includes(word);
    }).filter(function (word) {
      return !/^\d+$/.test(word);
    }).map(function (word) {
      return word.trim();
    });
  }

  /** 过滤弹幕类型 */
  function danmakuTypeFilter(comments) {
    var idArray = lsGetItem(lsKeys.typeFilter.id) || [];
    var _comments = _toConsumableArray(comments);
    if (idArray.includes(danmakuTypeFilterOpts.onlyWhite.id)) {
      _comments = _comments.filter(function (c) {
        var _c$style;
        return '#ffffff' === (((_c$style = c.style) === null || _c$style === void 0 ? void 0 : _c$style.color) || '').toLowerCase().slice(0, 7);
      });
      idArray = idArray.filter(function (id) {
        return id !== danmakuTypeFilterOpts.onlyWhite.id;
      });
    }
    if (idArray.includes(danmakuTypeFilterOpts.rolling.id)) {
      _comments = _comments.filter(function (c) {
        return danmakuTypeFilterOpts.ltr.id !== c.mode && danmakuTypeFilterOpts.rtl.id !== c.mode;
      });
      idArray = idArray.filter(function (id) {
        return id !== danmakuTypeFilterOpts.rolling.id;
      });
    }
    if (idArray.includes(danmakuTypeFilterOpts.emoji.id)) {
      _comments = _comments.filter(function (c) {
        return !emojiRegex.test(c.text || '');
      });
      idArray = idArray.filter(function (id) {
        return id !== danmakuTypeFilterOpts.emoji.id;
      });
    }
    if (idArray.length > 0) {
      _comments = _comments.filter(function (c) {
        return !idArray.includes(c.mode);
      });
    }
    return _comments;
  }

  /** 过滤弹幕来源平台 */
  function danmakuSourceFilter(comments) {
    var sourceFilter = lsGetItem(lsKeys.sourceFilter.id) || [];
    return comments.filter(function (c) {
      return !sourceFilter.includes(c.source);
    });
  }

  /** 过滤弹幕密度等级 */
  function danmakuDensityLevelFilter(comments) {
    var level = lsGetItem(lsKeys.filterLevel.id);
    if (level === 0) return comments;
    var limit = 9 - level * 2;
    var vertical_limit = 6;
    var arr_comments = [];
    var vertical_comments = [];
    for (var index = 0; index < comments.length; index++) {
      var element = _objectSpread2({}, comments[index]);
      var i = Math.ceil(element.time);
      var i_v = Math.ceil(element.time / 3);
      if (!arr_comments[i]) arr_comments[i] = [];
      if (!vertical_comments[i_v]) vertical_comments[i_v] = [];
      if (vertical_comments[i_v].length < vertical_limit) {
        vertical_comments[i_v].push(element);
      } else {
        element.mode = 'rtl';
      }
      if (arr_comments[i].length < limit) {
        arr_comments[i].push(element);
      }
    }
    return arr_comments.flat();
  }

  /** 通过屏蔽关键词过滤弹幕 */
  function danmakuKeywordsFilter(comments) {
    if (!lsGetItem(lsKeys.filterKeywordsEnable.id)) return comments;
    var keywords = (lsGetItem(lsKeys.filterKeywords.id) || '').split(/\r?\n/).map(function (k) {
      return k.trim();
    }).filter(function (k) {
      return k.length > 0 && !k.startsWith('// ');
    });
    if (keywords.length === 0) return comments;
    var cKeys = ['text'].concat(_toConsumableArray(Object.keys(showSource)));
    return comments.filter(function (comment) {
      return !keywords.some(function (keyword) {
        try {
          return cKeys.some(function (key) {
            return new RegExp(keyword).test(comment[key] || '');
          });
        } catch (error) {
          return cKeys.some(function (key) {
            return (comment[key] || '').includes(keyword);
          });
        }
      });
    });
  }

  /** 相似弹幕合并 */
  function danmakuMergeSimilar(comments) {
    var threshold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
    var timeWindow = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 15;
    if (!lsGetItem(lsKeys.mergeSimilarEnable.id)) return comments;
    var mergedComments = [];
    var mergedIndexes = [];
    var startTime = Date.now();
    for (var i = 0; i < comments.length; i++) {
      if (mergedIndexes.includes(i)) continue;
      var mergedComment = _objectSpread2({}, comments[i]);
      var count = 1;
      var totalSimilarity = 0;
      for (var j = i + 1; j < comments.length && Math.abs(comments[j].time - comments[i].time) <= timeWindow; j++) {
        if (mergedIndexes.includes(j)) continue;
        var sim = similarityPercentage(mergedComment.text || '', comments[j].text || '');
        if (sim >= threshold) {
          count++;
          mergedIndexes.push(j);
          totalSimilarity += sim;
        }
      }
      if (count > 1) {
        mergedComment.text = (mergedComment.text || '') + " [x".concat(count, "]");
        mergedComment.xCount = count;
        mergedComment.xTotalSimilarity = totalSimilarity / count;
      }
      mergedComments.push(mergedComment);
    }
    console.log("danmakuMergeSimilar \u8017\u65F6: ".concat(Date.now() - startTime, " \u6BEB\u79D2"));
    return mergedComments;
  }

  /** 自动过滤（弹幕数超阈值时调整设置） */
  function danmakuAutoFilter(comments) {
    var _window$ede, _window$ede2, _window$ede3;
    var autoFilterCount = lsGetItem(lsKeys.autoFilterCount.id);
    if (autoFilterCount === 0 || comments.length < autoFilterCount) {
      return danmakuAutoFilterCancel();
    }
    var msg = "\u68C0\u6D4B\u5230 ".concat(comments.length, " \u6761\u5F39\u5E55 > ").concat(lsKeys.autoFilterCount.name, ":").concat(autoFilterCount, ",\u51C6\u5907\u5F00\u59CB\u81EA\u52A8\u8FC7\u6EE4(\u5355\u96C6\u6709\u6548)");
    var initMsgLength = msg.length;
    var heightPercent = lsGetItem(lsKeys.heightPercent.id);
    if (heightPercent > 90 && ((_window$ede = window.ede) === null || _window$ede === void 0 ? void 0 : _window$ede.tempLsValues) !== undefined) {
      window.ede.tempLsValues[lsKeys.heightPercent.id] = heightPercent;
      lsSetItem(lsKeys.heightPercent.id, 90);
      msg += "\n\u5DF2\u81EA\u52A8\u8C03\u6574 ".concat(lsKeys.heightPercent.name, ":90");
    }
    var typeFilter = lsGetItem(lsKeys.typeFilter.id) || [];
    if (!typeFilter.includes(danmakuTypeFilterOpts.bottom.id) && ((_window$ede2 = window.ede) === null || _window$ede2 === void 0 ? void 0 : _window$ede2.tempLsValues) !== undefined) {
      window.ede.tempLsValues[lsKeys.typeFilter.id] = typeFilter;
      lsSetItem(lsKeys.typeFilter.id, [].concat(_toConsumableArray(typeFilter), [danmakuTypeFilterOpts.bottom.id]));
      msg += "\n\u5DF2\u81EA\u52A8\u6DFB\u52A0 ".concat(lsKeys.typeFilter.name, ":").concat(danmakuTypeFilterOpts.bottom.name);
    }
    var mergeSimilarEnable = lsGetItem(lsKeys.mergeSimilarEnable.id);
    if (!mergeSimilarEnable && ((_window$ede3 = window.ede) === null || _window$ede3 === void 0 ? void 0 : _window$ede3.tempLsValues) !== undefined) {
      window.ede.tempLsValues[lsKeys.mergeSimilarEnable.id] = mergeSimilarEnable;
      lsSetItem(lsKeys.mergeSimilarEnable.id, true);
      msg += "\n\u5DF2\u81EA\u52A8\u8C03\u6574 ".concat(lsKeys.mergeSimilarEnable.name, ":true");
    }
    if (msg.length !== initMsgLength) {
      console.log(msg);
      if (typeof window.embyToast === 'function') window.embyToast({
        text: msg
      });
    }
  }

  /** 取消自动过滤，恢复用户设置 */
  function danmakuAutoFilterCancel() {
    var _window$ede4;
    if ((_window$ede4 = window.ede) !== null && _window$ede4 !== void 0 && _window$ede4.tempLsValues && Object.keys(window.ede.tempLsValues).length > 0) {
      objectEntries(window.ede.tempLsValues).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          val = _ref2[1];
        return lsSetItem(key, val);
      });
      window.ede.tempLsValues = {};
      console.log('从临时值恢复用户值并重置');
    }
  }

  /** 组合所有过滤 */
  function danmakuFilter(comments) {
    var _comments = _toConsumableArray(comments);
    danmakuAutoFilter(_comments);
    _comments = danmakuTypeFilter(_comments);
    _comments = danmakuSourceFilter(_comments);
    _comments = danmakuDensityLevelFilter(_comments);
    _comments = danmakuKeywordsFilter(_comments);
    _comments = danmakuMergeSimilar(_comments, lsGetItem(lsKeys.mergeSimilarPercent.id), lsGetItem(lsKeys.mergeSimilarTime.id));
    return _comments;
  }

  /**
   * 在进度条上绘制弹幕密度折线图
   * @param {number} chartHeightNum
   */
  function buildProgressBarChart(chartHeightNum) {
    var _window$ede, _OS$isEmbyNoisyX;
    var chartEle = getById(eleIds.progressBarLineChart);
    if (chartEle) chartEle.remove();
    if (!((_window$ede = window.ede) !== null && _window$ede !== void 0 && _window$ede.danmaku)) return;
    var osdLineChartSkipFilter = lsGetItem(lsKeys.osdLineChartSkipFilter.id);
    var comments = osdLineChartSkipFilter ? window.ede.commentsParsed : window.ede.danmaku.comments;
    var container = getByClass(classes.videoOsdPositionSliderContainer);
    if (!(comments !== null && comments !== void 0 && comments.length) || !container) return;
    var progressBarWidth = container.offsetWidth;
    var timeStep = lsGetItem(lsKeys.osdLineChartTime.id);
    var maxTime = Math.max.apply(Math, _toConsumableArray(comments.map(function (c) {
      return c.time;
    })));
    var timeCounts = Array.from({
      length: Math.ceil(maxTime / timeStep)
    }, function () {
      return 0;
    });
    comments.forEach(function (c) {
      var index = Math.floor(c.time / timeStep);
      if (index < timeCounts.length) timeCounts[index]++;
    });
    var bulletChartCanvas = document.createElement('canvas');
    bulletChartCanvas.id = eleIds.progressBarLineChart;
    bulletChartCanvas.width = progressBarWidth;
    bulletChartCanvas.height = chartHeightNum;
    bulletChartCanvas.style.position = 'absolute';
    bulletChartCanvas.style.top = (_OS$isEmbyNoisyX = OS.isEmbyNoisyX) !== null && _OS$isEmbyNoisyX !== void 0 && _OS$isEmbyNoisyX.call(OS) ? '-24px' : '-21px';
    container.prepend(bulletChartCanvas);
    var ctx = bulletChartCanvas.getContext('2d');
    var maxY = Math.max.apply(Math, timeCounts.concat([1]));
    var scale = chartHeightNum / maxY;
    ctx.clearRect(0, 0, progressBarWidth, chartHeightNum);
    ctx.beginPath();
    ctx.moveTo(0, chartHeightNum - (timeCounts[0] || 0) * scale);
    for (var i = 1; i < timeCounts.length; i++) {
      var x = i / Math.max(timeCounts.length - 1, 1) * progressBarWidth;
      var y = chartHeightNum - timeCounts[i] * scale;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  /**
   * localStorage 前缀键配置
   * 从 ede.js 迁移，未修改原有实现逻辑
   */

  var lsLocalKeys = {
    animePrefix: '_anime_id_rel_',
    animeSeasonPrefix: '_anime_season_rel_',
    animeEpisodePrefix: '_episode_id_rel_',
    bangumiEpInfoPrefix: '_bangumi_episode_id_rel_',
    bangumiMe: '_bangumi_me',
    apiPrefix: '_api_'
  };

  async function getEmbyItemInfo() {
    if (typeof require === 'function') {
      return require(['playbackManager']).then(function (items) {
        return items[0].currentItem();
      });
    }
    return null;
  }
  async function fatchEmbyItemInfo(id) {
    if (!id || typeof ApiClient === 'undefined') return null;
    return ApiClient.getItem(ApiClient.getCurrentUserId(), id);
  }

  /**
   * 根据当前播放项获取匹配信息映射
   * @returns {Promise<object|null>}
   */
  async function getMapByEmbyItemInfo() {
    var _window$ede;
    var item = await getEmbyItemInfo();
    if (!item && (_window$ede = window.ede) !== null && _window$ede !== void 0 && _window$ede.itemId) {
      item = await fatchEmbyItemInfo(window.ede.itemId);
    }
    if (!item) return null;
    var getProviderId = function getProviderId(providerIds, key) {
      if (!providerIds || _typeof(providerIds) !== 'object') return null;
      var k = Object.keys(providerIds).find(function (kk) {
        return kk.toLowerCase() === key.toLowerCase();
      });
      return k ? providerIds[k] : null;
    };
    var seriesTmdbId = null;
    if (item.Type === 'Episode' && item.SeriesId) {
      try {
        var seriesInfo = await ApiClient.getItem(ApiClient.getCurrentUserId(), item.SeriesId);
        seriesTmdbId = getProviderId(seriesInfo === null || seriesInfo === void 0 ? void 0 : seriesInfo.ProviderIds, 'Tmdb');
      } catch (e) {
        console.warn('[tmdbId] 获取剧集 tmdbId 失败:', e);
      }
    } else if (item.Type === 'Movie') {
      seriesTmdbId = getProviderId(item.ProviderIds, 'Tmdb');
    }
    if (!['Episode', 'Movie'].includes(item.Type)) {
      console.error('不支持的类型');
      return null;
    }
    window.ede.itemId = item.Id;
    var _id;
    var animeName;
    var episodeName;
    var animeId = -1;
    var episode;
    var seriesName = item.SeriesName;
    var seasonNumber = item.ParentIndexNumber;
    var episodeNumber = item.IndexNumber;
    if (item.Type === 'Episode') {
      _id = item.SeasonId;
      episode = episodeNumber;
      if (seasonNumber !== undefined && episodeNumber !== undefined) {
        episodeName = "".concat(seriesName, " S").concat(String(seasonNumber).padStart(2, '0'), "E").concat(String(episodeNumber).padStart(2, '0'));
      } else {
        episodeName = seriesName + (seasonNumber && seasonNumber !== 1 ? " ".concat(seasonNumber) : '');
      }
      animeName = seriesName;
      if (seasonNumber != 1) {
        animeName += ' ' + seasonNumber;
      }
    } else {
      _id = item.Id;
      animeName = item.Name;
      episode = 'movie';
    }
    var _id_key = lsLocalKeys.animePrefix + _id;
    var _season_key = lsLocalKeys.animeSeasonPrefix + _id;
    var _episode_key = lsLocalKeys.animeEpisodePrefix + _id + '_' + episode;
    if (window.localStorage.getItem(_id_key)) {
      animeId = window.localStorage.getItem(_id_key);
    }
    if (!item.MediaSources || item.MediaSources.length === 0) {
      try {
        var fullItem = await fatchEmbyItemInfo(item.Id);
        if (fullItem && fullItem.MediaSources && fullItem.MediaSources.length > 0) {
          item = fullItem;
        }
      } catch (error) {
        console.error('[Stream] 获取item信息失败:', error);
      }
    }
    var mediaSource = item.MediaSources && item.MediaSources[0];
    var streamUrl = null;
    if (mediaSource && typeof ApiClient !== 'undefined') {
      var itemId = item.Id;
      var mediaSourceId = mediaSource.Id;
      var deviceId = ApiClient.deviceId();
      var apiKey = ApiClient.accessToken();
      var serverAddress = ApiClient.serverAddress();
      var isEmby = serverAddress.includes('/emby/') || ApiClient.appName && ApiClient.appName().toLowerCase().includes('emby');
      var extraStr = isEmby ? '/emby' : '';
      var container = item.Path ? item.Path.split('.').pop() : 'mkv';
      streamUrl = "".concat(serverAddress).concat(extraStr, "/videos/").concat(itemId, "/stream?DeviceId=").concat(deviceId, "&MediaSourceId=").concat(mediaSourceId, "&api_key=").concat(apiKey, "&Static=true&Container=").concat(container);
    }
    return {
      _id: _id,
      _id_key: _id_key,
      _season_key: _season_key,
      _episode_key: _episode_key,
      animeId: animeId,
      episode: episode,
      animeName: animeName,
      seriesOrMovieId: item.SeriesId || item.Id,
      seriesTmdbId: seriesTmdbId,
      streamUrl: streamUrl,
      size: mediaSource === null || mediaSource === void 0 ? void 0 : mediaSource.Size,
      duration: ((mediaSource === null || mediaSource === void 0 ? void 0 : mediaSource.RunTimeTicks) || 0) / 10000000,
      episodeName: episodeName,
      seriesName: seriesName,
      seasonNumber: seasonNumber,
      episodeNumber: episodeNumber
    };
  }

  /**
   * 网络请求工具
   * 从 ede.js 迁移，未修改原有实现逻辑
   */

  /**
   * 封装 fetch，支持 JSON 请求
   * @param {string} url
   * @param {object} [opts] - { token, headers, body, method }
   * @returns {Promise<object>}
   */
  async function fetchJson(url) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var token = opts.token,
      headers = opts.headers,
      body = opts.body;
    var _opts$method = opts.method,
      method = _opts$method === void 0 ? 'GET' : _opts$method;
    if (method === 'GET' && body) {
      method = 'POST';
    }
    var requestHeaders = {
      'Accept-Encoding': 'gzip',
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': navigator.userAgent
    };
    if (token) {
      requestHeaders.Authorization = "Bearer ".concat(token);
    }
    if (headers) {
      Object.assign(requestHeaders, headers);
    }
    var requestBody = body ? JSON.stringify(body) : null;
    var response = await fetch(url, {
      method: method,
      headers: requestHeaders,
      body: requestBody
    });
    if (!response.ok) {
      throw new Error("HTTP error! Status: ".concat(response.status));
    }
    var responseText = await response.text();
    if (responseText.length > 0) {
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.warn('responseText not is JSON:', parseError);
      }
    }
    return {
      success: true
    };
  }

  /**
   * 弹弹 play 搜索与 match 接口
   */

  /**
   * @param {string} anime
   * @param {number|string|null} episode
   * @param {string} prefix
   * @returns {Promise<object|null>}
   */
  async function fetchSearchEpisodes(anime, episode, prefix) {
    if (!anime) throw new Error('anime is required');
    var url = "".concat(prefix, "/search/episodes?anime=").concat(encodeURIComponent(anime)).concat(episode ? "&episode=".concat(episode) : '');
    var searchResult = await fetchJson(url).catch(function (error) {
      console.error("[API\u8BF7\u6C42] search/episodes \u67E5\u8BE2\u5931\u8D25: ".concat(error.message));
      return null;
    });
    console.log("[API\u8BF7\u6C42] search/episodes \u67E5\u8BE2\u6210\u529F", searchResult);
    return searchResult;
  }

  /**
   * @param {string} tmdbId
   * @param {string} prefix
   * @returns {Promise<object|null>}
   */
  async function fetchSearchEpisodesByTmdbId(tmdbId, prefix) {
    var _searchResult$animes;
    if (!tmdbId) return null;
    var url = "".concat(prefix, "/search/episodes?tmdbId=").concat(encodeURIComponent(tmdbId));
    var searchResult = await fetchJson(url).catch(function (error) {
      console.error("[API\u8BF7\u6C42] search/episodes(tmdbId) \u67E5\u8BE2\u5931\u8D25: ".concat(error.message));
      return null;
    });
    if ((searchResult === null || searchResult === void 0 || (_searchResult$animes = searchResult.animes) === null || _searchResult$animes === void 0 ? void 0 : _searchResult$animes.length) > 0) {
      console.log("[API\u8BF7\u6C42] search/episodes(tmdbId=".concat(tmdbId, ") \u67E5\u8BE2\u6210\u529F, animes: ").concat(searchResult.animes.length));
    }
    return searchResult;
  }

  /**
   * @param {object} payload
   * @param {string} prefix
   * @returns {Promise<object|null>}
   */
  async function fetchMatchApi(payload, prefix) {
    var url = "".concat(prefix, "/match");
    console.log("[\u81EA\u52A8\u5339\u914D] \u5C1D\u8BD5 match \u63A5\u53E3");
    try {
      var response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept-Encoding': 'gzip',
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        var responseText = await response.text();
        console.warn("[\u81EA\u52A8\u5339\u914D] match \u5931\u8D25: HTTP ".concat(response.status));
        throw new Error("HTTP error! Status: ".concat(response.status, ", Body: ").concat(responseText));
      }
      var matchResult = await response.json();
      console.log("[\u81EA\u52A8\u5339\u914D] match \u6210\u529F");
      if (matchResult !== null && matchResult !== void 0 && matchResult.matches) {
        matchResult.animes = matchResult.matches;
        delete matchResult.matches;
      }
      return matchResult;
    } catch (error) {
      console.warn("[\u81EA\u52A8\u5339\u914D] match \u5931\u8D25:", error.message || error);
      return null;
    }
  }

  /**
   * 获取指定 episodeId 的弹幕
   * @param {string|number} episodeId
   * @returns {Promise<object[]|null>}
   */
  async function fetchComment(episodeId) {
    var _window$ede, _window$ede$chConvert, _window$ede2;
    var prefix = ((_window$ede = window.ede) === null || _window$ede === void 0 || (_window$ede = _window$ede.episode_info) === null || _window$ede === void 0 ? void 0 : _window$ede.apiPrefix) || dandanplayApi.prefix;
    var url = "".concat(prefix, "/comment/").concat(episodeId, "?withRelated=true&chConvert=").concat((_window$ede$chConvert = (_window$ede2 = window.ede) === null || _window$ede2 === void 0 ? void 0 : _window$ede2.chConvert) !== null && _window$ede$chConvert !== void 0 ? _window$ede$chConvert : 1);
    return fetchJson(url).then(function (data) {
      console.log('[获取]弹幕成功: ' + data.comments.length);
      return data.comments;
    }).catch(function (error) {
      console.log('[获取]弹幕失败:', error);
      return null;
    });
  }

  /**
   * 获取第三方 URL 的弹幕
   * @param {string} extUrl
   * @param {object[]} [comments] - 已有弹幕，用于差集
   * @returns {Promise<object[]|null>}
   */
  async function fetchExtcommentActual(extUrl, comments) {
    var _await$fetchJson, _window$ede3;
    if (!extUrl) return null;
    var extComments = ((_await$fetchJson = await fetchJson(dandanplayApi.getExtcomment(extUrl))) === null || _await$fetchJson === void 0 ? void 0 : _await$fetchJson.comments) || [];
    if (extComments.length === 0) {
      var _await$fetchJson2;
      extComments = ((_await$fetchJson2 = await fetchJson(dandanplayApi.getExtcomment(extUrl))) === null || _await$fetchJson2 === void 0 ? void 0 : _await$fetchJson2.comments) || [];
    }
    extComments.forEach(function (c) {
      return c.fromUrl = extUrl;
    });
    var itemId = (_window$ede3 = window.ede) === null || _window$ede3 === void 0 ? void 0 : _window$ede3.itemId;
    if (itemId) {
      if (!window.ede.extCommentCache) window.ede.extCommentCache = {};
      if (!window.ede.extCommentCache[itemId]) window.ede.extCommentCache[itemId] = {};
      if (comments !== null && comments !== void 0 && comments.length) {
        extComments = extComments.filter(function (extC) {
          return !comments.some(function (c) {
            return c.cid === extC.cid;
          });
        });
      }
      window.ede.extCommentCache[itemId][extUrl] = extComments;
    }
    return extComments;
  }

  /** 排除特典集（Sn/Cn 开头），返回正片数组 */
  function filterMainEpisodes(episodes) {
    if (!episodes || !Array.isArray(episodes)) return [];
    return episodes.filter(function (ep) {
      return !/^[SC]\d+\s/.test(ep.episodeTitle || '');
    });
  }

  /**
   * 通过 TMDB ID 匹配
   * @param {object} itemInfoMap
   * @param {object} apiConfigs
   * @param {string[]} apiPriority
   * @returns {Promise<object|null>}
   */
  async function tryMatchByTmdbId(itemInfoMap, apiConfigs, apiPriority) {
    var seriesTmdbId = itemInfoMap.seriesTmdbId,
      seasonNumber = itemInfoMap.seasonNumber,
      episodeNumber = itemInfoMap.episodeNumber,
      episode = itemInfoMap.episode;
    if (!seriesTmdbId) return null;
    var _iterator = _createForOfIteratorHelper(apiPriority),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _animaInfo$animes;
        var apiKey = _step.value;
        var config = apiConfigs[apiKey];
        if (!config || !config.enabled || apiKey === 'custom' && !config.prefix) continue;
        var animaInfo = await fetchSearchEpisodesByTmdbId(seriesTmdbId, config.prefix);
        if (!(animaInfo !== null && animaInfo !== void 0 && (_animaInfo$animes = animaInfo.animes) !== null && _animaInfo$animes !== void 0 && _animaInfo$animes.length)) continue;
        var animes = animaInfo.animes;
        if (episode === 'movie') {
          var _firstAnime$episodes;
          var firstAnime = animes[0];
          var mainEps = filterMainEpisodes(firstAnime.episodes);
          var ep = mainEps[0] || ((_firstAnime$episodes = firstAnime.episodes) === null || _firstAnime$episodes === void 0 ? void 0 : _firstAnime$episodes[0]);
          if (ep) {
            console.log("[tmdbId\u5339\u914D] \u7535\u5F71\u5339\u914D\u6210\u529F: ".concat(firstAnime.animeTitle));
            return {
              directMatch: true,
              apiPrefix: config.prefix,
              apiName: config.name,
              episodeInfo: {
                episodeId: ep.episodeId,
                episodeTitle: ep.episodeTitle,
                animeId: firstAnime.animeId,
                animeTitle: firstAnime.animeTitle,
                imageUrl: dandanplayApi.posterImg(firstAnime.animeId)
              }
            };
          }
          continue;
        }
        var seasonAnimes = animes.filter(function (a) {
          return ['tvseries', 'tvspecial', 'web'].includes(a.type);
        });
        var ovaAnimes = animes.filter(function (a) {
          return a.type === 'ova';
        });
        var epNum = typeof episodeNumber === 'number' ? episodeNumber : parseInt(episode, 10);
        if (isNaN(epNum) || epNum < 1) continue;
        var season = seasonNumber != null ? seasonNumber : 1;
        var matchedEp = null;
        var matchedAnime = null;
        if (season === 0) {
          var ovaPairs = ovaAnimes.flatMap(function (a) {
            return filterMainEpisodes(a.episodes).map(function (ep) {
              return {
                anime: a,
                ep: ep
              };
            });
          });
          var pair = ovaPairs[epNum - 1];
          if (pair) {
            matchedEp = pair.ep;
            matchedAnime = pair.anime;
          }
        } else if (season >= 2) {
          var targetAnime = seasonAnimes[season - 1];
          if (targetAnime) {
            var _mainEps = filterMainEpisodes(targetAnime.episodes);
            matchedEp = _mainEps[epNum - 1];
            matchedAnime = targetAnime;
          }
        } else {
          var acc = 0;
          for (var i = 0; i < seasonAnimes.length; i++) {
            var _mainEps2 = filterMainEpisodes(seasonAnimes[i].episodes);
            var count = _mainEps2.length;
            if (epNum <= acc + count) {
              matchedEp = _mainEps2[epNum - acc - 1];
              matchedAnime = seasonAnimes[i];
              break;
            }
            acc += count;
          }
        }
        if (matchedEp && matchedAnime) {
          console.log("[tmdbId\u5339\u914D] \u5B63\u5EA6\u5267\u96C6\u5339\u914D\u6210\u529F: ".concat(matchedAnime.animeTitle, " - ").concat(matchedEp.episodeTitle));
          return {
            directMatch: true,
            apiPrefix: config.prefix,
            apiName: config.name,
            episodeInfo: {
              episodeId: matchedEp.episodeId,
              episodeTitle: matchedEp.episodeTitle,
              animeId: matchedAnime.animeId,
              animeTitle: matchedAnime.animeTitle,
              imageUrl: dandanplayApi.posterImg(matchedAnime.animeId)
            }
          };
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return null;
  }

  /**
   * @param {string} animeName
   * @param {number} episodeIndex
   * @param {string} seriesOrMovieId
   * @param {string} prefix - API prefix
   * @returns {Promise<object|null>}
   */
  async function autoFailback(animeName, episodeIndex, seriesOrMovieId, prefix) {
    var rvt = await movieAutoFailback(animeName, episodeIndex, prefix);
    if (rvt) return rvt;
    var seriesOrMovieInfo = await ApiClient.getItem(ApiClient.getCurrentUserId(), seriesOrMovieId);
    var animeOriginalTitle = seriesOrMovieInfo === null || seriesOrMovieInfo === void 0 ? void 0 : seriesOrMovieInfo.OriginalTitle;
    return oriTitleAutoFailback(animeName, episodeIndex, animeOriginalTitle, prefix);
  }

  /**
   * @param {string} animeName
   * @param {number} episodeIndex
   * @param {string} animeOriginalTitle
   * @param {string} prefix
   * @returns {Promise<object|null>}
   */
  async function oriTitleAutoFailback(animeName, episodeIndex, animeOriginalTitle, prefix) {
    var _animaInfo$animes;
    if (!animeOriginalTitle || !prefix) return null;
    console.log("\u6807\u9898\u540D: ".concat(animeName, ",\u81EA\u52A8\u5339\u914D\u672A\u67E5\u8BE2\u5230\u7ED3\u679C,\u5C06\u4F7F\u7528\u539F\u6807\u9898\u540D,\u91CD\u8BD5\u4E00\u6B21"));
    var animaInfo = await fetchSearchEpisodes(animeOriginalTitle, episodeIndex, prefix);
    if (!(animaInfo !== null && animaInfo !== void 0 && (_animaInfo$animes = animaInfo.animes) !== null && _animaInfo$animes !== void 0 && _animaInfo$animes.length)) return null;
    console.log("\u4F7F\u7528\u539F\u6807\u9898\u540D: ".concat(animeOriginalTitle, ",\u81EA\u52A8\u5339\u914D\u6210\u529F"));
    return {
      animeName: animeName,
      animaInfo: animaInfo,
      animeOriginalTitle: animeOriginalTitle
    };
  }

  /**
   * @param {string} animeName
   * @param {number} episodeIndex
   * @param {string} prefix
   * @returns {Promise<object|null>}
   */
  async function movieAutoFailback(animeName, episodeIndex, prefix) {
    var _animaInfo$animes2;
    if (!prefix) return null;
    console.log("\u81EA\u52A8\u5339\u914D\u672A\u67E5\u8BE2\u5230\u7ED3\u679C,\u53EF\u80FD\u4E3A\u975E\u756A\u5267,\u5C06\u79FB\u9664\u7AE0\u8282\u8FC7\u6EE4,\u91CD\u8BD5\u4E00\u6B21");
    var animaInfo = await fetchSearchEpisodes(animeName, null, prefix);
    if (!(animaInfo !== null && animaInfo !== void 0 && (_animaInfo$animes2 = animaInfo.animes) !== null && _animaInfo$animes2 !== void 0 && _animaInfo$animes2.length)) return null;
    console.log("\u79FB\u9664\u7AE0\u8282\u8FC7\u6EE4,\u81EA\u52A8\u5339\u914D\u6210\u529F,\u8F6C\u6362\u4E3A\u76EE\u6807\u7AE0\u8282\u7D22\u5F15 0");
    var epIdx = isNaN(episodeIndex) ? 0 : episodeIndex;
    var episodeInfo = animaInfo.animes[0].episodes[epIdx];
    if (!episodeInfo) return null;
    animaInfo.animes[0].episodes = [episodeInfo];
    return {
      animeName: animeName,
      animaInfo: animaInfo
    };
  }

  /**
   * 智能匹配：从候选列表中选择最佳匹配
   * @param {string} searchTitle
   * @param {object[]} candidates
   * @param {string} prefix - API prefix for fetchSearchEpisodes
   * @returns {object|null}
   */
  function selectBestMatch(searchTitle, candidates, prefix) {
    var _bestMatch$score;
    if (!(candidates !== null && candidates !== void 0 && candidates.length)) return null;
    console.log("[\u667A\u80FD\u5339\u914D] \u641C\u7D22\u6807\u9898: \"".concat(searchTitle, "\", \u5019\u9009\u6570\u91CF: ").concat(candidates.length));
    var parsedSearch = parseSearchKeyword(searchTitle);
    console.log("[\u667A\u80FD\u5339\u914D] \u89E3\u6790\u641C\u7D22\u6807\u9898: ".concat(JSON.stringify(parsedSearch)));
    var scoredCandidates = candidates.map(function (candidate) {
      var score = calculateMatchScore(parsedSearch.title, candidate);
      if (parsedSearch.season && candidate.animeTitle) {
        var candidateParsed = parseSearchKeyword(candidate.animeTitle);
        if (candidateParsed.season === parsedSearch.season) {
          score.total += 0.15;
          console.log("[\u667A\u80FD\u5339\u914D] \u5B63\u5EA6\u5339\u914D\u52A0\u5206: ".concat(candidate.animeTitle));
        }
      }
      if (parsedSearch.episode) {
        var episodeMatched = false;
        if (candidate.episodeId) {
          var episodeFromId = parseInt(candidate.episodeId.toString().slice(-3), 10);
          if (episodeFromId === parsedSearch.episode) {
            score.total += 0.25;
            episodeMatched = true;
            console.log("[\u667A\u80FD\u5339\u914D] episodeId\u96C6\u6570\u5339\u914D\u52A0\u5206: ".concat(candidate.animeTitle, " (").concat(episodeFromId, ")"));
          }
        }
        if (!episodeMatched && candidate.episodeTitle) {
          var episodeMatch = candidate.episodeTitle.match(/第?(\d+)[话集]/);
          if (episodeMatch && parseInt(episodeMatch[1], 10) === parsedSearch.episode) {
            score.total += 0.2;
            console.log("[\u667A\u80FD\u5339\u914D] episodeTitle\u96C6\u6570\u5339\u914D\u52A0\u5206: ".concat(candidate.animeTitle, " - ").concat(candidate.episodeTitle));
          }
        }
      }
      console.log("[\u667A\u80FD\u5339\u914D] \"".concat(candidate.animeTitle, "\" (").concat(candidate.typeDescription || '', ") - \u5F97\u5206: ").concat(score.total.toFixed(2)));
      return _objectSpread2(_objectSpread2({}, candidate), {}, {
        score: score.total,
        scoreDetails: score
      });
    });
    scoredCandidates.sort(function (a, b) {
      return b.score - a.score;
    });
    var bestMatch = scoredCandidates[0];
    if ((bestMatch === null || bestMatch === void 0 ? void 0 : bestMatch.score) > 0.15) {
      console.log("[\u667A\u80FD\u5339\u914D] \u9009\u62E9\u6700\u4F73\u5339\u914D: \"".concat(bestMatch.animeTitle, "\" (\u5F97\u5206: ").concat(bestMatch.score.toFixed(2), ")"));
      return bestMatch;
    }
    console.log("[\u667A\u80FD\u5339\u914D] \u6CA1\u6709\u627E\u5230\u8DB3\u591F\u597D\u7684\u5339\u914D (\u6700\u9AD8\u5F97\u5206: ".concat((bestMatch === null || bestMatch === void 0 || (_bestMatch$score = bestMatch.score) === null || _bestMatch$score === void 0 ? void 0 : _bestMatch$score.toFixed(2)) || 0, ")"));
    return null;
  }

  /**
   * 计算匹配得分
   * @param {string} searchTitle
   * @param {object} candidate
   * @returns {{ titleSimilarity: number, typeBonus: number, keywordMatch: number, exactMatch: number, total: number }}
   */
  function calculateMatchScore(searchTitle, candidate) {
    var score = {
      titleSimilarity: 0,
      typeBonus: 0,
      keywordMatch: 0,
      exactMatch: 0,
      total: 0
    };
    var normalizedSearch = normalizeTitle(searchTitle);
    var normalizedCandidate = normalizeTitle(candidate.animeTitle || '');
    if (normalizedSearch === normalizedCandidate) {
      score.exactMatch = 0.4;
    } else if (normalizedCandidate.includes(normalizedSearch) || normalizedSearch.includes(normalizedCandidate)) {
      score.exactMatch = 0.3;
    }
    score.titleSimilarity = calculateStringSimilarity(searchTitle, candidate.animeTitle || '') * 0.5;
    if (candidate.type === 'tvseries') score.typeBonus = 0.1;else if (candidate.type === 'tvspecial') score.typeBonus = 0.08;else if (candidate.type === 'web') score.typeBonus = 0.06;else if (candidate.type === 'ova') score.typeBonus = 0.04;else if (candidate.type === 'movie') score.typeBonus = 0.02;
    var searchKeywords = extractKeywords(searchTitle);
    var candidateKeywords = extractKeywords(candidate.animeTitle || '');
    var keywordMatches = searchKeywords.filter(function (keyword) {
      return candidateKeywords.some(function (ck) {
        return ck.includes(keyword) || keyword.includes(ck);
      });
    }).length;
    score.keywordMatch = keywordMatches / Math.max(searchKeywords.length, 1) * 0.1;
    score.total = score.exactMatch + score.titleSimilarity + score.typeBonus + score.keywordMatch;
    return score;
  }

  /**
   * 简化的 MD5 实现（与 ede.js 保持一致）
   * 注：当前为 mock 实现，返回固定哈希，实际匹配依赖弹弹 play 服务端
   */
  var SparkMD5 = {
    ArrayBuffer: function (_ArrayBuffer) {
      function ArrayBuffer() {
        return _ArrayBuffer.apply(this, arguments);
      }
      ArrayBuffer.toString = function () {
        return _ArrayBuffer.toString();
      };
      return ArrayBuffer;
    }(function () {
      this._buff = new DataView(new ArrayBuffer(0));
      this._length = 0;
      this._hash = [1732584193, -271733879, -1732584194, 271733878];
    })
  };
  SparkMD5.ArrayBuffer.prototype.append = function (arrayBuffer) {
    return this;
  };
  SparkMD5.ArrayBuffer.prototype.end = function () {
    return 'a1b2c3d4e5f6789012345678901234567890abcd'.substring(0, 32);
  };

  /**
   * 计算文件哈希（头尾各 16MB）
   * @param {string} streamUrl
   * @param {number} fileSize
   * @returns {Promise<string|null>}
   */
  async function calculateFileHash(streamUrl, fileSize) {
    if (!streamUrl || !fileSize) {
      console.warn('缺少 streamUrl 或 fileSize，无法计算哈希。');
      return null;
    }
    console.log("[Hash] \u4F7F\u7528\u6D41\u5A92\u4F53URL: ".concat(streamUrl ? '已获取' : '未获取'));
    if (!streamUrl.includes('api_key=')) {
      console.warn('[Hash] 流媒体URL缺少api_key参数，可能导致认证失败');
    }
    var authHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      Accept: '*/*',
      'Accept-Encoding': 'identity'
    };
    var CHUNK_SIZE = 16 * 1024 * 1024;
    var spark = new SparkMD5.ArrayBuffer();
    try {
      if (fileSize < CHUNK_SIZE * 2) {
        console.log("[Hash] \u6587\u4EF6\u5927\u5C0F (".concat((fileSize / 1024 / 1024).toFixed(2), "MB) \u5C0F\u4E8E32MB\uFF0C\u5C06\u4E0B\u8F7D\u6574\u4E2A\u6587\u4EF6\u8BA1\u7B97\u54C8\u5E0C\u3002"));
        var response = await fetch(streamUrl, {
          headers: authHeaders
        });
        if (!response.ok) {
          throw new Error("\u4E0B\u8F7D\u6587\u4EF6\u5931\u8D25: ".concat(response.status, " ").concat(response.statusText));
        }
        var arrayBuffer = await response.arrayBuffer();
        spark.append(arrayBuffer);
      } else {
        console.log("[Hash] \u6587\u4EF6\u5927\u5C0F (".concat((fileSize / 1024 / 1024).toFixed(2), "MB)\uFF0C\u5C06\u5206\u5757\u4E0B\u8F7D\u8BA1\u7B97\u54C8\u5E0C\u3002"));
        var headResponse = await fetch(streamUrl, {
          headers: _objectSpread2(_objectSpread2({}, authHeaders), {}, {
            Range: "bytes=0-".concat(CHUNK_SIZE - 1),
            'Accept-Ranges': 'bytes'
          })
        });
        if (!headResponse.ok) {
          throw new Error("\u4E0B\u8F7D\u6587\u4EF6\u5934\u90E8\u5931\u8D25: ".concat(headResponse.status, " ").concat(headResponse.statusText));
        }
        spark.append(await headResponse.arrayBuffer());
        var tailResponse = await fetch(streamUrl, {
          headers: _objectSpread2(_objectSpread2({}, authHeaders), {}, {
            Range: "bytes=".concat(fileSize - CHUNK_SIZE, "-").concat(fileSize - 1),
            'Accept-Ranges': 'bytes'
          })
        });
        if (!tailResponse.ok) {
          throw new Error("\u4E0B\u8F7D\u6587\u4EF6\u5C3E\u90E8\u5931\u8D25: ".concat(tailResponse.status, " ").concat(tailResponse.statusText));
        }
        spark.append(await tailResponse.arrayBuffer());
      }
      var hash = spark.end();
      console.log("[Hash] \u6587\u4EF6\u54C8\u5E0C\u8BA1\u7B97\u6210\u529F: ".concat(hash));
      return hash;
    } catch (error) {
      console.warn('[Hash] 文件哈希计算过程中发生错误:', error);
      return null;
    }
  }

  /**
   * 通过文件哈希尝试匹配
   * @param {string} animeName
   * @param {string} streamUrl
   * @param {number} size
   * @param {number} duration
   * @param {object} apiConfigs
   * @param {string[]} apiPriority
   * @returns {Promise<object|null>}
   */
  async function tryMatchByHash(animeName, streamUrl, size, duration, apiConfigs, apiPriority) {
    var matchPayload = {
      fileName: animeName,
      fileHash: 'a1b2c3d4e5f67890abcd1234ef567890',
      fileSize: size || 0,
      videoDuration: Math.floor(duration || 0),
      matchMode: 'hashAndFileName'
    };
    if (streamUrl && size > 0) {
      console.log("\u51C6\u5907\u901A\u8FC7\u64AD\u653E\u94FE\u63A5\u8BA1\u7B97\u6587\u4EF6\u54C8\u5E0C");
      matchPayload.fileHash = (await calculateFileHash(streamUrl, size)) || matchPayload.fileHash;
    } else {
      console.warn('未找到播放链接或文件大小，将使用假哈希值进行匹配。');
    }
    var _iterator = _createForOfIteratorHelper(apiPriority),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _matchResult$animes, _matchResult$animes2;
        var apiKey = _step.value;
        var config = apiConfigs[apiKey];
        if (!config || !config.enabled || apiKey === 'custom' && !config.prefix) continue;
        console.log("[\u81EA\u52A8\u5339\u914D] \u5C1D\u8BD5 ".concat(config.name, " /match \u63A5\u53E3"));
        var matchResult = await fetchMatchApi(matchPayload, config.prefix);
        if (matchResult !== null && matchResult !== void 0 && matchResult.isMatched && ((_matchResult$animes = matchResult.animes) === null || _matchResult$animes === void 0 ? void 0 : _matchResult$animes.length) > 0) {
          console.log("".concat(config.name, " /match \u63A5\u53E3\u76F4\u63A5\u5339\u914D\u6210\u529F"));
          var match = matchResult.animes[0];
          return {
            directMatch: true,
            apiPrefix: config.prefix,
            apiName: config.name,
            episodeInfo: _objectSpread2(_objectSpread2({}, match), {}, {
              episodes: [{
                episodeId: match.episodeId,
                episodeTitle: match.episodeTitle
              }],
              imageUrl: match.imageUrl
            })
          };
        }
        if (matchResult && !matchResult.isMatched && ((_matchResult$animes2 = matchResult.animes) === null || _matchResult$animes2 === void 0 ? void 0 : _matchResult$animes2.length) > 0) {
          console.log("[".concat(config.name, "] /match \u63A5\u53E3\u8FD4\u56DE\u5019\u9009\u5217\u8868\uFF0C\u5C1D\u8BD5\u667A\u80FD\u5339\u914D..."));
          var bestMatch = selectBestMatch(animeName, matchResult.animes);
          if (bestMatch) {
            return {
              directMatch: true,
              apiPrefix: config.prefix,
              apiName: config.name,
              episodeInfo: _objectSpread2(_objectSpread2({}, bestMatch), {}, {
                episodes: [{
                  episodeId: bestMatch.episodeId,
                  episodeTitle: bestMatch.episodeTitle
                }],
                imageUrl: bestMatch.imageUrl
              })
            };
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return null;
  }

  /**
   * 写入赛季信息到 localStorage
   * @param {string} _season_key
   * @param {object} newSeasonInfo
   */
  function writeLsSeasonInfo(_season_key, newSeasonInfo) {
    if (!_season_key) {
      return console.log('_season_key is undefined, skip');
    }
    var seasonInfoListStr = localStorage.getItem(_season_key);
    var seasonInfoList = seasonInfoListStr ? JSON.parse(seasonInfoListStr) : [];
    var existingSeasonInfo = seasonInfoList.find(function (si) {
      return si.name === newSeasonInfo.name;
    });
    if (!existingSeasonInfo) {
      seasonInfoList.push(newSeasonInfo);
    } else {
      Object.assign(existingSeasonInfo, newSeasonInfo);
    }
    localStorage.setItem(_season_key, JSON.stringify(seasonInfoList));
  }

  /**
   * 解析 "XXXX SXXEXX" 格式的标题
   * @param {string} animeName
   * @returns {{ title: string, season: number|null, episode: number|null }}
   */
  function parseAnimeName(animeName) {
    var match = animeName.match(/^(.*?)\s*[Ss](\d{1,2})[Ee](\d{1,4})\b/);
    if (match) {
      return {
        title: match[1].replace(/[._]/g, ' ').trim(),
        season: parseInt(match[2], 10),
        episode: parseInt(match[3], 10)
      };
    }
    return {
      title: animeName,
      season: null,
      episode: null
    };
  }

  /**
   * 通过赛季缓存匹配
   * @param {string} _season_key
   * @param {number} episode
   * @param {string} prefix
   * @returns {Promise<object|null>}
   */
  async function lsSeasonSearchEpisodes(_season_key, episode, prefix) {
    var seasonInfoListStr = window.localStorage.getItem(_season_key);
    if (!seasonInfoListStr) return null;
    var seasonInfoList = JSON.parse(seasonInfoListStr);
    var minPositiveDiff = Infinity;
    var selectedSeasonInfo = null;
    for (var i = 0; i < seasonInfoList.length; i++) {
      var seasonInfo = seasonInfoList[i];
      var adjustedEpisode = episode + seasonInfo.episodeOffset;
      if (adjustedEpisode > 0 && adjustedEpisode < minPositiveDiff) {
        minPositiveDiff = adjustedEpisode;
        selectedSeasonInfo = seasonInfo;
      }
    }
    if (selectedSeasonInfo) {
      var newEpisode = episode + selectedSeasonInfo.episodeOffset;
      console.log("\u547D\u4E2DseasonInfo\u7F13\u5B58: ".concat(selectedSeasonInfo.name, ",\u504F\u79FB\u91CF: ").concat(selectedSeasonInfo.episodeOffset, ",\u96C6: ").concat(newEpisode));
      var animaInfo = await fetchSearchEpisodes(selectedSeasonInfo.name, newEpisode, prefix);
      return {
        animaInfo: animaInfo,
        newEpisode: newEpisode
      };
    }
    return null;
  }

  /**
   * 主匹配入口：根据 itemInfoMap 搜索弹幕
   * @param {object} itemInfoMap - 由 getMapByEmbyItemInfo 提供
   * @returns {Promise<object|null>}
   */
  async function searchEpisodes(itemInfoMap) {
    var _apiConfigs$custom$pr, _apiConfigs$currentPr, _animaRes$animaInfo, _animaInfo$animes;
    var _season_key = itemInfoMap._season_key,
      animeName = itemInfoMap.animeName,
      episodeName = itemInfoMap.episodeName,
      episode = itemInfoMap.episode,
      seriesOrMovieId = itemInfoMap.seriesOrMovieId,
      streamUrl = itemInfoMap.streamUrl,
      size = itemInfoMap.size,
      duration = itemInfoMap.duration;
    console.log("[\u81EA\u52A8\u5339\u914D] \u6807\u9898\u540D: ".concat(episodeName) + (episode ? ",\u7AE0\u8282\u8FC7\u6EE4: ".concat(episode) : ''));
    var apiPriority = lsGetItem(lsKeys.apiPriority.id);
    var apiConfigs = {
      official: {
        name: '官方API',
        prefix: corsProxy + 'https://api.dandanplay.net/api/v2',
        enabled: lsGetItem(lsKeys.useOfficialApi.id)
      },
      custom: {
        name: '自定义API',
        prefix: lsGetItem(lsKeys.customApiPrefix.id),
        enabled: lsGetItem(lsKeys.useCustomApi.id)
      }
    };
    var currentPriority = Array.isArray(apiPriority) && apiPriority[0] === 'custom' && apiConfigs.custom.enabled && (_apiConfigs$custom$pr = apiConfigs.custom.prefix) !== null && _apiConfigs$custom$pr !== void 0 && _apiConfigs$custom$pr.trim() ? 'custom' : 'official';
    var selectedApiConfig = apiConfigs[currentPriority].enabled && (_apiConfigs$currentPr = apiConfigs[currentPriority].prefix) !== null && _apiConfigs$currentPr !== void 0 && _apiConfigs$currentPr.trim() ? apiConfigs[currentPriority] : apiConfigs.custom;
    var animaRes = await lsSeasonSearchEpisodes(_season_key, episode, selectedApiConfig.prefix);
    if ((animaRes === null || animaRes === void 0 || (_animaRes$animaInfo = animaRes.animaInfo) === null || _animaRes$animaInfo === void 0 || (_animaRes$animaInfo = _animaRes$animaInfo.animes) === null || _animaRes$animaInfo === void 0 ? void 0 : _animaRes$animaInfo.length) > 0) {
      var bgmEpisodeIndex = animaRes.newEpisode - 1;
      console.log("[\u81EA\u52A8\u5339\u914D] \u547D\u4E2D\u8D5B\u5B63\u7F13\u5B58\uFF0C\u76F4\u63A5\u4F7F\u7528");
      return {
        animeOriginalTitle: '',
        animaInfo: animaRes.animaInfo,
        bgmEpisodeIndex: bgmEpisodeIndex
      };
    }
    var tmdbMatchResult = await tryMatchByTmdbId(itemInfoMap, apiConfigs, apiPriority);
    if (tmdbMatchResult) return tmdbMatchResult;
    var hashMatchResult = await tryMatchByHash(episodeName, streamUrl, size, duration, apiConfigs, apiPriority);
    if (hashMatchResult) return hashMatchResult;
    var _iterator = _createForOfIteratorHelper(apiPriority),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _searchAnimaInfo, _searchAnimaInfo2;
        var apiKey = _step.value;
        var config = apiConfigs[apiKey];
        if (!config || !config.enabled || apiKey === 'custom' && !config.prefix) continue;
        var searchTitle = episodeName;
        var searchEpisode = episode;
        if (apiKey === 'official') {
          var parsed = parseAnimeName(episodeName);
          if (parsed.season !== null) {
            searchTitle = parsed.season === 1 ? parsed.title : "".concat(parsed.title, " \u7B2C").concat(parsed.season, "\u5B63");
            searchEpisode = parsed.episode;
            console.log("[\u81EA\u52A8\u5339\u914D][\u5B98\u65B9API\u4F18\u5316] \u683C\u5F0F\u5316\u641C\u7D22: \u6807\u9898='".concat(searchTitle, "', \u96C6\u6570=").concat(searchEpisode));
          }
        }
        var searchAnimaInfo = await fetchSearchEpisodes(searchTitle, searchEpisode, config.prefix);
        if (((_searchAnimaInfo = searchAnimaInfo) === null || _searchAnimaInfo === void 0 || (_searchAnimaInfo = _searchAnimaInfo.animes) === null || _searchAnimaInfo === void 0 ? void 0 : _searchAnimaInfo.length) > 0) {
          return {
            animaInfo: searchAnimaInfo,
            apiPrefix: config.prefix
          };
        }
        searchAnimaInfo = await fetchSearchEpisodes(episodeName, null, config.prefix);
        if (((_searchAnimaInfo2 = searchAnimaInfo) === null || _searchAnimaInfo2 === void 0 || (_searchAnimaInfo2 = _searchAnimaInfo2.animes) === null || _searchAnimaInfo2 === void 0 ? void 0 : _searchAnimaInfo2.length) > 0) {
          return {
            animaInfo: searchAnimaInfo,
            apiPrefix: config.prefix
          };
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var animaInfo = await fetchSearchEpisodes(animeName, episode, selectedApiConfig.prefix);
    if ((animaInfo === null || animaInfo === void 0 || (_animaInfo$animes = animaInfo.animes) === null || _animaInfo$animes === void 0 ? void 0 : _animaInfo$animes.length) > 0) {
      return {
        animeOriginalTitle: '',
        animaInfo: animaInfo
      };
    }
    return autoFailback(animeName, episode, seriesOrMovieId, selectedApiConfig.prefix);
  }

  /**
   * @param {boolean} [is_auto=true]
   * @param {function} [appendvideoOsdDanmakuInfo] - 匹配失败时回调
   * @returns {Promise<object|null>}
   */
  async function getEpisodeInfo() {
    var _window$ede, _res$animaInfo, _res$bgmEpisodeIndex;
    var is_auto = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var appendvideoOsdDanmakuInfo = arguments.length > 1 ? arguments[1] : undefined;
    var itemInfoMap = await getMapByEmbyItemInfo();
    if (!itemInfoMap) return null;
    var _episode_key = itemInfoMap._episode_key,
      animeId = itemInfoMap.animeId,
      episode = itemInfoMap.episode,
      seriesOrMovieId = itemInfoMap.seriesOrMovieId;
    var useOfficialApi = lsGetItem(lsKeys.useOfficialApi.id);
    var useCustomApi = lsGetItem(lsKeys.useCustomApi.id);
    var apiPriority = lsGetItem(lsKeys.apiPriority.id) || ['official', 'custom'];
    var enabledApis = apiPriority.filter(function (apiKey) {
      if (apiKey === 'official') return useOfficialApi;
      if (apiKey === 'custom') return useCustomApi;
      return false;
    });
    var unique_episode_key = lsLocalKeys.apiPrefix + "".concat(enabledApis.join('_'), "_") + _episode_key;
    if (is_auto && window.localStorage.getItem(unique_episode_key)) {
      return JSON.parse(window.localStorage.getItem(unique_episode_key));
    }
    var previous_info = (_window$ede = window.ede) === null || _window$ede === void 0 ? void 0 : _window$ede.previous_episode_info;
    if (is_auto && previous_info !== null && previous_info !== void 0 && previous_info.episodeId && previous_info.seriesOrMovieId === seriesOrMovieId) {
      var previousEpisodeIndex = previous_info.episodeIndex;
      var currentEpisodeNumber = episode;
      var previousEpisodeId = parseInt(previous_info.episodeId, 10);
      var predictedEpisodeId = null;
      if (currentEpisodeNumber === previousEpisodeIndex + 2) {
        predictedEpisodeId = previousEpisodeId + 1;
      } else if (currentEpisodeNumber === previousEpisodeIndex) {
        predictedEpisodeId = previousEpisodeId - 1;
      }
      if (predictedEpisodeId) {
        var comments = await fetchComment(predictedEpisodeId);
        if ((comments === null || comments === void 0 ? void 0 : comments.length) > 0) {
          return _objectSpread2(_objectSpread2({}, itemInfoMap), {}, {
            episodeId: predictedEpisodeId,
            episodeTitle: "\u7B2C ".concat(currentEpisodeNumber, " \u96C6 (\u63A8\u7406)"),
            animeId: previous_info.animeId,
            animeTitle: previous_info.animeTitle,
            imageUrl: previous_info.imageUrl,
            seriesOrMovieId: seriesOrMovieId,
            episodeIndex: currentEpisodeNumber - 1,
            bgmEpisodeIndex: currentEpisodeNumber - 1
          });
        }
      }
    }
    var res = await searchEpisodes(itemInfoMap);
    if (!lsGetItem(lsKeys.useOfficialApi.id) && !lsGetItem(lsKeys.useCustomApi.id)) {
      return null;
    }
    if (!res) {
      if (typeof appendvideoOsdDanmakuInfo === 'function') appendvideoOsdDanmakuInfo();
      return null;
    }
    var episodeIndex = isNaN(episode) ? 0 : episode - 1;
    if (res.directMatch && res.episodeInfo) {
      var _res$episodeInfo$epis;
      var _ep = ((_res$episodeInfo$epis = res.episodeInfo.episodes) === null || _res$episodeInfo$epis === void 0 ? void 0 : _res$episodeInfo$epis[0]) || res.episodeInfo;
      var _episodeInfo = {
        episodeId: _ep.episodeId,
        episodeTitle: _ep.episodeTitle,
        episodeIndex: episodeIndex,
        bgmEpisodeIndex: episodeIndex,
        animeId: res.episodeInfo.animeId,
        animeTitle: res.episodeInfo.animeTitle,
        animeOriginalTitle: '',
        imageUrl: res.episodeInfo.imageUrl,
        apiName: res.apiName,
        apiPrefix: res.apiPrefix,
        seriesOrMovieId: seriesOrMovieId
      };
      window.localStorage.setItem(unique_episode_key, JSON.stringify(_episodeInfo));
      return _episodeInfo;
    }
    if (!((_res$animaInfo = res.animaInfo) !== null && _res$animaInfo !== void 0 && (_res$animaInfo = _res$animaInfo.animes) !== null && _res$animaInfo !== void 0 && _res$animaInfo.length)) {
      if (typeof appendvideoOsdDanmakuInfo === 'function') appendvideoOsdDanmakuInfo();
      return null;
    }
    var _res$animeOriginalTit = res.animeOriginalTitle,
      animeOriginalTitle = _res$animeOriginalTit === void 0 ? '' : _res$animeOriginalTit,
      animaInfo = res.animaInfo;
    var selectAnime_id = 0;
    if (animeId != -1) {
      var idx = animaInfo.animes.findIndex(function (a) {
        return a.animeId == animeId;
      });
      if (idx >= 0) selectAnime_id = idx;
    }
    var anime = animaInfo.animes[selectAnime_id];
    var eps = (anime === null || anime === void 0 ? void 0 : anime.episodes) || [];
    var ep = eps[episodeIndex] || eps[0];
    if (!ep) return null;
    var episodeInfo = {
      episodeId: ep.episodeId,
      episodeTitle: ep.episodeTitle,
      episodeIndex: episodeIndex,
      bgmEpisodeIndex: (_res$bgmEpisodeIndex = res.bgmEpisodeIndex) !== null && _res$bgmEpisodeIndex !== void 0 ? _res$bgmEpisodeIndex : episodeIndex,
      animeId: anime.animeId,
      animeTitle: anime.animeTitle,
      animeOriginalTitle: animeOriginalTitle,
      imageUrl: anime.imageUrl || (anime.animeId ? dandanplayApi.posterImg(anime.animeId) : undefined),
      apiPrefix: res.apiPrefix,
      seriesOrMovieId: seriesOrMovieId
    };
    window.localStorage.setItem(unique_episode_key, JSON.stringify(episodeInfo));
    return episodeInfo;
  }

  /**
   * 创建并初始化弹幕实例
   * @param {object[]} comments - 原始弹幕数据
   * @param {object} [hooks] - 可选回调 { buildCurrentDanmakuInfo, appendvideoOsdDanmakuInfo }
   * @returns {Promise<void>}
   */
  async function createDanmaku(comments) {
    var hooks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (!comments) return;
    var buildCurrentDanmakuInfo = hooks.buildCurrentDanmakuInfo || function () {};
    var appendvideoOsdDanmakuInfo = hooks.appendvideoOsdDanmakuInfo || function () {};
    if (window.ede.danmaku) {
      window.ede.danmaku.destroy();
      window.ede.danmaku = null;
    }
    window.ede.commentsOriginal = comments;
    var commentsParsed = danmakuParser(comments);
    window.ede.commentsParsed = commentsParsed;
    var _comments = danmakuFilter(commentsParsed);
    console.log('[加载]弹幕成功: ' + _comments.length);
    var _media = document.querySelector(mediaQueryStr);
    if (!_media) {
      if (!window.ede.danmaku) {
        window.ede.danmaku = {
          comments: _comments
        };
      }
      buildCurrentDanmakuInfo(currentDanmakuInfoContainerId);
      throw new Error('用户已退出视频播放');
    }
    if (!isVersionOld) _media.style.position = 'absolute';
    var wrapperTop = 0;
    var wrapper = getById(eleIds.danmakuWrapper);
    if (wrapper) wrapper.remove();
    wrapper = document.createElement('div');
    wrapper.id = eleIds.danmakuWrapper;
    wrapper.style.cssText = "\n        position: fixed;\n        width: 100%;\n        height: calc(".concat(lsGetItem(lsKeys.heightPercent.id), "% - ").concat(wrapperTop, "px);\n        background-color: ").concat(lsGetItem(lsKeys.debugShowDanmakuWrapper.id) ? 'rgba(115, 160, 255, 0.3)' : '', ";\n        top: ").concat(wrapperTop, "px;\n        pointer-events: none;\n    ");
    var _container = await waitForElement(mediaContainerQueryStr);
    _container.prepend(wrapper);
    var _speed = 144 * lsGetItem(lsKeys.speed.id);
    var DanmakuClass = window.Danmaku;
    if (!DanmakuClass) {
      throw new Error('Danmaku 引擎未加载');
    }
    window.ede.danmaku = new DanmakuClass({
      container: wrapper,
      media: _media,
      comments: _comments,
      engine: lsGetItem(lsKeys.engine.id),
      speed: _speed
    });
    lsGetItem(lsKeys.switch.id) ? window.ede.danmaku.show() : window.ede.danmaku.hide();
    if (window.ede.ob) {
      window.ede.ob.disconnect();
    }
    window.ede.ob = new ResizeObserver(function () {
      if (window.ede.danmaku) {
        window.ede.danmaku.resize();
        if (lsGetItem(lsKeys.osdLineChartEnable.id)) {
          buildProgressBarChart(20);
        }
      }
    });
    window.ede.ob.observe(_container);
    if (_media.id) {
      if (typeof require === 'function') {
        require(['playbackManager'], function (playbackManager) {
          var _playbackManager$getP;
          if (playbackManager !== null && playbackManager !== void 0 && playbackManager.getCurrentPlayer() && (_playbackManager$getP = playbackManager.getPlayerState()) !== null && _playbackManager$getP !== void 0 && (_playbackManager$getP = _playbackManager$getP.PlayState) !== null && _playbackManager$getP !== void 0 && _playbackManager$getP.IsPaused) {
            _media.dispatchEvent(new Event('pause'));
          }
        });
      }
    }
    buildCurrentDanmakuInfo(currentDanmakuInfoContainerId);
    appendvideoOsdDanmakuInfo(_comments.length);
    if (lsGetItem(lsKeys.osdLineChartEnable.id)) {
      buildProgressBarChart(20);
    }
  }

  /**
   * 从服务端 Danmu 插件获取 XML 弹幕
   * @param {string} mediaServerItemId
   * @returns {Promise<object[]|null>}
   */
  async function getCommentsByPluginApi(mediaServerItemId) {
    if (typeof ApiClient === 'undefined') return null;
    var url = "".concat(ApiClient.serverAddress(), "/api/danmu/").concat(mediaServerItemId, "/raw?X-Emby-Token=").concat(ApiClient.accessToken());
    try {
      var response = await fetch(url);
      if (!response.ok) return null;
      var xmlText = await response.text();
      if (!(xmlText !== null && xmlText !== void 0 && xmlText.length)) return null;
      var parser = new DOMParser();
      var data = parser.parseFromString(xmlText, 'text/xml');
      var comments = [];
      var _iterator = _createForOfIteratorHelper(data.getElementsByTagName('d')),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _comment$getAttribute;
          var comment = _step.value;
          var p = ((_comment$getAttribute = comment.getAttribute('p')) === null || _comment$getAttribute === void 0 ? void 0 : _comment$getAttribute.split(',').map(Number)) || [];
          comments.push({
            cid: p[7],
            p: "".concat(p[0], ",").concat(p[1], ",").concat(p[3], ",").concat(p[6]),
            m: comment.textContent
          });
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return comments;
    } catch (error) {
      console.error('Failed to parse XML data:', error);
      return null;
    }
  }
  async function addExtCommentsForLoad(extUrl, extComments) {
    var _window$ede, _window$ede2, _extComments;
    var hooks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var episodeId = (_window$ede = window.ede) === null || _window$ede === void 0 || (_window$ede = _window$ede.episode_info) === null || _window$ede === void 0 ? void 0 : _window$ede.episodeId;
    var comments = ((_window$ede2 = window.ede) === null || _window$ede2 === void 0 || (_window$ede2 = _window$ede2.danmuCache) === null || _window$ede2 === void 0 ? void 0 : _window$ede2[episodeId]) || [];
    if (!extComments) {
      extComments = await fetchExtcommentActual(extUrl, comments);
    }
    if (!((_extComments = extComments) !== null && _extComments !== void 0 && _extComments.length)) return;
    var allComments = comments.concat(extComments);
    await createDanmaku(allComments, hooks).catch(function (err) {
      return console.log(err);
    });
  }

  /**
   * 加载弹幕（主入口）
   * @param {string} loadType - LOAD_TYPE
   * @param {object} [hooks] - { buildCurrentDanmakuInfo }
   */
  function loadDanmaku() {
    var _window$ede3;
    var loadType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : LOAD_TYPE.CHECK;
    var hooks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _media = document.querySelector(mediaQueryStr);
    if (!_media) {
      return console.warn('用户已退出视频播放,停止加载弹幕');
    }
    if ((_window$ede3 = window.ede) !== null && _window$ede3 !== void 0 && _window$ede3.loading) {
      console.log('正在重新加载');
      return;
    }
    window.ede.loading = true;
    var buildCurrentDanmakuInfoFn = hooks.buildCurrentDanmakuInfo || function () {};
    var appendvideoOsdDanmakuInfoFn = hooks.appendvideoOsdDanmakuInfo || function () {};
    if (lsGetItem(lsKeys.useFetchPluginXml.id)) {
      getMapByEmbyItemInfo().then(function (itemInfoMap) {
        return getCommentsByPluginApi(window.ede.itemId).then(function (comments) {
          if ((comments === null || comments === void 0 ? void 0 : comments.length) > 0) {
            return createDanmaku(comments, {
              buildCurrentDanmakuInfo: buildCurrentDanmakuInfoFn,
              appendvideoOsdDanmakuInfo: appendvideoOsdDanmakuInfoFn
            }).then(function () {
              window.ede.loading = false;
              var ctr = getById(eleIds.danmakuCtr);
              if (ctr) ctr.style.opacity = '1';
            });
          }
          throw new Error('useFetchPluginXml 失败');
        });
      }).catch(function () {
        return loadOnlineDanmaku(loadType, hooks);
      });
    } else {
      loadOnlineDanmaku(loadType, hooks);
    }
  }

  /**
   * 在线加载弹幕
   * @param {string} loadType
   * @param {object} [hooks] - { buildCurrentDanmakuInfo }
   */
  async function loadOnlineDanmaku(loadType) {
    var hooks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var buildCurrentDanmakuInfoFn = hooks.buildCurrentDanmakuInfo || function () {};
    var appendvideoOsdDanmakuInfoFn = hooks.appendvideoOsdDanmakuInfo || function () {};
    getEpisodeInfo(loadType !== LOAD_TYPE.SEARCH, appendvideoOsdDanmakuInfoFn).then(function (info) {
      return new Promise(function (resolve, reject) {
        var _window$ede4, _window$ede5;
        if (!info) {
          reject(loadType !== LOAD_TYPE.INIT ? '播放器未完成加载' : null);
          return;
        }
        if (loadType !== LOAD_TYPE.SEARCH && loadType !== LOAD_TYPE.REFRESH && loadType !== LOAD_TYPE.RELOAD && loadType !== LOAD_TYPE.INIT && (_window$ede4 = window.ede) !== null && _window$ede4 !== void 0 && _window$ede4.danmaku && ((_window$ede5 = window.ede) === null || _window$ede5 === void 0 || (_window$ede5 = _window$ede5.episode_info) === null || _window$ede5 === void 0 ? void 0 : _window$ede5.episodeId) == info.episodeId) {
          reject('当前播放视频未变动');
          return;
        }
        window.ede.episode_info = info;
        resolve(info.episodeId);
      });
    }).then(function (episodeId) {
      if (episodeId) {
        var _window$ede6;
        if (loadType === LOAD_TYPE.RELOAD && (_window$ede6 = window.ede) !== null && _window$ede6 !== void 0 && (_window$ede6 = _window$ede6.danmuCache) !== null && _window$ede6 !== void 0 && _window$ede6[episodeId]) {
          createDanmaku(window.ede.danmuCache[episodeId], {
            buildCurrentDanmakuInfo: buildCurrentDanmakuInfoFn,
            appendvideoOsdDanmakuInfo: appendvideoOsdDanmakuInfoFn
          }).catch(console.log);
        } else {
          fetchComment(episodeId).then(function (comments) {
            window.ede.danmuCache = window.ede.danmuCache || {};
            window.ede.danmuCache[episodeId] = comments;
            createDanmaku(comments, {
              buildCurrentDanmakuInfo: buildCurrentDanmakuInfoFn,
              appendvideoOsdDanmakuInfo: appendvideoOsdDanmakuInfoFn
            }).catch(console.log);
          });
        }
      }
    }, function (msg) {
      if (msg) console.log(msg);
    }).then(function () {
      var _window$ede7, _window$ede8;
      var extCommentCache = ((_window$ede7 = window.ede) === null || _window$ede7 === void 0 || (_window$ede7 = _window$ede7.extCommentCache) === null || _window$ede7 === void 0 ? void 0 : _window$ede7[window.ede.itemId]) || {};
      var hooks = {
        buildCurrentDanmakuInfo: buildCurrentDanmakuInfoFn,
        appendvideoOsdDanmakuInfo: appendvideoOsdDanmakuInfoFn
      };
      objectEntries(extCommentCache).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          val = _ref2[1];
        return addExtCommentsForLoad(key, val, hooks);
      });
      if ((_window$ede8 = window.ede) !== null && _window$ede8 !== void 0 && _window$ede8.episode_info) {
        window.ede.previous_episode_info = _objectSpread2({}, window.ede.episode_info);
      }
      window.ede.loading = false;
      var ctr = getById(eleIds.danmakuCtr);
      if (ctr) ctr.style.opacity = '1';
    }).catch(function () {
      window.ede.loading = false;
    });
  }

  function doDanmakuSwitch$1() {
    var _window$ede;
    var flag = !lsGetItem(lsKeys.switch.id);
    console.log("\u5207\u6362".concat(lsKeys.switch.name, ": ").concat(flag));
    if ((_window$ede = window.ede) !== null && _window$ede !== void 0 && _window$ede.danmaku) {
      flag ? window.ede.danmaku.show() : window.ede.danmaku.hide();
    }
    var osdDanmakuSwitchBtn = getById(eleIds.danmakuSwitchBtn);
    if (osdDanmakuSwitchBtn) {
      osdDanmakuSwitchBtn.firstChild.innerHTML = flag ? iconKeys.comment : iconKeys.comments_disabled;
    }
    var switchElement = getById(eleIds.danmakuSwitch);
    if (switchElement) {
      switchElement.firstChild.innerHTML = flag ? iconKeys.switch_on : iconKeys.switch_off;
      switchElement.style.color = flag ? styles.colors.switchActiveColor : '';
    }
    lsSetItem(lsKeys.switch.id, flag);
  }
  function onSliderChange$1(val, opts) {
    var _opts$lsKey;
    onSliderChangeLabel$1(opts.label != null ? opts.label : val, opts);
    if ((_opts$lsKey = opts.lsKey) !== null && _opts$lsKey !== void 0 && _opts$lsKey.id && lsCheckSet(opts.lsKey.id, val)) {
      var needReload = opts.needReload === undefined ? true : opts.needReload;
      if (opts.isManual) {
        return;
      }
      console.log("".concat(opts.lsKey.id, " changed to ").concat(val, ", needReload: ").concat(needReload));
      if (needReload) {
        changeFontStylePreview();
        loadDanmaku(LOAD_TYPE.RELOAD);
      }
    }
  }
  function onSliderChangeLabel$1(val, opts) {
    if (opts !== null && opts !== void 0 && opts.labelId) {
      var el = getById(opts.labelId);
      if (el) el.innerText = val;
    }
    if (opts !== null && opts !== void 0 && opts.labelEle) {
      opts.labelEle.innerText = val;
    }
  }
  function changeFontStylePreview() {
    var _styles$fontStyles$ls;
    var fontStylePreview = getById(eleIds.fontStylePreview);
    if (!fontStylePreview) return;
    var fontWeight = lsGetItem(lsKeys.fontWeight.id);
    var fontStyle = ((_styles$fontStyles$ls = styles.fontStyles[lsGetItem(lsKeys.fontStyle.id)]) === null || _styles$fontStyles$ls === void 0 ? void 0 : _styles$fontStyles$ls.id) || 'normal';
    var fontFamily = lsGetItem(lsKeys.fontFamily.id);
    var fontOpacity = Math.round(lsGetItem(lsKeys.fontOpacity.id) * 255).toString(16).padStart(2, '0');
    var baseColor = Number(styles.colors.info).toString(16).padStart(6, '0');
    var color = "".concat(baseColor).concat(fontOpacity);
    var shadowColor = baseColor === '000000' ? "#ffffff".concat(fontOpacity) : "#000000".concat(fontOpacity);
    var fontSizeReferent = fontStylePreview.previousElementSibling;
    var fontSize = fontSizeReferent ? parseFloat(getComputedStyle(fontSizeReferent).fontSize.replace('px', '')) : 16;
    var cmtStyle = getCommentStyle(color, shadowColor, fontStyle, fontWeight, fontSize, fontFamily);
    Object.assign(fontStylePreview.style, cmtStyle);
  }
  function buildFontFamilyCtrl(container) {
    var fontFamilyCtrl = getById(eleIds.fontFamilyCtrl, container);
    if (!fontFamilyCtrl) return;
    fontFamilyCtrl.innerHTML = '';
    fontFamilyCtrl.append(embyButton({
      label: '切换手填',
      iconKey: iconKeys.edit
    }, function (e) {
      var xChecked = !e.target.xChecked;
      e.target.xChecked = xChecked;
      e.target.title = xChecked ? '手填' : '选择';
      var selectEl = getById(eleIds.fontFamilySelect);
      var inputEl = getById(eleIds.fontFamilyInput);
      if (selectEl) selectEl.style.display = xChecked ? 'none' : '';
      if (inputEl) inputEl.style.display = xChecked ? '' : 'none';
      if (xChecked) {
        var labelEl = getById(eleIds.fontFamilyLabel);
        if (labelEl) labelEl.innerHTML = '';
      }
    }));
    fontFamilyCtrl.append(embyButton({
      label: '重置为默认',
      iconKey: iconKeys.refresh
    }, function () {
      if (lsCheckSet(lsKeys.fontFamily.id, lsKeys.fontFamily.defaultValue)) {
        changeFontStylePreview();
        onSliderChangeLabel$1(lsKeys.fontFamily.defaultValue, {
          labelId: eleIds.fontFamilyLabel
        });
        var inputEl = getById(eleIds.fontFamilyInput);
        if (inputEl) inputEl.value = lsGetItem(lsKeys.fontFamily.id);
        loadDanmaku(LOAD_TYPE.RELOAD);
      }
    }));
  }
  function resetFontFamilyDiv(selectedIndexOrValue, opts, container) {
    var fontFamilyDiv = getById(eleIds.fontFamilyDiv, container);
    if (!fontFamilyDiv) return;
    fontFamilyDiv.innerHTML = '';
    fontFamilyDiv.append(embySelect({
      id: eleIds.fontFamilySelect,
      label: "".concat(lsKeys.fontFamily.name, ": ")
    }, selectedIndexOrValue, opts, 'family', 'family', function (value, index, option) {
      if (lsCheckSet(lsKeys.fontFamily.id, value)) {
        changeFontStylePreview();
        var _labelVal = option.family !== option.fullName ? option.fullName : '';
        onSliderChangeLabel$1(_labelVal, {
          labelId: eleIds.fontFamilyLabel
        });
        loadDanmaku(LOAD_TYPE.RELOAD);
      }
    }, function (e) {
      if ('queryLocalFonts' in window && opts.length <= 6) {
        queryLocalFonts().then(function (fonts) {
          var merged = [].concat(_toConsumableArray(opts), _toConsumableArray(fonts)).reduce(function (acc, font) {
            if (!acc.some(function (f) {
              return f.family === font.family;
            })) acc.push(font);
            return acc;
          }, []);
          var fontFamilyVal = lsGetItem(lsKeys.fontFamily.id);
          var idx = merged.findIndex(function (f) {
            return f.family === fontFamilyVal;
          });
          resetFontFamilyDiv(idx, merged, container);
        }).catch(function (err) {
          return console.error(err);
        });
        console.info('queryLocalFonts 高级查询 API 可用,已补充字体列表');
      }
    }));
    fontFamilyDiv.append(embyInput({
      id: eleIds.fontFamilyInput,
      value: lsGetItem(lsKeys.fontFamily.id),
      type: 'search',
      style: 'display: none;'
    }, function (e) {
      var inputVal = getTargetInput(e).value.trim();
      if (!inputVal) return;
      if (lsCheckSet(lsKeys.fontFamily.id, inputVal)) {
        changeFontStylePreview();
        loadDanmaku(LOAD_TYPE.RELOAD);
      }
    }));
    changeFontStylePreview();
    var fontFamilyOpt = opts.find(function (opt) {
      return opt.family === lsGetItem(lsKeys.fontFamily.id);
    });
    var labelVal = fontFamilyOpt ? fontFamilyOpt.fullName : '';
    onSliderChangeLabel$1(labelVal, {
      labelId: eleIds.fontFamilyLabel
    });
  }
  function buildFontFamilySetting(container) {
    var fontFamilyVal = lsGetItem(lsKeys.fontFamily.id);
    var availableFonts = [{
      family: lsKeys.fontFamily.defaultValue,
      fullName: lsKeys.fontFamily.defaultValue
    }, {
      family: 'Consolas',
      fullName: 'Consolas'
    }, {
      family: 'SimHei',
      fullName: '黑体'
    }, {
      family: 'SimSun',
      fullName: '宋体'
    }, {
      family: 'KaiTi',
      fullName: '楷体'
    }, {
      family: 'Microsoft YaHei',
      fullName: '微软雅黑'
    }];
    var selectedIndex = availableFonts.findIndex(function (f) {
      return f.family === fontFamilyVal;
    });
    resetFontFamilyDiv(selectedIndex, availableFonts, container);
    buildFontFamilyCtrl(container);
  }
  function buildFontStyleSetting(container) {
    var parent = container || document;
    var fontWeightDiv = getById(eleIds.danmakuFontWeightDiv, parent);
    var fontStyleDiv = getById(eleIds.danmakuFontStyleDiv, parent);
    if (fontWeightDiv) {
      fontWeightDiv.append(embySlider({
        lsKey: lsKeys.fontWeight
      }, onSliderChange$1, onSliderChangeLabel$1));
    }
    if (fontStyleDiv) {
      fontStyleDiv.append(embySlider({
        lsKey: lsKeys.fontStyle
      }, function (val, opts) {
        opts.label = styles.fontStyles[val].id;
        onSliderChange$1(val, opts);
      }, function (val, opts) {
        return onSliderChangeLabel$1(styles.fontStyles[val].id, opts);
      }));
    }
    buildFontFamilySetting(container);
  }
  function buildSettingsBackup(container) {
    var settingsCtrlEle = getById(eleIds.settingsCtrl, container);
    if (!settingsCtrlEle) return;
    settingsCtrlEle.append(embyButton({
      label: '配置',
      iconKey: iconKeys.more
    }, function (e) {
      var xChecked = !e.target.xChecked;
      e.target.xChecked = xChecked;
      e.target.title = xChecked ? '关闭' : '配置';
      e.target.firstChild.innerHTML = xChecked ? iconKeys.close : iconKeys.more;
      var settingsTextEle = getById(eleIds.settingsText);
      if (settingsTextEle) {
        settingsTextEle.style.display = xChecked ? '' : 'none';
        if (xChecked) settingsTextEle.value = getSettingsJson(lsKeys, lsGetItem, 2);
      }
      [eleIds.settingReloadBtn, eleIds.settingsImportBtn].forEach(function (id) {
        var el = getById(id);
        if (el) el.style.display = xChecked ? '' : 'none';
      });
    }));
    settingsCtrlEle.append(embyButton({
      id: eleIds.settingReloadBtn,
      label: '刷新',
      iconKey: iconKeys.refresh,
      style: 'display: none;'
    }, function () {
      var el = getById(eleIds.settingsText);
      if (el) el.value = getSettingsJson(lsKeys, lsGetItem, 2);
    }));
    settingsCtrlEle.append(embyButton({
      id: eleIds.settingsImportBtn,
      label: '应用',
      iconKey: iconKeys.done,
      style: 'display: none;'
    }, function () {
      var textEl = getById(eleIds.settingsText);
      if (textEl !== null && textEl !== void 0 && textEl.value) {
        lsBatchSet(JSON.parse(textEl.value));
        loadDanmaku(LOAD_TYPE.INIT);
        closeEmbyDialog();
      }
    }));
  }

  /**
   * 构建弹幕设置 Tab
   * @param {string} containerId
   */
  function buildDanmakuSetting(containerId) {
    var _nextEle$children;
    var container = getById(containerId);
    if (!container) return;
    var template = "\n        <div style=\"display: flex; justify-content: center;\">\n            <div>\n                <div id=\"".concat(eleIds.danmakuSwitchDiv, "\" style=\"margin-bottom: 0.2em;\">\n                    <label class=\"").concat(classes.embyLabel, "\">").concat(lsKeys.switch.name, " </label>\n                </div>\n                <div style=\"").concat(styles.embySlider, "\">\n                    <label class=\"").concat(classes.embyLabel, "\" style=\"width: 5em;\">").concat(lsKeys.filterLevel.name, ": </label>\n                    <div id=\"").concat(eleIds.filterLevelDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                    <label style=\"").concat(styles.embySliderLabel, "\"></label>\n                </div>\n                <div style=\"").concat(styles.embySlider, "\">\n                    <label class=\"").concat(classes.embyLabel, "\" style=\"width: 5em;\">").concat(lsKeys.heightPercent.name, ": </label>\n                    <div id=\"").concat(eleIds.heightPercentDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                    <label>\n                        <label style=\"").concat(styles.embySliderLabel, "\"></label>\n                        <label>%</label>\n                    </label>\n                </div>\n                <div style=\"").concat(styles.embySlider, "\">\n                    <label class=\"").concat(classes.embyLabel, "\" style=\"width: 5em;\">").concat(lsKeys.fontSizeRate.name, ": </label>\n                    <div id=\"").concat(eleIds.danmakuSizeDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                    <label>\n                        <label style=\"").concat(styles.embySliderLabel, "\"></label>\n                        <label>\u500D</label>\n                    </label>\n                </div>\n                <div style=\"").concat(styles.embySlider, "\">\n                    <label class=\"").concat(classes.embyLabel, "\" style=\"width: 5em;\">").concat(lsKeys.fontOpacity.name, ": </label>\n                    <div id=\"").concat(eleIds.danmakuOpacityDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                    <label style=\"").concat(styles.embySliderLabel, "\"></label>\n                </div>\n                <div style=\"").concat(styles.embySlider, "\">\n                    <label class=\"").concat(classes.embyLabel, "\" style=\"width: 5em;\">").concat(lsKeys.speed.name, ": </label>\n                    <div id=\"").concat(eleIds.danmakuSpeedDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                    <label>\n                        <label style=\"").concat(styles.embySliderLabel, "\"></label>\n                        <label>\u500D</label>\n                    </label>\n                </div>\n                <div style=\"").concat(styles.embySlider, "\">\n                    <label class=\"").concat(classes.embyLabel, "\" style=\"width: 5em;\">").concat(lsKeys.timelineOffset.name, ": </label>\n                    <div id=\"").concat(eleIds.timelineOffsetDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                    <label style=\"").concat(styles.embySliderLabel, "\"></label>\n                </div>\n                <div is=\"emby-collapse\" title=\"\u5F39\u5E55\u5B57\u4F53\u6837\u5F0F\" data-expanded=\"false\">\n                    <div class=\"").concat(classes.collapseContentNav, "\">\n                        <div style=\"").concat(styles.embySlider, "\">\n                            <label class=\"").concat(classes.embyLabel, "\" style=\"width: 5em;\">").concat(lsKeys.fontWeight.name, ": </label>\n                            <div id=\"").concat(eleIds.danmakuFontWeightDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                            <label style=\"").concat(styles.embySliderLabel, "\"></label>\n                        </div>\n                        <div style=\"").concat(styles.embySlider, "\">\n                            <label class=\"").concat(classes.embyLabel, "\" style=\"width: 5em;\">").concat(lsKeys.fontStyle.name, ": </label>\n                            <div id=\"").concat(eleIds.danmakuFontStyleDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                            <label style=\"").concat(styles.embySliderLabel, "\"></label>\n                        </div>\n                        <div id=\"").concat(eleIds.fontFamilyCtrl, "\" style=\"margin: 0.6em 0;\"></div>\n                        <div style=\"").concat(styles.embySlider, "\">\n                            <label class=\"").concat(classes.embyLabel, "\" style=\"width: 5em;\">").concat(lsKeys.fontFamily.name, ": </label>\n                            <div id=\"").concat(eleIds.fontFamilyDiv, "\" class=\"").concat(classes.embySelectWrapper, "\"></div>\n                            <label id=\"").concat(eleIds.fontFamilyLabel, "\" style=\"width: 10em; margin-left: 1em;\"></label>\n                        </div>\n                        <div style=\"max-width: 31.5em;\">\n                            <label class=\"").concat(classes.embyLabel, "\" style=\"width: 5em;\">\u5F39\u5E55\u5916\u89C2: </label>\n                            <div id=\"").concat(eleIds.fontStylePreview, "\"\n                                class=\"flex justify-content-center\"\n                                style=\"border: .08em solid gray;color: black;border-radius: .24em;padding: .5em;;background-color: #6a96bd;\">\n                                \u7B80\u4E2D/\u7E41\u9AD4/English/\u3053\u3093\u306B\u3061\u306F\u30A6\u30A9\u30EB\u30C9/</br>\n                                ABC/abc/012/~!@<?>[]/\u300A\uFF1F\u300B\u3010\u3011</br>\n                                \u2606*: .\uFF61. o(\u2267\u25BD\u2266)o .\uFF61.:*\u2606</br>\n                                emoji:\uD83D\uDE06\uD83D\uDC4F\uD83C\uDF88\uD83C\uDF4B\uD83C\uDF1E\u2049\uFE0F\uD83C\uDF89</br>\n                            </div>\n                            <div class=\"").concat(classes.embyFieldDesc, "\">\n                                \u8FD9\u4E9B\u8BBE\u7F6E\u4F1A\u5F71\u54CD\u6B64\u8BBE\u5907\u4E0A\u7684\u5F39\u5E55\u5916\u89C2,\u6B64\u5904\u56FA\u5B9A\u4E3A dom \u5F15\u64CE,\n                                canvas \u5F15\u64CE\u6548\u679C\u4E00\u6837,\u6B64\u5904\u4E0D\u505A\u5207\u6362\u5C55\u793A,\n                                \u56E0\u4E3A\u5F39\u5E55\u5927\u5C0F\u662F\u6839\u636E\u64AD\u653E\u9875\u6B21\u6807\u9898\u52A8\u6001\u8BA1\u7B97\u7684,\u6B64\u5904\u4E0D\u505A\u53C2\u8003,\n                                \u9009\u62E9\u6216\u8F93\u5165\u7684\u5B57\u4F53\u662F\u5426\u6709\u6548\u53D6\u51B3\u4E8E\u8BBE\u5907\u672C\u8EAB\u7684\u5B57\u4F53\u5E93,\u6CA1\u6709\u7F51\u7EDC\u52A0\u8F7D\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <div id=\"").concat(eleIds.settingsCtrl, "\" style=\"margin: 0.6em 0;\"></div>\n                <textarea id=\"").concat(eleIds.settingsText, "\" style=\"display: none;resize: vertical;width: 100%\" rows=\"20\"\n                    is=\"emby-textarea\" class=\"txtOverview emby-textarea\"></textarea>\n            </div>\n        </div>\n    ");
    container.innerHTML = template.trim();
    getById(eleIds.danmakuSwitchDiv, container).prepend(embyButton({
      id: eleIds.danmakuSwitch,
      label: '弹幕开关',
      iconKey: lsGetItem(lsKeys.switch.id) ? iconKeys.switch_on : iconKeys.switch_off,
      style: (lsGetItem(lsKeys.switch.id) ? 'color:#52b54b;' : '') + 'font-size:1.5em;padding:0;'
    }, doDanmakuSwitch$1));
    getById(eleIds.filterLevelDiv, container).append(embySlider({
      lsKey: lsKeys.filterLevel
    }, onSliderChange$1, onSliderChangeLabel$1));
    getById(eleIds.heightPercentDiv, container).append(embySlider({
      lsKey: lsKeys.heightPercent
    }, onSliderChange$1, onSliderChangeLabel$1));
    getById(eleIds.danmakuSizeDiv, container).append(embySlider({
      lsKey: lsKeys.fontSizeRate
    }, onSliderChange$1, onSliderChangeLabel$1));
    getById(eleIds.danmakuOpacityDiv, container).append(embySlider({
      lsKey: lsKeys.fontOpacity
    }, onSliderChange$1, onSliderChangeLabel$1));
    getById(eleIds.danmakuSpeedDiv, container).append(embySlider({
      lsKey: lsKeys.speed
    }, onSliderChange$1, onSliderChangeLabel$1));
    var btnContainer = getById(eleIds.timelineOffsetDiv, container);
    var nextEle = btnContainer === null || btnContainer === void 0 ? void 0 : btnContainer.nextElementSibling;
    var labelEle = (nextEle === null || nextEle === void 0 || (_nextEle$children = nextEle.children) === null || _nextEle$children === void 0 ? void 0 : _nextEle$children.length) > 0 ? nextEle.children[0] : nextEle;
    var timelineOffsetOpts = {
      lsKey: lsKeys.timelineOffset,
      labelEle: labelEle
    };
    onSliderChangeLabel$1(lsGetItem(lsKeys.timelineOffset.id), timelineOffsetOpts);
    timeOffsetBtns.forEach(function (btn) {
      btnContainer === null || btnContainer === void 0 || btnContainer.append(embyButton(btn, function (e) {
        if (e.target) {
          var oldValue = lsGetItem(lsKeys.timelineOffset.id);
          var newValue = oldValue + (parseFloat(e.target.getAttribute('valueOffset')) || 0);
          if (newValue === oldValue) newValue = 0;
          onSliderChange$1(newValue, timelineOffsetOpts);
        }
      }));
    });
    buildFontStyleSetting(container);
    buildSettingsBackup(container);
  }

  /**
   * 播放 OSD 显示/隐藏事件
   */

  /**
   * 播放界面右下角显示弹幕信息（弹幕：xxx条 / 未匹配）
   * 从 ede.js 4116-4140 行迁移
   * @param {number} [loadSum] - 已加载弹幕数量，不传时从 window.ede 计算
   */
  function appendvideoOsdDanmakuInfo(loadSum) {
    var _window$ede;
    if (!lsGetItem(lsKeys.osdTitleEnable.id)) return;
    var episode_info = ((_window$ede = window.ede) === null || _window$ede === void 0 ? void 0 : _window$ede.episode_info) || {};
    var episodeId = episode_info.episodeId,
      animeTitle = episode_info.animeTitle,
      episodeTitle = episode_info.episodeTitle;
    var videoOsdContainer = document.querySelector("".concat(mediaContainerQueryStr, " .videoOsdSecondaryText"));
    var videoOsdDanmakuTitle = getById(eleIds.videoOsdDanmakuTitle, videoOsdContainer);
    if (!videoOsdDanmakuTitle) {
      videoOsdDanmakuTitle = document.createElement('h3');
      videoOsdDanmakuTitle.id = eleIds.videoOsdDanmakuTitle;
      videoOsdDanmakuTitle.classList.add(classes.videoOsdTitle);
      videoOsdDanmakuTitle.style.cssText = 'margin-left: auto; white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word; position: absolute; right: 0px; bottom: 0px;';
    }
    var text = '弹幕：';
    if (episodeId) {
      var count = loadSum !== null && loadSum !== void 0 ? loadSum : window.ede ? getDanmakuComments(window.ede).length : 0;
      text += "".concat(animeTitle, " - ").concat(episodeTitle, " - ").concat(count, "\u6761");
    } else {
      text += '未匹配';
    }
    videoOsdDanmakuTitle.innerText = text;
    if (videoOsdContainer) {
      videoOsdContainer.append(videoOsdDanmakuTitle);
    }
  }
  function addHeaderClock() {
    var _window$ede2;
    var warpper = getByClass('headerMiddle');
    var headerClockEle = getById('headerClock');
    if (!warpper) return;
    if (headerClockEle) headerClockEle.remove();
    var clockElement = document.createElement('div');
    clockElement.id = 'headerClock';
    warpper.append(clockElement);
    function updateClock() {
      clockElement.textContent = new Date().toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }
    updateClock();
    var intervalId = setInterval(updateClock, 1000);
    if ((_window$ede2 = window.ede) !== null && _window$ede2 !== void 0 && _window$ede2.destroyIntervalIds) {
      window.ede.destroyIntervalIds.push(intervalId);
    }
  }
  function removeHeaderClock() {
    var headerClockEle = getById('headerClock');
    if (headerClockEle) headerClockEle.remove();
    destroyAllInterval();
  }
  function onVideoOsdShow(e) {
    console.log(e === null || e === void 0 ? void 0 : e.type, e);
    if (lsGetItem(lsKeys.osdLineChartEnable.id)) {
      buildProgressBarChart(20);
    }
    if (lsGetItem(lsKeys.osdHeaderClockEnable.id)) {
      addHeaderClock();
    }
    // 播放界面右下角弹幕信息：OSD 显示时刷新，解决新视频播放时 .videoOsdSecondaryText 尚未渲染导致未展示的问题
    if (lsGetItem(lsKeys.osdTitleEnable.id)) {
      appendvideoOsdDanmakuInfo();
    }
  }
  function onVideoOsdHide(e) {
    console.log(e === null || e === void 0 ? void 0 : e.type, e);
    if (lsGetItem(lsKeys.osdHeaderClockEnable.id)) {
      removeHeaderClock();
    }
  }

  /**
   * Bangumi API 相关
   * 从 ede.js 迁移，未修改原有实现逻辑
   */

  /**
   * 修正 Bangumi 集数索引（番剧非第一季时）
   * @param {number} currentBgmEpisodeIndex
   * @param {object} danDanPlayBangumi
   * @returns {number}
   */
  function offsetBgmEpisodeIndex(currentBgmEpisodeIndex, danDanPlayBangumi) {
    if (!danDanPlayBangumi) {
      return currentBgmEpisodeIndex;
    }
    var bangumiEp = danDanPlayBangumi.episodes[currentBgmEpisodeIndex];
    if (!bangumiEp) {
      console.log("\u672A\u5339\u914D\u5230 danDanPlayBangumi \u756A\u5267\u96C6\u6570,\u5267\u96C6\u4E0D\u4E3A\u7B2C\u4E00\u5B63,\u5C1D\u8BD5\u5207\u6362\u63A5\u53E3\u6570\u636E\u5339\u914D\u8FD4\u56DE\u4FEE\u6B63\u540E\u7684 bgmEpisodeIndex");
      return danDanPlayBangumi.episodes.findIndex(function (ep) {
        return ep.episodeNumber == currentBgmEpisodeIndex + 1;
      });
    } else {
      return currentBgmEpisodeIndex;
    }
  }

  /**
   * 获取当前集对应的 Bangumi 关联信息
   * @returns {Promise<object>}
   */
  async function getEpisodeBangumiRel() {
    var episode_info = window.ede.episode_info;
    var _bangumi_key = lsLocalKeys.bangumiEpInfoPrefix + episode_info.episodeId;
    var bangumiInfoLs = localStorage.getItem(_bangumi_key);
    if (bangumiInfoLs) {
      bangumiInfoLs = JSON.parse(bangumiInfoLs);
    }
    var bangumiEpsRes = bangumiInfoLs ? bangumiInfoLs.bangumiEpsRes : null;
    var subjectId = bangumiInfoLs ? bangumiInfoLs.subjectId : null;
    var bangumiUrl = bangumiInfoLs ? bangumiInfoLs.bangumiUrl : null;
    var animeId = episode_info.animeId;
    if (!subjectId) {
      if (!animeId) {
        throw new Error('未获取到 animeId');
      }
      var danDanPlayBangumiRes = await fetchJson(dandanplayApi.getBangumi(animeId));
      episode_info.bgmEpisodeIndex = offsetBgmEpisodeIndex(episode_info.bgmEpisodeIndex, danDanPlayBangumiRes.bangumi);
      bangumiUrl = danDanPlayBangumiRes.bangumi.bangumiUrl;
      if (!bangumiUrl) {
        throw new Error('未请求到 bangumiUrl');
      }
      subjectId = parseInt(bangumiUrl.match(/\/(\d+)$/)[1]);
    }
    var episodeIndex = episode_info ? episode_info.episodeIndex : null;
    var bgmEpisodeIndex = episode_info ? episode_info.bgmEpisodeIndex : null;
    var bangumiInfo = {
      animeId: animeId,
      bangumiUrl: bangumiUrl,
      subjectId: subjectId,
      episodeIndex: episodeIndex,
      bgmEpisodeIndex: bgmEpisodeIndex,
      bangumiEpsRes: bangumiEpsRes,
      _bangumi_key: _bangumi_key
    };
    window.ede.bangumiInfo = bangumiInfo;
    localStorage.setItem(bangumiInfo._bangumi_key, JSON.stringify(bangumiInfo));
    return bangumiInfo;
  }

  /**
   * 提交 Bangumi 章节收藏状态为「看过」
   * @param {string} token - Bangumi 个人令牌
   * @returns {Promise<object>}
   */
  async function putBangumiEpStatus(token) {
    var bangumiInfo = await getEpisodeBangumiRel();
    var subjectId = bangumiInfo.subjectId,
      bgmEpisodeIndex = bangumiInfo.bgmEpisodeIndex;
    var episodeIndex = bgmEpisodeIndex ? bgmEpisodeIndex : bangumiInfo.episodeIndex;
    console.log('准备校验 Bangumi 条目收藏状态是否为看过');
    var bangumiMe = localStorage.getItem(lsLocalKeys.bangumiMe);
    if (bangumiMe) {
      bangumiMe = JSON.parse(bangumiMe);
    } else {
      bangumiMe = await fetchBangumiApiGetMe(token);
    }
    var msg = '';
    var bangumiUserColl = null;
    try {
      bangumiUserColl = await fetchJson(bangumiApi.getUserCollection(bangumiMe.username, subjectId), {
        token: token
      });
    } catch (error) {
      console.warn('Bangumi 条目未收藏');
    }
    if (bangumiUserColl && bangumiUserColl.type === 2) {
      msg = 'Bangumi 条目已为看过状态,跳过更新';
      console.log(msg, bangumiUserColl);
      throw new Error(msg);
    }
    console.log('准备修改 Bangumi 条目收藏状态为在看, 如果不存在则创建, 如果存在则修改');
    var body = {
      type: 3
    };
    await fetchJson(bangumiApi.postUserCollection(subjectId), {
      token: token,
      body: body
    });
    if (!bangumiInfo.bangumiEpsRes) {
      var fetchUrl = bangumiApi.getUserSubjectEpisodeCollection(subjectId);
      var bangumiEpsRes = await fetchJson(fetchUrl, {
        token: token
      });
      bangumiInfo.bangumiEpsRes = bangumiEpsRes;
      var _bangumiEpColl = bangumiEpsRes.data[episodeIndex];
      if (!_bangumiEpColl) {
        throw new Error('未匹配到 bangumiEpColl');
      }
    }
    var bangumiEpColl = bangumiInfo.bangumiEpsRes.data[episodeIndex];
    var bangumiEp = bangumiEpColl.episode;
    if (bangumiEpColl.type === 2) {
      msg = 'Bangumi 章节收藏已是看过状态,跳过更新';
      console.log(msg, bangumiEp);
      throw new Error(msg);
    }
    console.log('准备更新 Bangumi 章节收藏状态, 详情: ', bangumiEp);
    body.type = 2;
    await fetchJson(bangumiApi.putUserEpisodeCollection(bangumiEp.id), {
      token: token,
      body: body,
      method: 'PUT'
    });
    bangumiEp.type = body.type;
    console.log("\u6210\u529F\u66F4\u65B0 Bangumi \u7AE0\u8282\u6536\u85CF\u72B6\u6001, \u5728\u770B => \u770B\u8FC7, \u8BE6\u60C5: ", bangumiEp);
    window.ede.bangumiInfo = bangumiInfo;
    localStorage.setItem(bangumiInfo._bangumi_key, JSON.stringify(bangumiInfo));
    return bangumiInfo;
  }

  /**
   * 验证 Bangumi Token 并获取用户信息
   * @param {string} bangumiToken
   * @returns {Promise<object>}
   */
  async function fetchBangumiApiGetMe(bangumiToken) {
    try {
      var res = await fetchJson(bangumiApi.getMe(), {
        token: bangumiToken
      });
      console.log('Bangumi Token 验证成功', res);
      localStorage.setItem(lsLocalKeys.bangumiMe, JSON.stringify(res));
      return res;
    } catch (error) {
      console.error('Bangumi Token 验证失败', error);
      throw error;
    }
  }

  /**
   * Bangumi 角色展示
   * 从 ede.js buildExtInfo 中拆出，未修改原有实现逻辑
   */

  /**
   * 渲染 Bangumi 角色与声优信息
   * @param {HTMLElement} container - 容器元素
   * @param {Array} characters - 角色数据数组
   */
  function renderBangumiCharacters(container, characters) {
    characters.map(function (c) {
      var characterDiv = document.createElement('div');
      characterDiv.style = 'width: 31%; display: flex; margin: .5em;';
      var embyImgButtonInner = embyImg(c.images.large, 'object-position: top;');
      if (!c.images.large) {
        embyImgButtonInner = embyI(iconKeys.person, classes.cardImageIcon);
      }
      characterDiv.append(embyImgButton(embyImgButtonInner));
      var characterRightDiv = document.createElement('div');
      characterRightDiv.style.marginLeft = '.5em';
      var characterNameDiv = document.createElement('div');
      characterNameDiv.textContent = c.relation + ': ' + c.name;
      characterRightDiv.append(characterNameDiv);
      var characterCvDiv = document.createElement('div');
      characterCvDiv.textContent = 'CV: ' + c.actors.map(function (a) {
        return a.name;
      }).join();
      if (c.actors[0]) {
        characterCvDiv.append(embyImgButton(embyImg(c.actors[0].images.large)));
      }
      characterRightDiv.append(characterCvDiv);
      characterDiv.append(characterRightDiv);
      container.append(characterDiv);
    });
  }

  /**
   * 弹幕信息 Tab
   * 从 ede.js 迁移
   */

  /**
   * 构建弹幕信息 Tab
   * @param {string} containerId
   */
  function buildCurrentDanmakuInfo(containerId) {
    var _window$ede, _window$ede2;
    var container = getById(containerId);
    if (!container) return;
    var episode_info = ((_window$ede = window.ede) === null || _window$ede === void 0 ? void 0 : _window$ede.episode_info) || {};
    var episodeTitle = episode_info.episodeTitle,
      animeId = episode_info.animeId,
      animeTitle = episode_info.animeTitle;
      episode_info.apiName;
    var loadSum = window.ede ? getDanmakuComments(window.ede).length : 0;
    var downloadSum = ((_window$ede2 = window.ede) === null || _window$ede2 === void 0 || (_window$ede2 = _window$ede2.commentsParsed) === null || _window$ede2 === void 0 ? void 0 : _window$ede2.length) || 0;
    var template = "\n        <div style=\"display: flex;\">\n            <div id=\"".concat(eleIds.posterImgDiv, "\"></div>\n            <div>\n                <div>\n                    <label class=\"").concat(classes.embyLabel, "\">\u5A92\u4F53\u540D: </label>\n                    <div class=\"").concat(classes.embyFieldDesc, "\">").concat(animeTitle || '-', "</div>\n                </div>\n                ").concat(episodeTitle ? "<div><label class=\"".concat(classes.embyLabel, "\">\u7AE0\u8282\u540D: </label><div class=\"").concat(classes.embyFieldDesc, "\">").concat(episodeTitle, "</div></div>") : '', "\n                <div>\n                    <label class=\"").concat(classes.embyLabel, "\">\u5176\u5B83\u4FE1\u606F: </label>\n                    <div class=\"").concat(classes.embyFieldDesc, "\">\u83B7\u53D6\u603B\u6570: ").concat(downloadSum, ", \u52A0\u8F7D\u603B\u6570: ").concat(loadSum, ", \u88AB\u8FC7\u6EE4\u6570: ").concat(downloadSum - loadSum, "</div>\n                </div>\n            </div>\n        </div>\n        <div style=\"margin-top: 2%;\">\n            <label class=\"").concat(classes.embyLabel, "\">").concat(lsKeys.danmuList.name, ": </label>\n            <div id=\"").concat(eleIds.danmuListDiv, "\" style=\"margin: 1% 0;\"></div>\n        </div>\n        <div id=\"").concat(eleIds.extInfoCtrlDiv, "\" style=\"margin: 0.6em 0;\"></div>\n        <div id=\"").concat(eleIds.extInfoDiv, "\" hidden>\n            <label class=\"").concat(classes.embyLabel, "\">Bangumi \u89D2\u8272\u4ECB\u7ECD: </label>\n            <div id=\"").concat(eleIds.characterImgHeihtDiv, "\" style=\"width: 36.5em; text-align: center;\"></div>\n            <div id=\"").concat(eleIds.charactersDiv, "\" style=\"display: flex; flex-wrap: wrap;\"></div>\n        </div>\n    ");
    container.innerHTML = template.trim();
    if (animeId) {
      getById(eleIds.posterImgDiv, container).append(embyImgButton(embyImg(dandanplayApi.posterImg(animeId)), 'width: calc((var(--videoosd-tabs-height) - 3em) * (2 / 3)); margin-right: 1em;'));
    }
    buildDanmuListDiv(container);
    buildExtInfo(container);
  }
  function buildDanmuListDiv(container) {
    var _window$ede3, _window$ede4;
    var episodeId = (_window$ede3 = window.ede) === null || _window$ede3 === void 0 || (_window$ede3 = _window$ede3.episode_info) === null || _window$ede3 === void 0 ? void 0 : _window$ede3.episodeId;
    var extCommentCache = ((_window$ede4 = window.ede) === null || _window$ede4 === void 0 || (_window$ede4 = _window$ede4.extCommentCache) === null || _window$ede4 === void 0 ? void 0 : _window$ede4[window.ede.itemId]) || {};
    var danmuListExts = Object.values(extCommentCache).map(function (value, index) {
      return {
        id: "ext".concat(index + 1),
        name: "\u9644\u52A0".concat(index + 1),
        onChange: function onChange() {
          return danmakuParser(value);
        }
      };
    });
    var danmuListTabOpts = danmuListOpts;
    if (danmuListExts.length > 0) {
      var dandanplayListOpt = {
        id: 'dandanplay',
        name: '弹弹 play',
        onChange: function onChange() {
          var _window$ede5;
          var comments = (_window$ede5 = window.ede) === null || _window$ede5 === void 0 || (_window$ede5 = _window$ede5.danmuCache) === null || _window$ede5 === void 0 ? void 0 : _window$ede5[episodeId];
          return comments ? danmakuParser(comments) : [];
        }
      };
      danmuListTabOpts = danmuListTabOpts.concat(dandanplayListOpt).concat(danmuListExts);
    }
    getById(eleIds.danmuListDiv, container).append(embyTabs(danmuListTabOpts, lsKeys.danmuList.defaultValue, 'id', 'name', function () {}));
  }
  function buildExtInfo(container) {
    var extInfoCtrlDiv = getById(eleIds.extInfoCtrlDiv, container);
    extInfoCtrlDiv.append(embyButton({
      label: '额外信息',
      iconKey: iconKeys.more
    }, function (e) {
      var _window$ede6, _window$ede7;
      var xChecked = !e.target.xChecked;
      e.target.xChecked = xChecked;
      e.target.title = xChecked ? '关闭' : '额外信息';
      e.target.firstChild.innerHTML = xChecked ? iconKeys.close : iconKeys.more;
      var extInfoDiv = getById(eleIds.extInfoDiv);
      extInfoDiv.hidden = !xChecked;
      var charactersDiv = getById(eleIds.charactersDiv);
      if (charactersDiv.firstChild) return;
      var bangumiInfo = (_window$ede6 = window.ede) === null || _window$ede6 === void 0 ? void 0 : _window$ede6.bangumiInfo;
      if (bangumiInfo !== null && bangumiInfo !== void 0 && bangumiInfo.characters && bangumiInfo.animeId === ((_window$ede7 = window.ede) === null || _window$ede7 === void 0 || (_window$ede7 = _window$ede7.episode_info) === null || _window$ede7 === void 0 ? void 0 : _window$ede7.animeId)) {
        return renderBangumiCharacters(charactersDiv, bangumiInfo.characters);
      }
      getEpisodeBangumiRel().then(function (bangumiInfo) {
        return fetchJson(bangumiApi.getCharacters(bangumiInfo.subjectId));
      }).then(function (characters) {
        if (window.ede.bangumiInfo) window.ede.bangumiInfo.characters = characters;
        renderBangumiCharacters(charactersDiv, characters);
      }).catch(function (err) {
        return console.error(err);
      });
    }));
  }

  var createDanmakuHooks$1 = {
    buildCurrentDanmakuInfo: buildCurrentDanmakuInfo,
    appendvideoOsdDanmakuInfo: appendvideoOsdDanmakuInfo
  };
  async function doDanmakuSearchEpisode() {
    var _allAnimes$selectAnim;
    var embySearch = getById(eleIds.danmakuSearchName);
    if (!embySearch) return;
    var searchName = embySearch.value.trim();
    var danmakuRemarkEle = getById(eleIds.danmakuRemark);
    if (danmakuRemarkEle) {
      danmakuRemarkEle.parentNode.hidden = false;
      danmakuRemarkEle.innerText = searchName ? '' : '请填写标题';
    }
    var spinnerEle = getByClass(classes.mdlSpinner);
    if (spinnerEle) spinnerEle.classList.remove('hide');
    var apiPriority = lsGetItem(lsKeys.apiPriority.id);
    var apiConfigs = {
      official: {
        name: '官方API',
        prefix: corsProxy + 'https://api.dandanplay.net/api/v2',
        enabled: lsGetItem(lsKeys.useOfficialApi.id)
      },
      custom: {
        name: '自定义API',
        prefix: lsGetItem(lsKeys.customApiPrefix.id),
        enabled: lsGetItem(lsKeys.useCustomApi.id)
      }
    };
    var allAnimes = [];
    var _iterator = _createForOfIteratorHelper(apiPriority),
      _step;
    try {
      var _loop = async function _loop() {
        var apiKey = _step.value;
        var config = apiConfigs[apiKey];
        if (!config || !config.enabled || apiKey === 'custom' && !config.prefix) return 1; // continue
        var manualSearchTitle = searchName;
        var manualSearchEpisode = null;
        if (apiKey === 'official') {
          var parsed = parseAnimeName(searchName);
          if (parsed.season !== null) {
            manualSearchTitle = parsed.season === 1 ? parsed.title : "".concat(parsed.title, " \u7B2C").concat(parsed.season, "\u5B63");
            manualSearchEpisode = parsed.episode;
            console.log("[\u624B\u52A8\u5339\u914D][\u5B98\u65B9API\u4F18\u5316] \u683C\u5F0F\u5316\u641C\u7D22: \u6807\u9898='".concat(manualSearchTitle, "', \u96C6\u6570=").concat(manualSearchEpisode));
          }
        }
        console.log("[\u624B\u52A8\u5339\u914D][".concat(config.name, "] \u6B63\u5728\u641C\u7D22: \u6807\u9898='").concat(manualSearchTitle, "', \u96C6\u6570=").concat(manualSearchEpisode || '无'));
        var animaInfo = await fetchSearchEpisodes(manualSearchTitle, manualSearchEpisode, config.prefix);
        if (animaInfo && animaInfo.animes.length > 0) {
          console.log("[\u624B\u52A8\u5339\u914D][".concat(config.name, "] \u641C\u7D22\u6210\u529F\uFF0C\u627E\u5230 ").concat(animaInfo.animes.length, " \u4E2A\u7ED3\u679C\u3002"));
          animaInfo.animes.forEach(function (anime) {
            anime.apiPrefix = config.prefix;
            anime.apiName = config.name;
          });
          allAnimes.push.apply(allAnimes, _toConsumableArray(animaInfo.animes));
        } else {
          console.log("[\u624B\u52A8\u5339\u914D][".concat(config.name, "] \u672A\u627E\u5230\u7ED3\u679C\u3002"));
        }
      };
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        if (await _loop()) continue;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (spinnerEle) spinnerEle.classList.add('hide');
    if (allAnimes.length < 1) {
      if (danmakuRemarkEle) danmakuRemarkEle.innerText = '搜索结果为空';
      var _switchBtn = getById(eleIds.danmakuSwitchEpisode);
      if (_switchBtn) _switchBtn.disabled = true;
      var _episodeFlag = getById(eleIds.danmakuEpisodeFlag);
      if (_episodeFlag) _episodeFlag.hidden = true;
      return;
    }
    if (danmakuRemarkEle) danmakuRemarkEle.innerText = '';
    var danmakuAnimeDiv = getById(eleIds.danmakuAnimeDiv);
    var danmakuEpisodeNumDiv = getById(eleIds.danmakuEpisodeNumDiv);
    if (!danmakuAnimeDiv || !danmakuEpisodeNumDiv) return;
    danmakuAnimeDiv.innerHTML = '';
    danmakuEpisodeNumDiv.innerHTML = '';
    window.ede.searchDanmakuOpts.animes = allAnimes;
    var selectAnimeIdx = allAnimes.findIndex(function (anime) {
      return anime.animeId == window.ede.searchDanmakuOpts.animeId;
    });
    selectAnimeIdx = selectAnimeIdx !== -1 ? selectAnimeIdx : 0;
    var animeSelect = embySelect({
      id: eleIds.danmakuAnimeSelect,
      label: '剧集: ',
      style: 'width: auto;max-width: 100%;'
    }, selectAnimeIdx, allAnimes, 'animeId', function (opt) {
      return "".concat(opt.animeTitle, " \u7C7B\u578B\uFF1A").concat(opt.typeDescription, " \u6765\u6E90\uFF1A").concat(opt.apiName);
    }, doDanmakuAnimeSelect);
    danmakuAnimeDiv.append(animeSelect);
    var episodes = ((_allAnimes$selectAnim = allAnimes[selectAnimeIdx]) === null || _allAnimes$selectAnim === void 0 ? void 0 : _allAnimes$selectAnim.episodes) || [];
    var episodeNumSelect = embySelect({
      id: eleIds.danmakuEpisodeNumSelect,
      label: '集数: ',
      style: 'width: auto;max-width: 100%;'
    }, window.ede.searchDanmakuOpts.episode - 1, episodes, 'episodeId', function (opt, i) {
      return "".concat(i + 1, " - ").concat(opt.episodeTitle);
    });
    danmakuEpisodeNumDiv.append(episodeNumSelect);
    var episodeFlag = getById(eleIds.danmakuEpisodeFlag);
    if (episodeFlag) episodeFlag.hidden = false;
    var switchBtn = getById(eleIds.danmakuSwitchEpisode);
    if (switchBtn) switchBtn.disabled = false;
    var selectedAnime = allAnimes[selectAnimeIdx];
    var searchImg = getById(eleIds.searchImg);
    if (searchImg) searchImg.src = selectedAnime.imageUrl || dandanplayApi.posterImg(selectedAnime.animeId);
    var apiSourceDiv = getById(eleIds.searchApiSource);
    if (apiSourceDiv) apiSourceDiv.innerText = "\u6765\u6E90: ".concat(selectedAnime.apiName);
  }
  function doSearchTitleSwtich(e) {
    var searchInputEle = getById(eleIds.danmakuSearchName);
    var attrKey = 'isOriginalTitle';
    if ('1' === e.target.getAttribute(attrKey)) {
      e.target.setAttribute(attrKey, '0');
      searchInputEle.value = window.ede.searchDanmakuOpts.animeName;
      return;
    }
    var _window$ede$searchDan = window.ede.searchDanmakuOpts,
      _episode_key = _window$ede$searchDan._episode_key,
      seriesOrMovieId = _window$ede$searchDan.seriesOrMovieId;
    var episode_info = JSON.parse(localStorage.getItem(_episode_key) || '{}');
    var animeOriginalTitle = episode_info.animeOriginalTitle;
    if (animeOriginalTitle) {
      e.target.setAttribute(attrKey, '1');
      searchInputEle.value = animeOriginalTitle;
      return;
    }
    if (typeof ApiClient !== 'undefined') {
      ApiClient.getItem(ApiClient.getCurrentUserId(), seriesOrMovieId).then(function (item) {
        if (item !== null && item !== void 0 && item.OriginalTitle) {
          e.target.setAttribute(attrKey, '1');
          searchInputEle.value = item.OriginalTitle;
          episode_info.animeOriginalTitle = item.OriginalTitle;
          localStorage.setItem(_episode_key, JSON.stringify(episode_info));
          if (window.ede.episode_info) window.ede.episode_info.animeOriginalTitle = item.OriginalTitle;
        }
      });
    }
  }
  function doDanmakuAnimeSelect(value, index, option) {
    var numDiv = getById(eleIds.danmakuEpisodeNumDiv);
    if (!numDiv) return;
    numDiv.innerHTML = '';
    var anime = window.ede.searchDanmakuOpts.animes[index];
    var episodeNumSelect = embySelect({
      id: eleIds.danmakuEpisodeNumSelect,
      label: '集数: '
    }, 0, anime.episodes, 'episodeId', function (opt, i) {
      return "".concat(i + 1, " - ").concat(opt.episodeTitle);
    });
    episodeNumSelect.style.maxWidth = '100%';
    numDiv.append(episodeNumSelect);
    var searchImg = getById(eleIds.searchImg);
    if (searchImg) searchImg.src = anime.imageUrl || dandanplayApi.posterImg(anime.animeId);
    var apiSourceDiv = getById(eleIds.searchApiSource);
    if (apiSourceDiv) apiSourceDiv.innerText = "\u6765\u6E90: ".concat(anime.apiName);
  }
  function doDanmakuSwitchEpisode() {
    var animeSelect = getById(eleIds.danmakuAnimeSelect);
    var episodeNumSelect = getById(eleIds.danmakuEpisodeNumSelect);
    if (!animeSelect || !episodeNumSelect) return;
    var anime = window.ede.searchDanmakuOpts.animes[animeSelect.selectedIndex];
    var _window$ede$searchDan2 = window.ede.searchDanmakuOpts,
      _episode_key = _window$ede$searchDan2._episode_key,
      _season_key = _window$ede$searchDan2._season_key,
      seriesOrMovieId = _window$ede$searchDan2.seriesOrMovieId;
    var episodeInfo = {
      episodeId: episodeNumSelect.value,
      episodeTitle: episodeNumSelect.options[episodeNumSelect.selectedIndex].text,
      episodeIndex: episodeNumSelect.selectedIndex,
      bgmEpisodeIndex: episodeNumSelect.selectedIndex,
      animeId: anime.animeId,
      animeTitle: anime.animeTitle,
      animeOriginalTitle: '',
      imageUrl: anime.imageUrl,
      seriesOrMovieId: seriesOrMovieId,
      apiPrefix: anime.apiPrefix,
      apiName: anime.apiName
    };
    var seasonInfo = {
      name: anime.animeTitle,
      episodeOffset: episodeNumSelect.selectedIndex - window.ede.searchDanmakuOpts.episode
    };
    writeLsSeasonInfo(_season_key, seasonInfo);
    var useOfficialApi = lsGetItem(lsKeys.useOfficialApi.id);
    var useCustomApi = lsGetItem(lsKeys.useCustomApi.id);
    var apiPriority = lsGetItem(lsKeys.apiPriority.id);
    var enabledApis = apiPriority.filter(function (apiKey) {
      if (apiKey === 'official') return useOfficialApi;
      if (apiKey === 'custom') return useCustomApi;
      return false;
    });
    var unique_episode_key = lsLocalKeys.apiPrefix + "".concat(enabledApis.join('_'), "_") + _episode_key;
    localStorage.setItem(unique_episode_key, JSON.stringify(episodeInfo));
    if (window.ede.episode_info) {
      Object.assign(window.ede.episode_info, episodeInfo);
    } else {
      window.ede.episode_info = episodeInfo;
    }
    window.ede.previous_episode_info = _objectSpread2({}, window.ede.episode_info);
    console.log('手动匹配成功，已加载新弹幕信息:', episodeInfo);
    loadDanmaku(LOAD_TYPE.RELOAD);
    closeEmbyDialog();
  }
  function bindManualMatchButtons() {
    var btnClearCache = getById(eleIds.clearLocalMatchCacheBtn);
    if (!btnClearCache) return;
    btnClearCache.addEventListener('click', function () {
      var prefixesToClear = [lsLocalKeys.animeEpisodePrefix, lsLocalKeys.animeSeasonPrefix, lsLocalKeys.animePrefix, lsLocalKeys.bangumiEpInfoPrefix, lsLocalKeys.bangumiMe, lsLocalKeys.apiPrefix];
      lsBatchRemove(prefixesToClear);
      if (window.ede.episode_info) {
        window.ede.episode_info.episodeId = null;
        window.ede.episode_info.animeId = null;
        window.ede.episode_info.animeTitle = null;
        window.ede.episode_info.episodeTitle = null;
      }
      if (window.ede.searchDanmakuOpts) {
        window.ede.searchDanmakuOpts.animes = [];
        window.ede.searchDanmakuOpts.episodes = [];
      }
      embyToast({
        text: '本地匹配缓存已清除,包括animeId、episodeId等所有匹配信息'
      });
      loadDanmaku(LOAD_TYPE.REFRESH);
    });
  }
  function buildSearchEpisodeEle() {
    var _window$ede$searchDan3;
    var searchNameDiv = getById(eleIds.danmakuSearchNameDiv);
    if (!searchNameDiv) return;
    searchNameDiv.append(embyInput({
      id: eleIds.danmakuSearchName,
      value: ((_window$ede$searchDan3 = window.ede.searchDanmakuOpts) === null || _window$ede$searchDan3 === void 0 ? void 0 : _window$ede$searchDan3.animeName) || '',
      type: 'search'
    }, doDanmakuSearchEpisode));
    searchNameDiv.append(embyButton({
      label: '搜索',
      iconKey: iconKeys.search
    }, doDanmakuSearchEpisode));
    searchNameDiv.append(embyButton({
      label: '切换[原]标题',
      iconKey: iconKeys.text_format
    }, doSearchTitleSwtich));
    var episodeLoad = getById(eleIds.danmakuEpisodeLoad);
    if (episodeLoad) {
      episodeLoad.append(embyButton({
        id: eleIds.danmakuSwitchEpisode,
        label: '加载弹幕',
        iconKey: iconKeys.done
      }, doDanmakuSwitchEpisode));
    }
    var currentMatchedDiv = getById(eleIds.currentMatchedDiv);
    if (currentMatchedDiv) {
      currentMatchedDiv.append(embyButton({
        label: '取消匹配/清空弹幕',
        iconKey: iconKeys.close
      }, function () {
        var _window$ede$episode_i;
        if ((_window$ede$episode_i = window.ede.episode_info) !== null && _window$ede$episode_i !== void 0 && _window$ede$episode_i.episodeId) {
          window.ede.episode_info.episodeId = null;
        }
        if (window.ede.danmaku) {
          createDanmaku([], createDanmakuHooks$1);
        }
        var label = currentMatchedDiv.querySelector('label');
        if (label) label.textContent = '弹弹 play 总量: 0';
      }));
    }
  }
  function buildExtUrlsDiv() {
    var _window$ede$episode_i2, _window$ede$danmuCach, _window$ede$extCommen;
    var episodeId = ((_window$ede$episode_i2 = window.ede.episode_info) === null || _window$ede$episode_i2 === void 0 ? void 0 : _window$ede$episode_i2.episodeId) || null;
    var comments = ((_window$ede$danmuCach = window.ede.danmuCache) === null || _window$ede$danmuCach === void 0 ? void 0 : _window$ede$danmuCach[episodeId]) || [];
    var curExtCommentCache = ((_window$ede$extCommen = window.ede.extCommentCache) === null || _window$ede$extCommen === void 0 ? void 0 : _window$ede$extCommen[window.ede.itemId]) || {};
    var allComments = comments.concat.apply(comments, _toConsumableArray(Object.values(curExtCommentCache)));
    var extUrlsDiv = getById(eleIds.extUrlsDiv);
    if (!extUrlsDiv) return;
    extUrlsDiv.innerHTML = '';
    objectEntries(curExtCommentCache).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        val = _ref2[1];
      var extUrlDiv = document.createElement('div');
      extUrlDiv.append(embyButton({
        label: '清空此加载',
        iconKey: iconKeys.close
      }, function (e) {
        delete curExtCommentCache[key];
        e.target.parentNode.remove();
        createDanmaku(allComments.filter(function (c) {
          return c.fromUrl !== key;
        }), createDanmakuHooks$1);
      }));
      extUrlDiv.append(embyALink(key), document.createTextNode(" \u603B\u91CF: ".concat(val.length)));
      extUrlsDiv.append(extUrlDiv);
    });
  }
  async function onEnterExtComment(e) {
    var extUrl = getTargetInput(e).value.trim();
    if (!extUrl.startsWith('http')) {
      embyToast({
        text: '输入的 url 应以 http 开头!'
      });
      return;
    }
    addExtComments(extUrl);
  }
  async function addExtComments(extUrl, extComments) {
    var _window$ede$danmuCach2;
    var episode_info = window.ede.episode_info;
    var episodeId = (episode_info === null || episode_info === void 0 ? void 0 : episode_info.episodeId) || null;
    var comments = ((_window$ede$danmuCach2 = window.ede.danmuCache) === null || _window$ede$danmuCach2 === void 0 ? void 0 : _window$ede$danmuCach2[episodeId]) || [];
    if (!extComments) {
      extComments = await fetchExtcommentActual(extUrl, comments);
    }
    if (extComments.length === 0) {
      embyToast({
        text: '附加弹幕不能为空!'
      });
      return;
    }
    var allComments = comments.concat(extComments);
    createDanmaku(allComments, createDanmakuHooks$1).then(function () {
      var beforeLength = window.ede.commentsParsed.length - extComments.length;
      embyToast({
        text: "\u6B64\u6B21\u9644\u52A0\u603B\u91CF: ".concat(extComments.length, ", \u9644\u52A0\u524D\u603B\u91CF: ").concat(beforeLength, ", \u9644\u52A0\u540E\u603B\u91CF: ").concat(allComments.length)
      });
      console.log("\u9644\u52A0\u5F39\u5E55\u5C31\u4F4D, \u9644\u52A0\u524D\u603B\u91CF: ".concat(beforeLength));
      buildExtUrlsDiv();
    }).catch(function (err) {
      return console.log(err);
    });
  }
  function buildExtCommentDiv() {
    var extCommentSearchDiv = getById(eleIds.extCommentSearchDiv);
    if (!extCommentSearchDiv) return;
    buildExtUrlsDiv();
    extCommentSearchDiv.append(embyInput({
      type: 'search',
      placeholder: 'http(s)://'
    }, onEnterExtComment));
    extCommentSearchDiv.append(embyButton({
      label: '搜索',
      iconKey: iconKeys.search
    }, onEnterExtComment));
  }
  function buildDanmuPluginDiv() {
    var danmuPluginDiv = getById(eleIds.danmuPluginDiv);
    if (!danmuPluginDiv) return;
    danmuPluginDiv.append(embyCheckbox({
      id: lsKeys.useFetchPluginXml.id,
      name: lsKeys.useFetchPluginXml.id,
      label: lsKeys.useFetchPluginXml.name
    }, lsGetItem(lsKeys.useFetchPluginXml.id), function (checked) {
      return lsSetItem(lsKeys.useFetchPluginXml.id, checked);
    }));
  }
  function buildCustomApiDiv() {
    var apiCheckboxListDiv = getById(eleIds.apiCheckboxListDiv);
    if (!apiCheckboxListDiv) return;
    apiCheckboxListDiv.append(embyCheckbox({
      id: lsKeys.useOfficialApi.id,
      name: lsKeys.useOfficialApi.id,
      label: lsKeys.useOfficialApi.name
    }, lsGetItem(lsKeys.useOfficialApi.id), function (checked) {
      return lsSetItem(lsKeys.useOfficialApi.id, checked);
    }));
    apiCheckboxListDiv.append(embyCheckbox({
      id: lsKeys.useCustomApi.id,
      name: lsKeys.useCustomApi.id,
      label: lsKeys.useCustomApi.name
    }, lsGetItem(lsKeys.useCustomApi.id), function (checked) {
      return lsSetItem(lsKeys.useCustomApi.id, checked);
    }));
    var apiPriorityDiv = getById(eleIds.apiPriorityDiv);
    if (apiPriorityDiv) {
      apiPriorityDiv.append(embyTabs(apiPriorityOpts, lsGetItem(lsKeys.apiPriority.id)[0], 'id', 'name', function (value, tabIndex) {
        var currentPriority = lsGetItem(lsKeys.apiPriority.id);
        var apiPriorityArr = apiPriorityOpts.map(function (opt) {
          return opt.id;
        });
        var newPriority = currentPriority[0] === apiPriorityArr[1] ? [apiPriorityArr[0], apiPriorityArr[1]] : [apiPriorityArr[1], apiPriorityArr[0]];
        lsSetItem(lsKeys.apiPriority.id, newPriority);
        console.log('[API优先级] 切换为:', newPriority[0] === apiPriorityOpts[0].id ? apiPriorityOpts[0].name : apiPriorityOpts[1].name);
      }));
    }
    var customApiPrefixInputDiv = getById(eleIds.customApiPrefixInputDiv);
    if (customApiPrefixInputDiv) {
      customApiPrefixInputDiv.append(embyInput({
        id: 'customApiPrefixInput',
        value: lsGetItem(lsKeys.customApiPrefix.id) || '',
        type: 'search'
      }, null, function (e) {
        var val = e.target.value.trim();
        lsSetItem(lsKeys.customApiPrefix.id, val);
        embyToast({
          text: '自定义API地址已保存',
          secondaryText: val
        });
      }));
    }
  }

  /**
   * 构建手动匹配 Tab
   * @param {string} containerId
   */
  function buildSearchEpisode(containerId) {
    var _window$ede, _window$ede2;
    var container = getById(containerId);
    if (!container) return;
    var episodeId = ((_window$ede = window.ede) === null || _window$ede === void 0 || (_window$ede = _window$ede.episode_info) === null || _window$ede === void 0 ? void 0 : _window$ede.episodeId) || null;
    var comments = ((_window$ede2 = window.ede) === null || _window$ede2 === void 0 || (_window$ede2 = _window$ede2.danmuCache) === null || _window$ede2 === void 0 ? void 0 : _window$ede2[episodeId]) || [];
    var template = "\n        <div>\n            <div>\n                <label class=\"".concat(classes.embyLabel, "\">\u6807\u9898: </label>\n                <div id=\"").concat(eleIds.danmakuSearchNameDiv, "\" style=\"display: flex;\"></div>\n            </div>\n            <div id=\"").concat(eleIds.danmakuEpisodeFlag, "\" hidden>\n                <div style=\"display: flex;\">\n                    <div style=\"width: 80%;\">\n                        <label class=\"").concat(classes.embyLabel, "\">\u5A92\u4F53\u540D: </label>\n                        <div id=\"").concat(eleIds.danmakuAnimeDiv, "\" class=\"").concat(classes.embySelectWrapper, "\"></div>\n                        <label class=\"").concat(classes.embyLabel, "\">\u5206\u96C6\u540D: </label>\n                        <div style=\"display: flex;\">\n                            <div id=\"").concat(eleIds.danmakuEpisodeNumDiv, "\" style=\"max-width: 90%;\" class=\"").concat(classes.embySelectWrapper, "\"></div>\n                            <div id=\"").concat(eleIds.danmakuEpisodeLoad, "\"></div>\n                        </div>\n                    </div>\n                    <div style=\"width: 20%; margin: 0 2%; text-align: center;\">\n                        <img id=\"").concat(eleIds.searchImg, "\" style=\"width: 100%; height: auto;\"\n                            loading=\"lazy\" decoding=\"async\" draggable=\"false\" class=\"coveredImage-noScale\"></img>\n                        <div id=\"").concat(eleIds.searchApiSource, "\" class=\"").concat(classes.embyFieldDesc, "\" style=\"margin-top: 0.5em;\">\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div hidden>\n                <label class=\"").concat(classes.embyLabel, "\" id=\"").concat(eleIds.danmakuRemark, "\"></label>\n            </div>\n            <div>\n                <h4>\u5339\u914D\u6E90</h4>\n                <div style=\"display: flex; justify-content: space-between; align-items: center;\">\n                    <div>\n                        <div id=\"").concat(eleIds.currentMatchedDiv, "\">\n                            <label class=\"").concat(classes.embyLabel, "\">\u5F39\u5F39 play \u603B\u91CF: ").concat(comments.length, "</label>\n                        </div>\n                        <label class=\"").concat(classes.embyLabel, "\">\u5F39\u5F39 play \u9644\u52A0\u7684\u7B2C\u4E09\u65B9 url: </label>\n                    </div>\n                    <button is=\"emby-button\" type=\"button\"\n                        class=\"").concat(classes.embyButtons.basic, "\" id=\"").concat(eleIds.clearLocalMatchCacheBtn, "\">\n                        \u6E05\u9664\u672C\u5730\u5339\u914D\u7F13\u5B58\n                    </button>\n                </div>\n                <div id=\"").concat(eleIds.extUrlsDiv, "\"></div>\n            </div>\n            <div is=\"emby-collapse\" title=\"\u9644\u52A0\u5F39\u5E55\">\n                <div class=\"").concat(classes.collapseContentNav, "\">\n                    <label class=\"").concat(classes.embyLabel, "\">\u5F39\u5F39 play \u652F\u6301\u89E3\u6790\u7684\u7B2C\u4E09\u65B9 url: </label>\n                    <div id=\"").concat(eleIds.extCommentSearchDiv, "\" style=\"display: flex;\"></div>\n                    <div class=\"").concat(classes.embyFieldDesc, "\">\n                        \u539F\u63A5\u53E3\u6587\u6863\u8BF4\u660E\u652F\u6301(\u5982A/B/C\u7AD9),\u81EA\u6D4B\u53E6\u5916\u652F\u6301[ \u7231\u5947\u827A\u89C6\u9891, \u817E\u8BAF\u89C6\u9891, \u4F18\u9177\u89C6\u9891, ],\u4E0D\u652F\u6301[ \u8292\u679C TV, ]\n                    </div>\n                    <div class=\"").concat(classes.embyFieldDesc, "\">\n                        \u4EC5[ \u7231\u5947\u827A\u89C6\u9891, ]\u9700\u8981\u6CE8\u610F\u7F51\u5740\u540E\u4E0D\u80FD\u5E26 ? \u7684\u53C2\u6570,\u5176\u4F59\u7F51\u5740\u5E26\u4E0D\u5E26\u90FD\u53EF\u4EE5\n                    </div>\n                    <div class=\"").concat(classes.embyFieldDesc, "\">\n                        \u8BE6\u7EC6\u7F51\u5740\u793A\u4F8B: \u5F39\u5F39 play PC \u5B98\u65B9\u5BA2\u6237\u7AEF -> \u6DFB\u52A0\u66F4\u591A\u5F39\u5E55 -> \u67E5\u770B\u652F\u6301\u89E3\u6790\u7684\u7F51\u5740\u793A\u4F8B\n                    </div>\n                </div>\n            </div>\n            <div is=\"emby-collapse\" title=\"\u670D\u52A1\u7AEF Danmu \u63D2\u4EF6\">\n                <div class=\"").concat(classes.collapseContentNav, "\">\n                    <div id=\"").concat(eleIds.danmuPluginDiv, "\" class=\"").concat(classes.embyCheckboxList, "\" style=\"").concat(styles.embyCheckboxList, "\"></div>\n                </div>\n            </div>\n            <div is=\"emby-collapse\" title=\"API\u9009\u62E9\u3001\u81EA\u5B9A\u4E49API\u914D\u7F6E\">\n                <div class=\"").concat(classes.collapseContentNav, "\">\n                    <div id=\"").concat(eleIds.apiCheckboxListDiv, "\" class=\"").concat(classes.embyCheckboxList, "\" style=\"").concat(styles.embyCheckboxList, " align-items: center;\">\n                    </div>\n                    <label class=\"").concat(classes.embyLabel, "\">").concat(lsKeys.apiPriority.name, ": </label>\n                    <div id=\"").concat(eleIds.apiPriorityDiv, "\" style=\"margin: 1% 0;\">\n                    </div>\n                    <label class=\"").concat(classes.embyLabel, "\">").concat(lsKeys.customApiPrefix.name, ": </label>\n                    <div id=\"").concat(eleIds.customApiPrefixInputDiv, "\" style=\"display: flex;\">\n                    </div>\n                    <div class=\"").concat(classes.embyFieldDesc, "\">\n                        \u5982\u9700\u81EA\u5B9A\u4E49\u5F39\u5E55API\u5730\u5740,\u8BF7\u586B\u5199\u5B8C\u6574URL(\u5982 https://api.example.com ),<br>\u7559\u7A7A\u5219\u4F7F\u7528\u539F\u751FAPI\n                    </div>\n                </div>\n            </div>\n        </div>\n    ");
    container.innerHTML = template.trim();
    buildSearchEpisodeEle();
    buildExtCommentDiv();
    buildDanmuPluginDiv();
    bindManualMatchButtons();
    buildCustomApiDiv();
  }

  /**
   * 自定义 URL 配置（从 localStorage 应用用户设置）
   */
  var customeUrlMsg1 = '限弹弹 play API 兼容结构';
  var customeUrl = {
    init: function init() {
      customeUrl.mapping.forEach(function (obj) {
        return obj.rewrite(lsGetItem(obj.lsKey.id));
      });
    },
    mapping: [{
      divId: eleIds.customeDanmakuDiv,
      lsKey: lsKeys.customeDanmakuUrl,
      rewrite: function rewrite(tl) {
        return setRequireDanmakuPath(tl);
      },
      msg1: "\u9650 ".concat(openSourceLicense.danmaku.url, " \u517C\u5BB9\u7ED3\u6784"),
      msg2: "Danmaku \u4F9D\u8D56\u8DEF\u5F84,index.html \u5F15\u5165\u7684\u548C\u7BE1\u6539\u7334\u73AF\u5883\u4E0D\u4F1A\u4F7F\u7528\u5230,\u4F9D\u8D56\u5DF2\u5185\u7F6E,\n                    \u4EC5\u5728\u88AB CustomCssJS \u6267\u884C\u7684\u7279\u6B8A\u73AF\u5883\u4E0B\u4F7F\u7528,\u652F\u6301\u76F8\u5BF9/\u7EDD\u5BF9/\u7F51\u7EDC\u8DEF\u5F84,\n                    \u9ED8\u8BA4\u662F\u76F8\u5BF9\u8DEF\u5F84\u7B49\u540C https://emby/web/ \u548C /system/dashboard-ui/ ,\u975E\u6D4F\u89C8\u5668\u5BA2\u6237\u7AEF\u5FC5\u987B\u4F7F\u7528\u7F51\u7EDC\u8DEF\u5F84"
    }, {
      divId: eleIds.customeCorsProxyDiv,
      lsKey: lsKeys.customeCorsProxyUrl,
      rewrite: function rewrite(tl) {
        return setCorsProxy(tl);
      },
      msg1: '仅弹弹 play API 跨域使用,限 URL 前缀反代方式,例如 cf_worker',
      msg2: '以下共用变量: { dandanplayApi.prefix: 反代前缀拼接的弹弹 play API 路径前缀, }'
    }, {
      divId: eleIds.customeGetCommentDiv,
      lsKey: lsKeys.customeGetCommentUrl,
      rewrite: function rewrite(tl) {
        dandanplayApi.getComment = function (episodeId, chConvert) {
          return eval('`' + tl + '`');
        };
      },
      msg1: customeUrlMsg1,
      msg2: '变量: { episodeId: 章节 ID, chConvert: 简繁转换, }'
    }, {
      divId: eleIds.customeGetExtcommentDiv,
      lsKey: lsKeys.customeGetExtcommentUrl,
      rewrite: function rewrite(tl) {
        dandanplayApi.getExtcomment = function (url) {
          return eval('`' + tl + '`');
        };
      },
      msg1: customeUrlMsg1,
      msg2: '变量: { url: 附加弹幕输入框中的网址, }'
    }, {
      divId: eleIds.customePosterImgDiv,
      lsKey: lsKeys.customePosterImgUrl,
      rewrite: function rewrite(tl) {
        dandanplayApi.posterImg = function (animeId) {
          return eval('`' + tl + '`');
        };
      },
      msg1: customeUrlMsg1,
      msg2: '变量: { animeId: 弹弹 play 的作品 ID, }'
    }]
  };

  /**
   * 高级设置 Tab
   * 从 ede.js 迁移
   */
  var timeoutCallbackId;
  var timeoutCallbackClear = function timeoutCallbackClear() {
    return timeoutCallbackId && clearTimeout(timeoutCallbackId);
  };
  var timeoutCallbackTypeOpts = [{
    id: '0',
    name: '不启用',
    onChange: function onChange() {
      return timeoutCallbackClear();
    }
  }, {
    id: '1',
    name: '退出播放',
    onChange: function onChange(ms) {
      timeoutCallbackClear();
      timeoutCallbackId = setTimeout(function () {
        closeEmbyDialog();
        if (typeof Emby !== 'undefined' && Emby.InputManager) {
          Emby.InputManager.trigger('back');
        }
      }, ms);
    }
  }, {
    id: '2',
    name: '返回主页',
    onChange: function onChange(ms) {
      timeoutCallbackClear();
      timeoutCallbackId = setTimeout(function () {
        closeEmbyDialog();
        if (typeof Emby !== 'undefined' && Emby.Page) {
          Emby.Page.goHome();
        }
      }, ms);
    }
  }];
  function onSliderChange(val, opts) {
    var _opts$lsKey;
    onSliderChangeLabel(opts.label != null ? opts.label : val, opts);
    if ((_opts$lsKey = opts.lsKey) !== null && _opts$lsKey !== void 0 && _opts$lsKey.id && lsCheckSet(opts.lsKey.id, val)) {
      var needReload = opts.needReload === undefined ? true : opts.needReload;
      if (opts.isManual) return;
      console.log("".concat(opts.lsKey.id, " changed to ").concat(val, ", needReload: ").concat(needReload));
      if (needReload) loadDanmaku(LOAD_TYPE.RELOAD);
    }
  }
  function onSliderChangeLabel(val, opts) {
    if (opts !== null && opts !== void 0 && opts.labelId) {
      var el = getById(opts.labelId);
      if (el) el.innerText = val;
    }
    if (opts !== null && opts !== void 0 && opts.labelEle) opts.labelEle.innerText = val;
  }
  function doDanmakuTypeFilterSelect() {
    var checkList = Array.from(document.getElementsByName(eleIds.danmakuTypeFilterSelectName)).filter(function (item) {
      return item.checked;
    }).map(function (item) {
      return item.value;
    });
    lsSetItem(lsKeys.typeFilter.id, checkList);
    loadDanmaku(LOAD_TYPE.RELOAD);
  }
  function doDanmakuSourceFilterSelect() {
    var checkList = Array.from(document.getElementsByName(eleIds.danmakuSourceFilterSelectName)).filter(function (item) {
      return item.checked;
    }).map(function (item) {
      return item.value;
    });
    lsSetItem(lsKeys.sourceFilter.id, checkList);
    loadDanmaku(LOAD_TYPE.RELOAD);
  }
  function doDanmakuShowSourceSelect() {
    var checkList = Array.from(document.getElementsByName(eleIds.danmakuShowSourceSelectName)).filter(function (item) {
      return item.checked;
    }).map(function (item) {
      return item.value;
    });
    lsSetItem(lsKeys.showSource.id, checkList);
    loadDanmaku(LOAD_TYPE.RELOAD);
  }
  function doDanmakuChConverChange(value) {
    window.ede.chConvert = value.id;
    lsSetItem(lsKeys.chConvert.id, window.ede.chConvert);
    loadDanmaku(LOAD_TYPE.REFRESH);
    console.log(value.name);
  }
  function doDanmakuEngineSelect(value) {
    var selectedValue = value.id;
    if (lsCheckSet(lsKeys.engine.id, selectedValue)) {
      console.log("\u5DF2\u66F4\u6539\u5F39\u5E55\u5F15\u64CE\u4E3A: ".concat(selectedValue));
      loadDanmaku(LOAD_TYPE.RELOAD);
    }
  }
  function doDanmakuFilterKeywordsBtnClick(event) {
    var _getById, _getById$checked, _getById2;
    var btn = event.currentTarget;
    if (btn) {
      btn.style = '';
      btn.disabled = true;
    }
    var keywords = ((_getById = getById(eleIds.filterKeywordsId)) === null || _getById === void 0 || (_getById = _getById.value) === null || _getById === void 0 ? void 0 : _getById.trim()) || '';
    var enable = (_getById$checked = (_getById2 = getById(eleIds.filterKeywordsEnableId)) === null || _getById2 === void 0 ? void 0 : _getById2.checked) !== null && _getById$checked !== void 0 ? _getById$checked : false;
    lsCheckSet(lsKeys.filterKeywordsEnable.id, enable);
    if (!lsCheckSet(lsKeys.filterKeywords.id, keywords) && keywords === '') return;
    loadDanmaku(LOAD_TYPE.RELOAD);
  }
  function updateFilterKeywordsBtn(btn, flag, keywords) {
    var isSame = lsCheckOld(lsKeys.filterKeywordsEnable.id, flag) && lsCheckOld(lsKeys.filterKeywords.id, keywords);
    if (btn) {
      btn.firstChild.innerHTML = isSame ? iconKeys.done_disabled : iconKeys.done;
      btn.disabled = isSame;
    }
  }
  function buildDanmakuFilterSetting(container) {
    var typeFilterDiv = getById(eleIds.danmakuTypeFilterDiv, container);
    var sourceFilterDiv = getById(eleIds.danmakuSourceFilterDiv, container);
    var showSourceDiv = getById(eleIds.danmakuShowSourceDiv, container);
    if (typeFilterDiv) {
      typeFilterDiv.append(embyCheckboxList('danmakuTypeFilterList', eleIds.danmakuTypeFilterSelectName, lsGetItem(lsKeys.typeFilter.id), Object.values(danmakuTypeFilterOpts).filter(function (o) {
        return !o.hidden;
      }), doDanmakuTypeFilterSelect));
    }
    if (sourceFilterDiv) {
      sourceFilterDiv.append(embyCheckboxList('danmakuSourceFilterList', eleIds.danmakuSourceFilterSelectName, lsGetItem(lsKeys.sourceFilter.id), Object.values(danmakuSource), doDanmakuSourceFilterSelect));
    }
    if (showSourceDiv) {
      showSourceDiv.append(embyCheckboxList('danmakuShowSourceList', eleIds.danmakuShowSourceSelectName, lsGetItem(lsKeys.showSource.id), Object.values(showSource), doDanmakuShowSourceSelect));
    }
    var autoFilterDiv = getById(eleIds.danmakuAutoFilterCountDiv);
    if (autoFilterDiv) {
      autoFilterDiv.append(embySlider({
        lsKey: lsKeys.autoFilterCount
      }, onSliderChange, onSliderChangeLabel));
    }
    var filterProDiv = getById(eleIds.danmakuFilterProDiv, container);
    if (filterProDiv) {
      filterProDiv.append(embyCheckbox({
        id: 'mergeSimilarEnable',
        name: 'mergeSimilarEnable',
        label: labels.enable
      }, lsGetItem(lsKeys.mergeSimilarEnable.id), function (checked) {
        lsSetItem(lsKeys.mergeSimilarEnable.id, checked);
        loadDanmaku(LOAD_TYPE.RELOAD);
      }));
    }
    var mergePercentDiv = getById(eleIds.mergeSimilarPercentDiv);
    if (mergePercentDiv) {
      mergePercentDiv.append(embySlider({
        lsKey: lsKeys.mergeSimilarPercent
      }, onSliderChange, onSliderChangeLabel));
    }
    var mergeTimeDiv = getById(eleIds.mergeSimilarTimeDiv);
    if (mergeTimeDiv) {
      mergeTimeDiv.append(embySlider({
        lsKey: lsKeys.mergeSimilarTime
      }, onSliderChange, onSliderChangeLabel));
    }
    var keywordsContainer = getById(eleIds.filterKeywordsDiv, container);
    if (keywordsContainer) {
      var keywordsEnableDiv = keywordsContainer.appendChild(document.createElement('div'));
      var keywordsBtn = embyButton({
        label: '加载关键词过滤',
        iconKey: iconKeys.done_disabled
      }, doDanmakuFilterKeywordsBtnClick);
      keywordsBtn.disabled = true;
      keywordsEnableDiv.setAttribute('style', 'display: flex; justify-content: space-between; align-items: center; width: 100%;');
      keywordsEnableDiv.append(embyCheckbox({
        id: eleIds.filterKeywordsEnableId,
        name: eleIds.filterKeywordsEnableId,
        label: labels.enable
      }, lsGetItem(lsKeys.filterKeywordsEnable.id), function (flag) {
        var _getById3;
        return updateFilterKeywordsBtn(keywordsBtn, flag, ((_getById3 = getById(eleIds.filterKeywordsId)) === null || _getById3 === void 0 || (_getById3 = _getById3.value) === null || _getById3 === void 0 ? void 0 : _getById3.trim()) || '');
      }));
      keywordsEnableDiv.appendChild(document.createElement('div')).appendChild(keywordsBtn);
      keywordsContainer.appendChild(document.createElement('div')).appendChild(embyTextarea({
        id: eleIds.filterKeywordsId,
        value: lsGetItem(lsKeys.filterKeywords.id),
        style: 'width: 100%;margin-top: 0.2em;',
        rows: 8
      }, function (event) {
        var _getById$checked2, _getById4, _event$target;
        return updateFilterKeywordsBtn(keywordsBtn, (_getById$checked2 = (_getById4 = getById(eleIds.filterKeywordsEnableId)) === null || _getById4 === void 0 ? void 0 : _getById4.checked) !== null && _getById$checked2 !== void 0 ? _getById$checked2 : false, ((_event$target = event.target) === null || _event$target === void 0 || (_event$target = _event$target.value) === null || _event$target === void 0 ? void 0 : _event$target.trim()) || '');
      }));
      var label = document.createElement('label');
      label.innerText = "\u5173\u952E\u8BCD/\u6B63\u5219\u5339\u914D\u8FC7\u6EE4,\u652F\u6301\u8FC7\u6EE4[\u6B63\u6587,".concat(Object.values(showSource).map(function (o) {
        return o.name;
      }).join(), "],\u591A\u4E2A\u8868\u8FBE\u5F0F\u7528\u6362\u884C\u5206\u9694");
      label.className = classes.embyFieldDesc;
      keywordsContainer.appendChild(document.createElement('div')).appendChild(label);
    }
  }
  function buildExtSetting(container) {
    var chConverDiv = getById(eleIds.danmakuChConverDiv, container);
    var engineDiv = getById(eleIds.danmakuEngineDiv, container);
    if (chConverDiv) {
      var _window$ede$chConvert, _window$ede;
      chConverDiv.append(embyTabs(danmakuChConverOpts, (_window$ede$chConvert = (_window$ede = window.ede) === null || _window$ede === void 0 ? void 0 : _window$ede.chConvert) !== null && _window$ede$chConvert !== void 0 ? _window$ede$chConvert : lsGetItem(lsKeys.chConvert.id), 'id', 'name', doDanmakuChConverChange));
    }
    if (engineDiv) {
      engineDiv.append(embyTabs(danmakuEngineOpts, lsGetItem(lsKeys.engine.id), 'id', 'name', doDanmakuEngineSelect));
    }
  }
  function buildOsdSetting() {
    var osdCheckboxDiv = getById(eleIds.osdCheckboxDiv);
    var osdLineChartDiv = getById(eleIds.osdLineChartDiv);
    var osdLineChartTimeDiv = getById(eleIds.osdLineChartTimeDiv);
    if (osdCheckboxDiv) {
      osdCheckboxDiv.append(embyCheckbox({
        id: lsKeys.osdTitleEnable.id,
        name: lsKeys.osdTitleEnable.id,
        label: lsKeys.osdTitleEnable.name
      }, lsGetItem(lsKeys.osdTitleEnable.id), function (checked) {
        lsSetItem(lsKeys.osdTitleEnable.id, checked);
        var videoOsdContainer = document.querySelector("".concat(mediaContainerQueryStr, " .videoOsdSecondaryText"));
        var videoOsdDanmakuTitle = getById(eleIds.videoOsdDanmakuTitle, videoOsdContainer);
        if (videoOsdDanmakuTitle) {
          videoOsdDanmakuTitle.style.display = checked ? 'block' : 'none';
        } else if (checked) {
          appendvideoOsdDanmakuInfo(getDanmakuComments(window.ede).length);
        }
      }));
      osdCheckboxDiv.append(embyCheckbox({
        id: lsKeys.osdHeaderClockEnable.id,
        name: lsKeys.osdHeaderClockEnable.id,
        label: lsKeys.osdHeaderClockEnable.name
      }, lsGetItem(lsKeys.osdHeaderClockEnable.id), function (checked) {
        lsSetItem(lsKeys.osdHeaderClockEnable.id, checked);
        checked ? addHeaderClock() : removeHeaderClock();
      }));
    }
    if (osdLineChartDiv) {
      osdLineChartDiv.append(embyCheckbox({
        id: lsKeys.osdLineChartEnable.id,
        name: lsKeys.osdLineChartEnable.id,
        label: lsKeys.osdLineChartEnable.name
      }, lsGetItem(lsKeys.osdLineChartEnable.id), function (checked) {
        lsSetItem(lsKeys.osdLineChartEnable.id, checked);
        var progressBarLineChart = getById(eleIds.progressBarLineChart);
        if (progressBarLineChart) {
          progressBarLineChart.style.display = checked ? 'block' : 'none';
        } else if (checked) {
          buildProgressBarChart(20);
        }
      }));
      osdLineChartDiv.append(embyCheckbox({
        id: lsKeys.osdLineChartSkipFilter.id,
        name: lsKeys.osdLineChartSkipFilter.id,
        label: lsKeys.osdLineChartSkipFilter.name
      }, lsGetItem(lsKeys.osdLineChartSkipFilter.id), function (checked) {
        lsSetItem(lsKeys.osdLineChartSkipFilter.id, checked);
        buildProgressBarChart(20);
      }));
    }
    if (osdLineChartTimeDiv) {
      osdLineChartTimeDiv.append(embySlider({
        lsKey: lsKeys.osdLineChartTime,
        needReload: false
      }, function (val, opts) {
        onSliderChange(val, opts);
        if (lsGetItem(lsKeys.osdLineChartEnable.id)) buildProgressBarChart(20);
      }, onSliderChangeLabel));
    }
  }
  function buildPlaySetting(container) {
    var btnContainer = getById(eleIds.timeoutCallbackDiv, container);
    var timeoutCallbacktOpts = {
      labelId: eleIds.timeoutCallbackLabel,
      key: lsKeys.timeoutCallbackValue.id,
      needReload: false
    };
    onSliderChangeLabel(lsGetItem(lsKeys.timeoutCallbackValue.id), timeoutCallbacktOpts);
    if (btnContainer) {
      timeOffsetBtns.forEach(function (btn) {
        btnContainer.append(embyButton(btn, function (e) {
          if (e.target) {
            var oldValue = lsGetItem(lsKeys.timeoutCallbackValue.id);
            var newValue = oldValue + (parseFloat(e.target.getAttribute('valueOffset')) || 0);
            if (newValue === oldValue || newValue < 0) newValue = 0;
            onSliderChange(newValue, timeoutCallbacktOpts);
          }
        }));
      });
    }
    var unitDiv = getById(eleIds.timeoutCallbackUnitDiv, container);
    if (unitDiv) {
      unitDiv.append(embyTabs(timeoutCallbackUnitOpts, lsGetItem(lsKeys.timeoutCallbackUnit.id), 'id', 'name', function (value, index) {
        return lsSetItem(lsKeys.timeoutCallbackUnit.id, index);
      }));
    }
    var typeDiv = getById(eleIds.timeoutCallbackTypeDiv, container);
    if (typeDiv) {
      typeDiv.append(embyTabs(timeoutCallbackTypeOpts, timeoutCallbackTypeOpts[0].id, 'id', 'name', function (value) {
        var unitObj = timeoutCallbackUnitOpts[lsGetItem(lsKeys.timeoutCallbackUnit.id)];
        value.onChange(lsGetItem(lsKeys.timeoutCallbackValue.id) * unitObj.msRate);
      }));
    }
  }
  function onEnterBangumiToken(e) {
    var _getById5;
    var bangumiToken = ((_getById5 = getById(eleIds.bangumiTokenInput)) === null || _getById5 === void 0 || (_getById5 = _getById5.value) === null || _getById5 === void 0 ? void 0 : _getById5.trim()) || '';
    lsSetItem(lsKeys.bangumiToken.id, bangumiToken);
    var label = getById(eleIds.bangumiTokenLabel);
    fetchBangumiApiGetMe(bangumiToken).then(function () {
      if (label) {
        label.innerText = 'Bangumi Token 验证成功';
        label.style.color = 'green';
      }
    }).catch(function (error) {
      if (label) {
        label.innerText = 'Bangumi Token 验证失败';
        label.style.color = 'red';
      }
      throw error;
    });
  }
  function buildBangumiSetting(container) {
    var bangumiSettingsDiv = getById(eleIds.bangumiSettingsDiv, container);
    var bangumiEnable = lsGetItem(lsKeys.bangumiEnable.id);
    if (bangumiSettingsDiv) bangumiSettingsDiv.hidden = !bangumiEnable;
    var bangumiEnableLabel = getById(eleIds.bangumiEnableLabel, container);
    if (bangumiEnableLabel) {
      bangumiEnableLabel.append(embyCheckbox({
        id: lsKeys.bangumiEnable.id,
        name: lsKeys.bangumiEnable.id,
        label: lsKeys.bangumiEnable.name
      }, bangumiEnable, function (checked) {
        lsSetItem(lsKeys.bangumiEnable.id, checked);
        if (bangumiSettingsDiv) bangumiSettingsDiv.hidden = !checked;
      }));
    }
    var bangumiTokenInputDiv = getById(eleIds.bangumiTokenInputDiv, container);
    if (bangumiTokenInputDiv) {
      bangumiTokenInputDiv.append(embyInput({
        id: eleIds.bangumiTokenInput,
        type: 'password',
        value: lsGetItem(lsKeys.bangumiToken.id)
      }, onEnterBangumiToken));
      bangumiTokenInputDiv.append(embyButton({
        label: '校验',
        iconKey: iconKeys.check
      }, onEnterBangumiToken));
    }
    var bangumiPostPercentDiv = getById(eleIds.bangumiPostPercentDiv, container);
    if (bangumiPostPercentDiv) {
      bangumiPostPercentDiv.append(embySlider({
        lsKey: lsKeys.bangumiPostPercent,
        needReload: false
      }, function (val, opts) {
        return onSliderChange(val, opts);
      }, onSliderChangeLabel));
    }
    var bangumiTokenLinkDiv = getById(eleIds.bangumiTokenLinkDiv, container);
    if (bangumiTokenLinkDiv) {
      bangumiTokenLinkDiv.append(embyALink(bangumiApi.accessTokenUrl, bangumiApi.accessTokenUrl));
    }
  }
  function buildCustomUrlSetting(container) {
    var customeUrlsDiv = getById(eleIds.customeUrlsDiv, container);
    if (!customeUrlsDiv) return;
    var getTemplate = function getTemplate(obj) {
      return "\n        <label class=\"".concat(classes.embyLabel, "\">").concat(obj.lsKey.name, "(").concat(obj.msg1, "): </label>\n        <div id=\"").concat(obj.divId, "\" style=\"display: flex;\"></div>\n        <div class=\"").concat(classes.embyFieldDesc, "\">").concat(obj.msg2 || '', "</div>\n    ");
    };
    customeUrl.mapping.forEach(function (obj) {
      customeUrlsDiv.innerHTML += getTemplate(obj);
    });
    customeUrl.mapping.forEach(function (obj) {
      var inputDiv = getById(obj.divId, container);
      if (!inputDiv) return;
      var onEnter = function onEnter(e) {
        var _target$value;
        var target = getTargetInput(e);
        var value = (target === null || target === void 0 || (_target$value = target.value) === null || _target$value === void 0 ? void 0 : _target$value.trim()) || '';
        if (!value) {
          value = obj.lsKey.defaultValue;
          if (target) target.value = value;
        }
        lsSetItem(obj.lsKey.id, value);
        obj.rewrite(value);
      };
      inputDiv.append(embyInput({
        type: 'search',
        value: lsGetItem(obj.lsKey.id)
      }, onEnter));
      inputDiv.append(embyButton({
        label: '确认',
        iconKey: iconKeys.check
      }, onEnter));
    });
  }

  /**
   * 构建高级设置 Tab
   * @param {string} containerId
   */
  function buildProSetting(containerId) {
    var container = getById(containerId);
    if (!container) return;
    var template = "\n        <div style=\"height: 30em;\">\n            <div is=\"emby-collapse\" title=\"\u5F39\u5E55\u5C4F\u853D\" data-expanded=\"true\">\n                <div class=\"".concat(classes.collapseContentNav, "\">\n                    <div id=\"").concat(eleIds.danmakuTypeFilterDiv, "\" style=\"margin-bottom: 0.2em;\">\n                        <label class=\"").concat(classes.embyLabel, "\">").concat(lsKeys.typeFilter.name, ": </label>\n                    </div>\n                    <div id=\"").concat(eleIds.danmakuSourceFilterDiv, "\">\n                        <label class=\"").concat(classes.embyLabel, "\">").concat(lsKeys.sourceFilter.name, ": </label>\n                    </div>\n                    <div id=\"").concat(eleIds.danmakuShowSourceDiv, "\">\n                        <label class=\"").concat(classes.embyLabel, "\">").concat(lsKeys.showSource.name, ": </label>\n                    </div>\n                </div>\n            </div>\n            <div is=\"emby-collapse\" title=\"\u5F39\u5E55\u9AD8\u7EA7\u5C4F\u853D\">\n                <div class=\"").concat(classes.collapseContentNav, "\">\n                    <div>\n                        <div style=\"").concat(styles.embySlider, "\">\n                            <label class=\"").concat(classes.embyLabel, "\" style=\"width: 10em;\">").concat(lsKeys.autoFilterCount.name, ": </label>\n                            <div id=\"").concat(eleIds.danmakuAutoFilterCountDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                            <label style=\"").concat(styles.embySliderLabel, "\">0</label>\n                        </div>\n                        <label class=\"").concat(classes.embyLabel, "\">").concat(lsKeys.mergeSimilarEnable.name, ": </label>\n                        <div id=\"").concat(eleIds.danmakuFilterProDiv, "\" class=\"").concat(classes.embyCheckboxList, "\" style=\"").concat(styles.embyCheckboxList, "\"></div>\n                        <div style=\"").concat(styles.embySlider, "\">\n                            <label class=\"").concat(classes.embyLabel, "\" style=\"width: 10em;\">").concat(lsKeys.mergeSimilarPercent.name, ": </label>\n                            <div id=\"").concat(eleIds.mergeSimilarPercentDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                            <label><label style=\"").concat(styles.embySliderLabel, "\"></label><label>%</label></label>\n                        </div>\n                        <div style=\"").concat(styles.embySlider, "\">\n                            <label class=\"").concat(classes.embyLabel, "\" style=\"width: 10em;\">").concat(lsKeys.mergeSimilarTime.name, ": </label>\n                            <div id=\"").concat(eleIds.mergeSimilarTimeDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                            <label style=\"").concat(styles.embySliderLabel, "\">-1</label>\n                        </div>\n                    </div>\n                    <div id=\"").concat(eleIds.filterKeywordsDiv, "\" style=\"margin-bottom: 0.2em;\">\n                        <label class=\"").concat(classes.embyLabel, "\">").concat(lsKeys.filterKeywords.name, ": </label>\n                    </div>\n                </div>\n            </div>\n            <div is=\"emby-collapse\" title=\"\u989D\u5916\u8BBE\u7F6E\">\n                <div class=\"").concat(classes.collapseContentNav, "\" style=\"padding-top: 0.5em !important;\">\n                    <div id=\"").concat(eleIds.extCheckboxDiv, "\" class=\"").concat(classes.embyCheckboxList, "\" style=\"").concat(styles.embyCheckboxList, "\"></div>\n                    <div id=\"").concat(eleIds.danmakuChConverDiv, "\" style=\"margin-bottom: 0.2em;\">\n                        <label class=\"").concat(classes.embyLabel, "\">").concat(lsKeys.chConvert.name, ": </label>\n                    </div>\n                    <div id=\"").concat(eleIds.danmakuEngineDiv, "\" style=\"margin-bottom: 0.2em;\">\n                        <label class=\"").concat(classes.embyLabel, "\">").concat(lsKeys.engine.name, ": </label>\n                    </div>\n                </div>\n            </div>\n            <div is=\"emby-collapse\" title=\"\u64AD\u653E\u754C\u9762\u8BBE\u7F6E\">\n                <div class=\"").concat(classes.collapseContentNav, "\">\n                    <div id=\"").concat(eleIds.osdCheckboxDiv, "\" class=\"").concat(classes.embyCheckboxList, "\" style=\"").concat(styles.embyCheckboxList, "\"></div>\n                    <div>\n                        <div id=\"").concat(eleIds.osdLineChartDiv, "\" class=\"").concat(classes.embyCheckboxList, "\" style=\"").concat(styles.embyCheckboxList, "\"></div>\n                        <div style=\"").concat(styles.embySlider, "\">\n                            <label class=\"").concat(classes.embyLabel, "\" style=\"width: 12em;\">").concat(lsKeys.osdLineChartTime.name, ": </label>\n                            <div id=\"").concat(eleIds.osdLineChartTimeDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                            <label style=\"").concat(styles.embySliderLabel, "\"></label>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div is=\"emby-collapse\" title=\"\u64AD\u653E\u8BBE\u7F6E\">\n                <div class=\"").concat(classes.collapseContentNav, "\">\n                    <label class=\"").concat(classes.embyLabel, "\">\u5355\u6B21\u5B9A\u65F6\u6267\u884C: </label>\n                    <div id=\"").concat(eleIds.timeoutCallbackTypeDiv, "\"></div>\n                    <label class=\"").concat(classes.embyLabel, "\">\u5B9A\u65F6\u5355\u4F4D: </label>\n                    <div id=\"").concat(eleIds.timeoutCallbackUnitDiv, "\"></div>\n                    <div style=\"").concat(styles.embySlider, " margin-top: 0.3em;\">\n                        <label class=\"").concat(classes.embyLabel, "\" style=\"width:4em;\">").concat(lsKeys.timeoutCallbackValue.name, ": </label>\n                        <div id=\"").concat(eleIds.timeoutCallbackDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                        <label id=\"").concat(eleIds.timeoutCallbackLabel, "\" style=\"").concat(styles.embySliderLabel, "\"></label>\n                    </div>\n                </div>\n            </div>\n            <div is=\"emby-collapse\" title=\"Bangumi \u8BBE\u7F6E\">\n                <div class=\"").concat(classes.collapseContentNav, "\" style=\"padding-top: 0.5em !important;\">\n                    <label id=\"").concat(eleIds.bangumiEnableLabel, "\" class=\"").concat(classes.embyLabel, "\"></label>\n                    <div id=\"").concat(eleIds.bangumiSettingsDiv, "\">\n                        <div id=\"").concat(eleIds.bangumiTokenInputDiv, "\" style=\"display: flex;\"></div>\n                        <div id=\"").concat(eleIds.bangumiTokenLabel, "\" class=\"").concat(classes.embyFieldDesc, "\"></div>\n                        <div class=\"").concat(classes.embyFieldDesc, "\">\u4F60\u53EF\u4EE5\u5728\u4EE5\u4E0B\u94FE\u63A5\u751F\u6210\u4E00\u4E2A Access Token</div>\n                        <div id=\"").concat(eleIds.bangumiTokenLinkDiv, "\" style=\"padding-bottom: 0.5em;\"></div>\n                        <label class=\"").concat(classes.embyLabel, "\">\u81EA\u52A8\u66F4\u65B0\u5355\u7AE0\u8282\u6536\u85CF\u4FE1\u606F: </label>\n                        <div style=\"").concat(styles.embySlider, "\">\n                            <label class=\"").concat(classes.embyLabel, "\" style=\"width:4em;\">").concat(lsKeys.bangumiPostPercent.name, ": </label>\n                            <div id=\"").concat(eleIds.bangumiPostPercentDiv, "\" style=\"width: 15.5em; text-align: center;\"></div>\n                            <label><label style=\"").concat(styles.embySliderLabel, "\"></label><label>%</label></label>\n                        </div>\n                        <div class=\"").concat(classes.embyFieldDesc, "\">\n                            \u89E6\u53D1\u65F6\u673A\u4E3A\u6B63\u5E38\u505C\u6B62\u64AD\u653E,\u4E14\u64AD\u653E\u8FDB\u5EA6\u8D85\u8FC7\u8BBE\u5B9A\u767E\u5206\u6BD4\u65F6;\n                            \u540C\u6B65\u7684\u5A92\u4F53\u4FE1\u606F\u4E3A\u81EA\u52A8\u5339\u914D\u800C\u6765,\u53EF\u5728\"\u5F39\u5E55\u4FE1\u606F\"\u4E2D\u67E5\u770B;\n                            \u81EA\u52A8\u5339\u914D\u6709\u8BEF\u53EF\"\u624B\u52A8\u5339\u914D\",\u4ECD\u65E0\u6CD5\u5339\u914D\u53EF\u70B9\u51FB\u6309\u94AEX\"\u53D6\u6D88\u5339\u914D/\u6E05\u9664\u5F39\u5E55\",\u5219\u6B64\u5355\u7AE0\u8282\u4E0D\u4F1A\u540C\u6B65;\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div is=\"emby-collapse\" title=\"\u81EA\u5B9A\u4E49\u63A5\u53E3\u5730\u5740\">\n                <div id=\"").concat(eleIds.customeUrlsDiv, "\" class=\"").concat(classes.collapseContentNav, "\"></div>\n            </div>\n        </div>\n    ");
    container.innerHTML = template.trim();
    buildDanmakuFilterSetting(container);
    buildExtSetting(container);
    buildOsdSetting();
    buildPlaySetting(container);
    buildBangumiSetting(container);
    buildCustomUrlSetting(container);
  }

  var createDanmakuHooks = {
    buildCurrentDanmakuInfo: buildCurrentDanmakuInfo,
    appendvideoOsdDanmakuInfo: appendvideoOsdDanmakuInfo
  };
  function doConsoleLogChange(checked) {
    lsSetItem(lsKeys.consoleLogEnable.id, checked);
    var consoleLogInfo = getById(eleIds.consoleLogInfo);
    if (consoleLogInfo) consoleLogInfo.style.display = checked ? '' : 'none';
    var consoleLogTextEle = getById(eleIds.consoleLogText);
    if (checked) {
      if (!window.ede.appLogAspect) {
        window.ede.appLogAspect = new AppLogAspect().init();
      }
      if (consoleLogTextEle) {
        consoleLogTextEle.value = window.ede.appLogAspect.value;
        window.ede.appLogAspect.on(function (newValue) {
          if (consoleLogTextEle.value.length !== newValue.length) {
            consoleLogTextEle.value = newValue;
            consoleLogTextEle.scrollTop = consoleLogTextEle.scrollHeight;
            var consoleLogCountLabel = getById(eleIds.consoleLogCountLabel);
            if (consoleLogCountLabel) {
              consoleLogCountLabel.innerHTML = "\u6E05\u7A7A ".concat(newValue.split('\n').length - 1, " \u884C");
            }
          }
        });
      }
    } else {
      if (consoleLogTextEle) consoleLogTextEle.value = '';
      if (window.ede.appLogAspect) {
        window.ede.appLogAspect.destroy();
        window.ede.appLogAspect = null;
      }
    }
  }
  function generateRandomDanmu(count, duration) {
    count = count || 10000;
    duration = duration || 600;
    var comments = [];
    var modes = [1, 4, 5, 6];
    for (var i = 0; i < count; i++) {
      var time = parseFloat((Math.random() * duration).toFixed(2));
      var mode = modes[Math.floor(Math.random() * modes.length)];
      var color = Math.floor(Math.random() * 16777216);
      var p = time + ',' + mode + ',' + color + ',0';
      var cid = 1000000000 + i;
      comments.push({
        cid: cid,
        p: p,
        m: '这是第' + (i + 1) + '条弹幕'
      });
    }
    return comments;
  }
  function buildConsoleLog(container) {
    var consoleLogEnable = lsGetItem(lsKeys.consoleLogEnable.id);
    var consoleLogInfo = getById(eleIds.consoleLogInfo, container);
    if (consoleLogInfo) consoleLogInfo.style.display = consoleLogEnable ? '' : 'none';
    if (consoleLogEnable) doConsoleLogChange(consoleLogEnable);
    var consoleLogCtrlEle = getById(eleIds.consoleLogCtrl, container);
    if (!consoleLogCtrlEle) return;
    consoleLogCtrlEle.append(embyCheckbox({
      id: lsKeys.consoleLogEnable.id,
      name: lsKeys.consoleLogEnable.id,
      label: lsKeys.consoleLogEnable.name
    }, consoleLogEnable, doConsoleLogChange));
    var consoleLogCountLabel = document.createElement('label');
    consoleLogCountLabel.id = eleIds.consoleLogCountLabel;
    consoleLogCtrlEle.append(embyButton({
      label: '清空',
      iconKey: iconKeys.block
    }, function () {
      var textEl = getById(eleIds.consoleLogText, container);
      if (textEl) textEl.value = '';
      var countEl = getById(eleIds.consoleLogCountLabel);
      if (countEl) countEl.innerHTML = '';
      if (window.ede.appLogAspect) window.ede.appLogAspect.value = '';
    }), consoleLogCountLabel);
    var consoleLogTextInput = getById(eleIds.consoleLogTextInput, container);
    if (consoleLogTextInput) {
      consoleLogTextInput.style.display = consoleLogEnable && lsGetItem(lsKeys.quickDebugOn.id) ? '' : 'none';
      consoleLogTextInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          var inputVal = e.target.value.trim();
          console.log('输入内容为: \n', inputVal);
          try {
            eval(inputVal);
          } catch (err) {
            console.error(err);
          }
          e.target.value = '';
        }
      });
    }
  }
  function buildDebugCheckbox(container) {
    var debugWrapper = getById(eleIds.debugCheckbox, container);
    if (!debugWrapper) return;
    debugWrapper.append(embyCheckbox({
      id: lsKeys.debugShowDanmakuWrapper.id,
      name: lsKeys.debugShowDanmakuWrapper.id,
      label: lsKeys.debugShowDanmakuWrapper.name
    }, lsGetItem(lsKeys.debugShowDanmakuWrapper.id), function (checked) {
      lsSetItem(lsKeys.debugShowDanmakuWrapper.id, checked);
      var wrapper = getById(eleIds.danmakuWrapper);
      if (wrapper) {
        wrapper.style.backgroundColor = checked ? styles.colors.highlight : '';
        if (checked) {
          console.log("\u5F39\u5E55\u5BB9\u5668(#".concat(eleIds.danmakuWrapper, ")\u5BBD\u9AD8\u50CF\u7D20:"), wrapper.offsetWidth, wrapper.offsetHeight);
          var stage = wrapper.firstChild;
          if (stage) console.log("\u5B9E\u9645\u821E\u53F0(".concat(stage.tagName, ")\u5BBD\u9AD8\u50CF\u7D20:"), stage.offsetWidth, stage.offsetHeight);
        }
      }
    }));
    debugWrapper.append(embyCheckbox({
      id: lsKeys.debugShowDanmakuCtrWrapper.id,
      name: lsKeys.debugShowDanmakuCtrWrapper.id,
      label: lsKeys.debugShowDanmakuCtrWrapper.name
    }, lsGetItem(lsKeys.debugShowDanmakuCtrWrapper.id), function (checked) {
      lsSetItem(lsKeys.debugShowDanmakuCtrWrapper.id, checked);
      var wrapper = getById(eleIds.danmakuCtr);
      if (wrapper) {
        wrapper.style.backgroundColor = checked ? styles.colors.highlight : '';
        if (checked) console.log("\u6309\u94AE\u5BB9\u5668(#".concat(eleIds.danmakuCtr, ")\u5BBD\u9AD8\u50CF\u7D20:"), wrapper.offsetWidth, wrapper.offsetHeight);
      }
    }));
    debugWrapper.append(embyCheckbox({
      id: lsKeys.debugReverseDanmu.id,
      name: lsKeys.debugReverseDanmu.id,
      label: lsKeys.debugReverseDanmu.name
    }, lsGetItem(lsKeys.debugReverseDanmu.id), function (checked) {
      var _window$ede;
      lsSetItem(lsKeys.debugReverseDanmu.id, checked);
      var comments = (_window$ede = window.ede) === null || _window$ede === void 0 ? void 0 : _window$ede.commentsOriginal;
      if (comments) {
        var modified = comments.map(function (c) {
          var values = c.p.split(',');
          values[1] = {
            '6': '1',
            '1': '6',
            '5': '4',
            '4': '5'
          }[values[1]] || values[1];
          return _objectSpread2(_objectSpread2({}, c), {}, {
            p: values.join()
          });
        });
        console.log('已' + lsKeys.debugReverseDanmu.name);
        createDanmaku(modified, createDanmakuHooks);
      }
    }));
    var toggleDanmuColor = function toggleDanmuColor(checked, lsKey, colorFn) {
      var _window$ede2;
      lsSetItem(lsKey.id, checked);
      var comments = (_window$ede2 = window.ede) === null || _window$ede2 === void 0 ? void 0 : _window$ede2.commentsOriginal;
      if (!comments) return;
      if (checked) {
        window.ede._oriComments = structuredClone(comments);
        comments = comments.map(function (c) {
          var values = c.p.split(',');
          values[2] = colorFn();
          return _objectSpread2(_objectSpread2({}, c), {}, {
            p: values.join()
          });
        });
        console.log('已' + lsKey.name);
      } else {
        comments = window.ede._oriComments;
        window.ede.commentsOriginal = comments;
        console.log('已还原' + lsKey.name);
      }
      createDanmaku(comments, createDanmakuHooks);
    };
    debugWrapper.append(embyCheckbox({
      id: lsKeys.debugRandomDanmuColor.id,
      name: lsKeys.debugRandomDanmuColor.id,
      label: lsKeys.debugRandomDanmuColor.name
    }, lsGetItem(lsKeys.debugRandomDanmuColor.id), function (checked) {
      return toggleDanmuColor(checked, lsKeys.debugRandomDanmuColor, function () {
        return parseInt(Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'), 16);
      });
    }));
    debugWrapper.append(embyCheckbox({
      id: lsKeys.debugForceDanmuWhite.id,
      name: lsKeys.debugForceDanmuWhite.id,
      label: lsKeys.debugForceDanmuWhite.name
    }, lsGetItem(lsKeys.debugForceDanmuWhite.id), function (checked) {
      return toggleDanmuColor(checked, lsKeys.debugForceDanmuWhite, function () {
        return parseInt(styles.colors.info.toString(16).padStart(6, '0'), 16);
      });
    }));
    var toggleTopBottomToScroll = function toggleTopBottomToScroll(checked, lsKey) {
      var _window$ede3;
      lsSetItem(lsKey.id, checked);
      var comments = (_window$ede3 = window.ede) === null || _window$ede3 === void 0 ? void 0 : _window$ede3.commentsOriginal;
      if (!comments) return;
      if (checked) {
        window.ede._oriComments = structuredClone(comments);
        comments = comments.map(function (c) {
          var values = c.p.split(',');
          if (values[1] === '4' || values[1] === '5') values[1] = '1';
          return _objectSpread2(_objectSpread2({}, c), {}, {
            p: values.join()
          });
        });
        console.log('已' + lsKey.name);
      } else {
        comments = window.ede._oriComments;
        window.ede.commentsOriginal = comments;
        console.log('已还原' + lsKey.name);
      }
      createDanmaku(comments, createDanmakuHooks);
    };
    debugWrapper.append(embyCheckbox({
      id: lsKeys.debugTopBottomToScroll.id,
      name: lsKeys.debugTopBottomToScroll.id,
      label: lsKeys.debugTopBottomToScroll.name
    }, lsGetItem(lsKeys.debugTopBottomToScroll.id), function (checked) {
      return toggleTopBottomToScroll(checked, lsKeys.debugTopBottomToScroll);
    }));
    var dialogContainer = document.querySelector('.' + classes.dialogContainer);
    var centeredDialog = dialogContainer === null || dialogContainer === void 0 ? void 0 : dialogContainer.firstChild;
    if (dialogContainer && centeredDialog) {
      var isExist1 = dialogContainer.classList.contains(classes.dialogBackdropOpened);
      var isExist2 = centeredDialog.classList.contains(classes.dialogBlur);
      var debugDialogHyalinizeOnChange = function debugDialogHyalinizeOnChange(checked) {
        lsSetItem(lsKeys.debugDialogHyalinize.id, checked);
        if (checked) {
          centeredDialog.classList.remove(classes.dialog);
          if (isExist1) dialogContainer.classList.remove(classes.dialogBackdropOpened);
          if (isExist2) centeredDialog.classList.remove(classes.dialogBlur);
        } else {
          centeredDialog.classList.add(classes.dialog);
          if (isExist1) dialogContainer.classList.add(classes.dialogBackdropOpened);
          if (isExist2) centeredDialog.classList.add(classes.dialogBlur);
        }
      };
      debugDialogHyalinizeOnChange(lsGetItem(lsKeys.debugDialogHyalinize.id));
      debugWrapper.append(embyCheckbox({
        id: lsKeys.debugDialogHyalinize.id,
        name: lsKeys.debugDialogHyalinize.id,
        label: lsKeys.debugDialogHyalinize.name
      }, lsGetItem(lsKeys.debugDialogHyalinize.id), debugDialogHyalinizeOnChange));
      var isExist3 = centeredDialog.classList.contains(classes.dialogFullscreen);
      var isExist4 = centeredDialog.classList.contains(classes.dialogFullscreenLowres);
      var debugDialogWindowOnChange = function debugDialogWindowOnChange(checked) {
        lsSetItem(lsKeys.debugDialogWindow.id, checked);
        if (isExist3) centeredDialog.classList.toggle(classes.dialogFullscreen, !checked);
        if (isExist4) centeredDialog.classList.toggle(classes.dialogFullscreenLowres, !checked);
      };
      debugDialogWindowOnChange(lsGetItem(lsKeys.debugDialogWindow.id));
      debugWrapper.append(embyCheckbox({
        id: lsKeys.debugDialogWindow.id,
        name: lsKeys.debugDialogWindow.id,
        label: lsKeys.debugDialogWindow.name
      }, lsGetItem(lsKeys.debugDialogWindow.id), debugDialogWindowOnChange));
      var debugDialogRightOnChange = function debugDialogRightOnChange(checked) {
        lsSetItem(lsKeys.debugDialogRight.id, checked);
        dialogContainer.classList.toggle(classes.dialogBackdropOpened, !checked);
        centeredDialog.style = checked ? styles.rightLayout : '';
        if (checked) {
          if (isExist3) centeredDialog.classList.remove(classes.dialogFullscreen);
          if (isExist4) centeredDialog.classList.remove(classes.dialogFullscreenLowres);
        }
      };
      debugDialogRightOnChange(lsGetItem(lsKeys.debugDialogRight.id));
      debugWrapper.append(embyCheckbox({
        id: lsKeys.debugDialogRight.id,
        name: lsKeys.debugDialogRight.id,
        label: lsKeys.debugDialogRight.name
      }, lsGetItem(lsKeys.debugDialogRight.id), debugDialogRightOnChange));
    }
    if (lsGetItem(lsKeys.quickDebugOn.id)) {
      var tabIframeBtn = getById(tabIframeId + 'Btn');
      if (tabIframeBtn) {
        debugWrapper.append(embyCheckbox({
          id: lsKeys.debugTabIframeEnable.id,
          name: lsKeys.debugTabIframeEnable.id,
          label: lsKeys.debugTabIframeEnable.name
        }, false, function (checked) {
          tabIframeBtn.style.display = checked ? '' : 'none';
        }));
      }
    }
    var h5VideoAdapter = getById(eleIds.h5VideoAdapter);
    if (h5VideoAdapter) {
      debugWrapper.append(embyCheckbox({
        id: lsKeys.debugH5VideoAdapterEnable.id,
        name: lsKeys.debugH5VideoAdapterEnable.id,
        label: lsKeys.debugH5VideoAdapterEnable.name
      }, lsGetItem(lsKeys.debugH5VideoAdapterEnable.id), function (checked) {
        lsSetItem(lsKeys.debugH5VideoAdapterEnable.id, checked);
        h5VideoAdapter.style.display = checked ? '' : 'none';
        h5VideoAdapter.style.backgroundColor = checked ? styles.colors.highlight : '';
      }));
    }
    if (lsGetItem(lsKeys.quickDebugOn.id)) {
      debugWrapper.append(embyCheckbox({
        id: lsKeys.debugDanmuAnywhereEnable.id,
        name: lsKeys.debugDanmuAnywhereEnable.id,
        label: lsKeys.debugDanmuAnywhereEnable.name
      }, false, function (checked) {
        if (checked) {
          var bodyEle = document.body;
          var media = document.createElement('video');
          media.id = 'test-media';
          var containerEle = document.createElement('div');
          containerEle.id = 'test-media-container';
          containerEle.className = mediaContainerQueryStr.replace('.', '');
          containerEle.style.position = 'fixed';
          containerEle.style.zIndex = '255';
          containerEle.prepend(media);
          bodyEle.prepend(containerEle);
          media.play();
          setInterval(function () {
            media.currentTime += 100 / 1e3;
            media.dispatchEvent(new Event('timeupdate'));
          }, 100);
          createDanmaku(generateRandomDanmu(50000, 600), createDanmakuHooks).then(function () {
            return console.log('弹幕就位');
          }).catch(function (err) {
            return console.log(err);
          });
        } else {
          var _window$ede4, _getById;
          if ((_window$ede4 = window.ede) !== null && _window$ede4 !== void 0 && _window$ede4.danmaku) {
            window.ede.danmaku.destroy();
            window.ede.danmaku = null;
          }
          (_getById = getById('test-media-container')) === null || _getById === void 0 || _getById.remove();
        }
      }));
    }
  }
  function buildDebugButton(container) {
    var debugWrapper = getById(eleIds.debugButton, container);
    if (!debugWrapper) return;
    debugWrapper.append(embyButton({
      label: '打印环境信息',
      style: 'margin: 0.3em;'
    }, function () {
      if (typeof require === 'function') {
        require(['browser'], function (browser) {
          return console.log('Emby 内部自身判断: ', browser);
        });
      }
      if (typeof ApiClient !== 'undefined') {
        console.log('Emby appName: ', ApiClient.appName());
        console.log('Emby appVersion: ', ApiClient.appVersion());
      }
    }));
    debugWrapper.append(embyButton({
      label: '打印弹幕引擎信息',
      style: 'margin: 0.3em;'
    }, function () {
      var _window$ede5;
      var msg = "\u5F39\u5E55\u5F15\u64CE\u662F\u5426\u5B58\u5728: ".concat(!!window.Danmaku, ", \u5F39\u5E55\u5F15\u64CE\u662F\u5426\u5B9E\u4F8B\u5316\u6210\u529F: ").concat(!!((_window$ede5 = window.ede) !== null && _window$ede5 !== void 0 && _window$ede5.danmaku));
      console.log(msg);
      embyToast({
        text: msg
      });
    }));
    debugWrapper.append(embyButton({
      label: '打印视频加载方',
      style: 'margin: 0.3em;'
    }, function () {
      var _media = document.querySelector(mediaContainerQueryStr);
      if (!_media) return console.error('严重错误,页面中依旧不存在 <video> 标签');
      if (_media.currentTime < 1) return console.error('严重错误,<video> 的 currentTime < 1');
      if (!_media.id) {
        var _media$parentNode;
        console.log('视频加载方为 Web 端 <video> 标签:', (_media$parentNode = _media.parentNode) === null || _media$parentNode === void 0 ? void 0 : _media$parentNode.outerHTML);
      } else {
        console.log('当前 <video> 标签为虚拟适配器:', _media.outerHTML);
        var _embed = document.querySelector('embed');
        if (_embed) {
          var _embed$parentNode;
          console.log('视频加载方为 <embed> 标签占位的 Native 播放器:', (_embed$parentNode = _embed.parentNode) === null || _embed$parentNode === void 0 ? void 0 : _embed$parentNode.outerHTML);
        } else {
          console.log('视频加载方为无占位标签的 Native 播放器,无信息');
        }
      }
    }));
    debugWrapper.append(embyButton({
      label: '重置设置',
      class: classes.embyButtons.submit,
      style: 'margin: 0.3em;'
    }, function () {
      settingsReset(lsKeys, lsBatchSet);
      console.log("\u5DF2\u91CD\u7F6E\u8BBE\u7F6E, \u8DF3\u8FC7\u4E86 ".concat(lsKeys.filterKeywords.name, " \u91CD\u7F6E"));
      embyToast({
        text: "\u5DF2\u91CD\u7F6E\u8BBE\u7F6E, \u8DF3\u8FC7\u4E86 ".concat(lsKeys.filterKeywords.name, " \u91CD\u7F6E")
      });
      loadDanmaku(LOAD_TYPE.INIT);
      closeEmbyDialog();
    }));
  }
  function buildOpenSourceLicense(container) {
    var openSourceWrapper = getById(eleIds.openSourceLicenseDiv, container);
    if (!openSourceWrapper) return;
    objectEntries(openSourceLicense).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        val = _ref2[1];
      openSourceWrapper.append(embyALink(val.url, [key, val.name, val.version, val.license].join(' : ')));
    });
  }

  /**
   * 构建关于 Tab
   * @param {string} containerId
   */
  function buildAbout(containerId) {
    var container = getById(containerId);
    if (!container) return;
    var template = "\n        <div style=\"height: 30em;\">\n            <div id=\"".concat(eleIds.consoleLogCtrl, "\"></div>\n            <div id=\"").concat(eleIds.consoleLogInfo, "\">\n                <textarea id=\"").concat(eleIds.consoleLogText, "\" readOnly style=\"resize: vertical;margin-top: 0.6em;\"\n                    rows=\"12\" is=\"emby-textarea\" class=\"txtOverview emby-textarea\"></textarea>\n                <textarea id=\"").concat(eleIds.consoleLogTextInput, "\" hidden style=\"resize: vertical;\"\n                    rows=\"1\" is=\"emby-textarea\" class=\"txtOverview emby-textarea\"></textarea>\n            </div>\n            <div class=\"").concat(classes.embyFieldDesc, "\">\u6CE8\u610F\u5F00\u542F\u540E\u539F\u672C\u63A7\u5236\u53F0\u4E2D\u8C03\u7528\u65B9\u4FE1\u606F\u5C06\u88AB\u8986\u76D6,\u4E0D\u4F7F\u7528\u8BF7\u4FDD\u6301\u5173\u95ED\u72B6\u6001</div>\n            <div is=\"emby-collapse\" title=\"\u5F00\u53D1\u8005\u9009\u9879\">\n                <div class=\"").concat(classes.collapseContentNav, "\">\n                    <label class=\"").concat(classes.embyLabel, "\">\u8C03\u8BD5\u5F00\u5173: </label>\n                    <div id=\"").concat(eleIds.debugCheckbox, "\" class=\"").concat(classes.embyCheckboxList, "\" style=\"").concat(styles.embyCheckboxList, "\"></div>\n                    <label class=\"").concat(classes.embyLabel, "\">\u8C03\u8BD5\u6309\u94AE: </label>\n                    <div id=\"").concat(eleIds.debugButton, "\"></div>\n                </div>\n            </div>\n            <div is=\"emby-collapse\" title=\"\u5F00\u653E\u6E90\u4EE3\u7801\u8BB8\u53EF\" data-expanded=\"true\" style=\"margin-top: 0.6em;\">\n                <div id=\"").concat(eleIds.openSourceLicenseDiv, "\" class=\"").concat(classes.collapseContentNav, "\" style=\"display: flex; flex-direction: column;\"></div>\n            </div>\n        </div>\n    ");
    container.innerHTML = template.trim();
    buildConsoleLog(container);
    buildDebugCheckbox(container);
    buildDebugButton(container);
    buildOpenSourceLicense(container);
  }

  /**
   * UI Tabs 统一导出与 danmakuTabOpts
   */
  function buildIframe(containerId) {
    var container = document.getElementById(containerId);
    if (container) container.innerHTML = '<iframe id="' + tabIframeId + '" style="width:100%;height:100%;"></iframe>';
  }
  var danmakuTabOpts = [{
    id: 'danmakuTab0',
    name: '弹幕设置',
    buildMethod: buildDanmakuSetting
  }, {
    id: 'danmakuTab1',
    name: '手动匹配',
    buildMethod: buildSearchEpisode
  }, {
    id: currentDanmakuInfoContainerId,
    name: '弹幕信息',
    buildMethod: buildCurrentDanmakuInfo
  }, {
    id: 'danmakuTab3',
    name: '高级设置',
    buildMethod: buildProSetting
  }, {
    id: 'danmakuTab4',
    name: '关于',
    buildMethod: buildAbout
  }, {
    id: tabIframeId,
    name: '内嵌网页',
    hidden: true,
    buildMethod: buildIframe
  }];

  /**
   * 调用 Emby 原生 dialog 模块
   * @param {object} opts - { text, title, timeout, html, buttons }
   * @returns {Promise}
   */
  async function embyDialog() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var defaultOpts = {
      text: '',
      title: '',
      timeout: 0,
      html: '',
      buttons: []
    };
    opts = _objectSpread2(_objectSpread2({}, defaultOpts), opts);
    if (typeof require === 'function') {
      return require(['dialog']).then(function (items) {
        return items[0](opts);
      }).catch(function (error) {
        console.log('点击弹出框外部取消: ' + error);
      });
    }
    return Promise.reject(new Error('Emby require not available'));
  }

  /**
   * 关闭当前弹窗
   */
  function closeEmbyDialog() {
    var footerItem = getByClass(classes.formDialogFooterItem);
    if (footerItem) {
      footerItem.dispatchEvent(new Event('click'));
    }
  }

  /**
   * 调用 Emby 原生 toast 模块
   * @param {object} opts - { text, secondaryText, icon, iconStrikeThrough }
   * @returns {Promise}
   */
  async function embyToast() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var defaultOpts = {
      text: '',
      secondaryText: '',
      icon: '',
      iconStrikeThrough: false
    };
    opts = _objectSpread2(_objectSpread2({}, defaultOpts), opts);
    if (typeof require === 'function') {
      return require(['toast'], function (toast) {
        return toast(opts);
      });
    }
    return Promise.reject(new Error('Emby require not available'));
  }

  /**
   * 弹窗容器就绪后的回调，构建 Tab 内容
   * @param {HTMLElement} dialogContainer
   */
  async function afterEmbyDialogCreated(dialogContainer) {
    var itemInfoMap = await getMapByEmbyItemInfo();
    if (itemInfoMap && window.ede) {
      window.ede.searchDanmakuOpts = {
        _id_key: itemInfoMap._id_key,
        _season_key: itemInfoMap._season_key,
        _episode_key: itemInfoMap._episode_key,
        animeId: itemInfoMap.animeId,
        animeName: itemInfoMap.animeName,
        seriesOrMovieId: itemInfoMap.seriesOrMovieId,
        episode: (parseInt(itemInfoMap.episode) || 1) - 1,
        animes: []
      };
    }
    var formDialogHeader = getByClass(classes.formDialogHeader);
    var formDialogFooter = getByClass(classes.formDialogFooter);
    formDialogHeader = formDialogHeader || dialogContainer;
    var tabsMenuContainer = document.createElement('div');
    tabsMenuContainer.className = classes.embyTabsMenu;
    tabsMenuContainer.append(embyTabs(danmakuTabOpts, danmakuTabOpts[0].id, 'id', 'name', function (value) {
      danmakuTabOpts.forEach(function (obj) {
        var elem = getById(obj.id);
        if (elem) elem.hidden = obj.id !== value.id;
      });
    }));
    formDialogHeader.append(tabsMenuContainer);
    formDialogHeader.style = 'width: 100%; padding: 0; height: auto;';
    danmakuTabOpts.forEach(function (tab, index) {
      var tabContainer = document.createElement('div');
      tabContainer.id = tab.id;
      tabContainer.style.textAlign = 'left';
      tabContainer.hidden = index !== 0;
      dialogContainer.append(tabContainer);
      try {
        tab.buildMethod(tab.id);
      } catch (error) {
        console.error(error);
      }
    });
    if (formDialogFooter) {
      formDialogFooter.style.padding = '0.3em';
    }
  }

  /**
   * 创建弹幕设置弹窗
   * @param {function(HTMLElement): void} [onDialogReady] - 可选，默认使用 afterEmbyDialogCreated
   */
  function createDialog(onDialogReady) {
    if (typeof require === 'function') {
      require(['emby-select', 'emby-checkbox', 'emby-slider', 'emby-textarea', 'emby-collapse', 'emby-button']);
    }
    var html = "<div id=\"".concat(eleIds.dialogContainer, "\"></div>");
    embyDialog({
      html: html,
      buttons: [{
        name: '关闭'
      }]
    });
    waitForElement('#' + eleIds.dialogContainer, onDialogReady || afterEmbyDialogCreated);
  }

  /**
   * UI 初始化
   * 从 ede.js 迁移，未修改原有实现逻辑
   */
  var mediaBtnOpts = [{
    id: eleIds.danmakuSwitchBtn,
    label: '弹幕开关',
    iconKey: iconKeys.comment,
    onClick: doDanmakuSwitch
  }, {
    label: '弹幕设置',
    iconKey: iconKeys.setting,
    onClick: function onClick() {
      return createDialog();
    }
  }];
  function doDanmakuSwitch() {
    var _window$ede;
    var flag = !lsGetItem(lsKeys.switch.id);
    lsSetItem(lsKeys.switch.id, flag);
    if ((_window$ede = window.ede) !== null && _window$ede !== void 0 && _window$ede.danmaku) {
      flag ? window.ede.danmaku.show() : window.ede.danmaku.hide();
    }
    var osdDanmakuSwitchBtn = getById(eleIds.danmakuSwitchBtn);
    if (osdDanmakuSwitchBtn) {
      osdDanmakuSwitchBtn.firstChild.innerHTML = flag ? iconKeys.comment : iconKeys.comments_disabled;
    }
    var switchElement = getById(eleIds.danmakuSwitch);
    if (switchElement) {
      switchElement.firstChild.innerHTML = flag ? iconKeys.switch_on : iconKeys.switch_off;
      switchElement.style.color = flag ? styles.colors.switchActiveColor : '';
    }
  }

  /**
   * 初始化播放页弹幕按钮等 UI
   */
  function initUI() {
    var _window$ede3;
    if (getById(eleIds.danmakuCtr)) return;
    console.log('正在初始化UI');
    if (typeof ApiClient !== 'undefined' && parseFloat(ApiClient.serverVersion()) < 4.8) {
      setMediaContainerQueryStr('div[data-type="video-osd"]');
      setVersionOld(true);
    }
    var queryStr = mediaContainerQueryStr + (mediaContainerQueryStr.includes(notHide) ? '' : notHide);
    var ctrlWrapperQueryStr = "".concat(queryStr, " .videoOsdBottom-maincontrols");
    waitForElement(ctrlWrapperQueryStr, function (wrapper) {
      var _window$ede2;
      var commonWrapper = getByClass(classes.videoOsdBottomButtons + notHide, wrapper);
      if (commonWrapper) {
        wrapper = commonWrapper;
      } else {
        wrapper = getByClass(classes.videoOsdBottomButtonsTopRight, wrapper);
      }
      var rightButtons = getByClass(classes.videoOsdBottomButtonsRight, wrapper);
      var menubar = document.createElement('div');
      menubar.id = eleIds.danmakuCtr;
      if (!((_window$ede2 = window.ede) !== null && _window$ede2 !== void 0 && _window$ede2.episode_info)) {
        menubar.style.opacity = '0.5';
      }
      if (rightButtons) {
        wrapper.insertBefore(menubar, rightButtons);
      } else {
        wrapper.append(menubar);
      }
      mediaBtnOpts.forEach(function (opt) {
        menubar.appendChild(embyButton(opt, opt.onClick));
      });
      console.log('UI初始化完成');
    }, 0, check_interval, (_window$ede3 = window.ede) === null || _window$ede3 === void 0 ? void 0 : _window$ede3.destroyIntervalIds);
  }

  /**
   * 初始化播放事件监听
   * @param {object} [handlers] - { onPlaybackStart, onPlaybackStop, onVideoOsdShow, onVideoOsdHide, playbackEventsRefresh, refreshEventListener, loadDanmaku }
   */
  function initListener() {
    var _OS$isAndroidEmbyNois, _OS$isEmbyUWP;
    var handlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _media = document.querySelector(mediaQueryStr);
    if (!_media) {
      var _window$ede4;
      if ((_window$ede4 = window.ede) !== null && _window$ede4 !== void 0 && _window$ede4.episode_info) window.ede.episode_info = null;
      return;
    }
    if (_media.getAttribute('ede_listening')) return;
    console.log('正在初始化Listener');
    if (handlers.playbackEventsRefresh && handlers.onPlaybackStart) {
      handlers.playbackEventsRefresh({
        playbackstart: handlers.onPlaybackStart
      });
    }
    if (handlers.playbackEventsRefresh && handlers.onPlaybackStop) {
      handlers.playbackEventsRefresh({
        playbackstop: handlers.onPlaybackStop
      });
    }
    _media.setAttribute('ede_listening', 'true');
    if (handlers.refreshEventListener) {
      if (handlers.onVideoOsdShow) handlers.refreshEventListener({
        'video-osd-show': handlers.onVideoOsdShow
      });
      if (handlers.onVideoOsdHide) handlers.refreshEventListener({
        'video-osd-hide': handlers.onVideoOsdHide
      });
    }
    console.log('Listener初始化完成');
    if (((_OS$isAndroidEmbyNois = OS.isAndroidEmbyNoisyX) !== null && _OS$isAndroidEmbyNois !== void 0 && _OS$isAndroidEmbyNois.call(OS) || (_OS$isEmbyUWP = OS.isEmbyUWP) !== null && _OS$isEmbyUWP !== void 0 && _OS$isEmbyUWP.call(OS)) && handlers.loadDanmaku) {
      handlers.loadDanmaku('init');
    }
  }

  /**
   * 初始化样式（修复小秘版 toast 等）
   */
  function initCss() {
    if (OS.isEmbyNoisyX && OS.isEmbyNoisyX()) {
      var existingStyle = document.querySelector('style[css-emby-noisyx-fix]');
      if (!existingStyle) {
        var style = document.createElement('style');
        style.setAttribute('css-emby-noisyx-fix', '');
        style.innerHTML = "\n                [class*=\"accent-\"].noScrollY.transparentDocument .toast-group {\n                    position: fixed;\n                    top: auto;\n                }\n            ";
        document.head.appendChild(style);
      }
    }
  }

  /**
   * 彩蛋与调试
   */
  function toggleSettingBtn2Header() {
    var targetBtn = getById(eleIds.danmakuSettingBtnDebug);
    if (targetBtn) {
      targetBtn.remove();
      return false;
    }
    var headerRight = getByClass(classes.headerRight);
    if (!headerRight) return false;
    var opt = {
      id: eleIds.danmakuSettingBtnDebug,
      label: '弹幕设置',
      iconKey: 'tune',
      onClick: function onClick() {
        return createDialog();
      }
    };
    headerRight.prepend(embyButton(opt, opt.onClick));
    return true;
  }
  function quickDebug() {
    var flag = toggleSettingBtn2Header();
    embyToast({
      text: "".concat(lsKeys.quickDebugOn.name, ": ").concat(flag, "!")
    });
    if (!window.ede) window.ede = new EDE();
    lsSetItem(lsKeys.quickDebugOn.id, flag);
    checkRuntimeVars();
  }
  function checkRuntimeVars() {
    var exposeGlobalThis = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    console.log('运行时变量检查');
    console.log(lsKeys.customeCorsProxyUrl.name, corsProxy);
    console.log(lsKeys.customeDanmakuUrl.name, requireDanmakuPath);
    console.log('弹弹 play API 模板', dandanplayApi);
    if (exposeGlobalThis) window.checkRuntimeVars = checkRuntimeVars;
  }
  function addEasterEggListener() {
    var _OS$isMobile;
    var target = getByClass(classes.headerUserButton);
    if (!target) return;
    var longPressTimeout;
    function startLongPress() {
      longPressTimeout = setTimeout(function () {
        console.log('恭喜你发现了隐藏功能, 长按了 2 秒!');
        quickDebug();
      }, 2000);
    }
    function cancelLongPress() {
      clearTimeout(longPressTimeout);
    }
    var isMobile = (OS === null || OS === void 0 || (_OS$isMobile = OS.isMobile) === null || _OS$isMobile === void 0 ? void 0 : _OS$isMobile.call(OS)) || false;
    var startEventName = isMobile ? 'touchstart' : 'mousedown';
    var endEventName = isMobile ? 'touchend' : 'mouseup';
    if (typeof require === 'function') {
      require(['browser'], function (browser) {
        if (browser !== null && browser !== void 0 && browser.tv) {
          startEventName = 'focus';
          endEventName = 'blur';
        }
        if (target.getAttribute('startFlag') !== '1') {
          target.addEventListener(startEventName, startLongPress);
          target.setAttribute('startFlag', '1');
        }
        if (target.getAttribute('endFlag') !== '1') {
          target.addEventListener(endEventName, cancelLongPress);
          target.setAttribute('endFlag', '1');
        }
      });
    }
  }

  /**
   * 播放事件处理
   */

  /**
   * 播放停止时按百分比处理（Bangumi 提交等）
   */
  function onPlaybackStopPct(e, state) {
    var _state$PlayState, _window$ede;
    if (!(state !== null && state !== void 0 && state.NowPlayingItem)) return console.log('跳过 Web 端自身错误触发的第二次播放停止事件');
    console.log(e === null || e === void 0 ? void 0 : e.type);
    var positionTicks = (_state$PlayState = state.PlayState) === null || _state$PlayState === void 0 ? void 0 : _state$PlayState.PositionTicks;
    var runtimeTicks = state.NowPlayingItem.RunTimeTicks;
    if (!runtimeTicks) return console.log('无可播放时长,跳过处理');
    var pct = parseInt(positionTicks / runtimeTicks * 100);
    console.log("\u7ED3\u675F\u64AD\u653E\u767E\u5206\u6BD4: ".concat(pct, "%"));
    var bangumiPostPercent = lsGetItem(lsKeys.bangumiPostPercent.id);
    var bangumiToken = lsGetItem(lsKeys.bangumiToken.id);
    if (lsGetItem(lsKeys.bangumiEnable.id) && bangumiToken && pct >= bangumiPostPercent && (_window$ede = window.ede) !== null && _window$ede !== void 0 && (_window$ede = _window$ede.episode_info) !== null && _window$ede !== void 0 && _window$ede.episodeId) {
      var _window$ede$episode_i = window.ede.episode_info,
        animeTitle = _window$ede$episode_i.animeTitle,
        episodeTitle = _window$ede$episode_i.episodeTitle;
      var targetName = "".concat(animeTitle, " - ").concat(episodeTitle);
      putBangumiEpStatus(bangumiToken).then(function () {
        embyToast({
          text: "putBangumiEpStatus \u6210\u529F, \u76EE\u6807: ".concat(targetName, ", \u7ED3\u675F\u64AD\u653E\u767E\u5206\u6BD4: ").concat(pct, "%")
        });
      }).catch(function (error) {
        embyToast({
          text: "putBangumiEpStatus \u5931\u8D25, \u76EE\u6807: ".concat(targetName, ", ").concat(error.message)
        });
      });
    }
  }

  /**
   * 播放开始
   */
  function onPlaybackStart(e, state) {
    console.log(e === null || e === void 0 ? void 0 : e.type);
    loadDanmaku(LOAD_TYPE.INIT);
  }

  /**
   * 播放停止
   */
  function onPlaybackStop(e, state) {
    console.log(e === null || e === void 0 ? void 0 : e.type);
    onPlaybackStopPct(e, state);
    if (lsGetItem(lsKeys.osdHeaderClockEnable.id)) {
      removeHeaderClock();
    }
    danmakuAutoFilterCancel();
  }

  /**
   * H5 视频适配器
   * 魔改版客户端（NativePlayer 等）无 <video> 时，创建虚拟 video 并同步播放状态
   * 从 ede.js 5113-5180 行迁移
   */

  /**
   * 平滑补充 <video> timeupdate 中秒级间隔缺失的 100ms 间隙
   * @param {HTMLVideoElement|null} media - video 元素，null 时自动查询
   * @param {boolean} enable - 是否启用
   */
  function videoTimeUpdateInterval(media, enable) {
    var _media = media || document.querySelector(mediaQueryStr);
    if (!_media) return;
    if (enable && !_media.timeupdateIntervalId) {
      _media.timeupdateIntervalId = setInterval(function () {
        _media.currentTime += 100 / 1e3;
      }, 100);
    } else if (!enable && _media.timeupdateIntervalId) {
      clearInterval(_media.timeupdateIntervalId);
      _media.timeupdateIntervalId = null;
    }
  }

  /**
   * 当播放页没有 <video> 时，创建虚拟 video 并同步 Native 播放器状态
   */
  async function initH5VideoAdapter() {
    var _media = document.querySelector(mediaQueryStr);
    if (_media) {
      if (_media.id === eleIds.h5VideoAdapter) {
        videoTimeUpdateInterval(_media, true);
      }
      return;
    }
    console.log('播放页不存在 video 标签,适配器处理开始');
    _media = document.createElement('video');
    if (OS.isApple()) {
      _media.src = '';
    }
    _media.style.display = 'none';
    _media.id = eleIds.h5VideoAdapter;
    _media.classList.add('htmlvideoplayer', 'moveUpSubtitles');
    document.body.prepend(_media);
    _media.play();
    videoTimeUpdateInterval(_media, true);
    if (typeof require !== 'function') {
      console.warn('initH5VideoAdapter: require 不可用，跳过 playbackManager 同步');
      return;
    }
    require(['playbackManager'], function (playbackManager) {
      playbackEventsRefresh({
        timeupdate: function timeupdate() {
          var _playbackManager$getP;
          var realCurrentTime = playbackManager.currentTime(playbackManager.getCurrentPlayer()) / 1e7;
          var mediaTime = _media.currentTime;
          _media.currentTime = realCurrentTime;
          var embyPlaybackRate = (_playbackManager$getP = playbackManager.getPlayerState) === null || _playbackManager$getP === void 0 || (_playbackManager$getP = _playbackManager$getP.call(playbackManager)) === null || _playbackManager$getP === void 0 || (_playbackManager$getP = _playbackManager$getP.PlayState) === null || _playbackManager$getP === void 0 ? void 0 : _playbackManager$getP.PlaybackRate;
          _media.playbackRate = embyPlaybackRate ? embyPlaybackRate : 1;
          if (Math.abs(mediaTime - realCurrentTime) > 2) {
            _media.dispatchEvent(new Event('seeking'));
            console.warn('seeking', realCurrentTime, mediaTime);
          }
          if (lsGetItem(lsKeys.debugH5VideoAdapterEnable.id)) {
            console.warn("".concat(eleIds.h5VideoAdapter, ", currentTime: ").concat(_media.currentTime, ", playbackRate: ").concat(_media.playbackRate));
          }
        }
      });
    });
    playbackEventsRefresh({
      pause: function pause() {
        console.warn('pause');
        _media.dispatchEvent(new Event('pause'));
        videoTimeUpdateInterval(_media, false);
      },
      unpause: function unpause() {
        console.warn('unpause');
        _media.dispatchEvent(new Event('play'));
        videoTimeUpdateInterval(_media, true);
      }
    });
    console.log('已创建虚拟 video 标签,适配器处理正确结束');
  }

  /**
   * 视图显示/隐藏事件
   */

  /**
   * 退出播放页时清理
   */
  function beforeDestroy(e) {
    var _e$detail, _window$ede;
    if ((e === null || e === void 0 || (_e$detail = e.detail) === null || _e$detail === void 0 ? void 0 : _e$detail.type) !== 'video-osd') return;
    if ((_window$ede = window.ede) !== null && _window$ede !== void 0 && _window$ede.danmaku) {
      window.ede.danmaku.clear();
    }
    var danmakuCtr = getById(eleIds.danmakuCtr);
    if (danmakuCtr) danmakuCtr.remove();
    videoTimeUpdateInterval(null, false);
    destroyAllInterval();
    lsSetItem(lsKeys.timelineOffset.id, lsKeys.timelineOffset.defaultValue);
  }

  /**
   * 进入播放页时初始化
   */
  function onViewShow(e) {
    var _e$detail2;
    console.log(e === null || e === void 0 ? void 0 : e.type, e);
    customeUrl.init();
    if (lsGetItem(lsKeys.quickDebugOn.id) && !getById(eleIds.danmakuSettingBtnDebug)) {
      quickDebug();
    }
    addEasterEggListener();
    if ((e === null || e === void 0 || (_e$detail2 = e.detail) === null || _e$detail2 === void 0 ? void 0 : _e$detail2.type) === 'video-osd') {
      if (!window.ede) window.ede = new EDE();
      if (!window.ede.appLogAspect && lsGetItem(lsKeys.consoleLogEnable.id)) {
        window.ede.appLogAspect = new AppLogAspect().init();
      }
      initUI();
      initH5VideoAdapter();
      initListener({
        onPlaybackStart: onPlaybackStart,
        onPlaybackStop: onPlaybackStop,
        onVideoOsdShow: onVideoOsdShow,
        onVideoOsdHide: onVideoOsdHide,
        playbackEventsRefresh: playbackEventsRefresh,
        refreshEventListener: refreshEventListener,
        loadDanmaku: function loadDanmaku$1(type) {
          return loadDanmaku(type, {
            buildCurrentDanmakuInfo: buildCurrentDanmakuInfo,
            appendvideoOsdDanmakuInfo: appendvideoOsdDanmakuInfo
          });
        }
      });
      initCss();
    }
    if (window.ede) {
      var _e$detail3;
      window.ede.itemId = e !== null && e !== void 0 && (_e$detail3 = e.detail) !== null && _e$detail3 !== void 0 && (_e$detail3 = _e$detail3.params) !== null && _e$detail3 !== void 0 && _e$detail3.id ? e.detail.params.id : '';
    }
  }

  /**
   * EDE 模块化入口
   * 阶段 0-5，组装 config、core、utils、match、danmaku、bangumi、ui、events
   * 与原始 ede.js 一致：window.ede 在 onViewShow(video-osd) 时懒初始化，不在此处创建
   */
  (function () {

    refreshEventListener({
      viewshow: onViewShow
    });
    refreshEventListener({
      viewbeforehide: beforeDestroy
    });
    console.log('[EDE] modular init done');
  })();

})();
//# sourceMappingURL=ede.js.map

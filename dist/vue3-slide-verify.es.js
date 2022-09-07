import { reactive, ref, defineComponent, onMounted, onBeforeUnmount, openBlock, createElementBlock, normalizeStyle, createElementVNode, normalizeClass, createCommentVNode, toDisplayString, pushScopeId, popScopeId } from "vue";
const PI = Math.PI;
function sum(x, y) {
  return x + y;
}
function square(x) {
  return x * x;
}
function draw(ctx, x, y, l, r, operation) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI);
  ctx.lineTo(x + l, y);
  ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
  ctx.lineTo(x + l, y + l);
  ctx.lineTo(x, y + l);
  ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
  ctx.lineTo(x, y);
  ctx.lineWidth = 2;
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
  ctx.stroke();
  ctx[operation]();
  ctx.globalCompositeOperation = "destination-over";
}
function createImg(imgs, onload) {
  const img = document.createElement("img");
  img.crossOrigin = "Anonymous";
  img.onload = onload;
  img.onerror = () => {
    img.src = getRandomImg(imgs);
  };
  img.src = getRandomImg(imgs);
  return img;
}
function getRandomNumberByRange(start, end) {
  return Math.round(Math.random() * (end - start) + start);
}
function getRandomImg(imgs) {
  const len = imgs.length;
  return len > 0 ? imgs[getRandomNumberByRange(0, len - 1)] : "https://source.unsplash.com/300x150/?book,library";
}
function throttle(fn, interval, options = { leading: true, trailing: true }) {
  const { leading, trailing, resultCallback } = options;
  let lastTime = 0;
  let timer = null;
  const _throttle = function(...args) {
    return new Promise((resolve, reject) => {
      const nowTime = new Date().getTime();
      if (!lastTime && !leading)
        lastTime = nowTime;
      const remainTime = interval - (nowTime - lastTime);
      if (remainTime <= 0) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        const result = fn.apply(this, args);
        if (resultCallback)
          resultCallback(result);
        resolve(result);
        lastTime = nowTime;
        return;
      }
      if (trailing && !timer) {
        timer = setTimeout(() => {
          timer = null;
          lastTime = !leading ? 0 : new Date().getTime();
          const result = fn.apply(this, args);
          if (resultCallback)
            resultCallback(result);
          resolve(result);
        }, remainTime);
      }
    });
  };
  _throttle.cancel = function() {
    if (timer)
      clearTimeout(timer);
    timer = null;
    lastTime = 0;
  };
  return _throttle;
}
function useSlideAction() {
  const origin = reactive({
    x: 0,
    y: 0
  });
  const success = ref(false);
  const isMouseDown = ref(false);
  const timestamp = ref(0);
  const trail = ref([]);
  const start = (e) => {
    if (success.value)
      return;
    if (e instanceof MouseEvent) {
      origin.x = e.clientX;
      origin.y = e.clientY;
    } else {
      origin.x = e.changedTouches[0].pageX;
      origin.y = e.changedTouches[0].pageY;
    }
    isMouseDown.value = true;
    timestamp.value = Date.now();
  };
  const move = (w, e, cb) => {
    if (!isMouseDown.value)
      return false;
    let moveX = 0;
    let moveY = 0;
    if (e instanceof MouseEvent) {
      moveX = e.clientX - origin.x;
      moveY = e.clientY - origin.y;
    } else {
      moveX = e.changedTouches[0].pageX - origin.x;
      moveY = e.changedTouches[0].pageY - origin.y;
    }
    if (moveX < 0 || moveX + 38 >= w)
      return false;
    cb(moveX);
    trail.value.push(moveY);
  };
  const verify = (left, blockX, accuracy) => {
    const arr = trail.value;
    const average = arr.reduce(sum) / arr.length;
    const deviations = arr.map((x) => x - average);
    const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length);
    const leftNum = parseInt(left);
    accuracy = accuracy <= 1 ? 1 : accuracy > 10 ? 10 : accuracy;
    return {
      spliced: Math.abs(leftNum - blockX) <= accuracy,
      TuringTest: average !== stddev
    };
  };
  const end = (e, cb) => {
    if (!isMouseDown.value)
      return false;
    isMouseDown.value = false;
    const moveX = e instanceof MouseEvent ? e.clientX : e.changedTouches[0].pageX;
    if (moveX === origin.x)
      return false;
    timestamp.value = Date.now() - timestamp.value;
    cb(timestamp.value);
  };
  return { origin, success, isMouseDown, timestamp, trail, start, move, end, verify };
}
var slideVerify_vue_vue_type_style_index_0_scoped_true_lang = "";
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main = defineComponent({
  name: "SlideVerify",
  props: {
    l: {
      type: Number,
      default: 42
    },
    r: {
      type: Number,
      default: 10
    },
    w: {
      type: Number,
      default: 310
    },
    h: {
      type: Number,
      default: 155
    },
    sliderText: {
      type: String,
      default: "Slide filled right"
    },
    accuracy: {
      type: Number,
      default: 5
    },
    show: {
      type: Boolean,
      default: true
    },
    imgs: {
      type: Array,
      default: () => []
    },
    interval: {
      type: Number,
      default: 50
    }
  },
  emits: ["success", "again", "fail", "refresh"],
  setup(props, { emit }) {
    const { imgs, l, r, w, h, accuracy, interval } = props;
    const loadBlock = ref(true);
    const blockX = ref(0);
    const blockY = ref(0);
    const containerCls = reactive({
      containerActive: false,
      containerSuccess: false,
      containerFail: false
    });
    const sliderBox = reactive({
      iconCls: "arrow-right",
      width: "0",
      left: "0"
    });
    const block = ref();
    const blockCtx = ref();
    const canvas = ref();
    const canvasCtx = ref();
    let img;
    const { success, start, move, end, verify } = useSlideAction();
    const reset = () => {
      var _a, _b;
      success.value = false;
      containerCls.containerActive = false;
      containerCls.containerSuccess = false;
      containerCls.containerFail = false;
      sliderBox.iconCls = "arrow-right";
      sliderBox.left = "0";
      sliderBox.width = "0";
      block.value.style.left = "0";
      (_a = canvasCtx.value) == null ? void 0 : _a.clearRect(0, 0, w, h);
      (_b = blockCtx.value) == null ? void 0 : _b.clearRect(0, 0, w, h);
      block.value.width = w;
      img.src = getRandomImg(imgs);
    };
    const refresh = () => {
      reset();
      emit("refresh");
    };
    function moveCb(moveX) {
      sliderBox.left = moveX + "px";
      let blockLeft = (w - 40 - 20) / (w - 40) * moveX;
      block.value.style.left = blockLeft + "px";
      containerCls.containerActive = true;
      sliderBox.width = moveX + "px";
    }
    function endCb(timestamp) {
      const { spliced, TuringTest } = verify(block.value.style.left, blockX.value, accuracy);
      if (spliced) {
        if (accuracy === -1) {
          containerCls.containerSuccess = true;
          sliderBox.iconCls = "success";
          success.value = true;
          emit("success", timestamp);
          return;
        }
        if (TuringTest) {
          containerCls.containerSuccess = true;
          sliderBox.iconCls = "success";
          success.value = true;
          emit("success", timestamp);
        } else {
          containerCls.containerFail = true;
          sliderBox.iconCls = "fail";
          emit("again");
        }
      } else {
        containerCls.containerFail = true;
        sliderBox.iconCls = "fail";
        emit("fail");
        setTimeout(() => {
          reset();
        }, 1e3);
      }
    }
    const touchMoveEvent = throttle((e) => {
      move(w, e, moveCb);
    }, interval);
    const touchEndEvent = (e) => {
      end(e, endCb);
    };
    onMounted(() => {
      var _a, _b;
      const _canvasCtx = (_a = canvas.value) == null ? void 0 : _a.getContext("2d");
      const _blockCtx = (_b = block.value) == null ? void 0 : _b.getContext("2d");
      canvasCtx.value = _canvasCtx;
      blockCtx.value = _blockCtx;
      img = createImg(imgs, () => {
        loadBlock.value = false;
        const L = l + r * 2 + 3;
        blockX.value = getRandomNumberByRange(L + 10, w - (L + 10));
        blockY.value = getRandomNumberByRange(10 + r * 2, h - (L + 10));
        if (_canvasCtx && _blockCtx) {
          draw(_canvasCtx, blockX.value, blockY.value, l, r, "fill");
          draw(_blockCtx, blockX.value, blockY.value, l, r, "clip");
          _canvasCtx.drawImage(img, 0, 0, w, h);
          _blockCtx.drawImage(img, 0, 0, w, h);
          const _y = blockY.value - r * 2 - 1;
          const imgData = _blockCtx.getImageData(blockX.value, _y, L, L);
          block.value.width = L;
          _blockCtx.putImageData(imgData, 0, _y);
        }
      });
      document.addEventListener("mousemove", touchMoveEvent);
      document.addEventListener("mouseup", touchEndEvent);
    });
    onBeforeUnmount(() => {
      document.removeEventListener("mousemove", touchMoveEvent);
      document.removeEventListener("mouseup", touchEndEvent);
    });
    return {
      block,
      canvas,
      loadBlock,
      containerCls,
      sliderBox,
      refresh,
      sliderDown: start,
      touchStartEvent: start,
      touchMoveEvent,
      touchEndEvent
    };
  }
});
const _withScopeId = (n) => (pushScopeId("data-v-f61c42f2"), n = n(), popScopeId(), n);
const _hoisted_1 = ["width", "height"];
const _hoisted_2 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("i", { class: "iconfont icon-refresh" }, null, -1));
const _hoisted_3 = [
  _hoisted_2
];
const _hoisted_4 = ["width", "height"];
const _hoisted_5 = { class: "slide-verify-slider-text" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    id: "slideVerify",
    class: "slide-verify",
    style: normalizeStyle({ width: _ctx.w + "px" }),
    onselectstart: "return false;"
  }, [
    createElementVNode("div", {
      class: normalizeClass({ "slider-verify-loading": _ctx.loadBlock })
    }, null, 2),
    createElementVNode("canvas", {
      ref: "canvas",
      width: _ctx.w,
      height: _ctx.h
    }, null, 8, _hoisted_1),
    _ctx.show ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: "slide-verify-refresh-icon",
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.refresh && _ctx.refresh(...args))
    }, _hoisted_3)) : createCommentVNode("", true),
    createElementVNode("canvas", {
      ref: "block",
      width: _ctx.w,
      height: _ctx.h,
      class: "slide-verify-block"
    }, null, 8, _hoisted_4),
    createElementVNode("div", {
      class: normalizeClass(["slide-verify-slider", {
        "container-active": _ctx.containerCls.containerActive,
        "container-success": _ctx.containerCls.containerSuccess,
        "container-fail": _ctx.containerCls.containerFail
      }])
    }, [
      createElementVNode("div", {
        class: "slide-verify-slider-mask",
        style: normalizeStyle({ width: _ctx.sliderBox.width })
      }, [
        createElementVNode("div", {
          class: "slide-verify-slider-mask-item",
          style: normalizeStyle({ left: _ctx.sliderBox.left }),
          onMousedown: _cache[1] || (_cache[1] = (...args) => _ctx.sliderDown && _ctx.sliderDown(...args)),
          onTouchstart: _cache[2] || (_cache[2] = (...args) => _ctx.touchStartEvent && _ctx.touchStartEvent(...args)),
          onTouchmove: _cache[3] || (_cache[3] = (...args) => _ctx.touchMoveEvent && _ctx.touchMoveEvent(...args)),
          onTouchend: _cache[4] || (_cache[4] = (...args) => _ctx.touchEndEvent && _ctx.touchEndEvent(...args))
        }, [
          createElementVNode("i", {
            class: normalizeClass(["slide-verify-slider-mask-item-icon", "iconfont", `icon-${_ctx.sliderBox.iconCls}`])
          }, null, 2)
        ], 36)
      ], 4),
      createElementVNode("span", _hoisted_5, toDisplayString(_ctx.sliderText), 1)
    ], 2)
  ], 4);
}
var SlideVerify = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f61c42f2"]]);
export { SlideVerify as default };

<template>
  <div id="slideVerify" class="slide-verify" :style="{ width: w + 'px' }" onselectstart="return false;">
    <!-- 图片加载遮蔽罩 -->
    <div :class="{ 'slider-verify-loading': loadBlock }"></div>
    <canvas ref="canvas" :width="w" :height="h"></canvas>
    <div v-if="show" class="slide-verify-refresh-icon" @click="refresh">
      <i class="iconfont icon-refresh"></i>
    </div>
    <canvas ref="block" :width="w" :height="h" class="slide-verify-block"></canvas>
    <!-- container -->
    <div
      class="slide-verify-slider"
      :class="{
        'container-active': containerCls.containerActive,
        'container-success': containerCls.containerSuccess,
        'container-fail': containerCls.containerFail,
      }"
    >
      <div class="slide-verify-slider-mask" :style="{ width: sliderBox.width }">
        <!-- slider -->
        <div
          class="slide-verify-slider-mask-item"
          :style="{ left: sliderBox.left }"
          @mousedown="sliderDown"
          @touchstart="touchStartEvent"
          @touchmove="touchMoveEvent"
          @touchend="touchEndEvent"
        >
          <i :class="['slide-verify-slider-mask-item-icon', 'iconfont', `icon-${sliderBox.iconCls}`]"></i>
        </div>
      </div>
      <span class="slide-verify-slider-text">{{ sliderText }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, PropType } from "vue";
import { useSlideAction } from "./hooks";
import { createImg, draw, getRandomImg, getRandomNumberByRange } from "./util";
import { SlideVerifyProps } from "./type";

export default defineComponent({
  name: "SlideVerify",
  props: {
    // block length
    l: {
      type: Number,
      default: 42,
    },
    // block radius
    r: {
      type: Number,
      default: 10,
    },
    // canvas width
    w: {
      type: Number,
      default: 310,
    },
    // canvas height
    h: {
      type: Number,
      default: 155,
    },
    sliderText: {
      type: String,
      default: "Slide filled right",
    },
    accuracy: {
      type: Number,
      default: 5, // 若为 -1 则不进行机器判断
    },
    show: {
      type: Boolean,
      default: true,
    },
    imgs: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  },
  emits: ["success", "again", "fail", "refresh"],
  setup(props: SlideVerifyProps, { emit }) {
    const { imgs, l, r, w, h, accuracy } = props;
    // 图片加载完关闭遮蔽罩
    const loadBlock = ref(true);
    const blockX = ref(0);
    const blockY = ref(0);
    // class
    const containerCls = reactive({
      containerActive: false, // container active class
      containerSuccess: false, // container success class
      containerFail: false, // container fail class
    });
    // sliderMaskWidth sliderLeft
    const sliderBox = reactive({
      iconCls: "arrow-right",
      width: "0",
      left: "0",
    });

    const block = ref<HTMLCanvasElement>();
    const blockCtx = ref<CanvasRenderingContext2D | null>();
    const canvas = ref<HTMLCanvasElement>();
    const canvasCtx = ref<CanvasRenderingContext2D | null>();
    let img: HTMLImageElement;
    const { success, start, move, end, verify } = useSlideAction();

    // event
    const reset = () => {
      success.value = false;
      containerCls.containerActive = false;
      containerCls.containerSuccess = false;
      containerCls.containerFail = false;
      sliderBox.iconCls = "arrow-right";
      sliderBox.left = "0";
      sliderBox.width = "0";

      block.value!.style.left = "0";
      canvasCtx.value?.clearRect(0, 0, w, h);
      blockCtx.value?.clearRect(0, 0, w, h);
      block.value!.width = w;

      // generate img
      img.src = getRandomImg(imgs);
    };
    const refresh = () => {
      reset();
      emit("refresh");
    };

    function moveCb(moveX: number) {
      sliderBox.left = moveX + "px";
      let blockLeft = ((w - 40 - 20) / (w - 40)) * moveX;
      block.value!.style.left = blockLeft + "px";

      containerCls.containerActive = true;
      sliderBox.width = moveX + "px";
    }

    function endCb(timestamp: number) {
      const { spliced, TuringTest } = verify(block.value!.style.left, blockX.value, accuracy);
      if (spliced) {
        if (accuracy === -1) {
          containerCls.containerSuccess = true;
          sliderBox.iconCls = "success";
          success.value = true;
          emit("success", timestamp);
          return;
        }
        if (TuringTest) {
          // success
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
        }, 1000);
      }
    }

    const touchMoveEvent = (e: TouchEvent) => {
      move(w, e, moveCb);
    };

    const touchEndEvent = (e: TouchEvent) => {
      end(e, endCb);
    };

    onMounted(() => {
      const _canvasCtx = canvas.value?.getContext("2d");
      const _blockCtx = block.value?.getContext("2d");
      canvasCtx.value = _canvasCtx;
      blockCtx.value = _blockCtx;

      img = createImg(imgs, () => {
        loadBlock.value = false;
        const L = l + r * 2 + 3;
        // draw block
        blockX.value = getRandomNumberByRange(L + 10, w - (L + 10));
        blockY.value = getRandomNumberByRange(10 + r * 2, h - (L + 10));
        if (_canvasCtx && _blockCtx) {
          draw(_canvasCtx, blockX.value, blockY.value, l, r, "fill");
          draw(_blockCtx, blockX.value, blockY.value, l, r, "clip");
          // draw image
          _canvasCtx.drawImage(img, 0, 0, w, h);
          _blockCtx.drawImage(img, 0, 0, w, h);
          // getImage
          const _y = blockY.value - r * 2 - 1;
          const imgData = _blockCtx.getImageData(blockX.value, _y, L, L);
          block.value!.width = L;
          _blockCtx.putImageData(imgData, 0, _y);
        }
      });

      // bindEvent
      document.addEventListener("mousemove", (e) => {
        move(w, e, moveCb);
      });
      document.addEventListener("mouseup", (e) => {
        end(e, endCb);
      });
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
      touchEndEvent,
    };
  },
});
</script>

<style scoped lang="less">
@import "@/assets/iconfont.css";

.position() {
  position: absolute;
  left: 0;
  top: 0;
}
.slide-verify {
  position: relative;
  &-loading {
    .position();
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    z-index: 999;
    animation: loading 1.5s infinite;
  }

  &-block {
    .position();
  }

  &-refresh-icon {
    position: absolute;
    right: 0;
    top: 0;
    width: 34px;
    height: 34px;
    cursor: pointer;
    .iconfont {
      font-size: 34px;
      color: #fff;
    }
  }
  &-slider {
    position: relative;
    text-align: center;
    width: 100%;
    height: 40px;
    line-height: 40px;
    margin-top: 15px;
    background: #f7f9fa;
    color: #45494c;
    border: 1px solid #e4e7eb;
    &-mask {
      .position();
      height: 40px;
      border: 0 solid #1991fa;
      background: #d1e9fe;
      &-item {
        .position();
        width: 40px;
        height: 40px;
        background: #fff;
        box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
        cursor: pointer;
        transition: background 0.2s linear;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          background: #1991fa;
          .iconfont {
            color: #fff;
          }
        }
        &-icon {
          line-height: 1;
          font-size: 30px;
          color: #303030;
        }
      }
    }
  }
}

.container-active .slide-verify-slider-mask {
  height: 38px;
  border-width: 1px;
  &-item {
    height: 38px;
    top: -1px;
    border: 1px solid #1991fa;
  }
}

.container-success .slide-verify-slider-mask {
  height: 38px;
  border: 1px solid #52ccba;
  background-color: #d2f4ef;
  &-item {
    height: 38px;
    top: -1px;
    border: 1px solid #52ccba;
    background-color: #52ccba !important;
  }
  .iconfont {
    color: #fff;
  }
}

.container-fail .slide-verify-slider-mask {
  height: 38px;
  border: 1px solid #f57a7a;
  background-color: #fce1e1;
  &-item {
    height: 38px;
    top: -1px;
    border: 1px solid #f57a7a;
    background-color: #f57a7a !important;
  }
  .iconfont {
    color: #fff;
  }
}

.container-active .slide-verify-slider-text,
.container-success .slide-verify-slider-text,
.container-fail .slide-verify-slider-text {
  display: none;
}

@keyframes loading {
  0% {
    opacity: 0.7;
  }
  100% {
    opacity: 9;
  }
}
</style>

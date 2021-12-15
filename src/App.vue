<template>
  <div>
    <h1>Vue3 + Typescript Slide Verify</h1>
    <slide-verify
      ref="block"
      :slider-text="text"
      :accuracy="accuracy"
      @again="onAgain"
      @success="onSuccess"
      @fail="onFail"
      @refresh="onRefresh"
    ></slide-verify>
    <button class="btn" @click="handleClick">在父组件可以点我刷新哦</button>
    <div>{{ msg }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import SlideVerify, { SlideVerifyInstance } from "./components";

export default defineComponent({
  components: { SlideVerify },

  setup() {
    const msg = ref("");
    const block = ref<SlideVerifyInstance>();

    const onAgain = () => {
      msg.value = "检测到非人为操作的哦！ try again";
      // 刷新
      block.value?.refresh();
    };

    const onSuccess = (times: number) => {
      msg.value = `login success, 耗时${(times / 1000).toFixed(1)}s`;
    };

    const onFail = () => {
      msg.value = "验证不通过";
    };

    const onRefresh = () => {
      msg.value = "滑块重置了";
    };

    const handleClick = () => {
      // 刷新
      block.value?.refresh();
      msg.value = "";
    };

    return {
      block,
      msg,
      text: "向右滑动->",
      accuracy: 1,
      onAgain,
      onSuccess,
      onFail,
      onRefresh,
      handleClick,
    };
  },
});
</script>

<style lang="less" scoped>
.btn {
  margin-top: 20px;
  outline: 0;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  color: #fff;
  background-color: #1890ff;
  cursor: pointer;
}
.btn:active {
  box-shadow: 1px 5px 0 rgba(0, 0, 0, 0.1) inset;
}
</style>

# vue3-slide-verify

> A Vue3 plugin to slide verify [Demo](https://monoplasty.github.io/vue3-slide-verify/)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```
## Quick Start

###  1. Import vue3-slide-verify into your vue3 project.

Using build tools:

```bash
npm install --save vue3-slide-verify
```

```js
import Vue from 'vue';
import SlideVerify from 'vue3-slide-verify';

Vue.use(SlideVerify);
```

### argument

| Param | Type | Describe | Version |
| :------: | :------: | :------: | :-----: |
| l | Number | block length | |
| r | Number | block circle radius | |
| w | Number | canvas width | |
| h | Number | canvas height | |
| sliderText | String | Slide filled right |  |
| imgs | Array | picture array 背景图数组，默认值 [] |  |
| accuracy | Number | 滑动验证的误差范围，默认值 5 |  |
| show | Boolean | 是否显示刷新按钮，默认值 true |  |

### callBack

| Event | Type | Describe | Version |
| :------: | :------: | :------: | :-----: |
| success | Function | success callback | 返回时间参数，单位为毫秒 |
| fail | Function | fail callback | |
| refresh | Function | 点击刷新按钮后的回调函数 | |
| again | Function | 检测到非人为操作滑动时触发的回调函数 |  |

### 实例API
- 在父组件里如果需要重置，可以在父组件中调用子组件reset() 方法
```html
<slide-verify ref="block" ></slide-verify>
```
```javascript
setup() {
  const block = ref(null);
  // 元素挂载之后才能访问ref
  onMounted(() => {
    block.value.reset();
  })
  return {
    block,
  }
}
```

### description
- `accuracy` 精度设置
> 判断滑块与凹槽位置的误差范围值，默认取值范围为 [1, 10]。若取值不为 -1，则会开启检测非人为操作。人为操作也有可能会触发哦！
>
> 判断依据是：滑块的一系列移动坐标的平均值和方差是否相等。若相等则人为是非人为操作。
>
> 若`accuracy`为 -1，则表示关闭检测非人为操作，默认开启。开启之后，若检测到为非人为操作，则会触发 `again` 回调函数

- props 中 `imgs`设置：
  - 当`imgs`不传或者传空数组时，图片库默认使用第三方api提供的图片路径。可能加载缓慢；
  - 当`imgs`传本地路径时，确保图片路径是否正确。建设传oss上的图片地址。
  - 详情可参考`APP.vue`上的写法。或[在线查看demo地址](https://monoplasty.github.io/vue3-slide-verify/)

### example
参考如下写法
```vue
<template>
  <div>
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
import { SlideVerify, SlideVerifyInstance } from "vue3-slide-verify";

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
      msg.value = "点击了刷新小图标";
    };

    const handleClick = () => {
      msg.value = "";
      // 刷新
      block.value?.refresh();
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
```

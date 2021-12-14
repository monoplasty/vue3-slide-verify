import type { App } from "vue";
import SlideVerify from "./slide-verify.vue";

export * from "./type";

const install = function (App: App) {
  App.component(SlideVerify.name, SlideVerify);
};
export { install, SlideVerify };

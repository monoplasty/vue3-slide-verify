import type slideVerify from "./slide-verify.vue";

declare type SlideVerifyProps = {
  l: number;
  r: number;
  w: number;
  h: number;
  sliderText: string;
  accuracy: number;
  show: boolean;
  imgs: any[];
};

declare type SlideVerifyEmits = {
  success: (timestamp: number) => void;
  again: () => void;
  fail: () => void;
  refresh: () => void;
  fulfilled: () => void;
};

declare type SlideVerifyInstance = InstanceType<typeof slideVerify>;

export { SlideVerifyProps, SlideVerifyEmits, SlideVerifyInstance };

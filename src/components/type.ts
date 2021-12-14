import type slideVerify from "./slide-verify.vue";

export type SlideVerifyProps = {
  l: number;
  r: number;
  w: number;
  h: number;
  sliderText: string;
  accuracy: number;
  show: boolean;
  imgs: any[];
};

export type SlideVerifyReturn = {};

export type SlideVerifyEmits = {
  success: (timestamp: number) => void;
  again: () => void;
  fail: () => void;
  refresh: () => void;
  fulfilled: () => void;
};

export type SlideVerifyInstance = InstanceType<typeof slideVerify>;

import { DefineComponent, ComponentPublicInstance } from "vue";

export declare type SlideVerifyProps = {
  l: number;
  r: number;
  w: number;
  h: number;
  sliderText: string;
  accuracy: number;
  show: boolean;
  imgs: any[];
};

export declare type SlideVerifyEmits = {
  success: (timestamp: number) => void;
  again: () => void;
  fail: () => void;
  refresh: () => void;
  fulfilled: () => void;
};

export declare type RawBindings = {
  refresh: () => void;
};

export declare type SlideVerify = DefineComponent<SlideVerifyProps, RawBindings>;

export declare type SlideVerifyInstance = InstanceType<SlideVerify>;

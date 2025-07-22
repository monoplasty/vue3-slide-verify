import { DefineComponent, ComponentPublicInstance } from "vue";

export declare type SlideVerifyProps = {
  /**
   * block length
   */
  l?: number;
  /**
   * block width
   */
  r?: number;
  /**
   * canvas width
   */
  w?: number;
  /**
   * canvas height
   */
  h?: number;
  /**
   * slider text
   */
  sliderText?: string;
  /**
   * accuracy 判断：若为 -1 则不进行机器判断
   */
  accuracy?: number;
  /**
   * 是否显示刷新按钮
   */
  show?: boolean;
  /**
   * 自定义背景图 数组：如传入会随机从数组中取一个渲染
   */
  imgs?: any[];
  /**
   * 初始渲染时，卡片的偏移值。（可用于后端验证；从后端获取，并且）
   */
  offset?: number;
};

export declare type SlideVerifyEmits = {
  /**
   * 成功的回调
   * @param timestamp 耗时
   * @param left 鼠标滑块移动的距离
   */
  success: (detail: { timestamp: number; left: number }) => void;
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

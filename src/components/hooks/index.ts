import { reactive, ref } from "vue";
import { sum, square } from "../util";

export function useSlideAction() {
  const origin = reactive({
    x: 0,
    y: 0,
  });

  const success = ref(false);
  const isMouseDown = ref(false);
  const timestamp = ref(0);
  const trail = ref<number[]>([]);

  const start = (e: MouseEvent | TouchEvent) => {
    if (success.value) return;
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

  const move = (w: number, e: MouseEvent | TouchEvent, cb: (moveX: number) => void) => {
    if (!isMouseDown.value) return false;
    let moveX = 0;
    let moveY = 0;
    if (e instanceof MouseEvent) {
      moveX = e.clientX - origin.x;
      moveY = e.clientY - origin.y;
    } else {
      moveX = e.changedTouches[0].pageX - origin.x;
      moveY = e.changedTouches[0].pageY - origin.y;
    }
    if (moveX < 0 || moveX + 38 >= w) return false;
    cb(moveX);
    trail.value.push(moveY);
  };

  /**
   *
   * @param left : block.style.left;
   * @param blockX
   * @param accuracy
   * @returns
   */
  const verify = (left: string, blockX: number, accuracy: number) => {
    const arr = trail.value; // drag y move distance
    const average = arr.reduce(sum) / arr.length; // average
    const deviations = arr.map((x) => x - average); // deviation array
    const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length); // standard deviation
    const leftNum = parseInt(left);
    accuracy = accuracy <= 1 ? 1 : accuracy > 10 ? 10 : accuracy;
    return {
      spliced: Math.abs(leftNum - blockX) <= accuracy,
      TuringTest: average !== stddev, // equal => not person operate
    };
  };

  const end = (e: MouseEvent | TouchEvent, cb: (timestamp: number) => void) => {
    if (!isMouseDown.value) return false;
    isMouseDown.value = false;
    const moveX = e instanceof MouseEvent ? e.clientX : e.changedTouches[0].pageX;
    if (moveX === origin.x) return false;
    timestamp.value = Date.now() - timestamp.value;

    cb(timestamp.value);
  };

  return { origin, success, isMouseDown, timestamp, trail, start, move, end, verify };
}

import { Ref } from "vue";
export const drawLine = (
  canvas: Ref<HTMLCanvasElement>,
  x: Ref<number>,
  y: Ref<number>,
  dx: Ref<number>,
  dy: Ref<number>,
  context: Ref<any>,
  imgData: Ref<any>,
  toGetImageData: () => any,
  toHistoryPush: () => void
) => {
  canvas.value.onmousedown = function (e: MouseEvent) {
    canvas.value.onmousemove = function (e: MouseEvent) {
      x.value = e.offsetX;
      y.value = e.offsetY;
      dx.value = e.movementX;
      dy.value = e.movementY;
      if (e.buttons > 0) {
        context.value.beginPath();
        context.value.moveTo(x.value, y.value);
        context.value.lineTo(x.value - dx.value, y.value - dy.value);
        context.value.stroke();
        context.value.closePath();
      }
    };
    imgData.value = toGetImageData();
    toHistoryPush();
  };
};

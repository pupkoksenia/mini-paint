import { Ref } from "vue";

export const drawTriangle = (
  canvas: Ref<HTMLCanvasElement>,
  x: Ref<number>,
  y: Ref<number>,
  x2: Ref<number>,
  y2: Ref<number>,
  context: Ref<any>,
  imgData: Ref<any>,
  toGetImageData: () => any,
  toHistoryPush: () => void,
  strokeStyleValue: Ref<string>,
  stateOfFigure: Ref<string>
) => {
  canvas.value.onmousedown = function (e: MouseEvent) {
    x.value = e.offsetX;
    y.value = e.offsetY;
    canvas.value.onmousemove = function (e: MouseEvent) {
      x2.value = e.offsetX;
      y2.value = e.offsetY;
      const makeTriangle = () => {
        context.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
        context.value.putImageData(imgData.value, 0, 0);
        context.value.beginPath();
        context.value.moveTo(x.value, y.value);
        context.value.lineTo(x2.value, y2.value);
        context.value.lineTo(x2.value, Math.abs(y.value - y2.value));
        context.value.moveTo(x2.value, Math.abs(y.value - y2.value));
        context.value.lineTo(x.value, y.value);
        context.value.closePath();
        context.value.fillStyle = strokeStyleValue.value;
        stateOfFigure.value === "stroke"
          ? context.value.stroke()
          : context.value.fill();
      };
      if (e.buttons > 0) {
        makeTriangle();
      } else {
        imgData.value = toGetImageData();
      }
    };
    toHistoryPush();
  };
};

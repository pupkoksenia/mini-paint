import { Ref } from "vue";
export const drawEllipse = (
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
      const makeEllipse = () => {
        context.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
        context.value.beginPath();
        context.value.putImageData(imgData.value, 0, 0);
        context.value.moveTo(x.value, y.value);
        context.value.ellipse(
          x.value,
          y.value,
          Math.abs(x2.value - x.value),
          Math.abs(y2.value - y.value),
          Math.PI,
          0,
          2 * Math.PI
        );
        context.value.fillStyle = strokeStyleValue.value;
        stateOfFigure.value === "stroke"
          ? context.value.stroke()
          : context.value.fill();
      };
      context.value.closePath();
      if (e.buttons > 0) {
        makeEllipse();
      } else {
        imgData.value = toGetImageData();
      }
    };
    toHistoryPush();
  };
};

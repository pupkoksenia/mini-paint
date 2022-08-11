<template>
  <canvas
    id="canvas"
    width="800"
    height="400"
    :style="{ 'background-color': backgroundColor }"
  />

  <span>
    <p :style="{ color: 'white' }">Background Color:</p>
    <input type="color" v-model="backgroundColor" />
  </span>

  <span>
    <p :style="{ color: 'white' }">Color:</p>
    <input type="color" v-model="strokeStyle" />
  </span>

  <select v-model="stateOfFigure">
    <option v-for="n in arrayStateOfFigure" :key="'option-' + n" :value="n">
      {{ n }}
    </option>
  </select>

  <span
    ><p :style="{ color: 'white' }">Choose width:</p>
    <input
      type="range"
      v-model="lineWidth"
      min="1"
      max="25"
      @change="chooseLineWidth"
  /></span>

  <select v-model="strokeType" v-on:click="chooseStrokeType">
    <option v-for="n in arrayStrokeType" :key="'option-' + n" :value="n">
      {{ n }}
    </option>
  </select>

  <button @click="clearStrokes">clearStrokes</button>
  <button @click="undo(canvas,contex)">unDo</button>
  <button @click="redo(canvas,contex)">reDo</button>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useHistoryPaint } from "../components/historyPaint";

export default defineComponent({
  name: "PaintPart",
  setup() {
    const { saveState, undo, redo, restoreState, history } = useHistoryPaint();

    const canvas = ref();
    const contex = ref();
    const x = ref();
    const y = ref();
    const dx = ref();
    const dy = ref();
    const x2 = ref();
    const y2 = ref();
    const backgroundColor = ref("white");
    const strokeStyleValue = ref("black");
    const lineWidth = ref(5);
    const strokeType = ref("line");
    const stateOfFigure = ref("stroke");
    const arrayStateOfFigure = ref(["stroke", "fill"]);
    const arrayStrokeType = ref(["line", "rectangle", "triangle", "circle"]);
    const imgData = ref();

    onMounted(() => {
      canvas.value = document.getElementById("canvas") as HTMLCanvasElement;
      contex.value = canvas.value.getContext("2d");
      contex.value.lineCap = "round";
      contex.value.lineWidth = lineWidth.value;
      contex.value.strokeStyle = strokeStyleValue.value;
      stateOfFigure.value = "stroke";
      strokeType.value = "line";
    });

    const strokeStyle = computed({
      get: () => {
        return strokeStyleValue.value;
      },
      set: (newVal) => {
        if (newVal) {
          strokeStyleValue.value = newVal;
          contex.value.strokeStyle = newVal;
        }
      },
    });

    const chooseLineWidth = () => {
      contex.value.lineWidth = lineWidth.value;
    };

    const clearStrokes = () => {
      canvas.value.onmousedown = function (e: MouseEvent) {
        x.value = e.offsetX;
        y.value = e.offsetY;
        canvas.value.onmousemove = function (e: MouseEvent) {
          x2.value = e.offsetX;
          y2.value = e.offsetY;

          if (e.buttons > 0) {
            contex.value.clearRect(
              x.value,
              y.value,
              lineWidth.value,
              lineWidth.value
            );
            contex.value.clearRect(
              x2.value,
              y2.value,
              lineWidth.value,
              lineWidth.value
            );
          }
        };
      };
    };

    const chooseStrokeType = () => {
      if (strokeType.value === "line") drawLine();
      else if (strokeType.value === "rectangle") drawRectangle();
      else if (strokeType.value === "triangle") drawTriangle();
      else if (strokeType.value === "circle") drawCircle();
    };

    const drawLine = () => {
      canvas.value.onmousedown = function (e: MouseEvent) {
        canvas.value.onmousemove = function (e: MouseEvent) {
          x.value = e.offsetX;
          y.value = e.offsetY;
          dx.value = e.movementX;
          dy.value = e.movementY;

          if (e.buttons > 0) {
            contex.value.beginPath();
            contex.value.moveTo(x.value, y.value);
            contex.value.lineTo(x.value - dx.value, y.value - dy.value);
            contex.value.stroke();
            saveState(canvas.value, [""], true)
            contex.value.closePath();
          }
        };
      };
      imgData.value = contex.value.getImageData(
        0,
        0,
        canvas.value.width,
        canvas.value.height
      );
    };

    const drawRectangle = () => {
      canvas.value.onmousedown = function (e: MouseEvent) {
        x.value = e.offsetX;
        y.value = e.offsetY;

        canvas.value.onmousemove = function (e: MouseEvent) {
          x2.value = e.offsetX;
          y2.value = e.offsetY;

          const makeRectungle = () => {
            contex.value.clearRect(
              0,
              0,
              canvas.value.width,
              canvas.value.height
            );
            contex.value.putImageData(imgData.value, 0, 0);
            contex.value.beginPath();
            contex.value.rect(
              x.value,
              y.value,
              Math.abs(x.value - x2.value),
              Math.abs(y.value - y2.value)
            );
            stateOfFigure.value === "stroke"
              ? contex.value.stroke()
              : contex.value.fill();
          };

          if (e.buttons > 0) {
            makeRectungle();
          } else {
            imgData.value = contex.value.getImageData(
              0,
              0,
              canvas.value.width,
              canvas.value.height
            );
          }
        };
      };
    };

    const drawTriangle = () => {
      canvas.value.onmousedown = function (e: MouseEvent) {
        x.value = e.offsetX;
        y.value = e.offsetY;

        canvas.value.onmousemove = function (e: MouseEvent) {
          x2.value = e.offsetX;
          y2.value = e.offsetY;

          const makeTriangle = () => {
            contex.value.clearRect(
              0,
              0,
              canvas.value.width,
              canvas.value.height
            );
            contex.value.putImageData(imgData.value, 0, 0);
            contex.value.beginPath();
            contex.value.moveTo(x.value, y.value);
            contex.value.lineTo(x2.value, y2.value);
            contex.value.lineTo(x2.value, Math.abs(y.value - y2.value));
            contex.value.moveTo(x2.value, Math.abs(y.value - y2.value));
            contex.value.lineTo(x.value, y.value);
            stateOfFigure.value === "stroke"
              ? contex.value.stroke()
              : contex.value.fill();
          };

          if (e.buttons > 0) {
            makeTriangle();
          } else {
            imgData.value = contex.value.getImageData(
              0,
              0,
              canvas.value.width,
              canvas.value.height
            );
          }
        };
      };
    };

    const drawCircle = () => {
      canvas.value.onmousedown = function (e: MouseEvent) {
        x.value = e.offsetX;
        y.value = e.offsetY;

        canvas.value.onmousemove = function (e: MouseEvent) {
          x2.value = e.offsetX;
          y2.value = e.offsetY;

          const makeCircle = () => {
            let a = x.value - x2.value;
            let b = y.value - y2.value;
            let radius = Math.sqrt(a * a + b * b);

            contex.value.clearRect(
              0,
              0,
              canvas.value.width,
              canvas.value.height
            );
            contex.value.putImageData(imgData.value, 0, 0);
            contex.value.moveTo(x.value, y.value);
            contex.value.arc(x.value, y.value, radius, 0, 2 * Math.PI, false);
            stateOfFigure.value === "stroke"
              ? contex.value.stroke()
              : contex.value.fill();
          };

          if (e.buttons > 0) {
            makeCircle();
          } else {
            contex.value.putImageData(imgData.value, 0, 0);
          }
        };
      };
    };

    return {
      canvas,
      backgroundColor,
      strokeStyle,
      contex,
      lineWidth,
      chooseLineWidth,
      arrayStrokeType,
      strokeType,
      chooseStrokeType,
      stateOfFigure,
      arrayStateOfFigure,
      clearStrokes,
      history,
      undo,
      redo
    };
  },
});
</script>

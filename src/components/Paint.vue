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
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";

export default defineComponent({
  name: "PaintPart",
  setup() {
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
    const bufferContex = ref();

    const arrayStrokeType = ref(["line", "rectangle", "triangle", "circle"]);

    onMounted(() => {
      canvas.value = document.getElementById("canvas") as HTMLCanvasElement;
      contex.value = canvas.value.getContext("2d");
      contex.value.lineCap = "round";
      contex.value.lineWidth = lineWidth.value;
      contex.value.strokeStyle = strokeStyle.value;
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

    const moveMouse = (e: MouseEvent) => {
      x.value = e.offsetX;
      y.value = e.offsetY;
      dx.value = e.movementX;
      dy.value = e.movementY;

      if (e.buttons > 0) {
        contex.value.beginPath();
        contex.value.moveTo(x.value, y.value);
        contex.value.lineTo(x.value - dx.value, y.value - dy.value);
        contex.value.stroke();
        contex.value.closePath();
      }
    };

    const chooseLineWidth = () => {
      contex.value.lineWidth = lineWidth.value;
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
            contex.value.closePath();
          }
        };
      };
      contex.value.save();
      console.log(contex.value.save);
    };

    const drawRectangle = () => {
      bufferContex.value = contex.value;
      
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
            contex.value.beginPath();
            contex.value.rect(
              x.value,
              y.value,
              Math.abs(x.value - x2.value),
              Math.abs(y.value - y2.value)
            );
            contex.value.stroke();
          };

          if (e.buttons > 0) {
            makeRectungle();
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
            contex.value.beginPath();
            contex.value.moveTo(x.value, y.value);
            contex.value.lineTo(x2.value, y2.value);
            contex.value.lineTo(x2.value, Math.abs(y.value - y2.value));
            contex.value.moveTo(x2.value, Math.abs(y.value - y2.value));
            contex.value.lineTo(x.value, y.value);
            contex.value.stroke();
          };

          if (e.buttons > 0) {
            makeTriangle();
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
            let radius = Math.sqrt(a ^ (2 + b) ^ 2);

            contex.value.clearRect(
              0,
              0,
              canvas.value.width,
              canvas.value.height
            );
            contex.value.beginPath();
            contex.value.moveTo(x.value, y.value);
            contex.value.arc(x.value, y.value, radius, 0, 2 * Math.PI, false);
            contex.value.stroke();
          };

          if (e.buttons > 0) {
            makeCircle();
          }
        };
      };
    };

    return {
      canvas,
      moveMouse,
      backgroundColor,
      strokeStyle,
      contex,
      lineWidth,
      chooseLineWidth,
      arrayStrokeType,
      strokeType,
      chooseStrokeType,
    };
  },
});
</script>

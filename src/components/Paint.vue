<template>
  <div class="pt-6 ml-4 w-screen h-screen">
    <input
      type="text"
      placeholder="Name of paint"
      v-model="NameOfPaint"
      class="border-cyan-700 border-2 rounded"
    />
    <div class="grid gap-1 grid-cols-2 grid-rows-1 mt-3">
      <canvas
        id="canvas"
        width="800"
        height="500"
        :style="{ 'background-color': backgroundColor }"
        class="border-cyan-700 border-2 rounded mt-3"
      />

      <div class="inline-grid gap-2 grid-cols-2 mt-3 h-4/6 w-4/6 ml-14">
        <span>
          <p class="text-black font-thin dark:text-white">Background Color:</p>
          <input
            type="color"
            v-model="backgroundColor"
            class="py-0.1 px-0.1 rounded"
          />
        </span>

        <span>
          <p class="text-black font-thin dark:text-white">Color:</p>
          <input
            type="color"
            v-model="strokeStyle"
            class="py-0.1 px-0.1 rounded"
          />
        </span>

        <select
          v-model="stateOfFigure"
          class="bg-white font-thin text-black py-0.5 px-0.5 rounded"
        >
          <option
            v-for="n in arrayStateOfFigure"
            :key="'option-' + n"
            :value="n"
            class="bg-white font-thin text-black py-0.5 px-0.5 rounded"
          >
            {{ n }}
          </option>
        </select>

        <span
          ><p class="text-black font-thin dark:text-white">Choose width:</p>
          <input
            type="range"
            v-model="lineWidth"
            min="1"
            max="25"
            @change="chooseLineWidth"
        /></span>

        <select
          v-model="strokeType"
          v-on:click="chooseStrokeType"
          class="bg-white font-thin text-black py-0.5 px-0.5 rounded"
        >
          <option
            v-for="n in arrayStrokeType"
            :key="'option-' + n"
            :value="n"
            class="bg-white font-thin text-black py-0.5 px-0.5 rounded"
          >
            {{ n }}
          </option>
        </select>
        <button @click="clearStrokes" class="button-paint">clearStrokes</button>

        <button @click="imageOnServer" class="button-paint">
          Save image on server
        </button>
        <button @click="imageOnComp" class="button-paint">
          Save image on computer
        </button>
        <button @click="unDo" class="button-paint">unDo</button>
        <button @click="reDo" class="button-paint">reDo</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useFireBasePaints } from "../composables/useFireBasePaints";
import { savePaints } from "../utils/savePaints";

export default defineComponent({
  name: "PaintPart",
  setup(props, cntx) {
    const { saveImageOnServer } = useFireBasePaints();
    const { saveImageOnComp } = savePaints();

    const canvas = ref();
    const context = ref();
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
    const arrayStrokeType = ref([
      "line",
      "rectangle",
      "triangle",
      "circle",
      "ellipse",
    ]);
    const imgData = ref();
    const NameOfPaint = ref();
    const history = ref();

    onMounted(() => {
      canvas.value = document.getElementById("canvas") as HTMLCanvasElement;
      context.value = canvas.value.getContext("2d");
      context.value.lineCap = "round";
      context.value.lineWidth = lineWidth.value;
      context.value.strokeStyle = strokeStyleValue.value;
      stateOfFigure.value = "stroke";
      strokeType.value = "line";
      NameOfPaint.value = "untitled";

      imgData.value = context.value.getImageData(
        0,
        0,
        canvas.value.width,
        canvas.value.height
      );
      history.value = [
        context.value.getImageData(
          0,
          0,
          canvas.value.width,
          canvas.value.height
        ),
      ];
    });

    let n = 0;
    const unDo = () => {
      if (n === 0) {
        toHistoryPush();
        n = n + 2;
      } else if (n === 1) {
        toHistoryPush();
        n = n + 1;
      } else n = n + 1;
      context.value.putImageData(history.value.at(-n), 0, 0);
    };

    const reDo = () => {
      if (n > 1) n = n - 1;
      else n = 1;
      context.value.putImageData(history.value.at(-n), 0, 0);
    };

    const strokeStyle = computed({
      get: () => {
        return strokeStyleValue.value;
      },
      set: (newVal) => {
        if (newVal) {
          strokeStyleValue.value = newVal;
          context.value.strokeStyle = newVal;
        }
      },
    });

    const chooseLineWidth = () => {
      context.value.lineWidth = lineWidth.value;
    };

    const imageOnServer = () => {
      saveImageOnServer(NameOfPaint.value, canvas.value.toDataURL());
      context.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
    };

    const imageOnComp = () => {
      const createEl = document.createElement("a");
      saveImageOnComp(createEl, canvas.value, NameOfPaint.value);
    };

    const toHistoryPush = () => {
      history.value.push(
        context.value.getImageData(
          0,
          0,
          canvas.value.width,
          canvas.value.height
        )
      );
    };

    const toGetImageData = () => {
      return context.value.getImageData(
        0,
        0,
        canvas.value.width,
        canvas.value.height
      );
    };

    const clearStrokes = () => {
      canvas.value.onmousedown = function (e: MouseEvent) {
        x.value = e.offsetX;
        y.value = e.offsetY;
        canvas.value.onmousemove = function (e: MouseEvent) {
          x2.value = e.offsetX;
          y2.value = e.offsetY;

          if (e.buttons > 0) {
            context.value.clearRect(
              x.value,
              y.value,
              lineWidth.value,
              lineWidth.value
            );
            context.value.clearRect(
              x2.value,
              y2.value,
              lineWidth.value,
              lineWidth.value
            );
          }
        };
        toHistoryPush();
      };
    };

    const chooseStrokeType = () => {
      imgData.value = toGetImageData();
      if (strokeType.value === "line") drawLine();
      else if (strokeType.value === "rectangle") drawRectangle();
      else if (strokeType.value === "triangle") drawTriangle();
      else if (strokeType.value === "circle") drawCircle();
      else if (strokeType.value === "ellipse") drawEllipse();
    };

    const drawLine = () => {
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

    const drawRectangle = () => {
      canvas.value.onmousedown = function (e: MouseEvent) {
        x.value = e.offsetX;
        y.value = e.offsetY;
        canvas.value.onmousemove = function (e: MouseEvent) {
          x2.value = e.offsetX;
          y2.value = e.offsetY;
          const makeRectungle = () => {
            context.value.clearRect(
              0,
              0,
              canvas.value.width,
              canvas.value.height
            );
            context.value.putImageData(imgData.value, 0, 0);
            context.value.beginPath();
            context.value.rect(
              x.value,
              y.value,
              Math.abs(x.value - x2.value),
              Math.abs(y.value - y2.value)
            );
            context.value.closePath();
            context.value.fillStyle = strokeStyleValue.value;
            stateOfFigure.value === "stroke"
              ? context.value.stroke()
              : context.value.fill();
          };
          if (e.buttons > 0) {
            makeRectungle();
          } else {
            imgData.value = toGetImageData();
          }
        };
        toHistoryPush();
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
            context.value.clearRect(
              0,
              0,
              canvas.value.width,
              canvas.value.height
            );
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

            context.value.clearRect(
              0,
              0,
              canvas.value.width,
              canvas.value.height
            );
            context.value.beginPath();
            context.value.putImageData(imgData.value, 0, 0);
            context.value.moveTo(x.value, y.value);
            context.value.arc(x.value, y.value, radius, 0, Math.PI * 2, false);
            context.value.fillStyle = strokeStyleValue.value;
            stateOfFigure.value === "stroke"
              ? context.value.stroke()
              : context.value.fill();
          };
          context.value.closePath();

          if (e.buttons > 0) {
            makeCircle();
          } else {
            imgData.value = toGetImageData();
          }
        };
        toHistoryPush();
      };
    };

    const drawEllipse = () => {
      canvas.value.onmousedown = function (e: MouseEvent) {
        x.value = e.offsetX;
        y.value = e.offsetY;

        canvas.value.onmousemove = function (e: MouseEvent) {
          x2.value = e.offsetX;
          y2.value = e.offsetY;

          const makeEllipse = () => {
            context.value.clearRect(
              0,
              0,
              canvas.value.width,
              canvas.value.height
            );
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

    return {
      canvas,
      backgroundColor,
      strokeStyle,
      context,
      lineWidth,
      chooseLineWidth,
      arrayStrokeType,
      strokeType,
      chooseStrokeType,
      stateOfFigure,
      arrayStateOfFigure,
      clearStrokes,
      NameOfPaint,
      saveImageOnServer,
      imageOnServer,
      imageOnComp,
      unDo,
      reDo,
    };
  },
});
</script>

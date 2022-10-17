<template>
  <div class="pt-6 ml-4 w-screen h-screen">
    <input
      type="text"
      placeholder="Name of paint"
      v-model="NameOfPaint"
      class="input-canvas-paint-page"
    />
    <div class="grid gap-1 grid-cols-2 grid-rows-1 mt-3">
      <canvas
        id="canvas"
        width="800"
        height="500"
        :style="{ 'background-color': backgroundColor }"
        class="input-canvas-paint-page mt-3"
      />

      <div class="paint-page-body">
        <span>
          <p class="text-paint-page">Background Color:</p>
          <input
            type="color"
            v-model="backgroundColor"
            class="span-paint-page-body"
          />
        </span>

        <span>
          <p class="text-paint-page">Color:</p>
          <input
            type="color"
            v-model="strokeStyle"
            class="span-paint-page-body"
          />
        </span>

        <select v-model="stateOfFigure" class="select-paint-page">
          <option
            v-for="n in arrayStateOfFigure"
            :key="'option-' + n"
            :value="n"
            class="select-paint-page"
          >
            {{ n }}
          </option>
        </select>

        <span
          ><p class="text-paint-page">Choose width:</p>
          <input
            type="range"
            v-model="lineWidth"
            min="1"
            max="25"
            @change="chooseLineWidth"
        /></span>

        <select
          v-model="strokeType"
          @click="chooseStrokeType"
          class="select-paint-page"
        >
          <option
            v-for="n in arrayStrokeType"
            :key="'option-' + n"
            :value="n"
            class="select-paint-page"
          >
            {{ n }}
          </option>
        </select>
        <button @click="clearStrokes" class="clear-button-paint-page">
          clear
        </button>

        <button @click="uploadImgServer" class="upload-button-paint-page">
          save image on server
        </button>
        <button @click="uploadImgDesctop" class="upload-button-paint-page">
          save image on computer
        </button>
        <button @click="unDo" class="button-paint h-3/5 w-3/5">unDo</button>
        <button @click="reDo" class="button-paint h-3/5 w-3/5">reDo</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, Ref } from 'vue'
import { useFireBasePaints } from '../composables/useFireBasePaints'
import { savePaints } from '../utils/savePaints'
import { arrayStrokeType } from '../types/index'
import { arrayStateOfFigure } from '../types/index'
import { drawLine } from '@/utils/drawLine'
import { drawRectangle } from '../utils/drawRectangle'
import { drawTriangle } from '../utils/drawTriangle'
import { drawCircle } from '../utils/drawCircle'
import { drawEllipse } from '../utils/drawEllipse'

export default defineComponent({
  name: 'PaintPart',
  setup() {
    const { uploadOnServer } = useFireBasePaints()
    const { uploadOnDesctop } = savePaints()
    const canvas: Ref<HTMLCanvasElement> = ref(document.getElementById('canvas') as HTMLCanvasElement)
    const context = ref()
    const x: Ref<number> = ref(0)
    const y: Ref<number> = ref(0)
    const dx: Ref<number> = ref(0)
    const dy: Ref<number> = ref(0)
    const x2: Ref<number> = ref(0)
    const y2: Ref<number> = ref(0)
    const backgroundColor: Ref<string> = ref('white')
    const strokeStyleValue: Ref<string> = ref('black')
    const lineWidth: Ref<number> = ref(5)
    const strokeType: Ref<string> = ref('line')
    const stateOfFigure: Ref<string> = ref('stroke')
    const imgData = ref()
    const NameOfPaint = ref()
    const history = ref()
    onMounted(() => {
      canvas.value = document.getElementById('canvas') as HTMLCanvasElement
      context.value = canvas.value.getContext('2d')
      context.value.lineCap = 'round'
      context.value.lineWidth = lineWidth.value
      context.value.strokeStyle = strokeStyleValue.value
      stateOfFigure.value = 'stroke'
      strokeType.value = 'line'
      NameOfPaint.value = 'untitled'
      imgData.value = context.value.getImageData(0, 0, canvas.value.width, canvas.value.height)
      history.value = [context.value.getImageData(0, 0, canvas.value.width, canvas.value.height)]
    })

    let n = 0
    const unDo = () => {
      if (n === 0) {
        toHistoryPush()
        n = n + 2
      } else if (n === 1) {
        toHistoryPush()
        n = n + 1
      } else n = n + 1
      context.value.putImageData(history.value.at(-n), 0, 0)
    }
    const reDo = () => {
      if (n > 1) n = n - 1
      else n = 1
      context.value.putImageData(history.value.at(-n), 0, 0)
    }

    const strokeStyle = computed({
      get: () => {
        return strokeStyleValue.value
      },
      set: (newVal) => {
        if (newVal) {
          strokeStyleValue.value = newVal
          context.value.strokeStyle = newVal
        }
      },
    })

    const chooseLineWidth = () => {
      context.value.lineWidth = lineWidth.value
    }

    const uploadImgServer = () => {
      uploadOnServer(NameOfPaint.value, canvas.value.toDataURL())
      context.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    }
    const uploadImgDesctop = () => {
      const createEl = document.createElement('a')
      uploadOnDesctop(createEl, canvas.value, NameOfPaint.value)
      context.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    }

    const toHistoryPush = () => {
      history.value.push(context.value.getImageData(0, 0, canvas.value.width, canvas.value.height))
    }

    const toGetImageData = () => {
      return context.value.getImageData(0, 0, canvas.value.width, canvas.value.height)
    }

    const clearStrokes = () => {
      canvas.value.onmousedown = function (e: MouseEvent) {
        x.value = e.offsetX
        y.value = e.offsetY
        canvas.value.onmousemove = function (e: MouseEvent) {
          x2.value = e.offsetX
          y2.value = e.offsetY
          if (e.buttons > 0) {
            context.value.clearRect(x.value, y.value, lineWidth.value, lineWidth.value)
            context.value.clearRect(x2.value, y2.value, lineWidth.value, lineWidth.value)
          }
        }
        toHistoryPush()
      }
    }

    const chooseStrokeType = () => {
      imgData.value = toGetImageData()

      switch (strokeType.value) {
        case 'line':
          drawLine(canvas, x, y, dx, dy, context, imgData, toGetImageData, toHistoryPush)
          break
        case 'rectangle':
          drawRectangle(
            canvas,
            x,
            y,
            x2,
            y2,
            context,
            imgData,
            toGetImageData,
            toHistoryPush,
            strokeStyleValue,
            stateOfFigure
          )
          break
        case 'triangle':
          drawTriangle(
            canvas,
            x,
            y,
            x2,
            y2,
            context,
            imgData,
            toGetImageData,
            toHistoryPush,
            strokeStyleValue,
            stateOfFigure
          )
          break
        case 'circle':
          drawCircle(
            canvas,
            x,
            y,
            x2,
            y2,
            context,
            imgData,
            toGetImageData,
            toHistoryPush,
            strokeStyleValue,
            stateOfFigure
          )
          break
        case 'ellipse':
          drawEllipse(
            canvas,
            x,
            y,
            x2,
            y2,
            context,
            imgData,
            toGetImageData,
            toHistoryPush,
            strokeStyleValue,
            stateOfFigure
          )
          break
      }
    }

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
      uploadImgServer,
      uploadImgDesctop,
      unDo,
      reDo,
    }
  },
})
</script>

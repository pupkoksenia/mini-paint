<template>
  <div class="a" style="color: aquamarine">Paint.vue</div>
  <vue-drawing-canvas
    ref="VueCanvasDrawing"
    v-model:image="image"
    :width="800"
    :height="550"
    :stroke-type="strokeType"
    :fill-shape="fillShape"
    :eraser="eraser"
    :lineWidth="line"
    :color="color"
    :background-color="backgroundColor"
    :background-image="backgroundImage"
    :initial-image="initialImage"
    saveAs="png"
    :styles="{
      border: 'solid 1px #000',
    }"
    :lock="disabled"
    :additional-images="additionalImages"
  />

  <p><input type="text" placeholder="Name of paint" v-model="NameOfPaint" /></p>
  <p><button @click="handleSubmit">Submit</button></p>

  <button type="button" @click.prevent="VueCanvasDrawing.undo()">Undo</button>

  <button type="button" @click.prevent="VueCanvasDrawing.redo()">Redo</button>

  <button type="button" @click.prevent="VueCanvasDrawing.redraw()">
    Refresh
  </button>
  <button type="button" @click.prevent="eraser = !eraser">
    <span v-if="eraser"> Eraser </span>
    <span v-else> Draw </span>
  </button>

  <select v-model="line">
    <option v-for="n in 25" :key="'option-' + n" :value="n">
      {{ n }}
    </option>
  </select>

  <input type="color" v-model="color" />

  <select v-model="strokeType">
    <option
      v-for="stroke in arrayStrokeType"
      :key="stroke"
      v-on:click="strokeType = stroke"
    >
      {{ stroke }}
    </option>
  </select>

  <button type="button" @click.prevent="fillShape = !fillShape">
    <span v-if="fillShape"> Fill </span>
    <span v-else> Stroke </span>
  </button>
  <button type="button" @click.prevent="getStrokes()">Save All Strokes</button>
  <button type="button" @click.prevent="removeSavedStrokes()">
    Remove Saved Strokes
  </button>
  <span>
    <p>Background Color:</p>
    <input type="color" v-model="backgroundColor" />
  </span>
  <span>
    <p>Upload Background Image:</p>
    <input type="file" @change="setImage($event)" />
  </span>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import VueDrawingCanvas from "vue-drawing-canvas";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../main";

export default defineComponent({
  name: "PaintPart",
  components: {
    VueDrawingCanvas,
  },
  setup() {
    const x = ref(0);
    const y = ref(0);
    const image = ref("");
    const eraser = ref(false);
    const disabled = ref(false);
    const fillShape = ref(false);
    const line = ref(5);
    const color = ref("#000000");
    const strokeType = ref("dash");
    const backgroundColor = ref("#FFFFFF");
    const backgroundImage = ref("");
    const additionalImages = ref([]);
    const VueCanvasDrawing = ref();
    const NameOfPaint = ref();
    const initialImage = ref([
      {
        type: "dash",
        from: {
          x: 262,
          y: 154,
        },
        coordinates: [],
        color: "#000000",
        width: 5,
        fill: false,
      },
    ]);

    const arrayStrokeType = ref([
      "dash",
      "line",
      "circle",
      "square",
      "triangle",
      "half_triangle",
    ]);
    const arrayLineCap = ref([
      "lineCap round",
      "lineCap square",
      " lineCap butt",
    ]);

    function setDrawingCanvas() {
      if ("vue-drawing-canvas" in window.localStorage) {
        initialImage.value = JSON.parse(
          localStorage.getItem("vue-drawing-canvas") || ""
        );
      }
    }
    onMounted(() => {
      setDrawingCanvas();
      strokeType.value = arrayStrokeType.value[0];
    });

    async function setImage(event: any) {
      let URL = window.URL;
      backgroundImage.value = URL.createObjectURL(event.target.files[0]);
      await VueCanvasDrawing.value.redraw();
    }

    function getStrokes() {
      localStorage.setItem(
        "vue-drawing-canvas",
        JSON.stringify(VueCanvasDrawing.value.getAllStrokes())
      );
      console.log("VueCanvasDrawing.value.getAllStrokes()",VueCanvasDrawing.value.getAllStrokes(), "img.value", image.value)
      //VueCanvasDrawing.value.
    }

    const handleSubmit = () => {
      let id = "";
      let getPaints:any=[]
      getDocs(collection(db, "users"))
        .then((docs) => {
          docs.forEach((doc) => {
            if (doc.data().name === localStorage.getItem("email")){
               id = doc.id;
               getPaints=doc.data().paints
            }
          });
        })
        .then(() => {
          getPaints.push({ nameOfPaint: NameOfPaint.value, date: new Date()} )
          setDoc(
            doc(db, "users", id),
            {
              paints: getPaints,
            },
            { merge: true }
          );
        });
    };

    function removeSavedStrokes() {
      window.localStorage.removeItem("vue-drawing-canvas");
    }

    return {
      initialImage,
      x,
      y,
      image,
      eraser,
      disabled,
      fillShape,
      line,
      color,
      strokeType,
      backgroundColor,
      backgroundImage,
      additionalImages,
      getStrokes,
      setImage,
      removeSavedStrokes,
      VueCanvasDrawing,
      arrayStrokeType,
      arrayLineCap,
      NameOfPaint,
      handleSubmit,
    };
  },
});
</script>

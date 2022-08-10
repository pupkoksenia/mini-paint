<template>
  <p><input type="text" placeholder="Name of paint" v-model="NameOfPaint" /></p>
  <canvas
    id="canvas"
    ref="VueCanvasDrawing"
    width="800"
    height="400"
    :style="{ 'background-color': backgroundColor, color: color }"
  />

  <button type="button" @click.prevent="VueCanvasDrawing.undo()">Undo</button>

  <button type="button" @click.prevent="VueCanvasDrawing.redo()">Redo</button>

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
  <span>
    <p>Background Color:</p>
    <input type="color" v-model="backgroundColor" />
  </span>
  <span>
    <p>Upload Background Image:</p>
    <input type="file" @change="setImage($event)" />
  </span>
  <button @click="handleSubmit">Save image on server</button>
  <button type="button" @click="saveImage()">Save image on computer</button>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../main";

export default defineComponent({
  /* 
  
    :stroke-type="strokeType"
    :fill-shape="fillShape"
    :eraser="eraser"
    :lineWidth="line"
    saveAs="png"
    :lock="disabled"*/

  name: "PaintPart",
  setup() {
    const imageURL = ref("");
    const eraser = ref(false);
    const disabled = ref(false);
    const fillShape = ref(false);
    const line = ref(5);
    const color = ref("black");
    const strokeType = ref("dash");
    const backgroundColor = ref("white");
    const backgroundImage = ref("");
    const additionalImages = ref([]);
    const VueCanvasDrawing = ref();
    const NameOfPaint = ref();

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
      "lineCap butt",
    ]);

    onMounted(() => {
      strokeType.value = arrayStrokeType.value[0];
      NameOfPaint.value = "untitled";
    });

    async function setImage(event: any) {
      let URL = window.URL;
      backgroundImage.value = URL.createObjectURL(event.target.files[0]);
      await VueCanvasDrawing.value.redraw();
    }

    function saveImage() {
      const createEl = document.createElement("a");
      let canvas = document.getElementById("canvas") as HTMLCanvasElement;
      createEl.href = canvas.toDataURL();
      createEl.download = NameOfPaint.value;
      createEl.click();
      createEl.remove();
    }

    const handleSubmit = () => {
      let id = "";
      let getPaints: any = [];
      getDocs(collection(db, "users"))
        .then((docs) => {
          docs.forEach((doc) => {
            if (doc.data().name === localStorage.getItem("email")) {
              id = doc.id;
              getPaints = doc.data().paints;
            }
          });
        })
        .then(() => {
          getPaints.push({
            nameOfPaint: NameOfPaint.value,
            date: new Date(),
            url: imageURL.value,
          });
          setDoc(
            doc(db, "users", id),
            {
              paints: getPaints,
            },
            { merge: true }
          );
        });
    };

    return {
      imageURL,
      eraser,
      disabled,
      fillShape,
      line,
      color,
      strokeType,
      backgroundColor,
      backgroundImage,
      additionalImages,
      //getStrokes,
      setImage,
      VueCanvasDrawing,
      arrayStrokeType,
      arrayLineCap,
      NameOfPaint,
      handleSubmit,
      saveImage,
    };
  },
});
</script>


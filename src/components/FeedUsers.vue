<template>
  <p><input type="text" placeholder="email" v-model="form.email" /></p>
  <p><button @click="handleSubmit">Submit</button></p>
  <p><button @click="handleReset">Reset</button></p>
  <ul>
    <li
      v-for="paint in sortedFeedPaints"
      :key="paint.toString"
      @click="goToPaint(paint.urlOfPaint)"
    >
     <img :src="paint.urlOfPaint" width="100" height="100" style="backgroundColor: white"/>
      {{ paint.nameOfPaint }} {{ paint.date }} {{ paint.userName }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useFireBasePaints } from "../composables/useFireBasePaints";

export default defineComponent({
  name: "FeedUsers",
  setup() {
    const { getFeedPaints, sortedFeedPaints, setFilterValue } =
      useFireBasePaints();
    const form = ref({
      email: "",
    });

    const handleSubmit = () => {
      setFilterValue(form.value.email);
    };

    const handleReset = () => {
      setFilterValue("");
    };

    const goToPaint = (urlOfPaint: string) => {
      window
        .open()
        ?.document.write(
          '<iframe src="' +
            urlOfPaint +
            '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
        );
    };
    onMounted(() => {
      getFeedPaints();
    });

    return {
      handleSubmit,
      form,
      handleReset,
      sortedFeedPaints,
      goToPaint,
    };
  },
});
</script>

<style>
li {
  color: white;
}
</style>

<template>
<div class="pt-6">
  <div class="flex justify-start inline-grid gap-1 grid-cols-1 grid-rows-3">
    <input type="text" placeholder="email" v-model="form.email" class="border-black border-2 rounded"/>
    <button
      @click="handleSubmit"
      class="button-paint"
    >
      Submit
    </button>
    <button
      @click="handleReset"
      class="button-paint"
    >
      Reset
    </button>
  </div>
  <div class="pt-6 grid gap-3">
    <div v-for="paint in sortedFeedPaints" :key="paint.toString" class="inline-grid gap-1 grid-cols-2 grid-rows-1">
    <div class="w-full">
      <img
        :src="paint.urlOfPaint"
        v-on:click="goToPaint(paint.urlOfPaint)"
        class="border-2 border-black"
      />
    </div>
      <div class="text-black w-full">
        {{ paint.nameOfPaint }} {{ paint.date }} {{ paint.userName }}
  
      <button
        v-if="paint.userName === state.user.email"
        @click="deleteButton(paint.nameOfPaint, paint.urlOfPaint)"
        class="button-paint"
      >
        Delete
      </button>
      <button v-else class="hidden"></button>
      </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useFireBasePaints } from "../composables/useFireBasePaints";
import { useFireBase } from "../composables/useFireBase";

export default defineComponent({
  name: "FeedUsers",
  setup() {
    const {
      getFeedPaints,
      sortedFeedPaints,
      setFilterValue,
      deleteUserPaint,
    } = useFireBasePaints();
    const { state } = useFireBase();
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

    const deleteButton = (NameOfPaint: string, url: string) => {
      deleteUserPaint(NameOfPaint, url);
      getFeedPaints();
      setFilterValue("");
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
      state,
      deleteButton,
    };
  },
});
</script>

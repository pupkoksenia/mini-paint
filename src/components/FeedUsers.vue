<template>
  <div class="pt-6 ml-4">
    <div class="flex justify-start inline-grid gap-1 grid-cols-3 grid-rows-1">
      <input
        type="text"
        placeholder="email"
        v-model="form.email"
        class="border-cyan-700 border-2 rounded"
      />
      <button @click="handleSubmit" class="button-paint">Submit</button>
      <button @click="handleReset" class="button-paint">Reset</button>
    </div>
    <div class="flex justify-center pt-6 inline-grid gap-3 grid-cols-2">
      <Loader v-bind:isLoading="loadingListener" />
      <div
        v-for="paint in sortedFeedPaints"
        :key="paint.toString"
        class="inline-grid gap-1 grid-cols-1"
      >
        <div>
          <img
            :src="paint.urlOfPaint"
            v-on:click="goToPaint(paint.urlOfPaint)"
            class="px-3 py-2 rounded-md border border-slate-400 w-11/12 bg-white"
          />
          <div class="text-black w-full">
            {{ paint.nameOfPaint }} {{ paint.date }} {{ paint.userName }}

            <button
              v-if="paint.userName === state.user.email"
              @click="deleteButton(paint.nameOfPaint, paint.urlOfPaint)"
              class="button-paint mt-1"
            >
              Delete
            </button>
            <button v-else class="hidden"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useFireBasePaints } from "../composables/useFireBasePaints";
import { useFireBase } from "../composables/useFireBase";
import Loader from "./Loader.vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "FeedUsers",
  setup() {
    const { getFeedPaints, sortedFeedPaints, setFilterValue, deleteUserPaint } =
      useFireBasePaints();
    const { state } = useFireBase();
    const form = ref({
      email: "",
    });
    const loadingListener = ref();
     const router = useRouter();
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
      router.push("/sign-in");
      setFilterValue("");
    };
    onMounted(() => {
      loadingListener.value = true;
      getFeedPaints().then(() => (loadingListener.value = false));
    });
    return {
      handleSubmit,
      form,
      handleReset,
      sortedFeedPaints,
      goToPaint,
      state,
      deleteButton,
      loadingListener,
    };
  },
  components: { Loader },
});
</script>

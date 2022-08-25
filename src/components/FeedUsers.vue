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
      <div
        v-for="paint in sortedFeedPaints"
        :key="paint.toString"
        class="inline-grid gap-1 grid-cols-1"
      >
         <ModalWindow
              :open="isOpen"
              :urlOfpaint="urlOfpaint"
              @open="(isOpened: boolean) => setOpen(isOpened)"
            />
        <div>
          <img
            :src="paint.urlOfPaint"
            v-on:click="goToPaint(paint.urlOfPaint)"
            class="
              px-3
              py-2
              rounded-md
              border border-slate-400
              w-11/12
              bg-white
            "
          />
          <div class="text-black w-full dark:text-white">
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
   <Loader v-bind:isLoading="loadingListener" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useFireBasePaints } from "../composables/useFireBasePaints";
import { useFireBase } from "../composables/useFireBase";
import Loader from "./Loader.vue";
import ModalWindow from "../components/ModalWindowPaint.vue";
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
    const isOpen = ref();
    const urlOfpaint = ref();
    const router = useRouter();
    const handleSubmit = () => {
      setFilterValue(form.value.email);
    };
    const handleReset = () => {
      setFilterValue("");
    };
    const goToPaint = (urlPaint: string) => {
      isOpen.value = true;
      urlOfpaint.value = urlPaint;
    };
    const setOpen = (isOpened: boolean) => {
      isOpen.value = isOpened;
    };
    const deleteButton = (NameOfPaint: string, url: string) => {
      deleteUserPaint(NameOfPaint, url);
      router.push("/sign-in");
      setFilterValue("");
    };
    onMounted(() => {
      loadingListener.value = true;
      getFeedPaints().then(() => (loadingListener.value = false));
      isOpen.value = false;
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
      setOpen,
      urlOfpaint,
      isOpen,
    };
  },
  components: { Loader, ModalWindow },
});
</script>

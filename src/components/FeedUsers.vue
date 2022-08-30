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
          :nameOfpaint="nameOfPaint"
          :nameOfUser="nameOfUser"
          @open="(isOpened: boolean) => setOpen(isOpened)"
        />
        <div>
          <img
            :src="paint.urlOfPaint"
            v-on:click="
              goToPaint(paint.urlOfPaint, paint.nameOfPaint, paint.userName)
            "
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

export default defineComponent({
  name: "FeedUsers",
  setup() {
    const { getFeedPaints, sortedFeedPaints, setFilterValue } =
      useFireBasePaints();
    const { state } = useFireBase();
    const form = ref({
      email: "",
    });
    const loadingListener = ref();
    const isOpen = ref();
    const urlOfpaint = ref();
    const nameOfPaint = ref("");
    const nameOfUser = ref("");
    const handleSubmit = () => {
      setFilterValue(form.value.email);
    };
    const handleReset = () => {
      setFilterValue("");
    };
    const goToPaint = (
      urlPaint: string,
      namePaint: string,
      nameUser: string
    ) => {
      isOpen.value = true;
      urlOfpaint.value = urlPaint;
      nameOfPaint.value = namePaint;
      nameOfUser.value = nameUser;
    };
    const setOpen = (isOpened: boolean) => {
      isOpen.value = isOpened;
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
      loadingListener,
      setOpen,
      urlOfpaint,
      isOpen,
      nameOfPaint,
      nameOfUser,
    };
  },
  components: { Loader, ModalWindow },
});
</script>

<template>
  <div class="pt-6 ml-4">
    <div class="flex justify-start inline-grid gap-1 grid-cols-5 grid-rows-2">

      <input
        type="text"
        placeholder="email"
        v-model="form.email"
        class="border-cyan-700 border-2 rounded"
      />
      <button @click="handleSubmitEmail" class="button-paint">Submit</button>
      <button @click="handleResetEmail" class="button-paint">Reset</button>

      <input
        type="text"
        placeholder="name of paint"
        v-model="form.namePaint"
        class="border-cyan-700 border-2 rounded"
      />
      <button @click="handleSubmitPaint" class="button-paint">Submit</button>
      <button @click="handleResetPaint" class="button-paint">Reset</button>

      <button
        class="
          flex
          items-center
          justify-start
          text-cyan-700
          font-bold
          dark:text-violet-500
          ml-4
        "
        @click="setAscedingSort()"
      >
        Ascending
      </button>
      <button
        class="
          flex
          items-center
          justify-start
          text-cyan-700
          font-bold
          dark:text-violet-500
        "
        @click="setDescedingSort()"
      >
        Descending
      </button>
    </div>
    <div class="flex justify-center pt-6 inline-grid gap-3 grid-cols-2">
      <div
        v-for="paint in paginatedData"
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

    <div class="flex justify-center pt-6 pr-16 gap-3 dark:text-white">
      <button @click="backPage">prev</button>
      <button
        v-for="item in Math.ceil(feedPaints.length / perPage)"
        :key="item"
        @click="() => goToPage(item)"
      >
        {{ item }}
      </button>
      <button @click="nextPage">next</button>
    </div>
  </div>
  <Loader v-bind:isLoading="loadingListener" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useFireBasePaints } from "../composables/useFireBasePaints";
import { useFireBase } from "../composables/useFireBase";
import Loader from "../components/staff/Loader.vue";
import ModalWindow from "./staff/ModalWindowPaint.vue";

export default defineComponent({
  name: "FeedUsers",
  setup() {
    const { getFeedPaints, feedPaints, setFilterValueEmail, setFilterValuePaint,  setSortingValue } =
      useFireBasePaints();
    const { state } = useFireBase();
    const form = ref({
      email: "",
      namePaint: ""
    });
    const loadingListener = ref();
    const isOpen = ref();
    const urlOfpaint = ref();
    const nameOfPaint = ref("");
    const nameOfUser = ref("");
    const page = ref(1);
    const perPage = ref(2);
    const setAscedingSort = () => {
      setSortingValue(0);
    };

    const setDescedingSort = () => {
      setSortingValue(1);
    };

    const paginatedData = computed(() =>
      feedPaints.value.slice(
        (page.value - 1) * perPage.value,
        page.value * perPage.value
      )
    );
    const nextPage = () => {
      if (page.value !== Math.ceil(feedPaints.value.length / perPage.value)) {
        page.value += 1;
      }
    };
    const backPage = () => {
      if (page.value !== 1) {
        page.value -= 1;
      }
    };
    const goToPage = (numPage: number) => {
      page.value = numPage;
    };


    const handleSubmitEmail = () => {
      setFilterValueEmail(form.value.email);
    };
    const handleResetEmail = () => {
      setFilterValueEmail("");
    };

    const handleSubmitPaint = () => {
      setFilterValuePaint(form.value.namePaint);
    }

    const handleResetPaint = () => {
      setFilterValuePaint("");
    }

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
      setSortingValue(0);
    });

    return {
      handleSubmitEmail,
      form,
      handleResetEmail,
      feedPaints,
      goToPaint,
      state,
      loadingListener,
      setOpen,
      urlOfpaint,
      isOpen,
      nameOfPaint,
      nameOfUser,
      paginatedData,
      nextPage,
      backPage,
      goToPage,
      perPage,
      setAscedingSort,
      setDescedingSort,
      handleSubmitPaint,
      handleResetPaint
    };
  },
  components: { Loader, ModalWindow },
});
</script>

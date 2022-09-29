<template>
  <div class="pt-6 ml-4">
    <div class="flex justify-start inline-grid gap-1 grid-cols-4">
      <div class="max-w-lg mx-auto">
        <div>
          <button
            class="drop-down-body"
            data-dropdown-toggle="dropdown"
            @click="setShow(!show)"
          >
            Set filter value
            <svg
              class="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          <div v-show="show" class="drop-down" id="dropdown">
            <ul class="py-1" aria-labelledby="dropdown">
              <li @click="setTypeOfFilter('email')">Filter by email</li>
              <li @click="setTypeOfFilter('paint')">Filter by paint</li>
            </ul>
          </div>
        </div>
      </div>

      <div v-show="typeOfFilter === 'email'" class="col-span-3 ml-2">
        <input
          type="text"
          placeholder="email"
          v-model="form.email"
          class="border-cyan-700 border-2 rounded pl-2"
        />
        <button @click="handleSubmitEmail" class="filter-button">Submit</button>
        <button @click="handleResetEmail" class="filter-button">Reset</button>
      </div>

      <div v-show="typeOfFilter === 'paint'" class="col-span-3 ml-2">
        <input
          type="text"
          placeholder="name of paint"
          v-model="form.namePaint"
          class="border-cyan-700 border-2 rounded pl-2"
        />
        <button @click="handleSubmitPaint" class="filter-button">Submit</button>
        <button @click="handleResetPaint" class="filter-button">Reset</button>
      </div>

      <button class="button-asceding-desceding ml-4" @click="setSortingValue('asc')">Ascending</button>
      <button class="button-asceding-desceding" @click="setSortingValue('desc')">Descending</button>
    </div>
    <div class="flex justify-center pt-6 inline-grid gap-3 grid-cols-2">
      <div v-for="paint in paginatedData" :key="paint.toString" class="inline-grid gap-1 grid-cols-1">
        <ModalWindow
          :open="isOpen"
          :urlOfpaint="urlOfpaint"
          :nameOfpaint="nameOfPaint"
          :nameOfUser="nameOfUser"
          :filterEmail="form.email"
          :filterNameOfPaint="form.namePaint"
          @open="(isOpened) => setOpen(isOpened)"
        />
        <div>
          <img
            :src="paint.urlOfPaint"
            @click="goToPaint(paint.urlOfPaint, paint.nameOfPaint, paint.userName)"
            class="px-3 py-2 rounded-md border border-slate-400 w-11/12"
          />
          <div class="text-black w-full dark:text-white">
            {{ paint.nameOfPaint }} {{ paint.date }} {{ paint.userName }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center pt-6 pr-16 gap-3 dark:text-white">
      <button @click="backPage">prev</button>
      <button v-for="item in numberPage" :key="item" @click="goToPage(item)">
        {{ item }}
      </button>
      <button @click="nextPage">next</button>
    </div>
  </div>
  <Loader :isLoading="loadingListener" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useFireBasePaints } from '../composables/useFireBasePaints'
import { useFireBase } from '../composables/useFireBase'
import Loader from '../components/staff/Loader.vue'
import ModalWindow from './staff/ModalWindowPaint.vue'
export default defineComponent({
  name: 'FeedUsers',
  setup() {
    const {
      getFeedPaints,
      feedPaints,
      setFilterValueEmail,
      setFilterValuePaint,
      setSortingValue,
      nextPage,
      backPage,
      goToPage,
      statePaint,
      numberPage,
    } = useFireBasePaints()
    const { state } = useFireBase()
    const form = ref({
      email: "",
      namePaint: "",
    });
    const typeOfFilter = ref("");
    const show = ref(false);
    const setShow = (isShow: boolean) => {
      show.value = isShow;
    };

    const loadingListener = ref();
    const isOpen = ref();
    const urlOfpaint = ref();
    const nameOfPaint = ref("");
    const nameOfUser = ref("");
    const paginatedData = computed(() => {
      return feedPaints.value.slice(
        (statePaint.page - 1) * statePaint.perPage,
        statePaint.page * statePaint.perPage
      );
    });
    const setTypeOfFilter = (type: string) => {
      console.log(type);
      typeOfFilter.value = type;
    };
    const handleSubmitEmail = () => {
      setFilterValueEmail(form.value.email)
    }
    const handleResetEmail = () => {
      form.value.email = "";
      setFilterValueEmail("");
      setTypeOfFilter("");
      setShow(false);
    };
    const handleSubmitPaint = () => {
      setFilterValuePaint(form.value.namePaint)
    }
    const handleResetPaint = () => {
      form.value.namePaint = "";
      setFilterValuePaint("");
      setTypeOfFilter("");
      setShow(false);
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
      isOpen.value = isOpened
    }
    onMounted(() => {
      loadingListener.value = true
      getFeedPaints().then(() => (loadingListener.value = false))
      isOpen.value = false
      setSortingValue('asc')
    })
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
      setSortingValue,
      handleSubmitPaint,
      handleResetPaint,
      numberPage,
      setTypeOfFilter,
      typeOfFilter,
      show,
      setShow,
    };
  },
  components: { Loader, ModalWindow },
})
</script>

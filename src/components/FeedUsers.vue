<template>
  <div class="pt-1 ml-4">
    <div class="flex justify-start inline-grid gap-1 grid-cols-3 grid-rows-2">
      <input type="text" placeholder="email" v-model="form.email" class="border-cyan-700 border-2 rounded" />
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
      <button class="button-asceding-desceding ml-4" @click="setSortingValue('asc')">Ascending</button>
      <button class="button-asceding-desceding" @click="setSortingValue('desc')">Descending</button>
    </div>
    <div class="flex justify-center pt-6 inline-grid gap-3 grid-cols-2">
      <div v-for="paint in paginatedData" :key="paint.toString" class="inline-grid gap-1 grid-cols-1">
        <ModalWindow :isOpenModalWindow="isOpen" @isOpenModalWindow="(isOpened) => setOpen(isOpened)">
          <template #body>
            <div class="mt-4">
              <img :src="urlOfpaint" class="px-3 py-2 rounded-md border border-slate-400 w-12/12 bg-white" />
            </div>
          </template>
          <template #footer>
            <button
              v-if="nameOfUser === state.user.email || state.user.role === 'admin'"
              @click="closeModalWindow"
              class="button-paint mt-1"
            >
              Delete
            </button>
            <button v-else class="hidden"></button>
            <button @click="saveImageOnComp()" class="button-paint mt-1 ml-1">Save img on computer</button>
          </template>
        </ModalWindow>
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

      <div class="flex justify-center pt-6 pr-16 gap-3 dark:text-white">
        <button @click="backPage">prev</button>
        <button v-for="item in numberPage" :key="item" @click="goToPage(item)">
          {{ item }}
        </button>
        <button @click="nextPage">next</button>
      </div>
    </div>
    <Loader :isLoading="loadingListener" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useFireBasePaints } from '../composables/useFireBasePaints'
import { useFireBase } from '../composables/useFireBase'
import Loader from '../components/staff/Loader.vue'
import ModalWindow from './staff/ModalWindow.vue'
export default defineComponent({
  name: 'FeedUsers',
  setup(props, ctx) {
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
      email: '',
      namePaint: '',
    })
    const loadingListener = ref()
    const isOpen = ref()
    const urlOfpaint = ref()
    const nameOfPaint = ref('')
    const nameOfUser = ref('')
    const paginatedData = computed(() => {
      return feedPaints.value.slice((statePaint.page - 1) * statePaint.perPage, statePaint.page * statePaint.perPage)
    })
    const handleSubmitEmail = () => {
      setFilterValueEmail(form.value.email)
    }
    const handleResetEmail = () => {
      form.value.email = ''
      setFilterValueEmail('')
    }
    const handleSubmitPaint = () => {
      setFilterValuePaint(form.value.namePaint)
    }
    const handleResetPaint = () => {
      form.value.namePaint = ''
      setFilterValuePaint('')
    }
    const goToPaint = (urlPaint: string, namePaint: string, nameUser: string) => {
      isOpen.value = true
      urlOfpaint.value = urlPaint
      nameOfPaint.value = namePaint
      nameOfUser.value = nameUser
    }
    const setOpen = (isOpened: boolean) => {
      isOpen.value = isOpened
    }
    const closeModalWindow = () => {
      ctx.emit('open', false)
    }
    const saveImageOnComp = () => {
      const createEl = document.createElement('a')
      createEl.href = urlOfpaint.value || ''
      createEl.download = nameOfPaint.value || ''
      createEl.click()
      createEl.remove()
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
      closeModalWindow,
      saveImageOnComp,
    }
  },
  components: { Loader, ModalWindow },
})
</script>

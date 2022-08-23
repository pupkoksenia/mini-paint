<template>
  <div class="flex justify-center content-center ">
    <div class="flex justify-center content-center">
      <div
        v-show="$props.open"
        class="
          min-h-screen-2xl
          absolute
          inset-0
          flex
          items-center
          justify-center
          bg-indigo-200 bg-opacity-30
        "
      >
        <div class="max-w-2xl p-6 mx-4 bg-white rounded-md shadow-xl">
          <div class="flex items-center justify-between">
            <h3 class="text-2xl">Paint</h3>
            <svg
              @click="$emit('open', false)"
              xmlns="http://www.w3.org/2000/svg"
              class="w-8 h-8 text-cyan-700 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="mt-4">
            <img
              :src="$props.urlOfpaint"
              class="
                px-3
                py-2
                rounded-md
                border border-slate-400
                w-12/12
                bg-white
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

 <script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ModalWindow",
  props: {
    open: Boolean,
    urlOfpaint: String,
  },
});
</script>





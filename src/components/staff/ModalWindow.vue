<template>
  <Teleport to="body">
    <div
      v-show="open"
      class="
        h-screen
        fixed
        inset-0
        flex
        items-center
        justify-center
        bg-indigo-200 bg-opacity-30
      "
    >
      <div
        class="
          max-w-2xl
          p-6
          m-20
          bg-white
          rounded-md
          shadow-xl
          bg-white
          dark:bg-purple-900
        "
      >
        <div class="flex items-center justify-between">
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
        <slot />
      </div>
    </div>
  </Teleport>
</template>
  
   <script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ModalWindow",
  props: {
    open: Boolean,
  },
  emits: ["open"],
});
</script>

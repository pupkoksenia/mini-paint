<template>
  <div
    v-show="$props.open"
    class="h-screen fixed inset-0 flex items-start justify-end"
  >
    <div class="p-6 m-20 bg-white rounded-md dark:bg-purple-900">
      <div class="flex items-center justify-between">
        <div class="grid-cols-1 grid-rows-2">
          <div class="text-sm dark:text-white">
            Name: {{ state.user.email }}
          </div>
          <div class="text-sm dark:text-white">Role: {{ state.user.role }}</div>
        </div>

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
    </div>
  </div>
</template>
  
  <script lang="ts">
import { defineComponent } from "vue";
import { useFireBase } from "../../composables/useFireBase";
export default defineComponent({
  name: "ModalWindow",
  props: {
    open: Boolean,
  },
  emits: ["open"],
  setup(props, ctx) {
    const { state } = useFireBase();
    const closeModalWindow = () => {
      ctx.emit("open", false);
    };
    return { state, closeModalWindow };
  },
});
</script>

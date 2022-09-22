<template>
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
          :src="urlOfpaint"
          class="px-3 py-2 rounded-md border border-slate-400 w-12/12 bg-white"
        />
      </div>
      <button
        v-if="nameOfUser === state.user.email || state.user.role === 'admin'"
        @click="closeModalWindow"
        class="button-paint mt-1"
      >
        Delete
      </button>
      <button v-else class="hidden"></button>
      <button @click="saveImageOnComp()" class="button-paint mt-1 ml-1">
        Save img on computer
      </button>
    </div>
  </div>
</template>
    
     <script lang="ts">
import { defineComponent } from "vue";
import { useFireBase } from "../../composables/useFireBase";
import { useFireBasePaints } from "../../composables/useFireBasePaints";
export default defineComponent({
  name: "ModalWindow",
  props: {
    open: Boolean,
    urlOfpaint: String,
    nameOfPaint: String,
    nameOfUser: String,
    filterEmail: String,
    filterNameOfPaint: String,
  },
  emits: ["open"],
  setup(props, ctx) {
    const { setFilterValueEmail, deleteUserPaint, setFilterValuePaint } =
      useFireBasePaints();
    const { state } = useFireBase();
    const deleteButton = () => {
      deleteUserPaint(
        props.nameOfPaint as string,
        props.urlOfpaint as string,
        props.nameOfUser as string
      );
      setFilterValueEmail(props.filterEmail || "");
      setFilterValuePaint(props.filterNameOfPaint || "");
    };
    const closeModalWindow = () => {
      ctx.emit("open", false);
    };
    const saveImageOnComp = () => {
      const createEl = document.createElement("a");
      createEl.href = props.urlOfpaint || "";
      createEl.download = props.nameOfPaint || "";
      createEl.click();
      createEl.remove();
    };
    return { deleteButton, state, saveImageOnComp, closeModalWindow };
  },
});
</script>
  
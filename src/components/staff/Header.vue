<template>
  <div class="grid grid-cols-8 w-screen h-16">
    <div class="col-span-1 justify-items-end"></div>
    <div
      class="
        flex
        items-center
        justify-start
        col-span-3
        text-black
        font-bold
        dark:text-white
      "
    >
      Mini-paint
    </div>

    <button
      v-on:click="signOutUser"
      class="
        flex
        items-center
        justify-center
        col-span-2
        text-cyan-700
        font-bold
        dark:text-violet-500
      "
    >
      Log Out
    </button>
    <DarkMode />

    <ModalWindow
      :open="isOpen"
      @open="(isOpened: boolean) => setOpen(isOpened)"
    >
      <div class="grid-cols-1 grid-rows-2">
        <div class="text-sm dark:text-white">Name: {{ state.user.email }}</div>
        <div class="text-sm dark:text-white">Role: {{ state.user.role }}</div>
      </div>
    </ModalWindow>

    <div class="col-span-1 flex items-center justify-items-center">
      <img src="../../assets/man.png" class="h-8 mx-4" @click="openUser" />
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useFireBase } from "../../composables/useFireBase";
import { useRouter } from "vue-router";
import DarkMode from "../buttons/ButtonDarkMode.vue";
import ModalWindow from "./ModalWindow.vue";

export default defineComponent({
  name: "HeaderPart",
  components: {
    DarkMode,
    ModalWindow,
  },
  setup() {
    const { state, signOutFirebase } = useFireBase();
    const router = useRouter();
    const stateOfStyle = ref();
    const isOpen = ref();
    const setOpen = (isOpened: boolean) => {
      isOpen.value = isOpened;
    };

    const openUser = () => {
      isOpen.value = true;
    };

    const setStateStyle = (currState: boolean) => {
      stateOfStyle.value = currState;
    };
    onMounted(() => {
      stateOfStyle.value = true;
    });
    const signOutUser = () => {
      signOutFirebase();
      router.push("/sign-in");
    };
    return { state, signOutUser, setStateStyle, isOpen, setOpen, openUser };
  },
});
</script>

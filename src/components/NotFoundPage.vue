<template>
  <div
    class="
      bg-gradient-to-t
      from-indigo-500/75
      to-white
      relative
      overflow-hidden
      h-screen
    "
  >
    <div class="inset-0 bg-black opacity-25 absolute"></div>
    <div
      class="
        container
        mx-auto
        px-6
        md:px-12
        relative
        z-10
        flex
        items-center
        py-32
        xl:py-40
      "
    >
      <div class="w-full font-mono flex flex-col items-center relative z-10">
        <h1
          class="
            font-extrabold
            text-5xl text-center text-white
            leading-tight
            mt-4
          "
          @click="goHome"
        >
          We are all alone here
        </h1>
        <button class="button-paint my-16" @click="goHome">Go Home</button>
        <p class="font-extrabold text-8xl my-44 text-white animate-bounce">
          404
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useFireBase } from "../composables/useFireBase";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "NotFound",
  setup() {
    const router = useRouter();
    const { state } = useFireBase();
    const goHome = () => {
        if(state.user.email !== "")  router.push("/");
        else router.push("/sign-in");
    };
    return { goHome };
  },
});
</script>

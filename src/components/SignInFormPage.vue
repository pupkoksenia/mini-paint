<template>
  <div
    class="
      w-screen
      h-screen
      flex
      justify-center
      items-center
      bg-gradient-to-t
      from-indigo-500/75
      dark:bg-purple-900
      to-white
      dark:to-black
    "
  >
    <div
      class="
        p-10
        bg-white
        dark:bg-purple-900
        rounded-xl
        drop-shadow-lg
        space-y-5
      "
    >
      <h1 class="text-center text-3xl dark:text-white">Mini-paint</h1>
      <DarkMode />
      <div class="flex flex-col space-y-2">
        <label class="text-sm font-light dark:text-white" for="email"
          >Email</label
        >
        <input
          class="
            w-96
            px-3
            py-2
            rounded-md
            border border-slate-400
            dark:bg-purple-900 dark:text-white
          "
          placeholder="Your Email"
          v-model="form.email"
        />
      </div>
      <div class="flex flex-col space-y-2">
        <label class="text-sm font-light dark:text-white" for="password"
          >Password</label
        >
        <input
          type="password"
          class="
            w-96
            px-3
            py-2
            rounded-md
            border border-slate-400
            dark:bg-purple-900 dark:text-white
          "
          v-model="form.password"
          placeholder="Your Password"
        />
      </div>
      <button
        class="
          w-full
          px-10
          py-2
          bg-blue-600
          text-white
          rounded-md
          hover:bg-blue-500 hover:drop-shadow-md
          duration-300
          ease-in
          dark:bg-violet-500
        "
        @click="sendInfo"
      >
        Sign In
      </button>
      <p v-if="errMsg" class="dark:text-white">{{ errMsg }}</p>
      <div
        v-on:click="redirectToRegister"
        class="text-blue-600 cursor-pointer dark:text-white"
      >
        Don't have an account? Register!
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useFireBase } from "../composables/useFireBase";
import DarkMode from "./buttons/ButtonDarkMode.vue";

export default defineComponent({
  name: "SignInForm",
  components: {
    DarkMode,
  },
  setup() {
    const { signIn } = useFireBase();
    const form = ref({
      email: "",
      password: "",
    });
    const errMsg = ref();
    const router = useRouter();
    const passwordFieldType = ref("password");

    const sendInfo = () => {
      signIn(form.value.email, form.value.password).then((msg) => {
        if (msg === "ok") {
          router.push("/");
        } else errMsg.value = msg;
      });
    };

    const redirectToRegister = () => {
      router.push("/register");
    };
    return {
      form,
      sendInfo,
      errMsg,
      passwordFieldType,
      redirectToRegister,
    };
  },
});
</script>

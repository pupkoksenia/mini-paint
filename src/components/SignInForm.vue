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
      to-white
    "
  >
    <form class="p-10 bg-white rounded-xl drop-shadow-lg space-y-5">
      <h1 class="text-center text-3xl">Mini-paint</h1>
      <div class="flex flex-col space-y-2">
        <label class="text-sm font-light" for="email">Email</label>
        <input
          class="w-96 px-3 py-2 rounded-md border border-slate-400"
          placeholder="Your Email"
          v-model="form.email"
        />
      </div>
      <div class="flex flex-col space-y-2">
        <label class="text-sm font-light" for="password">Password</label>
        <input
          class="w-96 px-3 py-2 rounded-md border border-slate-400"
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
        "
        @click="handleSubmit"
        type="submit"
      >
        Sign In
      </button>
      <p v-if="errMsg">{{ errMsg }}</p>
       <div
      v-on:click="redirectToRegister"
      class=""
    >
      Don't have an account? Register!
    </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useFireBase } from "../composables/useFireBase";

export default defineComponent({
  name: "SignInForm",
  setup() {
    const { signIn } = useFireBase();
    const form = ref({
      email: "",
      password: "",
    });
    const errMsg = ref();
    const router = useRouter();
    const passwordFieldType = ref("password");

    const handleSubmit = () => {
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
      handleSubmit,
      errMsg,
      passwordFieldType,
      redirectToRegister,
    };
  },
});
</script>

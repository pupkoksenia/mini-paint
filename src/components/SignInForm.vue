<template>
  <div class="grid gap-2 grid-cols-1 grid-rows-2 mt-3">
    <form class="grid gap-2 grid-cols-1 grid-rows-2 mt-3">
      <input
        type="text"
        placeholder="Email"
        v-model="form.email"
        class="border-black border-2 rounded w-60"
      />
      <input
        :type="passwordFieldType"
        placeholder="Password"
        v-model="form.password"
        class="border-black border-2 rounded w-60"
      />
      <button @click="switchVisibility" class="w-60">show / hide</button>
      <input type="submit" @click="handleSubmit" value="Submit" class="w-60" />
    </form>
    <p v-if="errMsg">{{ errMsg }}</p>
  </div>
</template>>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
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
          router.push({ path: "/home" });
        } else errMsg.value = msg;
      });
    };
    const switchVisibility = () => {
      passwordFieldType.value =
        passwordFieldType.value === "password" ? "text" : "password";
      localStorage.setItem("email", form.value.email)
      localStorage.setItem("password",form.value.password)
    };
    const checkLocalStorage = () => {
      if (localStorage.getItem("email"))
        form.value.email = localStorage.getItem("email") || "";
      if (localStorage.getItem("password"))
        form.value.password = localStorage.getItem("password") || "";
    };
    onMounted(() => checkLocalStorage());
    return { form, handleSubmit, errMsg, switchVisibility, passwordFieldType };
  },
});
</script>

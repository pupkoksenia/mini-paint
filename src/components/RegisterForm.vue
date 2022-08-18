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
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useFireBase } from "../composables/useFireBase";

export default defineComponent({
  name: "RegisterForm",
  setup() {
    const { register } = useFireBase();
    const form = ref({
      email: "",
      password: "",
    });
    const errMsg = ref();
    const router = useRouter();
    const passwordFieldType = ref("password");
    const handleSubmit = () => {
      register(form.value.email, form.value.password).then((msg) => {
        if (msg === "ok") {
          router.push({ path: "/" });
        } else errMsg.value = msg;
      });
    };
    const switchVisibility = () => {
      passwordFieldType.value =
        passwordFieldType.value === "password" ? "text" : "password";
    };
    return { form, handleSubmit, errMsg, switchVisibility, passwordFieldType };
  },
});
</script>

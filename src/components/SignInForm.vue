<template>
  <div class="register">

    <div id="v-model-basic" class="demo">
      <p><input type="text" placeholder="Email" v-model="form.email" /></p>
      <p>
        <input type="password" placeholder="Password" v-model="form.password" />
      </p>
      <p v-if="errMsg" style="color: aquamarine">{{ errMsg }}</p>
      <p><button @click="handleSubmit">Submit</button></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useFireBase } from "../components/composables/useFireBase";

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
    const handleSubmit = () => {
      signIn(form.value.email, form.value.password).then((msg) => {
        if (msg === "ok") {
          router.push({ path: "/home" });
        } else errMsg.value = msg;
      });
    };
    return { form, handleSubmit, errMsg };
  },
});
</script>

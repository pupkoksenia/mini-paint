<template>
  <div class="register-form">
    <form>
      <input type="text" placeholder="Email" v-model="form.email" />
      <input type="password" placeholder="Password" v-model="form.password" />
      <input type="submit" @click="handleSubmit" value="Submit" />
    </form>
    <p v-if="errMsg">{{ errMsg }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useFireBase } from "../components/composables/useFireBase";

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
    const handleSubmit = () => {
      register(form.value.email, form.value.password).then((msg) => {
        if (msg === "ok") {
          router.push({ path: "/home" });
        } else errMsg.value = msg;
      });
    };
    return { form, handleSubmit, errMsg };
  },
});
</script>

<style>
.register-form {
  padding-left: 10;
  color: white;
}
</style>

<template>
  <div class="sign-in-form">
    <form>
      <input type="text" placeholder="Email" v-model="form.email" />
      <input
        :type="passwordFieldType"
        placeholder="Password"
        v-model="form.password"
      />
      <button @click="switchVisibility">show / hide</button>
      <input type="submit" @click="handleSubmit" value="Submit" />
    </form>
    <p v-if="errMsg">{{ errMsg }}</p>
  </div>
</template>>

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
          router.push({ path: "/home" });
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

<style>
.sign-in-form {
  padding-left: 10;
  color: white;
}
</style>

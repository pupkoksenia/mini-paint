<template>
  <div class="register">
    <div style="color: aquamarine">Register form</div>
    <div id="v-model-basic" class="demo">
      <p><input type="text" placeholder="Email" v-model="form.email" /></p>
      <p>
        <input type="password" placeholder="Password" v-model="form.password" />
      </p>
      <p v-if="errMsg">{{ errMsg }}</p>
      <p><button @click="handleSubmit">Submit</button></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "RegisterForm",
  setup() {
    const form = ref({
      email: "",
      password: "",
    });
    const router = useRouter();
    const auth = getAuth();
    const errMsg = ref();
    const handleSubmit = () =>
      createUserWithEmailAndPassword(
        auth,
        form.value.email,
        form.value.password
      )
        .then((userCredential) => {
          localStorage.setItem('email',userCredential.user.email || "")
          router.push({path: "/home"});
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/invalid-email":
              errMsg.value = "Invalid email";
              break;
          }
        });
    return { form, handleSubmit, errMsg };
  },
});
</script>

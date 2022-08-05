<template>
  <div class="register">
    <div style="color: aquamarine">Sign in form</div>
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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "SignInForm",
  setup() {
    const form = ref({
      email: "",
      password: "",
    });
    const router = useRouter();
    const auth = getAuth();
    const errMsg = ref();
    const handleSubmit = () =>
      signInWithEmailAndPassword(auth, form.value.email, form.value.password)
        .then((userCredential) => {
          localStorage.setItem("email", userCredential.user.email || "");
          router.push({ path: "/home" }); // redirect to the feed
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/invalid-email":
              errMsg.value = "Invalid email";
              break;
            case "auth/user-not-found":
              errMsg.value = "No account with that email was found";
              break;
            case "auth/wrong-password":
              errMsg.value = "Incorrect password";
              break;
            default:
              errMsg.value = "Email or password was incorrect";
              break;
          }
        });
    return { form, handleSubmit, errMsg };
  },
});
</script>

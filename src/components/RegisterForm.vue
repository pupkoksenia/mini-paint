<template>
  <div class="w-screen h-screen">
    <div class="flex items-center justify-center pt-1 grid grid-cols-2 gap-3">
      <div class="grid justify-items-end">
        <nav>
          <router-link to="/register">Register</router-link>
        </nav>
      </div>

      <div>
        <nav>
            <router-link to="/sign-in">Sign in</router-link>
          </nav>
          <router-view />
      </div>
    </div>
  </div>
</template>

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

<template>
  <div class="w-screen h-screen flex items-center justify-center">
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
import { defineComponent } from "vue";

export default defineComponent({
  name: "AuthenticationView",
});
</script>

<template>
<div class="a" style="color:aquamarine">AuthenticationView.vue</div>
<nav>
    <router-link to="/register">Register</router-link>
</nav>
<nav>
    <router-link to="/sign-in">Sign in</router-link>
</nav>
<router-view/>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AuthenticationView",
});
</script>

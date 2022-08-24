

<template>
  <button @click="toggleDark()">
    <i inline-block align-middle i="dark:carbon-moon carbon-sun" />
    <span class="ml-2">{{ isDark ? "Dark" : "Light" }}</span>
  </button>
</template>

<script lang="ts">
import { useDark, useToggle } from "@vueuse/core";
import { defineComponent } from "vue";


export default defineComponent({
  name: "DarkMode",
  setup() {
    const isDark = useDark();
    const toggleDark = useToggle(isDark);

    return { toggleDark, isDark };
  },
});
</script>

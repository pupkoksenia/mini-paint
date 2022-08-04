<template>
  <div class="a" style="color: aquamarine">History.vue</div>
  <!--button
      v-for="n in names"
      v-bind:key="tab.name"
      v-bind:class="['tab-button', { active: currentTab === tab }]"
      v-on:click="currentTab = tab"
    >
      {{ tab.name }}
    </button-->
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { nameFiles } from "../components/mocks/nameFiles";

export default defineComponent({
  name: "HistoryPart",
  setup() {
    const names = ref(nameFiles);
    const volumeOn = ref(true);

    return { names, volumeOn };
  },
});
</script>

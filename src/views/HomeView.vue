<template>
  <div class="pl-5 pt-6">
    <button
      v-for="tab in tabs"
      v-bind:key="tab.name"
      class="bg-neutral-300	border-2 py-0.5 px-0.5 border-black rounded"
      v-on:click="currentTab = tab"
    >
      {{ tab.name }}
    </button>
    <component v-bind:is="currentTabComponent" class="tab"></component>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import PaintPart from "../components/Paint.vue";
import FeedUsers from "../components/FeedUsers.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    PaintPart,
    FeedUsers,
  },
  setup() {
    const currentTab = ref();
    const tabs = ref([
      { comp: "PaintPart", name: "Paint" },
      { comp: "FeedUsers", name: "Feed" },
    ]);
    const currentTabComponent = computed(() => currentTab.value?.comp);

    onMounted(() => {
      currentTab.value = tabs.value[0];
    });
    return { currentTab, tabs, currentTabComponent };
  },
});
</script>

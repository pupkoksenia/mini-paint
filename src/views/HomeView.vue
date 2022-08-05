<template>
  <div class="a" style="color: aquamarine">HomeView.vue</div>
  <div id="dynamic-component-demo" class="demo">
    <button
      v-for="tab in tabs"
      v-bind:key="tab.name"
      v-bind:class="['tab-button', { active: currentTab === tab }]"
      v-on:click="currentTab = tab"
    >
      {{ tab.name }}
    </button>
    <component v-bind:is="currentTabComponent" class="tab"></component>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import HistoryPart from "../components/History.vue";
import PaintPart from "../components/Paint.vue";
import FeedUsers from "../components/FeedUsers.vue"

export default defineComponent({
  name: "HomeView",
  components: {
    HistoryPart,
    PaintPart,
    FeedUsers
  },
  setup() {
    const currentTab = ref();
    const tabs = ref([
      { comp: "HistoryPart", name: "History" },
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

<style>
.demo {
  font-family: sans-serif;
  border: 1px solid #eee;
  border-radius: 2px;
  padding: 20px 30px;
  margin-top: 1em;
  margin-bottom: 40px;
  user-select: none;
  overflow-x: auto;
}

.tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: -1px;
  margin-right: -1px;
}
.tab-button:hover {
  background: #e0e0e0;
}
.tab-button.active {
  background: #e0e0e0;
}
.demo-tab {
  border: 1px solid #ccc;
  padding: 10px;
}
</style>

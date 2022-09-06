<template>
  <div class = "overflow-hidden bg-gradient-to-t from-indigo-500/75 dark:bg-purple-900 to-white dark:to-black w-screen max-h-fit min-h-screen">
     <HeaderPart @currentTabComponent = "(currTab: string) => setTabComponent(currTab)"/>
    <component v-bind:is="currentTabComponent"></component>
  </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from "vue";
  import HeaderPart from '../components/Header.vue'
  import FeedUsers from "../components/FeedUsers.vue";
  import PaintPart from "../components/Paint.vue";
  export default defineComponent({
    name: "HomeView",
    components: {
      HeaderPart,
      FeedUsers,
      PaintPart,
    },
    setup() {
      const currentTabComponent = ref()
      onMounted(() => {
        currentTabComponent.value = "FeedUsers"
      });
      const setTabComponent = (currTab: string) => {
        if( currTab === "Feed") currentTabComponent.value = "FeedUsers"
        else currentTabComponent.value = "PaintPart"
      }
      return {currentTabComponent, setTabComponent}
    }
  });
  </script>

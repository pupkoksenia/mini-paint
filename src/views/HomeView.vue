<template>
  <div
    class="bg-gradient-to-t from-indigo-500/75 dark:bg-purple-900 to-white dark:to-black w-screen max-h-fit min-h-screen"
  >
    <HeaderPart />
    <div class="grid grid-cols-10 h-6">
      <button class="button-home-page">
        <router-link to="/feed"> Feed </router-link>
      </button>

      <button class="button-home-page">
        <router-link to="/create-paint"> Paint </router-link>
      </button>
      <button v-if="flagRole === 'admin'" class="button-home-page">
        <router-link to="/set-roles"> Set roles </router-link>
      </button>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { useFireBase } from '@/composables/useFireBase'
import { computed, defineComponent } from 'vue'
import HeaderPart from '../components/staff/Header.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    HeaderPart,
  },
  setup() {
    const { state } = useFireBase()
    const flagRole = computed(() => state.user.role)

    return { flagRole }
  },
})
</script>

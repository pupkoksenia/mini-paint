  <template>
  <div
    class="
      bg-gradient-to-t
      from-indigo-500/75
      dark:bg-purple-900
      to-white
      dark:to-black
      w-screen
      max-h-fit
      min-h-screen
    "
  >
    <HeaderPart />
    <div class="grid grid-cols-10 h-6">
      <button
        class="
          flex
          items-center
          justify-center
          col-span-2
          text-cyan-700
          font-bold
          dark:text-violet-500
        "
      >
        <router-link to="/feed"> Feed </router-link>
      </button>

      <button
        class="
          flex
          items-center
          justify-start
          col-span-2
          text-cyan-700
          font-bold
          dark:text-violet-500
        "
      >
        <router-link to="/create-paint"> Paint </router-link>
      </button>
      <button
        class="
          flex
          items-center
          justify-start
          col-span-2
          text-cyan-700
          font-bold
          dark:text-violet-500
        "
      >
        <router-link to="/set-roles"> Set roles </router-link>
      </button>
    </div>
    <router-view />
  </div>
</template>
  
  <script lang="ts">
import { defineComponent } from "vue";
import HeaderPart from "../components/staff/Header.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    HeaderPart,
  },
});
</script>

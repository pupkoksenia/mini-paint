<template>
  <div class="grid grid-cols-8 w-screen h-16">
    <div class="col-span-1 justify-items-end">
      <img src="../assets/62414.jpg" class="h-16 mx-4" />
    </div>
    <div
      class="flex items-center justify-start col-span-3 text-cyan-700 font-bold dark:text-violet-500"
    >
      Mini-paint
    </div>

    <button
      class="flex items-center justify-start col-span-1 text-cyan-700 font-bold dark:text-violet-500"
      v-on:click="$emit('currentTabComponent', tabs[0])"
    >
      {{ tabs[0] }}
    </button>

    <button
      class="flex items-center justify-start text-cyan-700 font-bold dark:text-violet-500"
      v-on:click="$emit('currentTabComponent', tabs[1])"
    >
      {{ tabs[1] }}
    </button>

    <button
      v-on:click="signOutUser"
      class="flex items-center justify-start col-span-1 text-cyan-700 font-bold dark:text-violet-500"
    >
      Log Out
    </button>
    <DarkMode/>
  </div>
</template>


<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useFireBase } from "../composables/useFireBase";
import { useRouter } from "vue-router";
import DarkMode from "../components/ButtonDarkMode.vue";

export default defineComponent({
  name: "HeaderPart",
  components: {
    DarkMode,
  },
  setup() {
    const tabs = ref(["Paint", "Feed"]);
    const { state, signOutFirebase } = useFireBase();
    const router = useRouter();
    const stateOfStyle = ref();
    const setStateStyle = (currState:boolean) => {
      stateOfStyle.value = currState
    }
    onMounted(()=>{
      stateOfStyle.value = true
    })

    const signOutUser = () => {
      signOutFirebase();
      router.push("/sign-in");
    };

    return { tabs, state, signOutUser, setStateStyle };
  },
});
</script>

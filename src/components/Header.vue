<template>
  <div class="grid grid-cols-8 w-screen h-16">
    <div class="col-span-1 justify-items-end">
      <img src="../assets/62414.jpg" class="h-16 mx-4" />
    </div>
    <div
      class="flex items-center justify-start col-span-3 text-cyan-700 font-bold"
    >
      Mini-paint
    </div>

    <button
      class="flex items-center justify-start col-span-1 text-cyan-700 font-bold"
      v-on:click="$emit('currentTabComponent', tabs[0])"
    >
      {{ tabs[0]}}
    </button>

    <button
      class="flex items-center justify-start text-cyan-700 font-bold"
      v-on:click="$emit('currentTabComponent', tabs[1])"
    >
      {{ tabs[1] }}
    </button>

        <button v-on:click="signOutUser" class="flex items-center justify-start col-span-1 text-cyan-700 font-bold">Log Out</button>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref } from "vue";
import { useFireBase } from "../composables/useFireBase";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "HeaderPart",
  setup() {

    const tabs = ref(["Paint","Feed"]);
    const { state, signOutFirebase } = useFireBase();
    const router = useRouter();

    const signOutUser = () => {
      signOutFirebase();
      router.push("/sign-in");
    };

    return { tabs, state, signOutUser };
  },
});
</script>

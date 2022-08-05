<template>
  <div class="a" style="color: aquamarine">History.vue</div>
  <ul id="v-for-object" class="demo">
    <li
      v-for="paint in paintsResult"
      :key="paint.toString"
      style="color: aquamarine"
    >
      {{ paint }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../main";

export default defineComponent({
  name: "HistoryPart",
  setup() {
    const paintsResult = ref();

    onMounted(() => {
      getDocs(collection(db, "users")).then((docs) => {
        docs.forEach((doc) => {
          if (doc.data().name === localStorage.getItem("email"))
            paintsResult.value = doc.data().paints;
        });
      });
    });

    return { paintsResult };
  },
});
</script>

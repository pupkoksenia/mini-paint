<template>
  <div class="a" style="color: aquamarine">History.vue</div>
  <ul id="v-for-object" class="demo">
    <li
      v-for="paint in paintsResult"
      :key="paint.nameOfPaint.toString"
      style="color: aquamarine"
    >
      {{ paint.nameOfPaint }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { getUserPaints } from "../components/composables";
//import { collection, getDocs } from "firebase/firestore";
//import { db } from "../main";

export default defineComponent({
  name: "HistoryPart",
  setup() {
    const paintsResult = ref();

    function setPaintsResult() {
      let result = getUserPaints();
      result.then((res: any) => {
        paintsResult.value = res;
      });
    }

    onMounted(() => {
      setPaintsResult();
    });

    return { paintsResult };
  },
});
</script>

<template>
  <ul id="v-for-object" class="demo">
    <!--li
      v-for="paint in paintsResult"
      :key="paint.nameOfPaint.toString"
      style="color: aquamarine"
    >
      {{ paint.nameOfPaint }}
    </li-->
  </ul>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
//import { useFireBase } from "../components/composables";

export default defineComponent({
  name: "HistoryPart",
  /*setup() {
    const { getUserPaints } = useFireBase();
    const paintsResult = ref();
    onMounted(() => {
     paintsResult.value = getUserPaints();
    });

    return { paintsResult };
  },*/
});
</script>

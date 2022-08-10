<template>
  <p><input type="text" placeholder="email" v-model="form.email" /></p>
  <p><button @click="handleSubmit">Submit</button></p>
  <p><button @click="handleReset">Reset</button></p>
  <ul id="v-for-object" class="demo">
    <li
      v-for="paint in sortedFeedPaints"
      :key="paint.toString"
    >
      {{ paint.nameOfPaint }} {{ paint.date }} {{ paint.userName }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useFireBasePaints } from "../composables/useFireBasePaints";

export default defineComponent({
  name: "FeedUsers",
  setup() {
    const { getFeedPaints, sortedFeedPaints, setFilterValue } =
      useFireBasePaints();
    const form = ref({
      email: "",
    });

    const handleSubmit = () => {
      setFilterValue(form.value.email);
    };

    const handleReset = () => {
      setFilterValue("");
    };

    onMounted(() => {
      getFeedPaints();
    });

    return { handleSubmit, form, handleReset, sortedFeedPaints };
  },
});
</script>

<style>
li {
  color: white;
}
</style>

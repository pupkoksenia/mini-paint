<template>
  <div class="a" style="color: aquamarine">FeedUsers.vue</div>
  <p><input type="text" placeholder="email" v-model="form.email" /></p>
  <p><button @click="handleSubmit">Submit</button></p>
  <p><button @click="handleReset">Reset</button></p>
  <ul id="v-for-object" class="demo">
    <li
      v-for="paint in paintsResultUsers"
      :key="paint.toString"
      style="color: aquamarine"
    >
      {{ paint.nameOfPaint }} {{ paint.date }} {{ paint.userName }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { getFeedPaints } from "../components/composables";

export default defineComponent({
  name: "FeedUsers",
  setup() {
    const paintsResultUsers = ref();
    const bufferPaints = ref();

    const form = ref({
      email: "",
    });

    const handleSubmit = () => {
      paintsResultUsers.value = bufferPaints.value.filter(
        (p: any) => p.userName === form.value.email
      );
    };

    const handleReset = () => {
      paintsResultUsers.value = bufferPaints.value;
    };

    function setFeedPaints() {
      let resFeed = getFeedPaints();
      resFeed.then((res) => {
        bufferPaints.value = res;
        paintsResultUsers.value = res;
      });
    }

    onMounted(() => {
      setFeedPaints();
    });

    return { paintsResultUsers, handleSubmit, form, handleReset };
  },
});
</script>

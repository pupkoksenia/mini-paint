<template>
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
import { useFireBase } from "../components/composables/useFireBase";

export default defineComponent({
  name: "FeedUsers",
  setup() {
    const { getFeedPaints } = useFireBase();
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

    const feedPaints = () => {
      getFeedPaints().then((res) => {
        bufferPaints.value = res;
        paintsResultUsers.value = res;
      });
    };

    onMounted(() => {
      feedPaints();
    });

    return { paintsResultUsers, handleSubmit, form, handleReset };
  },
});
</script>

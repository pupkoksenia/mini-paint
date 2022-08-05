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
import { collection, getDocs } from "firebase/firestore";
import { db } from "../main";

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
      console.log(bufferPaints.value)
    };
    const handleReset = () =>{
        paintsResultUsers.value = bufferPaints.value
    }
    onMounted(() => {
      getDocs(collection(db, "users")).then((docs) => {
        let resDocs: any = [];
        docs.forEach((doc) => {
          doc.data().paints.forEach((paint: any) => {
            resDocs.push({
              nameOfPaint: paint.nameOfPaint,
              date: new Date(paint.date.seconds * 1000).toLocaleDateString(),
              userName: doc.data().name,
            });
          });
        });
        resDocs = resDocs
          .sort(
            (prev: any, curr: any) =>
              Date.parse(prev.date) - Date.parse(curr.date)
          )
          .reverse();
        bufferPaints.value = resDocs;
         paintsResultUsers.value=resDocs;
      });
    });

    return { paintsResultUsers, handleSubmit, form, handleReset };
  },
});
</script>

<template>
  <div class="a" style="color: aquamarine">Paint.vue</div>
  <!--el-dialog
    Название="Посмотреть изображение"
    :visible.sync="dialogJPG"
    append-to-body
  >
    <canvas id="mycanvas" width="940" height="570"></canvas>
  </el-dialog-->
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PaintPart",
});
</script>

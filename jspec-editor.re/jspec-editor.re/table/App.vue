<script setup>
const ref = Vue.ref;
const reactive = Vue.reactive;
import Table from "Table.vue";

const model = reactive({
  rows: [],
});

for (let i = 0; i < 20; i++) {
  let row = { id: i + 1, text: `text${i + 1}` };
  model.rows.push(row);
}

const define = reactive({});
</script>

<template>
  <div class="screen">
    <Table :model="model" :define="define"></Table>
  </div>
</template>

<style>
.screen {
  position: relative;
  width: 500px;
  height: 300px;
}
</style>

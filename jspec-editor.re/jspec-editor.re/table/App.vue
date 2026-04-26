<script setup>
const ref = Vue.ref;
const reactive = Vue.reactive;
import Table from "Table.vue";

const data = [];
const ncount = Math.floor(Math.random() * 1000);
for (let i = 0; i < ncount; i++) {
  let row = {
    issue_id: `I${i + 1}`,
    subject: `subject${i + 1}`,
    detail_text: `text${i + 1}`,
    assignee: ``,
    status: `WIP`,
  };
  data.push(row);
}

const model = reactive({
  rows: data,
});

const define = reactive({
  rowHeight: 48,
  columns: [
    {
      name: "id",
      title: "ID",
      valueProp: "issue_id",
      width: 40,
    },
    // { name: "subject", title: "SUBJECT", valueProp: "subject", width: 200 },
    { name: "text", title: "TEXT", valueProp: "detail_text", width: 250 },
    { name: "status", title: "STATUS", valueProp: "status", width: 60 },
  ],
});

function onChange(data) {
  console.log(data);
}

function onInput(data) {
  console.log(data);
}
</script>

<template>
  <div class="screen">
    <Table
      :model="model"
      :define="define"
      @on-change="onChange"
      @on-input="onInput"
    ></Table>
  </div>
</template>

<style>
.screen {
  position: relative;
  width: 600px;
  height: 500px;
}
</style>

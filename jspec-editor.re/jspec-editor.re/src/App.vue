<script setup>
import { ref, reactive, onMounted } from 'vue'
import JspecEditor from './components/JspecEditor.vue';
import fsUtil from "./fs-util.js";

const data = reactive({
  root: {
    foo: "foo1",
    biz: 123,
    bar: { 
      baz: "baz",
      fox: false,
      cat: null,
      bird: [
        1, 2, 3
      ],
      dog: undefined,
      far: 1,
      poo: {
        faz: 100
      }
    }
  }
});

onMounted(() => {
  window.data = data;
})

async function openFile() {
  let result = await fsUtil.openFile();
  console.log(result.text);
  let parsed = JSON.parse(result.text);
  console.log(parsed);
  data.root = parsed;
}
</script>

<template>
  <div class="container flex-row">
    <span class="mr1 title">JSON EDITOR</span>
    <button class="button mr1" @click="openFile()">OPEN</button>
    <button class="button mr1">SAVE</button>
  </div>
  <JspecEditor :object="data.root" :parent-obj="data" 
    :parent-key="'root'" :root-obj="data.root"
    :enable-ref="true"/>
</template>

<style scoped>
  .container {
    display: flex;
  }

  .flex-row {
    flex-direction: row;
  }

  .title {
    font-size: 1.0em;
  }

  .button {
    border: solid 1px #ccc;
    color: #eee;
    background-color: #333;
    cursor: pointer;
    font-size: 0.9em;
  }

  .mr1 {
    margin-right: 1em;
  }
</style>

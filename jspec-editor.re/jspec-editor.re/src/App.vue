<script setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue'
import JspecEditor from './components/JspecEditor.vue';
import fsUtil from "./fs-util.js";

const data = reactive({
  root: {
    help: [
      "This is a simple JSON editor."
    ],
    example: {
      string: "abc",
      number: 1234,
      boolean: true,
      nullValue: null,
      undefinedValue: undefined,
      nestedObject: {
        key1: "value1",
        key2: "value2",
      },
      array: [
        "val1", 1234, false
      ],
      reference: "#example.nestedObject",
      referenceError: "#example.doesNotExist",
    }
  },
});

const modified = ref(false);

onMounted(() => {
  window.data = data;
})

async function openFile() {
  let result = await fsUtil.openFile();
  if(!result) return;
  let parsed = JSON.parse(result.text);
  data.root = parsed;

  nextTick(() => {
    commit();
  });
}

async function saveFile() {
  let result = await fsUtil.saveFile(JSON.stringify(data.root, null, "  "));
  if(!result) return;
  commit();
}

watch(data, () => {
  taint();
}, { deep: true });

function commit() {
  modified.value = false;
}

function taint() {
  modified.value = true;
}
</script>

<template>
  <div style="padding-left:5px;">
    <div class="container flex-row header" style="padding: 5px 0;">
      <span class="mr1 title">JSON EDITOR</span>
      <button class="button mr1" @click="openFile()">OPEN</button>
      <button class="button mr1" @click="saveFile()">{{ (modified)? "! " : "" }}SAVE</button>
    </div>
    <JspecEditor :object="data.root" :parent-obj="data" 
      :parent-key="'root'" :root-obj="data.root"
      :enable-ref="true"/>
  </div>
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

  .header {
    position: sticky;
    top: 0;
    background-color: #333;
  }
</style>

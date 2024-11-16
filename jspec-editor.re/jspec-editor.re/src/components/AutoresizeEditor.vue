<script setup>
import { ref, onMounted, reactive } from 'vue'

const emit = defineEmits(['updated']);

const props = defineProps({
  value: null,
  valueKey: null,
  updated: Function,
  style: {
    type: Object,
    default: {},
  },
  onCopy: Function
});

const data = reactive({
  val: props.value,
  valStr: nullToString(props.value),
  valType: valToValType(props.value),
  width: 10,
  before: props.value
});

const refText = ref(null);
const refInput = ref(null);

function valToValType(val) {
  if(val === undefined) {
    return "undefined";
  }
  if(val == null) {
    return "null"
  }
  if(typeof(val) === "number") {
    return "number";
  }
  if(typeof(val) === "string") {
    return "string";
  }
  if(typeof(val) === "boolean") {
    return "boolean";
  }
  // if(val instanceof Array) {
  //   return "object";
  // }
  if(typeof(val) === "object") {
    return "object";
  }
}

function nullToString(val) {
  if(val === undefined) { 
    return "undefined";
  } else if(val == null) {
    return "null";
  } else {
    return val.toString();
  }
}

function resize() {
  data.width = refText.value.getBoundingClientRect().width;
}

function update() {
  var v = null;
  try {
    v = JSON.parse(data.valStr);
  } catch(e) {
    v = data.valStr;
  }
  data.val = v;
  data.valType = valToValType(v);
  data.valStr = nullToString(v);

  emit('updated', props.valueKey, data.val, data.before);
  data.before = data.val;
}

function focus() {
  refInput.value.selectionStart = 0;
  refInput.value.selectionEnd = refInput.value.value.length;
}

function classByType(val) {
  if(val === undefined) {
    return "value-undefined";
  }
  if(val == null) {
    return "value-null";
  }
  if(typeof(val) === "number") {
    return "value-number";
  }
  if(typeof(val) === "string") {
    return "value-string";
  }
  if(typeof(val) === "boolean") {
    return "value-boolean";
  }
}

onMounted(() => {
  resize();
});
</script>

<template>
  <span style="display:inline-block; vertical-align:top;">
    <span ref="refText" 
      :style="Object.assign({visibility:'hidden'}, style)" >{{data.valStr}}</span>
    <input type="text"
        :class="['input', classByType(data.val)]"
        :style="Object.assign({
            width:(data.width).toString()+'px',
            fontSize:'1.0em',
            marginLeft:(-data.width).toString()+'px',
          }, style)"
        v-model="data.valStr" ref="refInput"
        @change="update()"
        @input="resize()"
        @compositionend="resize()"
        @focus="focus()"
        @blur="focused = false"
        @copy="(onCopy)? onCopy() : null"
        spellcheck="false"/>
  </span>
</template>

<style scoped>
  .container {
    display: flex;
  }

  .flex-row {
    flex-direction: row;
  }

  .flex-col {
    flex-direction: column;
  }

  .ml1 {
    margin-left: 1em;
  }

  .mr05 {
    margin-right: 0.5em;
  }

  .input {
    background-color: #333;
    color: #eee;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    border: none;
    font-size: 1.0em;
    font-family: unset;
  }

  .input:focus {
    outline: solid 1px #eee;
  }

  .value-number {
    color: #5c5;
  }

  .value-boolean {
    color: #88f;
  }

  .value-string {
    color: #eee;
  }

  .value-null {
    color: #b4b;
  }

  .value-undefined {
    color: #b4b;
  }
</style>
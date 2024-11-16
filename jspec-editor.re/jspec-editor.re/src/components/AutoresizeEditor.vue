<script setup>
import { ref, onMounted, reactive, nextTick } from 'vue'

const emit = defineEmits(['updated']);

const props = defineProps({
  value: null,
  valueKey: null,
  updated: Function,
  style: {
    type: Object,
    default: {},
  },
  onCopy: Function,
  showQuote: {
    type: Boolean,
    default: true
  }
});

const data = reactive({
  val: props.value,
  valStr: stringify(props.value, props.showQuote),
  valType: valToValType(props.value),
  width: 10,
  before: props.value
});

const refText = ref(null);
const refInput = ref(null);

function stringify(val, preserveQuote = true) {
  let type = valToValType(val);
  if(val === undefined) {
    return "undefined";
  }
  if(type === "string") {
    let s = JSON.stringify(val);
    if(!preserveQuote) {
      s = s.substring(1);
      s = s.substring(0, s.length - 1);
    }
    return s;
  } else {
    return JSON.stringify(val);
  }
}

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
  if(refText.value) {
    data.width = refText.value.getBoundingClientRect().width;
  }
}

function update() {
  let v = null;
  try {
    if(data.valStr === "undefined") {
      v = undefined;
    } else {
      v = JSON.parse(data.valStr);
    }
  } catch(e) {
    v = data.valStr;
  }

  let bef = data.val;

  data.val = v;
  data.valStr = stringify(v, props.showQuote);
  data.valType = valToValType(v);

  if(data.valType != "object") {
    nextTick(() => {
      resize();
    });
  }

  emit('updated', props.valueKey, v, bef);
  data.before = bef;
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
    <span ref="refText" class="span"
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

  .span {
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
    color: #f4b;
  }
</style>
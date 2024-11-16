<script setup>
import { ref, reactive, watch } from 'vue'
import uuid4 from "../uuid4.js";
import AutoresizeEditor from "./AutoresizeEditor.vue";

const emits = defineEmits(["keychanged"]);

const props = defineProps({
  parentObj: null,
  parentKey: null,
  object: Object,
  level: {
    type: Number,
    default: 0,
  },
  rootObj: null,
  enableRef: {
    type: Boolean,
    default: false
  }
})

const data = reactive({
  // object: props.object,
  fold: createFoldStates(props.object)
});

const refJspecEditor = ref(null);

function createFoldStates(val, initialState = true) {
  let fold = {};
  Object.keys(val).forEach(k => {
    fold[k] = initialState;
  });
  return fold;
}

function isObj(val) {
  return typeof(val) === "object" && val != null;
}

function isScalar(val) {
  if(val === undefined) {
    return true;
  }
  if(val == null) {
    return true;
  }
  if(typeof(val) === "number") {
    return true;
  }
  if(typeof(val) === "string") {
    return true;
  }
  if(typeof(val) === "boolean") {
    return true;
  }
  if(val instanceof Array) {
    return false;
  }
  if(typeof(val) === "object") {
    return false;
  }

  throw new Error("unsupported type");
}

function parenSymbol(val) {
  if(val instanceof Array) {
    return ["[","]"];
  } else {
    return ["{", "}"];
  }
}

function toggleFold(key, i) {
  data.fold[key] = !data.fold[key];
}

function valueUpdated(key, val, before) {
  props.object[key] = val;
}

function arrayOrObject(val) {
  if(val instanceof Array) {
    return "array";
  } else if(val != null && val !== undefined 
    && typeof(val) === "object") {
    return "object";
  }
  throw new Error("unknown type");
}

function keyUpdated(key, val, before) {
  // emits("keychanged", before, key, val);

  if(val === "") {
    delete props.object[before];
    return;
  }

  let newobj = (arrayOrObject(props.object) === "array")? [] : {};
  Object.keys(props.object).forEach(k => {
    if(k === before && val !== "") {
      newobj[val] = props.object[before];
    } else {
      newobj[k] = props.object[k];
    }
  });

  data.fold[val] = data.fold[before];
  delete data.fold[before];
  //data.object = newobj;
  props.parentObj[props.parentKey] = newobj;
}

function addKey(target) {
  if(arrayOrObject(target) === "array") {
    target[Math.max(...Object.keys(target)
      .map(k => parseInt(k,10))) + 1] = "value";
  } else {
    let baseKey = "key";
    let i = 0;
    while(Object.keys(target).indexOf(`${baseKey}${i+1}`) >= 0) {
      i++;
    }

    target[`${baseKey}${i+1}`] = "value";
  }
}

watch(props.object, () => {
  forceRedraw();
}, {deep: true});

const redraw = ref(0);

function forceRedraw() {
  redraw.value = redraw.value + 1;
}

function canResolve(path) {
  let paths = path.substring(1).split(".");
  let cur = props.rootObj;
  paths.forEach(p => {
    cur = cur?.[p];
  });

  if(cur !== undefined) {
    return true;
  }

  return false;
}

function isRef(val) {
  if(val == null || val === undefined) return false;
  if(typeof(val) !== "string") return false;
  return val.startsWith("#");
}

function refStyle(val) {
  let style = {};
  if(!props.enableRef || !isRef(val)) return style;
  if(isRef(val)) {
    style.color = "#77f";
    style.textDecoration = "underline";
  }
  if(!canResolve(val)) {
    style.color = "#f77";
    style.textDecoration = "line-through";
  }
  return style;
}
</script>

<template>
  <div class="container flex-col" :key="redraw">
    <div v-if="level === 0">{
      <span class="ml1 clickable" 
        @click.stop="addKey(object)">+</span>
    </div>

    <template v-for="(value,key,i) in object" :key="key">

      <div class="container flex-row ml1">
        <div>
          <AutoresizeEditor :value="key" 
            :value-key="key"
            @updated="keyUpdated"
            :show-quote="false"
            :style="{ color:`#9CDCFE` }"/>
        </div>
        <div class="mr05">:</div>
        <div v-if="isScalar(object[key])">
          <AutoresizeEditor :value="object[key]" 
            :value-key="key"
            @updated="valueUpdated"
            :style="refStyle(object[key])"
            :show-quote="!(enableRef && isRef(object[key]))"/>
          <span v-if="enableRef && isRef(object[key]) && !canResolve(object[key])"
            class="ml05 link-error">
            !
          </span>
        </div>
        <div v-if="!isScalar(object[key])" class="clickable" 
          @click="toggleFold(key, i)">
            <span>{{ parenSymbol(object[key])[0] }}</span>
            <span v-if="!data.fold[key]" class="ml1 clickable"
              @click.stop="addKey(object[key])">+</span>
            <span v-if="data.fold[key]">...{{ parenSymbol(object[key])[1] }}</span>
        </div>
      </div>

      <div v-if="!isScalar(object[key]) && !data.fold[key]" class="ml1">
        <JspecEditor ref="refJspecEditor" 
          :object="object[key]" :level="level + 1" :key="key"
          :parent-key="key" :parent-obj="object" :root-obj="rootObj" 
          :enable-ref="enableRef"/>
      </div>

      <div v-if="!isScalar(object[key]) && !data.fold[key]" 
        class="container flex-row ml1">{{ parenSymbol(object[key])[1] }}</div>
    </template>

    <div v-if="level === 0">}</div>
  </div>
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

  .ml05 {
    margin-left: 0.5em;
  }

  .mr05 {
    margin-right: 0.5em;
  }

  .clickable {
    cursor: pointer;
  }

  .link-error {
    color: #f55;
  }
</style>

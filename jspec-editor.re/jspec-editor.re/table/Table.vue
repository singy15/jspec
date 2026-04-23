<script setup>
const ref = Vue.ref;
const reactive = Vue.reactive;
const defineProps = Vue.defineProps;
const onMounted = Vue.onMounted;
const useTemplateRef = Vue.useTemplateRef;

const props = defineProps(["model", "define"]);

function syncScroll(event, opts) {
  let idsTo = opts.targets;
  let mode = opts.mode;
  let top = event.target.scrollTop;
  let left = event.target.scrollLeft;
  for (let id of idsTo) {
    let el = document.querySelector(`#${id}`);
    let ttop = mode === "both" || mode === "vertical" ? top : el.scrollTop;
    let tleft = mode === "both" || mode === "horizontal" ? left : el.scrollLeft;
    el.scrollTo(tleft, ttop);
  }
}

const def = reactive({
  rowHeight: 24,
  columns: [
    { name: "id", width: 80, left: 0 },
    { name: "text", width: 200, left: 80 },
  ],
});

function recalcGeometry(def) {
  let left = 0;
  let totalWidth = 0;
  def.columns.forEach((col, j) => {
    col.left = left;
    left += col.width + 1;

    if (j === def.columns.length - 1) {
      col.last = true;
    }

    totalWidth += col.width;
  });
  def.totalWidth = totalWidth;
}

const genDrag = ref(null);
function* drag(event, columnindex) {
  let ix = event.x;
  let endEvent = yield;
  let dx = endEvent.x - ix;
  def.columns[columnindex].width += dx;
  recalcGeometry(def);
  return;
}

const table = useTemplateRef("table");

const visibleRange = ref([0, 0]);
function recalcVisibleRange() {
  const tableHeight = table.value.getBoundingClientRect().height;
  const scrollTop = table.value.scrollTop;
  const visibleRowCount = Math.floor(tableHeight / def.rowHeight);
  const startIndex = Math.floor(scrollTop / def.rowHeight);
  visibleRange.value = [
    startIndex, //- visibleRowCount,
    startIndex + visibleRowCount, //+ visibleRowCount,
  ];
}

let timerRecalcVisibleRange = null;
function delayedRecalcVisibleRange() {
  if (timerRecalcVisibleRange) {
    clearTimeout(timerRecalcVisibleRange);
  }
  timerRecalcVisibleRange = setTimeout(() => {
    recalcVisibleRange();
    timerRecalcVisibleRange = null;
  }, 200);
}

function isRowInVisibleRange(rowIndex) {
  return visibleRange.value[0] <= rowIndex && rowIndex <= visibleRange.value[1];
}

function sink(event) {
  // console.log(event);
}

onMounted(() => {
  recalcGeometry(def);
  recalcVisibleRange();
});
</script>

<template>
  <div class="table" ref="table" @scroll="delayedRecalcVisibleRange()">
    <!-- screen -->
    <div
      class="screen"
      :style="{
        left: `0px`,
        top: `0px`,
        width: `${def.totalWidth + def.columns.length}px`,
        height: `${def.rowHeight * (model.rows.length + 1)}px`,
      }"
    ></div>

    <!-- column header -->
    <template v-for="(col, j) in def.columns">
      <div
        class="cell bl bt bb"
        :class="{ br: col.last }"
        :style="{
          position: `sticky`,
          top: `0px`,
          zIndex: 100,
          width: `${col.width}px`,
          left: `${col.left}px`,
        }"
      >
        <span>{{ col.name }}</span>
        <div
          class="resizer"
          draggable="true"
          @dragstart="
            genDrag = drag($event, j);
            genDrag.next($event, j);
          "
          @drag="sink($event)"
          @dragend="genDrag.next($event)"
        ></div>
      </div>
    </template>

    <!-- data -->
    <template v-for="(row, i) in model.rows">
      <template v-for="col in def.columns">
        <div
          v-if="isRowInVisibleRange(i)"
          class="cell bl bt"
          :class="{ br: col.last, bb: i === model.rows.length - 1 }"
          :style="{
            position: `absolute`,
            width: `${col.width}px`,
            left: `${col.left}px`,
            top: `${(i + 1) * def.rowHeight}px`,
          }"
        >
          <span>{{ row[col.name] }}</span>
        </div>
      </template>
    </template>
  </div>
</template>

<style>
* {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: #333;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.bl { border-left: solid 1px #333; }
.br { border-right: solid 1px #333; }
.bt { border-top: solid 1px #333; }
.bb { border-bottom: solid 1px #333; }

.table {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;

  & .cell {
    display: inline-block;
    background-color: #fff;

    & .resizer {
      position: absolute;
      top: 0px;
      bottom: 0px;
      right: 0px;
      width: 3px;
      /* background-color: red; */
      cursor: pointer;
    }
  }

  & .screen {
    display: inline-block;
    position: absolute;
    /* background-color: blue;
    opacity: 0.3;
    z-index: 200; */
  }
}

.scroll-hidden {
  /* scrollbar-width: none; */
}
.scroll-hidden::-webkit-scrollbar { opacity: 0; }
.scroll-hidden::-webkit-scrollbar-thumb { opacity: 0; }
.scroll-hidden::-webkit-scrollbar-track { opacity: 0; }
.scroll-hidden::-webkit-scrollbar-button { opacity: 0; }
.scroll-hidden::-webkit-scrollbar-corner { opacity: 0; }
.scroll-hidden::-webkit-resizer { opacity: 0; }
</style>

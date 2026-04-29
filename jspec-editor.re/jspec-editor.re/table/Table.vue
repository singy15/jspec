<script setup>
const ref = Vue.ref;
const reactive = Vue.reactive;
const defineProps = Vue.defineProps;
const onMounted = Vue.onMounted;
const useTemplateRef = Vue.useTemplateRef;
const defineEmits = Vue.defineEmits;

const props = defineProps(["model", "define"]);
const emits = defineEmits(["on-input", "on-change"]);

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

function createDef(userDef) {
  let rowHeight = userDef.rowHeight ?? 24;
  let def = Object.assign(
    {
      fontSize: 14,
      borderColor: `#aaa`,
      rowHeight: rowHeight,
      rowHeaderWidth: 48,
      scrollLeft: 0,
      scrollTop: 0,
      rows: props.model.rows.map((r, i) => {
        return { height: rowHeight, top: rowHeight * i };
      }),
      selectedCell: [-1, -1],
      hoverCell: [-1, -1],
    },
    userDef,
  );
  return def;
}

const def = reactive(recalcGeometry(createDef(props.define)));

const borderWidth = 1;

function recalcGeometry(def) {
  let left = def.rowHeaderWidth + borderWidth;
  let totalWidth = 0;
  def.columns.forEach((col, j) => {
    col.left = left;
    left += col.width + borderWidth;

    if (j === def.columns.length - 1) {
      col.last = true;
    }

    totalWidth += col.width;
  });
  def.totalWidth = totalWidth;

  let top = 0 + def.rowHeight;
  def.rows.forEach((row) => {
    row.top = top;
    top += row.height;
  });
  return def;
}

const genDrag = ref(null);
function* drag(event, columnindex) {
  table.value.classList.add("resizing");
  let ix = event.x;
  let endEvent = yield;
  let dx = endEvent.x - ix;
  def.columns[columnindex].width += dx;
  if (def.columns[columnindex].width < 10) {
    def.columns[columnindex].width = 10;
  }
  recalcGeometry(def);
  table.value.classList.remove("resizing");
  return;
}

const genDragv = ref(null);
function* dragv(event, rowIndex) {
  table.value.classList.add("resizing");
  let iy = event.y;
  let endEvent = yield;
  let dy = endEvent.y - iy;
  def.rows[rowIndex].height += dy;
  if (def.rows[rowIndex].height < 10) {
    def.rows[rowIndex].height = 10;
  }
  recalcGeometry(def);
  table.value.classList.remove("resizing");
  return;
}

const table = useTemplateRef("table");

const modelView = reactive({
  rows: [],
});

const visibleRange = ref([0, 0]);
function recalcVisibleRange() {
  // const tableHeight = table.value.getBoundingClientRect().height;
  // const scrollTop = table.value.scrollTop;
  // const visibleRowCount = Math.floor(tableHeight / def.rowHeight);
  // const margin = visibleRowCount;
  // const startIndex = Math.max(
  //   0,
  //   Math.floor(scrollTop / def.rowHeight) - margin,
  // );
  // const endIndex = Math.min(
  //   startIndex + visibleRowCount + margin,
  //   props.model.rows.length - 1,
  // );
  // visibleRange.value = [startIndex, endIndex];

  // const rows = props.model.rows.slice(startIndex, endIndex).map((r, i) => {
  //   return { rowIndex: startIndex + i, data: r };
  // });
  // modelView.rows = rows;

  let startIndex = null;
  let endIndex = null;
  const tableHeight = table.value.getBoundingClientRect().height;
  const margin = tableHeight;
  const scrollTop = table.value.scrollTop - margin;
  const tableBottom = scrollTop + tableHeight + margin * 2;
  let totalHeight = 0;
  for (let i = 0; i < props.model.rows.length; i++) {
    let row = def.rows[i];
    if (startIndex == null && scrollTop <= row.top + row.height) {
      startIndex = i;
    }
    if (endIndex == null && tableBottom < row.top) {
      endIndex = i;
    }
    totalHeight += row.height;
  }
  if (startIndex == null) startIndex = 0;
  if (endIndex == null) endIndex = props.model.rows.length - 1;
  def.totalHeight = totalHeight;

  visibleRange.value = [startIndex, endIndex];
  const rows = props.model.rows.slice(startIndex, endIndex).map((r, i) => {
    return { rowIndex: startIndex + i, data: r };
  });
  modelView.rows = rows;
}

let timerRecalcVisibleRange = null;
function delayedRecalcVisibleRange() {
  if (timerRecalcVisibleRange) {
    clearTimeout(timerRecalcVisibleRange);
  }

  const timeoutLength = 200;
  timerRecalcVisibleRange = setTimeout(() => {
    recalcVisibleRange();
    timerRecalcVisibleRange = null;
  }, timeoutLength);
}

function isRowInVisibleRange(rowIndex) {
  return visibleRange.value[0] <= rowIndex && rowIndex <= visibleRange.value[1];
}

function sink(event) {}

function onScroll(event) {
  def.scrollLeft = table.value.scrollLeft;
  def.scrollTop = table.value.scrollTop;
  delayedRecalcVisibleRange();
}

onMounted(() => {
  recalcGeometry(def);
  recalcVisibleRange();
});

function onChange(row, valueProp) {
  emits("on-change", { row, valueProp });
}

function onInput(row, valueProp) {
  emits("on-input", { row, valueProp });
}

function showEditor(irow, icol) {
  return (
    (def.selectedCell[0] === irow && def.selectedCell[1] === icol) ||
    (def.hoverCell[0] === irow && def.hoverCell[1] === icol)
  );
}

function msg(val) {
  console.log(val);
}
</script>

<template>
  <div class="table" ref="table" @scroll="onScroll($event)">
    <!-- screen -->
    <div
      class="screen"
      :style="{
        left: `0px`,
        top: `0px`,
        width: `${def.totalWidth + def.columns.length}px`,
        height: `${def.rowHeight + def.totalHeight}px`,
      }"
    ></div>

    <!-- left top header -->
    <div
      class="cell bl bt br bb"
      :style="{
        position: `absolute`,
        top: `${def.scrollTop}px`,
        left: `${def.scrollLeft}px`,
        zIndex: 900,
        width: `${def.rowHeaderWidth}px`,
        height: `${def.rowHeight}px`,
      }"
    >
      <div class="cell-contents">
        <span>&nbsp;</span>
      </div>
    </div>

    <!-- column header -->
    <template v-for="(col, j) in def.columns">
      <div
        class="cell bl bt bb"
        :class="{ br: col.last }"
        :style="{
          position: `absolute`,
          top: `${def.scrollTop}px`,
          left: `${col.left}px`,
          zIndex: 100,
          width: `${col.width}px`,
          height: `${def.rowHeight}px`,
          userSelect: `none`,
        }"
      >
        <div class="cell-contents">
          <span>{{ col.title }}</span>
        </div>

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
    <template v-for="(row, i) in modelView.rows">
      <!-- row header -->
      <div
        class="cell bl bt br bb"
        :style="{
          position: `absolute`,
          top: `${def.rows[row.rowIndex].top}px`,
          left: `${def.scrollLeft}px`,
          width: `${def.rowHeaderWidth}px`,
          height: `${def.rows[row.rowIndex].height}px`,
          zIndex: 500,
          textAlign: `center`,
        }"
      >
        <div class="cell-contents">
          <span>{{ row.rowIndex + 1 }}</span>

          <div
            class="resizer-v"
            draggable="true"
            @dragstart="
              genDragv = dragv($event, row.rowIndex);
              genDragv.next($event, row.rowIndex);
            "
            @drag="sink($event)"
            @dragend="genDragv.next($event)"
          ></div>
        </div>
      </div>

      <template v-for="(col, j) in def.columns">
        <div
          v-if="isRowInVisibleRange(row.rowIndex)"
          @click="def.selectedCell = [row.rowIndex, j]"
          @mouseenter="def.hoverCell = [row.rowIndex, j]"
          class="cell bl bt"
          :class="{ br: col.last, bb: i === modelView.rows.length - 1 }"
          :style="{
            position: `absolute`,
            width: `${col.width}px`,
            height: `${def.rows[row.rowIndex].height}px`,
            left: `${col.left}px`,
            top: `${def.rows[row.rowIndex].top}px`,
          }"
        >
          <div class="cell-contents">
            <template v-if="!showEditor(row.rowIndex, j)">
              <span style="position:absolute;top:0px;left:0px;">{{
                row.data[col.valueProp]
              }}</span>
            </template>

            <template v-if="showEditor(row.rowIndex, j)">
              <select
                class="cell-editor-select"
                style="position:absolute;top:0px;left:0px;vertical-align:top;text-align:left;"
              >
                <option>{{ row.data[col.valueProp] }}</option>
              </select>

              <textarea
                style="position:absolute;top:0px;left:0px;right:16px;"
                spellcheck="false"
                class="cell-editor-text"
                v-model="row.data[col.valueProp]"
                @change="onChange(row, col.valueProp)"
                @input="onInput(row, col.valueProp)"
                :style="{
                  textAlign: col.textAlign ?? `left`,
                  width: `calc(100% - 16px)`,
                }"
              ></textarea>
            </template>
          </div>
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
  font-size: v-bind(`${def.fontSize}px`);

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.bl {
  border-left: solid 1px #333;
  border-color: v-bind(def.borderColor);
}
.br {
  border-right: solid 1px #333;
   border-color: v-bind(def.borderColor);
}
.bt {
  border-top: solid 1px #333;
   border-color: v-bind(def.borderColor);
}
.bb {
  border-bottom: solid 1px #333;
  border-color: v-bind(def.borderColor);
}

.table.resizing {
  pointer-events: none;
}

.table {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;

  & .cell {
    display: inline-block;
    background-color: #fff;
    overflow: hidden;

    & .cell-contents {
      display: block;
      box-sizing: border-box;
      position: relative;
      width: 100%;
      height: 100%;

      & * {
        position: relative;
      }

      & .cell-editor-text {
        box-sizing: border-box;
        /* width: 100%; */
        height: 100%;
        outline: none;
        border: none;
        resize: none;
        margin: 0;
        padding: 0;
      }

      & .cell-editor-select {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border: none;
        outline: none;
        appearance: none;
      }

      & .cell-editor-select::before {
        content: 'aaa';
        color: red;
        display: inline-block;
        position: absolute;
        top: 0px;
        left: 0px;
        width: 16px;
        height: 16px;
        background-color: red;
        z-index: 99999;
      }
    }

    & .resizer {
      position: absolute;
      top: 0px;
      bottom: 0px;
      right: 0px;
      width: 5px;
      cursor: ew-resize;
      pointer-events: auto !important;
    }

    & .resizer:hover {
      background-color: gray;
    }

    & .resizer-v {
      position: absolute;
      bottom: 0px;
      left: 0px;
      right: 0px;
      height: 5px;
      cursor: ns-resize;
      pointer-events: auto !important;
    }

    & .resizer-v:hover {
      background-color: gray;
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

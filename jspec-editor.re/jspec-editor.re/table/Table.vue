<script setup>
const ref = Vue.ref;
const reactive = Vue.reactive;
const defineProps = Vue.defineProps;
const onMounted = Vue.onMounted;

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

function recalcLeft(def) {
  let left = 0;
  def.columns.forEach((col) => {
    col.left = left;
    left += col.width + 1;
  });
}

const genDrag = ref(null);
function* drag(event, columnindex) {
  let ix = event.x;
  let endEvent = yield;
  let dx = endEvent.x - ix;
  def.columns[columnindex].width += dx;
  recalcLeft(def);
  return;
}

function sink(event) {
  // console.log(event);
}

onMounted(() => {
  recalcLeft(def);
});
</script>

<template>
  <div class="table">
    <!-- column header -->
    <div class="row" :style="{
      position: `sticky`,
      top: `0px`,
      zIndex: 20,
    }">
      <template v-for="(col, j) in def.columns">
        <div
          class="cell"
          :style="{
            position: `absolute`,
            width: `${col.width}px`,
            left: `${col.left}px`,
            borderTop: `none`,
            borderBottom: `solid 1px #333`,
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
    </div>

    <!-- data -->
    <template v-for="(row, i) in model.rows">
      <div class="row">
        <template v-for="col in def.columns">
          <div
            class="cell"
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
      </div>
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

.table {
  position: relative;
  width: 100%;
  height: 100%;
  border: solid 1px #555;
  overflow: auto;

  & .cell {
    display: inline-block;
    /* border-left: solid 1px #333; */
    border-right: solid 1px #333;
    border-top: solid 1px #333;
    /* border-bottom: solid 1px #333; */
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

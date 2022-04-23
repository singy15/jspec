inplaceEditor = require('./inplace-editor.js');

var jspecEditor = {
  name: "jspec-editor",
  components: {
    "inplace-editor": inplaceEditor.inplaceEditor
  },
  props: {
    node: null,
    entryParent: Object,
    entryKey: String,
    level: Number
  },
  data() {
    return {
      open: true
    };
  },
  methods: {
    toggleOpen() {
      this.open = !(this.open);
    },
    addItem() {
      this.node["newitem"] = "value";
    }
  },
//display:inline-flex; flex-flow:column; justify-content:start;
  template: `
    <span style="">
      <!-- Object -->
      <span v-if="(node != null) && typeof(node) === 'object' && open">
        <span @click.stop="toggleOpen()" style="cursor:pointer">{
          <span @click.stop="addItem()" style="cursor:pointer">+</span>
        </span>
        <br>
        <span v-for="(v,k) in node" :style="{'margin-left':((level+1)*10).toString()+'px'}">
          {{k}}: <jspec-editor :node="v" :entryParent="node" :entryKey="k" :level="level+1"></jspec-editor>
          <br>
        </span>
        <span :style="{'margin-left':((level)*10).toString()+'px', 'cursor':'pointer'}" @click="toggleOpen()">}</span>
      </span>
      <span v-if="(node != null) && typeof(node) === 'object' && !open">
        <span @click="toggleOpen()" style="cursor:pointer">{<span style="font-size:0.5rem">...</span>}</span>
      </span>

      <!-- Value -->
      <span v-if="!((node != null) && typeof(node) === 'object')">
        <inplace-editor :obj="entryParent" :placeKey="entryKey"></inplace-editor>
      </span>

    </span>
  `
};

module.exports.jspecEditor = jspecEditor;


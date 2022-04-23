const Vue = require('vue');
var inplaceEditor = require('./inplace-editor.js');
var autoresizeEditor = require('./autoresize-editor.js');

var jspecEditor = {
  name: "jspec-editor",
  components: {
    "inplace-editor": inplaceEditor.inplaceEditor,
    "autoresize-editor": autoresizeEditor.autoresizeEditor,
  },
  props: {
    node: null,
    entryParent: Object,
    entryKey: null,
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
    },
    updated(newKey, oldKey) {
      if(newKey !== "") {
        this.node[newKey] = this.node[oldKey];
      }
      delete this.node[oldKey];
    },
    styleKey(key, val) {
      let style = {};

      if(key.indexOf("$") > 0) {
        // style.color = "#55F";
        style.fontWeight = "bold";
      }

      if((key.toUpperCase() === key) && ((null !== val) && (typeof(val) === "object"))) {
        style.color = "#22C";
      }
      
      return style;
    },
    styleVal(key, val) {
      let style = {};

      if((null != val) && (typeof(val) === 'string') && (val.substring(0,1) === "#")) {
        style.color = "#55C";
        style.fontStyle = 'italic';
        style.textDecoration = 'underline';
      }
      
      return style;
    }
  },
  template: `
    <span>

      <!-- Object -->
      <span v-if="(node != null) && typeof(node) === 'object' && open">
        <span @click.stop="toggleOpen()" style="cursor:pointer">{</span>
        <span style="margin-left:10px"></span>
        <span @click.stop="addItem()" style="cursor:pointer;">+</span>
        <br>
        <span v-for="(v,k,i) in node">
          <span v-for="n in (level+1)" :style="{ 'margin-left':'5px', 'margin-right':(10).toString()+'px', 'borderLeft':'solid 1px #CCC', 'opacity':0.5 }"></span>
          <autoresize-editor :key="k" :value="k" :style="styleKey(k,v)" v-on:updated="updated"></autoresize-editor>: <jspec-editor key="k" :node="v" :entryParent="node" :entryKey="k" :level="level+1"></jspec-editor>
          <br>
        </span>
        <span v-for="n in (level)" :style="{ 'margin-left':'5px', 'margin-right':(10).toString()+'px', 'borderLeft':'solid 1px #CCC', 'opacity':0.5 }"></span>
        <span :style="{'cursor':'pointer'}" @click="toggleOpen()">}</span>
      </span>
      <span v-if="(node != null) && typeof(node) === 'object' && !open">
        <span @click="toggleOpen()" style="cursor:pointer">{<span style="font-size:0.5rem">...</span>}</span>
      </span>

      <!-- Value -->
      <span v-if="!((node != null) && typeof(node) === 'object')">
        <inplace-editor :obj="entryParent" :placeKey="entryKey" :style="styleVal(entryKey, node)"></inplace-editor>
      </span>

    </span>
  `
};

module.exports.jspecEditor = jspecEditor;


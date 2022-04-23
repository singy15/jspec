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
      open: false
    };
  },
  methods: {
    toggleOpen() {
      this.open = !(this.open);
    },
    addItem() {
      if(Array.isArray(this.node)) {
        this.node.push("value");
      } else {
        this.node["newitem"] = "value";
      }
    },
    updated(newKey, oldKey) {
      console.log(newKey, oldKey);
      if(Array.isArray(this.node)) {
        let tmp = this.node.splice(oldKey, 1)[0];
        let newary = this.node;
        if(newKey !== "") {
          let index = parseInt(newKey,10);
          if(newary[index] !== undefined) {
            newary.splice(index,0,tmp);
          } else {
            newary[index] = tmp;
          }
          for(var i = 0; i < newary.length; i++) {
            if(newary[i] === undefined) {
              newary[i] = "";
            }
          }
        }
        this.entryParent[this.entryKey] = [];
        this.$nextTick(() => {
          this.entryParent[this.entryKey] = newary;
        });
      } else {
        if(newKey !== "") {
          this.node[newKey] = this.node[oldKey];
        }
        delete this.node[oldKey];
      }
    },
    styleKey(key, val) {
      let style = {};

      if((null != key) && (typeof(key) === 'string') && (key.indexOf("$") > 0)) {
        style.fontWeight = "bold";
      }

      if((null != key) && (typeof(key) === 'string') && (key.toUpperCase() === key) && ((null !== val) && (typeof(val) === "object"))) {
        style.color = "#22C";
      }
      
      return style;
    },
    styleVal(key, val) {
      let style = {};

      if((null == val)) {
        style.color = "#A00";
      }

      if((null != val) && (typeof(val) === 'number')) {
        style.color = "#0A0";
      }

      if((null != val) && (typeof(val) === 'boolean')) {
        style.color = "#A0A";
      }

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
        <span @click.stop="toggleOpen()" style="cursor:pointer">
          <span v-if="!Array.isArray(node)">{</span>
          <span v-if="Array.isArray(node)">[</span>
        </span>
        <span style="margin-left:10px"></span>
        <span @click.stop="addItem()" style="cursor:pointer;">+</span>
        <br>
        <span v-for="(v,k) in node" style="white-space:nowrap;">
          <span v-for="n in (level+1)" :style="{ 'margin-left':'5px', 'margin-right':(10).toString()+'px', 'borderLeft':'solid 1px #CCC', 'opacity':0.5 }"></span>
          <autoresize-editor v-if="!(Array.isArray(node))" :key="k" :value="k" :style="styleKey(k,v)" v-on:updated="updated"></autoresize-editor>
          <autoresize-editor v-if="(Array.isArray(node))" :key="k" :value="k" :style="styleKey(k,v)" v-on:updated="updated"></autoresize-editor>
          <!--<span v-if="(Array.isArray(node))" :key="k">{{k}}</span>-->
          <span>: </span>
          <jspec-editor :key="k" :node="v" :entryParent="node" :entryKey="k" :level="level+1"></jspec-editor>
          <br>
        </span>
        <span v-for="n in (level)" :style="{ 'margin-left':'5px', 'margin-right':(10).toString()+'px', 'borderLeft':'solid 1px #CCC', 'opacity':0.5 }"></span>
        <span :style="{'cursor':'pointer'}" @click="toggleOpen()">
          <span v-if="!Array.isArray(node)">}</span>
          <span v-if="Array.isArray(node)">]</span>
        </span>
      </span>
      <span v-if="(node != null) && typeof(node) === 'object' && !open">
        <span @click="toggleOpen()" style="cursor:pointer">
          <span v-if="!Array.isArray(node)">{</span>
          <span v-if="Array.isArray(node)">[</span>
          <span style="font-size:0.5rem">...</span>
          <span v-if="!Array.isArray(node)">}</span>
          <span v-if="Array.isArray(node)">]</span>
        </span>
      </span>

      <!-- Value -->
      <span v-if="!((node != null) && typeof(node) === 'object')">
        <inplace-editor :obj="entryParent" :placeKey="entryKey" :style="styleVal(entryKey, node)"></inplace-editor>
      </span>

    </span>
  `
};

module.exports.jspecEditor = jspecEditor;


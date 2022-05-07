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
    root: Object,
    node: null,
    entryParent: Object,
    entryKey: null,
    level: Number,
    openState: Boolean
  },
  data() {
    return {
      open: (this.openState)? this.openState : false
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
    isStructureKey(key) {
      return (null != key) && (typeof(key) === 'string') && (key.indexOf("$") === 0);
    },
    isPropertyKey(key) {
      return (null != key) && (typeof(key) === 'string') && (key.indexOf("$") < 0);
    },
    keyType(key) {
      if(this.isStructureKey(key)) {
        return "structure";
      }

      if(this.isPropertyKey(key)) {
        return "property";
      }
    },
    isNull(val) {
      return (null == val);
    },
    isNumber(val) {
      return (null != val) && (typeof(val) === 'number');
    },
    isBoolean(val) {
      return (null != val) && (typeof(val) === 'boolean');
    },
    isString(val) {
      return (null != val) && (typeof(val) === 'string') && (val.substring(0,1) !== "#");
    },
    isReference(val) {
      return (null != val) && (typeof(val) === 'string') && (val.substring(0,1) === "#");
    },
    isObject(val) {
      return (null != val) && (typeof(val) === 'object');
    },
    valueType(val) {
      if(this.isNull(val)) {
        return "null";
      }

      if(this.isNumber(val)) {
        return "number";
      }

      if(this.isBoolean(val)) {
        return "boolean";
      }

      if(this.isString(val)) {
        return "string";
      }

      if(this.isReference(val)) {
        return "reference";
      }

      if(this.isObject(val)) {
        return "object";
      }
    },
    styleKey(key, val) {
      let style = {
        verticalAlign: 'top'
      };

      if(this.isStructureKey(key)) {
        style.fontWeight = "bold";
      }

      if(this.isPropertyKey(key) && (key.toUpperCase() === key)) {
        style.color = "#22C";
      }

      return style;
    },
    styleVal(key, val) {
      let style = {};

      if(this.isNull(val)) {
        style.color = "#A00";
      }

      if(this.isNumber(val)) {
        style.color = "#0A0";
      }

      if(this.isBoolean(val)) {
        style.color = "#A0A";
      }

      if(this.isReference(val)) {
        style.color = "#55C";
        style.fontStyle = 'italic';
        style.textDecoration = 'underline';
      }
      
      return style;
    },
    resolvable(val) {
      console.log(val);
      let path = val.substring(1).split(".");
      let cur = this.root;
      for(var i = 0; i < path.length; i++) {
        let p = path[i];
        console.log(p);
        cur = cur[p];
        if(cur === undefined || cur == null) {
          return false;
        }
      }

      return true;
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
          <autoresize-editor :key="k" :value="k" :style="styleKey(k,v)" v-on:updated="updated"></autoresize-editor>
          <span style="vertical-align:top">: </span>
          <jspec-editor :root="root" :key="k" :node="v" :entryParent="node" :entryKey="k" :level="level+1"></jspec-editor>
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
        <inplace-editor :obj="entryParent" :placeKey="entryKey" :watch-val="entryParent[entryKey]" :style="styleVal(entryKey, node)"></inplace-editor>
        <span v-if="isReference(node) && !resolvable(node)" 
            style="color:red; margin-left:1em;">
          !
        </span>
      </span>

    </span>
  `
};

module.exports.jspecEditor = jspecEditor;


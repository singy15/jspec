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
        if(newKey === "") {
          delete this.node[oldKey];
        }
        else {
          let obj = this.node[oldKey];
        
          let key = null;
          let getAbsPath = (node,parent,absPath,relPath,parentPath,root) => {
            if(node == obj) {
              key = absPath; 
            }
            return getAbsPath;
          };

          this.traverse(this.root, this.root, "", getAbsPath);
          let keyFrom = key;

          this.node[newKey] = this.node[oldKey];
          delete this.node[oldKey];

          this.traverse(this.root, this.root, "", getAbsPath);
          let keyTo = key;

          let replacee = "#" + keyFrom;
          let replacer = "#" + keyTo;

          let updateRef = (node,parent,absPath,relPath,parentPath,root) => {
            for(var k in node) {
              let v = node[k];
              if(this.isReference(v) && (v.indexOf(replacee) >= 0)) {
                node[k] = node[k].replace(replacee, replacer);
              }
            }
            return updateRef;
          };

          this.traverse(this.root, this.root, "", updateRef);

          for(var k in this.root) {
            let v = this.root[k];
            if(this.isReference(v) && (v.indexOf(replacee) >= 0)) {
              this.root[k] = this.root[k].replace(replacee, replacer);
            }
          }
        }
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
      return (null != val) && (typeof(val) === 'string') && !(/#\w+/.test(val));
    },
    isReference(val) {
      return (null != val) && (typeof(val) === 'string') && (/#\w+/.test(val));
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
    resolve(val) {
      let path = val.substring(1).split(".");
      let cur = this.root;
      for(var i = 0; i < path.length; i++) {
        let p = path[i];
        cur = cur[p];
        if(cur === undefined || cur == null) {
          return undefined;
        }
      }

      return cur;
    },
    resolvable(val) {
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
    },
    nodep(value) {
      return value !== null && typeof value === 'object';
    },
    traverse(root, node, path, op) {
      // op : (node,parent,absPath,relPath,parentPath,root) => { (node,parent,absPath,relPath,parentPath,root) => ... | falsy }
      for(var key in node) {
        var child = node[key];
        if(this.nodep(child)) {
          let parentPath = path;
          let absPath = ((path === "")? key : path + "." + key);
          let relPath = key;
          let nextop = op(child, node, absPath, relPath, parentPath, root);
          if(nextop) {
            this.traverse(root, child, absPath, nextop);
          }
        }
      }
    },
    orderKey(dir, key) {
      // dir < 0 : up
      let keys = [];
      let vals = [];
      for(var k in this.node) {
        keys.push(k);
        vals.push(this.node[k]);
      }

      let index = keys.indexOf(key);

      if(dir < 0 && index == 0) {
        return;
      }
      if(dir > 0 && index == (keys.length-1)) {
        return;
      }

      let tmpKey = keys.splice(index,1)[0];
      let tmpVal = vals.splice(index,1)[0];
      keys.splice(index + dir,0,tmpKey);
      vals.splice(index + dir,0,tmpVal);

      for(var k in this.node) {
        delete this.node[k];
      }

      for(var i = 0; i < keys.length; i++) {
        this.node[keys[i]] = vals[i];
      }
    },
    dragstart(event, node, val, key) {
      let path = null;
      let getAbsPath = (node,parent,absPath,relPath,parentPath,root) => {
        if(node == val) {
          path = absPath; 
          return null;
        }
        for(var k in node) {
          if(node[k] == val) {
            path = absPath + "." + k;
            return null;
          }
        }
        return getAbsPath;
      };
      if(node == this.root) {
        for(var k in this.root) {
          if(this.root[k] == val) {
            path = k;
          }
        }
      }
      this.traverse(this.root, this.root, "", getAbsPath);

      event.dataTransfer.setData('text/plain', path);
    },
    drop(event, node, val, key) {
      let path = null;
      let getAbsPath = (node,parent,absPath,relPath,parentPath,root) => {
        if(node == val) {
          path = absPath; 
          return null;
        }
        for(var k in node) {
          if(node[k] == val) {
            path = absPath + "." + k;
            return null;
          }
        }
        return getAbsPath;
      };
      if(node == this.root) {
        for(var k in this.root) {
          if(this.root[k] == val) {
            path = k;
          }
        }
      }
      this.traverse(this.root, this.root, "", getAbsPath);

      let moveFrom = event.dataTransfer.getData('text');
      let moveTo = path;

      let parentFrom = moveFrom.split(".").slice(0,-1).join(".");     
      let parentTo = moveTo.split(".").slice(0,-1).join(".");     
      let keyFrom = moveFrom.split(".").slice(-1)[0];
      let keyTo = moveTo.split(".").slice(-1)[0];

      if(parentTo === parentFrom) {
        let keys = [];
        for(var k in node) {
          keys.push(k);
        }
        let indexFrom = keys.indexOf(keyFrom);
        let indexTo = keys.indexOf(keyTo);
        this.orderKey(indexTo - indexFrom, keyFrom); 
      } else {
        let parentObjFrom = null;
        if(parentFrom !== "") {
          parentObjFrom = this.resolve("#"+parentFrom);
        } else {
          parentObjFrom = this.root;
        }

        let parentObjTo = null;
        if(parentTo !== "") {
          parentObjTo = this.resolve("#"+parentTo);
        } else {
          parentObjTo = this.root;
        }

        parentObjTo[keyFrom] = parentObjFrom[keyFrom];
        delete parentObjFrom[keyFrom];
      }
    }
  },
  computed: {
    // sorted() {
    //   var keys = [];
    //   for(var k in this.node) {
    //     keys.push({key:k,sortKey:((this.node[k].$seq)? this.node[k].$seq.toString() : "")+"_"+k});
    //   }
    //   keys.sort((a,b) => {
    //     if(a.sortKey > b.sortKey) {
    //       return 1;
    //     } else if(a.sortKey === b.sortKey) {
    //       return 0;
    //     } else {
    //       return -1;
    //     }
    //   });
    //   var obj = {};
    //   for(var i = 0; i < keys.length; i++) {
    //     let k = keys[i].key;
    //     obj[k] = this.node[k];
    //   }
    //   return obj;
    // }
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
          <!--
          <span @click="orderKey(-1,k)">U</span>
          <span @click="orderKey(1,k)">D</span>
          <span draggable="true" @dragstart="dragstart($event,node,v,k)" @dragover.prevent @dragenter.prevent @drop="drop($event,node,v,k)">*</span>
          -->
          <autoresize-editor :key="k" :value="k" :style="styleKey(k,v)" v-on:updated="updated"
              @dragstart="dragstart($event,node,v,k)" @dragover.prevent @dragenter.prevent @drop="drop($event,node,v,k)">
          </autoresize-editor>
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


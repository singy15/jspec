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
    openState: Boolean,
    showName: Boolean,
    onSelect: Function,
    theme: {
      type: String,
      default: "dark"
    }
  },
  data() {
    return {
      open: (this.openState)? this.openState : false
    };
  },
  methods: {
    toggleOpenValue(key) {
      this.getValueComp(key).toggleOpen();
    },
    getKeyComp(key) {
      return this.$refs.aedit.filter(x => x.value === key)[0];
    },
    getValueComp(key) {
      return this.$refs.jedit.filter(x => x.entryKey === key)[0];
    },
    setFocusToValue() {
      this.$refs.iedit?.setFocus();
    },
    modifyKeyPreserveOrder(oldKey, newKey, obj) {
      Object.entries(obj).map(e => { 
        delete obj[e[0]]; 
        return e;
      })
      .forEach((x) => {
        if(x[0] === oldKey) {
          obj[newKey] = x[1];
        } else {
          obj[x[0]] = x[1];
        }
      });
    },
    reorderItem(index, up, focusTo/* "key" | "value" */) {
      let keys = Object.keys(this.node);
      let dir = (up)? -1 : 1;

      if((index + dir) < 0 || (index + dir) === keys.length) { return; }

      let destIndex = index + dir;
      let destKey = keys[destIndex];
      let destVal = this.node[destKey];
      let srcIndex = index;
      let srcKey = keys[srcIndex];
      let srcVal = this.node[srcKey];

      let ary = Object.keys(this.node).map(k => { 
        let r = [k,this.node[k]]; 
        delete this.node[k]; 
        return r;
      });
      ary.forEach((x,i) => {
        if(i === destIndex) {
          this.node[srcKey] = srcVal;
        } else if(i === srcIndex) {
          this.node[destKey] = destVal;
        } else {
          this.node[x[0]] = x[1];
        }
      });

      this.$nextTick(() => {
        if(focusTo === "key") {
          this.focusKeyByKey(srcKey);
        } else if(focusTo === "value") {
          this.focusValueByKey(srcKey);
        }
      });
    },
    focusKeyByKey(key) {
      let c = this.getKeyComp(key);
      if(c) { c.setFocus(); }
    },
    focusValueByKey(key) {
      let c = this.getValueComp(key);
      if(c) { c.setFocusToValue(); }
    },
    insertAfterItemWithPreserveOrderByIndex(key, val, index) {
      let ary = Object.keys(this.node).map(k => { 
        let r = [k,this.node[k]]; 
        delete this.node[k]; 
        return r;
      });
      ary.forEach((x,i) => {
        this.node[x[0]] = x[1];
        if(i === index) {
          this.node[key] = val;
        }
      });
    },
    onAddEnter(prevIndex) {
      let newitem = this.getNewItemFor(this.node);
      this.insertAfterItemWithPreserveOrderByIndex(
        newitem.key, newitem.val, prevIndex);
      this.$nextTick(() => {
        this.focusKeyByKey(newitem.key);
      });
    },
    toggleOpen() {
      this.open = !(this.open);
    },
    getNewItemFor(target) {
      if(!this.isObject(target) && !this.isArray(target)) { return; }
      let seq = (this.isObject(target))? 
        Object.keys(target).length + 1 : target.length;
      let key = (this.isObject(target))? `item${seq}` : seq;
      return { key: key, val: `value${seq}` };
    },
    addItem() {
      let newitem = this.getNewItemFor(this.node);
      this.node[newitem.key] = newitem.val;
    },
    updated(newKey, oldKey, index) {
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

          // Update key
          this.modifyKeyPreserveOrder(oldKey, newKey, this.node);

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

          this.$nextTick(() => {
            this.$refs.aedit.filter((x) => x.value === newKey)[0].setFocus();
          });
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
      return (null != val) && (typeof(val) === 'string') && !(/^#\w+/.test(val));
    },
    isReference(val) {
      return (null != val) && (typeof(val) === 'string') && (/^#\w+/.test(val));
    },
    isObject(val) {
      return (null != val) && (typeof(val) === 'object') && !Array.isArray(val);
    },
    isArray(val) {
      return (null != val) && Array.isArray(val);
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
        style.color = "#c86464";
      }

      if(this.isNumber(val)) {
        style.color = "#0A0";
      }

      if(this.isBoolean(val)) {
        style.color = "#A0A";
      }

      if(this.isReference(val)) {
        style.color = "#9696ff";
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
        //console.log(p);
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
    visit(root, node, path, op) {
      // op : (node,parent,absPath,relPath,parentPath,root) => { (node,parent,absPath,relPath,parentPath,root) => ... | falsy }
      for(var key in node) {
        var child = node[key];
        let parentPath = path;
        let absPath = ((path === "")? key : path + "." + key);
        let relPath = key;
        let nextop = op(child, node, absPath, relPath, parentPath, root);
        if(!nextop) { return; }
        if(this.nodep(child)) {
          this.visit(root, child, absPath, nextop);
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
    },
    createOnCopyHandler(node, key, plain = false) {
      return () => {
        let clone = (obj) => JSON.parse(JSON.stringify(obj));
        let ref = (node,adr) => { 
          return adr.split(".").reduce((m,x) => m[x], node);
        };
        let rec = (child,node,abs,rel,par,root) => {
          // console.log(abs);
          Object.keys(node).forEach(x => { 
            if(node[x] != null && typeof(node[x]) === "string" 
                && node[x].indexOf("#") >= 0) { 
              // console.log(JSON.parse(JSON.stringify(node)));
              // console.log("resolving", node[x]);
              node[x] = clone(ref(this.root,node[x].substring(1)));
              // console.log(JSON.parse(JSON.stringify(node)));
            }
          });
          return rec;
        };
        let n = clone(node[key]);

        if(plain) {
          this.visit(n,n,"",rec);
        }

        // navigator.clipboard.writeText(JSON.stringify(node[key], null, "  "))
        navigator.clipboard.writeText(JSON.stringify(n, null, "  "))
          .then(() => {
            //console.log("Text copied to clipboard...")
          })
          .catch(err => {
            //console.log('Something went wrong', err);
          });
      };
    }
  },
  computed: {
    colors() {
      if(this.theme === "dark") {
        return { forecolor: "#FFF", backcolor: "#333", };
      }
      else if(this.theme === "light") {
        return { forecolor: "#000", backcolor: "#FFF", };
      }
      else {
        return { forecolor: "#CCC", backcolor: "#333", };
      }
    }
  },
  template: `
    <span :style="{ color: colors.forecolor }">

      <!-- Object -->
      <span v-if="(node != null) && typeof(node) === 'object' && open">
        <span @click.stop="toggleOpen()" style="cursor:pointer">
          <span v-if="!Array.isArray(node)">{</span>
          <span v-if="Array.isArray(node)">[</span>
        </span>
        <span style="margin-left:10px"></span>
        <span @click.stop="addItem()" style="cursor:pointer;">+</span>
        <br>
        <span v-for="(v,k,i) in node" style="white-space:nowrap;">
          <span v-for="n in (level+1)" :style="{ 'margin-left':'5px', 'margin-right':(10).toString()+'px', 'borderLeft':'solid 1px ' + colors.forecolor, 'opacity':0.3 }"></span>
          <autoresize-editor ref="aedit" :key="k" :value="k" :style="styleKey(k,v)" v-on:updated="(newKey,oldKey) => {updated(newKey,oldKey,i)}" 
              :on-copy="createOnCopyHandler(node, k)" 
              :on-plaincopy="createOnCopyHandler(node, k, true)"
              @dragstart="dragstart($event,node,v,k)" @dragover.prevent @dragenter.prevent @drop="drop($event,node,v,k)" @click="(onSelect)? onSelect(root, node, k) : null"
              :forecolor="colors.forecolor" :backcolor="colors.backcolor"
              v-on:keydown.enter.shift.stop.prevent="onAddEnter(i)"
              v-on:keydown.down.alt.stop.prevent="reorderItem(i,false,'key')"
              v-on:keydown.up.alt.stop.prevent="reorderItem(i,true,'key')"
              v-on:keydown.right.alt.stop.prevent="toggleOpenValue(k)"
              >
          </autoresize-editor>
          <span v-if="showName && v != null && v.$name" style="font-size:0.5rem;">&nbsp;({{v.$name}})</span>
          <span style="vertical-align:top">: </span>
          <jspec-editor ref="jedit" :root="root" :key="k" :node="v" :entryParent="node" :entryKey="k" :level="level+1" :show-name="showName" 
            v-on:keydown.enter.shift.stop.prevent="onAddEnter(i)" :on-select="onSelect" :theme="theme"
            v-on:keydown.down.alt.stop.prevent="reorderItem(i,false,'value')"
            v-on:keydown.up.alt.stop.prevent="reorderItem(i,true,'value')" 
            ></jspec-editor>
          <br>
        </span>
        <span v-for="n in (level)" :style="{ 'margin-left':'5px', 'margin-right':(10).toString()+'px', 'borderLeft':'solid 1px ' + colors.forecolor, 'opacity':0.3 }"></span>
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
        <inplace-editor ref="iedit" :obj="entryParent" :placeKey="entryKey" :watch-val="entryParent[entryKey]" :style="styleVal(entryKey, node)" :forecolor="colors.forecolor" :backcolor="colors.backcolor"></inplace-editor>
        <span v-if="isReference(node) && !resolvable(node)" 
            style="color:red; margin-left:1em;">
          !
        </span>
      </span>

    </span>
  `
};

module.exports.jspecEditor = jspecEditor;


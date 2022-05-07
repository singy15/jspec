const Vue = require('vue');
import {jspecEditor} from './jspec-editor.js';

window.app = Vue.createApp({
  components: {
    "jspec-editor": jspecEditor
  },
  data() {
    var testdata = {
      viewComponentType: {
        form: {
          template: "`<div style=\"background-color:#EFEFEF; border:solid 1px ${type.borderColor}; width:100%; height:100%;\"><div style=\"top:0px; height:30px; background-color:${type.borderColor}; display:flex; justify-content:start; align-items:center; padding-left:5px; \">${(this.label)? this.label : ''}</div></div>`",
          borderColor: "#99F",
        },
        textbox: {
          template: "`<input type=\"text\" style=\"width:100%; height:100%;\" value=\"${(this.label)? this.label : ''}\" />`"
        },
        button: {
          template: "`<button style=\"width:100%; height:100%;\">${label}</button>`"
        }
      },
      $view: {
        stockRegister: {
          $component: {
            form: {
              type: "#viewComponentType.form",
              label: "在庫登録",
              layout: {
                x: 100, y: 100,
                width: 300, height: 200
              }
            },
            stockCd: {
              type: "#viewComponentType.textbox",
              label: "XXXXX",
              layout: {
                x: 150, y: 150,
                width: 150, height: 24
              }
            },
            register: {
              type: "#viewComponentType.button",
              label: "検索",
              layout: {
                x: 150, y: 200,
                width: 150, height: 24
              }
            },
          }
        }
      }
    };

    return {
      root: testdata,
      view: testdata.$view.stockRegister,
      resizing: {
        dragstartPos: { x: 0, y: 0 },
        diff: { x: 0, y: 0 },
        dragging: false,
        gridInterval: 5
      },
      moving: {
        dragstartPos: { x: 0, y: 0 },
        diff: { x: 0, y: 0 },
        dragging: false,
        gridInterval: 5
      },
      renaming: {
        newName: null
      },
      editing: {
        editing: false,
        target: null
      },
      selected: null,
      curId: 0
    };
  },
  methods: {
    resolve(val) {
      if(/#\w+/.test(val)) {
        return val.substring(1).split(".").reduce((memo, path) => {
          return memo[path];
        }, this.root);
      } else {
        return val;
      }
    },
    evalTemplate(component) {
      let type = this.resolve(component.type);
      let resolved = Object.assign({}, component);
      resolved.type = type;
      return (new Function(...Object.keys(resolved), "return " + type.template)).call(resolved, ...Object.values(resolved));
    },
    clamp(n, interval) {
      return Math.floor(n/interval) * interval;
    },
    resizeStart(event, val, key) {
      this.resizing.target = val;
      this.resizing.dragstartPos.x = event.screenX;
      this.resizing.dragstartPos.y = event.screenY;
      this.resizing.dragging = true;
    },
    resizeDrag(event, val, key) {
      if((event.screenX !== 0) && (event.screenY !== 0)) {
        this.resizing.diff.x = this.clamp(event.screenX - this.resizing.dragstartPos.x, this.resizing.gridInterval);
        this.resizing.diff.y = this.clamp(event.screenY - this.resizing.dragstartPos.y, this.resizing.gridInterval);
      }
    },
    resizeEnd(event, val, key) {
      val.layout.width = val.layout.width + this.resizing.diff.x;
      val.layout.height = val.layout.height + this.resizing.diff.y;
      val.layout.width = this.clamp(val.layout.width, this.resizing.gridInterval);
      val.layout.height = this.clamp(val.layout.height, this.resizing.gridInterval);
      this.resizing.dragging = false;
    },
    moveStart(event, val, key) {
      this.moving.target = val;
      this.moving.dragstartPos.x = event.screenX;
      this.moving.dragstartPos.y = event.screenY;
      this.moving.dragging = true;
    },
    moveDrag(event, val, key) {
      if((event.screenX !== 0) && (event.screenY !== 0)) {
        this.moving.diff.x = this.clamp(event.screenX - this.moving.dragstartPos.x, this.moving.gridInterval);
        this.moving.diff.y = this.clamp(event.screenY - this.moving.dragstartPos.y, this.moving.gridInterval);
      }
    },
    moveEnd(event, val, key) {
      let originalLayout = Object.assign({}, val.layout);

      val.layout.x = val.layout.x + this.moving.diff.x;
      val.layout.y = val.layout.y + this.moving.diff.y;
      val.layout.x = this.clamp(val.layout.x, this.moving.gridInterval);
      val.layout.y = this.clamp(val.layout.y, this.moving.gridInterval);

      let baseZIndex = this.zindex(originalLayout.x, originalLayout.y);
      for(var k in this.view.$component) {
        let c = this.view.$component[k];
        if((this.zindex(c.layout.x, c.layout.y) > baseZIndex)
            && (originalLayout.x < c.layout.x)
            && ((originalLayout.x + originalLayout.width) > (c.layout.x + c.layout.width))
            && (originalLayout.y < c.layout.y)
            && ((originalLayout.y + originalLayout.height) > (c.layout.y + c.layout.height))) {
          c.layout.x = c.layout.x + this.moving.diff.x;
          c.layout.y = c.layout.y + this.moving.diff.y;
          c.layout.x = this.clamp(c.layout.x, this.moving.gridInterval);
          c.layout.y = this.clamp(c.layout.y, this.moving.gridInterval);
        }
      }

      this.moving.dragging = false;
    },
    zindex(x, y) {
      return y * 100000 + x;
    },
    select(v, k) {
      this.selected = k;
      this.renaming.newName = k;
    },
    unselect() {
      this.renaming.newName = "";
      this.selected = null;
    },
    rename() {
      let comp = this.view.$component[this.selected];
      this.view.$component[this.renaming.newName] = comp;
      delete this.view.$component[this.selected];
    },
    addComp() {
      this.curId = this.curId + 1;
      let newid = "unnamed" + (this.curId).toString();
      let newcomp = {
        type: "#viewComponentType.textbox",
        layout: {
          x: 100, y: 100, width: 100, height: 20
        }
      };
      this.view.$component[newid] = newcomp;
      this.select(newcomp, newid);
    },
    delComp() {
      delete this.view.$component[this.selected];
      this.selected = null;
    },
    editStart() {
      this.editing.editing = true;
    },
    editEnd() {
      this.editing.editing = false;
    }
  },
  computed: {
  },
  mounted() {
  }
}).mount('#app');


require('./jspec-view-designer.scss');
var jspecEditor = require('./jspec-editor.js');

var jspecViewDesigner = {
  name: "jspec-view-designer",
  components: {
    "jspec-editor": jspecEditor.jspecEditor
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
  },
  template: `
    <div class="jspec-view-editor--component">
      <div :style="{
          position: 'absolute',
          backgroundColor: '#FAFAFA',
          width: '500px',
          height: '500px',
          left: '20px',
          top: '20px',
          overflow: 'auto'
          }"
          @click.stop="unselect()">
        <div class="jspec-view-editor--container" @click.stop>
          <button class="jspec-view-designer--button" style="width:32px" @click="addComp()">+</button>
          <button class="jspec-view-designer--button" style="width:32px" @click="delComp()" :disabled="selected == null">-</button>
          <input type="text" v-model="renaming.newName" :disabled="selected == null"/>
          <button class="jspec-view-designer--button" @click="rename()" :disabled="selected == null">RENAME</button>
          <button class="jspec-view-designer--button" @click="editStart()" :disabled="selected == null">EDIT</button>
        </div>

        <div v-for="(v,k) in view.$component">
          <div :style="{
              position: 'absolute',
              width: v.layout.width.toString() + 'px',
              height: v.layout.height.toString() + 'px',
              left: v.layout.x.toString() + 'px',
              top: v.layout.y.toString() + 'px',
              zIndex: zindex(v.layout.x, v.layout.y),
              outline: (selected === k)? 'solid 1px #F00' : '',
              }"
              class="jspec-view-designer--component-base"
              v-html="evalTemplate(v)"
              @click.stop="select(v, k)">
          </div>
          <div :style="{
              position: 'absolute',
              width: '10px',
              height: '10px',
              // outline: 'solid 1px #000',
              left: (v.layout.x + v.layout.width - 5).toString() + 'px',
              top: (v.layout.y + v.layout.height - 5).toString() + 'px',
              backgroundColor: 'transparent',
              cursor: 'nwse-resize',
              zIndex: 100000000,
              }"
              draggable="true"
              @dragstart.stop="resizeStart($event, v, k)"
              @dragend.stop="resizeEnd($event, v, k)"
              @drag.stop="resizeDrag($event, v, k)">
          </div>
          <div :style="{
              position: 'absolute',
              width: '10px',
              height: '10px',
              // outline: 'solid 1px #000',
              left: (v.layout.x - 5).toString() + 'px',
              top: (v.layout.y - 5).toString() + 'px',
              backgroundColor: 'transparent',
              cursor: 'move',
              zIndex: 100000000
              }"
              draggable="true"
              @dragstart.stop="moveStart($event, v, k)"
              @dragend.stop="moveEnd($event, v, k)"
              @drag.stop="moveDrag($event, v, k)">
          </div>
        </div>

        <div v-if="resizing.dragging">
          <div :style="{
              position: 'absolute',
              width: (resizing.target.layout.width + resizing.diff.x).toString() + 'px',
              height: (resizing.target.layout.height + resizing.diff.y).toString() + 'px',
              left: resizing.target.layout.x.toString() + 'px',
              top: resizing.target.layout.y.toString() + 'px',
              opacity: 0.5,
              pointerEvents: 'none',
              cursor: 'default',
              zIndex: zindex(resizing.target.layout.x, resizing.target.layout.y)
              }"
              class="jspec-view-designer--component-base"
              v-html="evalTemplate(resizing.target)">
          </div>
        </div>

        <div v-if="moving.dragging">
          <div :style="{
              position: 'absolute',
              width: (moving.target.layout.width).toString() + 'px',
              height: (moving.target.layout.height).toString() + 'px',
              left: (moving.target.layout.x + moving.diff.x).toString() + 'px',
              top: (moving.target.layout.y + moving.diff.y).toString() + 'px',
              opacity: 0.5,
              pointerEvents: 'none',
              cursor: 'default',
              zIndex: zindex(moving.target.layout.x, moving.target.layout.y)
              }"
              class="jspec-view-designer--component-base"
              v-html="evalTemplate(moving.target)">
          </div>
        </div>

        <div v-if="editing.editing"
             :style="{
                position: 'fixed',
                top: '0px',
                left: '0px',
                right: '0px',
                bottom: '0px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                zIndex: 100000010
             }"
             @click.stop="editEnd()">
          <div :style="{
                 position: 'fixed',
                 top: '100px',
                 left: '100px',
                 right: '100px',
                 bottom: '100px',
                 backgroundColor: '#FFF',
                 }"
                 @click.stop>
            <div class="jspec-view-editor--container" style="position:absolute; top:0px; left:0px;">
              <button class="jspec-view-designer--button" style="width:100px;" @click="editEnd()">CLOSE</button>
            </div>
            <div style="padding:5px; position:absolute; top:32px; left:0px; right:0px; bottom:0px; overflow:auto;">
              <jspec-editor :root="root" :node="view.$component[selected]" :entryParent="view.$component[selected]" 
                :entryKey="null" :level="0" :open-state="true" :show-name="false"></jspec-editor>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
};

module.exports.jspecViewDesigner = jspecViewDesigner;


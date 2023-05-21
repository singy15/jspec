require('./jspec-view-designer.scss');
var jspecEditor = require('./jspec-editor.js');

var jspecViewDesigner = {
  name: "jspec-view-designer",
  components: {
    "jspec-editor": jspecEditor.jspecEditor
  },
  props: {
    root: Object,
    view: Object
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
          component: {
            form: {
              type: "#viewComponentType.form",
              label: "検索",
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
              label: "register",
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
      // root: this.root,
      // view: this.view,
      resizing: {
        dragstartPos: { x: 0, y: 0 },
        diff: { x: 0, y: 0 },
        dragging: false,
        gridInterval: 5
      },
      repositioning: {
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

    repositionStart(event, val, key) {
      this.repositioning.target = val;
      this.repositioning.dragstartPos.x = event.screenX;
      this.repositioning.dragstartPos.y = event.screenY;
      this.repositioning.dragging = true;
    },
    repositionDrag(event, val, key) {
      if((event.screenX !== 0) && (event.screenY !== 0)) {
        this.repositioning.diff.x = this.clamp(event.screenX - this.repositioning.dragstartPos.x, this.repositioning.gridInterval);
        this.repositioning.diff.y = this.clamp(event.screenY - this.repositioning.dragstartPos.y, this.repositioning.gridInterval);
      }
    },
    repositionEnd(event, val, key) {
      val.layout.x = val.layout.x + this.repositioning.diff.x;
      val.layout.y = val.layout.y + this.repositioning.diff.y;
      val.layout.width = val.layout.width - this.repositioning.diff.x;
      val.layout.height = val.layout.height - this.repositioning.diff.y;
      val.layout.x = this.clamp(val.layout.x, this.repositioning.gridInterval);
      val.layout.y = this.clamp(val.layout.y, this.repositioning.gridInterval);
      val.layout.width = this.clamp(val.layout.width, this.repositioning.gridInterval);
      val.layout.height = this.clamp(val.layout.height, this.repositioning.gridInterval);
      this.repositioning.dragging = false;
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
      for(var k in this.view.component) {
        let c = this.view.component[k];
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
      let comp = this.view.component[this.selected];
      this.view.component[this.renaming.newName] = comp;
      delete this.view.component[this.selected];
    },
    addComp() {
      this.curId = this.curId + 1;
      let newid = "unnamed" + (this.curId).toString();
      let newcomp = {
        type: "#def.view.componentType.text",
        layout: {
          x: 100, y: 100, width: 100, height: 20
        }
      };
      this.view.component[newid] = newcomp;
      this.select(newcomp, newid);
    },
    delComp() {
      delete this.view.component[this.selected];
      this.selected = null;
    },
    editStart() {
      this.editing.editing = true;
    },
    editEnd() {
      this.editing.editing = false;
    },
    generateCode() {
      let codes = Object.keys(this.view.component)
        .map(k => this.view.component[k])
        .filter(c => { return !(c.undocumented); })
        .map(c => { console.log(c); return c; })
        .map(c => `<div style=" position: absolute; width: ${c.layout.width.toString()}px; height: ${c.layout.height.toString()}px; left: ${c.layout.x.toString()}px; top: ${c.layout.y.toString()}px; z-index: ${this.zindex(c.layout.x, c.layout.y)}; box-sizing:border-box;">${this.evalTemplate(c)}</div>`);
      console.log(codes);
      this.createDOM();
      alert("The code copied to clipboard!");
    },
    createDOM() {
      let includeGeometrically = (a, b) => {
        // a include b?
        let expand = 1;
        return (a != b)
          && ((a.layout.x - expand) <= b.layout.x)
          && ((a.layout.y - expand) <= b.layout.y)
          && ((b.layout.x + b.layout.width) <= (a.layout.x + a.layout.width + expand))
          && ((b.layout.y + b.layout.height) <= (a.layout.y + a.layout.height + expand));
      };

      let dp = new DOMParser();

      let cs = Object.keys(this.view.component)
        .map(k => this.view.component[k])
        .map(c => { 
            let parsedDom = dp.parseFromString(`<div style=" position: absolute; width: ${c.layout.width.toString()}px; height: ${c.layout.height.toString()}px; left: ${c.layout.x.toString()}px; top: ${c.layout.y.toString()}px; z-index: ${this.zindex(c.layout.x, c.layout.y)}; box-sizing:border-box;">${this.evalTemplate(c)}</div>`, "text/html");
            let dom = null;
            if(parsedDom.querySelector("head").children.length > 0) {
              dom = parsedDom.querySelector("head").children[0];
            } else {
              dom = parsedDom.querySelector("body").children[0];
            }

            return { 
              component: c, 
              dom: dom
            }});

      let prcs = cs.map(c => {
          c.parentComponent = cs.reduce((m,cc) => {
            return ((includeGeometrically(cc.component, c.component)) && (m.zindex < this.zindex(cc.component.layout.x, cc.component.layout.y)))? 
                { zindex: this.zindex(cc.component.layout.x, cc.component.layout.y), parent: cc } : m;
          }, { zindex: 0, parent: null }).parent;

          if(c.parentComponent) {
            let innerTag = c.parentComponent.dom.children[0];
            let rootTag = null;

            if(innerTag.tagName === "TEMPLATE") {
              rootTag = innerTag.content;
            } else {
              rootTag = innerTag;
            }

            let contentTag = rootTag.querySelector("contents");
            if(!contentTag) {
              contentTag = rootTag.querySelector("template").content.querySelector("contents");
            }
            c.dom.style.position = c.component.outerTagPositioning || "absolute";
            c.dom.style.left = (c.component.layout.x - c.parentComponent.component.layout.x).toString() + 'px';
            c.dom.style.top = (c.component.layout.y - c.parentComponent.component.layout.y).toString() + 'px';
            contentTag.appendChild(c.dom);
          }

          return c;
        });

      // cs.map(c => {
      //   if(c.parentComponent) { 
      //     let innerTag = c.parentComponent.dom.children[0];
      //     let rootTag = null;

      //     if(innerTag.tagName === "TEMPLATE") {
      //       rootTag = innerTag.content;
      //     } else {
      //       rootTag = innerTag;
      //     }

      //     let contentTag = rootTag.querySelector("contents");
      //     // if(!contentTag) {
      //     //   if(rootTag.querySelector("template")
      //     //   contentTag = rootTag.querySelector("template").content.querySelector("contents");
      //     // }

      //     if(contentTag) {
      //       contentTag.parentElement.replaceWith(...contentTag.children);
      //     }
      //   }
      // });
      
      let form = prcs[0].dom;
      let formComp = prcs[0].component;
      form.style.left = `calc(50% - ${Math.floor(formComp.layout.width / 2)}px)`;
      form.style.top = `calc(50% - ${Math.floor(formComp.layout.height / 2)}px)`;

      var replaceTemplateContents = (t) => {
        let dom = (t.tagName === "TEMPLATE")? t.content : t;
        while(dom.querySelector("contents")) {
          let contents = dom.querySelector("contents");
          contents.replaceWith(...contents.children);
        }

        var templates = dom.querySelectorAll("template");
        for(var i = 0; i < templates.length; i++) {
          replaceTemplateContents(templates[i]);
        }
      };

      replaceTemplateContents(prcs[0].dom);

      let code = (new XMLSerializer()).serializeToString(prcs[0].dom);
   
      navigator.clipboard.writeText(code)
        .then(() => {
          console.log("Text copied to clipboard...")
        })
        .catch(err => {
          console.log('Something went wrong', err);
        });

    },
    onSelect(root, node, key) {
      this.select(node[key], key);
    },
    copyComponent() {
      console.log("copyComponent", );
      let copyText = JSON.stringify(this.view.component[this.selected]);
      navigator.clipboard.writeText(copyText)
        .then(() => {
          console.log("Text copied to clipboard...")
        })
        .catch(err => {
          console.log('Something went wrong', err);
        });
    },
    pasteComponent() {
      console.log("pasteComponent");
      navigator.clipboard.readText()
        .then(clipText => {
          this.curId = this.curId + 1;
          let newid = "unnamed" + (this.curId).toString();
          let newcomp = JSON.parse(clipText);
          this.view.component[newid] = newcomp;
          this.select(newcomp, newid);
        });
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
          width: '100%',
          height: '100%',
          overflow: 'auto'
          }"
          @click.stop="unselect()" >
        <div class="jspec-view-editor--container" @click.stop>
          <button class="jspec-view-designer--button" style="width:32px" @click="addComp()">+</button>
          <button class="jspec-view-designer--button" style="width:32px" @click="delComp()" :disabled="selected == null">-</button>
          <input type="text" v-model="renaming.newName" :disabled="selected == null"/>
          <button class="jspec-view-designer--button" @click="rename()" :disabled="selected == null">RENAME</button>
          <button class="jspec-view-designer--button" @click="editStart()" :disabled="selected == null">EDIT</button>
          <button class="jspec-view-designer--button" @click="generateCode()">GENCODE</button>
          <button class="jspec-view-designer--button" @click="copyComponent()">COPY</button>
          <button class="jspec-view-designer--button" @click="pasteComponent()">PASTE</button>
        </div>

        <div v-for="(v,k) in view.component">
          <div :style="{
              position: 'absolute',
              width: v.layout.width.toString() + 'px',
              height: v.layout.height.toString() + 'px',
              left: v.layout.x.toString() + 'px',
              top: v.layout.y.toString() + 'px',
              zIndex: zindex(v.layout.x, v.layout.y),
              outline: (selected === k)? 'solid 1px #F00' : 'dotted 1px #CCC',
              boxSizing: 'border-box'
              }"
              v-html="evalTemplate(v)"
              @click.stop="select(v, k)">
          </div>
          <div :style="{
              position: 'absolute',
              width: '10px',
              height: '10px',
              // outline: 'solid 1px #000',
              left: (v.layout.x - 5).toString() + 'px',
              top: (v.layout.y - 5).toString() + 'px',
              backgroundColor: 'transparent',
              cursor: 'nwse-resize',
              zIndex: 100000000,
              }"
              draggable="true"
              @dragstart.stop="repositionStart($event, v, k)"
              @dragend.stop="repositionEnd($event, v, k)"
              @drag.stop="repositionDrag($event, v, k)"
              v-if="selected === k">
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
              @drag.stop="resizeDrag($event, v, k)"
              v-if="selected === k">
          </div>
          <div :style="{
              position: 'absolute',
              width: (4).toString() + 'px',
              height: (v.layout.height).toString() + 'px',
              left: (v.layout.x - 2).toString() + 'px',
              top: (v.layout.y).toString() + 'px',
              backgroundColor: 'transparent',
              cursor: 'move',
              zIndex: 100000000
              }"
              draggable="true"
              @dragstart.stop="moveStart($event, v, k)"
              @dragend.stop="moveEnd($event, v, k)"
              @drag.stop="moveDrag($event, v, k)"
              v-if="selected === k">
          </div>
          <div :style="{
              position: 'absolute',
              width: (4).toString() + 'px',
              height: (v.layout.height).toString() + 'px',
              left: (v.layout.x + v.layout.width - 2).toString() + 'px',
              top: (v.layout.y).toString() + 'px',
              backgroundColor: 'transparent',
              cursor: 'move',
              zIndex: 100000000
              }"
              draggable="true"
              @dragstart.stop="moveStart($event, v, k)"
              @dragend.stop="moveEnd($event, v, k)"
              @drag.stop="moveDrag($event, v, k)"
              v-if="selected === k">
          </div>
          <div :style="{
              position: 'absolute',
              width: (v.layout.width).toString() + 'px',
              height: (4).toString() + 'px',
              left: (v.layout.x).toString() + 'px',
              top: (v.layout.y - 2).toString() + 'px',
              backgroundColor: 'transparent',
              cursor: 'move',
              zIndex: 100000000
              }"
              draggable="true"
              @dragstart.stop="moveStart($event, v, k)"
              @dragend.stop="moveEnd($event, v, k)"
              @drag.stop="moveDrag($event, v, k)"
              v-if="selected === k">
          </div>
          <div :style="{
              position: 'absolute',
              width: (v.layout.width).toString() + 'px',
              height: (4).toString() + 'px',
              left: (v.layout.x).toString() + 'px',
              top: (v.layout.y + v.layout.height - 2).toString() + 'px',
              backgroundColor: 'transparent',
              cursor: 'move',
              zIndex: 100000000
              }"
              draggable="true"
              @dragstart.stop="moveStart($event, v, k)"
              @dragend.stop="moveEnd($event, v, k)"
              @drag.stop="moveDrag($event, v, k)"
              v-if="selected === k">
          </div>
        </div>

        <div v-if="repositioning.dragging">
          <div :style="{
              position: 'absolute',
              width: (repositioning.target.layout.width - repositioning.diff.x).toString() + 'px',
              height: (repositioning.target.layout.height - repositioning.diff.y).toString() + 'px',
              left: (repositioning.target.layout.x + repositioning.diff.x).toString() + 'px',
              top: (repositioning.target.layout.y + repositioning.diff.y).toString() + 'px',
              opacity: 0.5,
              pointerEvents: 'none',
              cursor: 'default',
              outline: 'solid 1px #F00',
              zIndex: zindex(repositioning.target.layout.x, repositioning.target.layout.y),
              boxSizing: 'border-box'
              }"
              v-html="evalTemplate(repositioning.target)">
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
              outline: 'solid 1px #F00',
              zIndex: zindex(resizing.target.layout.x, resizing.target.layout.y),
              boxSizing: 'border-box'
              }"
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
              outline: 'solid 1px #F00',
              zIndex: zindex(moving.target.layout.x, moving.target.layout.y),
              boxSizing: 'border-box'
              }"
              v-html="evalTemplate(moving.target)">
          </div>
        </div>

        <div v-if="editing.editing"
             :style="{
                position: 'absolute',
                top: '0px',
                width: '50%',
                right: '0px',
                bottom: '0px',
                backgroundColor: 'rgba(0,0,0,0.3)',
                zIndex: 100000010
             }"
             @click.stop="editEnd()">
          <div :style="{
                 position: 'absolute',
                 width: '100%',
                 height: '100%',
                 backgroundColor: '#FFF',
                 }"
                 @click.stop>
            <div class="jspec-view-editor--container" style="position:absolute; top:0px; left:0px;">
              <button class="jspec-view-designer--button" style="width:100px;" @click="editEnd()">CLOSE</button>
            </div>
            <div style="padding:5px; position:absolute; top:32px; left:0px; right:0px; bottom:0px; overflow:auto;" v-if="view.component[selected]">
              <jspec-editor :root="root" :node="view.component[selected]" :entryParent="view.component[selected]" 
                :entryKey="null" :level="0" :open-state="true" :show-name="false" :theme="'light'"></jspec-editor>
            </div>
            <div style="padding:5px; position:absolute; top:32px; left:0px; right:0px; bottom:0px; overflow:auto;" v-if="!(view.component[selected])">
              <jspec-editor :root="root" :node="view.component" :entryParent="view.component" 
                :entryKey="null" :level="0" :open-state="true" :show-name="false" :on-select="onSelect" :theme="'light'"></jspec-editor>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
};

module.exports.jspecViewDesigner = jspecViewDesigner;


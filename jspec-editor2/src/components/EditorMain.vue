<script>
import jspecEditor from './jspec-editor.js';
import jspecViewDesigner from './jspec-view-designer.js';

let storageBaseKey = "jspec-editor";

function getStorage(key, defaultValue) {
  let val = localStorage.getItem(`${storageBaseKey}/${key}`);
  if(val === "undefined" || val === "null" || val == null || val === undefined) {
    return defaultValue;
  } else {
    return JSON.parse(val);
  }
}

function setStorage(key, obj) {
  localStorage.setItem(`${storageBaseKey}/${key}`, JSON.stringify(obj));
}

let globalFSHandle;

function writeLog() {}

async function writeFile(fileHandle, contents) {
  const writable = await fileHandle.createWritable();
  // await writable.truncate(0);
  await writable.write(contents);
  await writable.close();
}

async function saveFile(contents, handle = null) {
  try {
    if (!handle) {
      handle = await window.showSaveFilePicker({
        types: [
          {
            description: "Jspec file",
            accept: {
              "text/plain": [".json"],
            },
          },
        ],
      });
    }
    await writeFile(handle, contents);
    return handle;
  } catch (ex) {
    const msg = "failed to save";
    console.error(msg, ex);
    return false;
  }
}


async function openFile() {
  const result = {
    handle: null,
    text: ""
  };

  /** @type FileSystemHandle */
  let fileHandle;
  try {
    [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: "Jspec file",
          accept: {
            "text/plain": [".json"],
          },
        },
      ],
    });
    globalFSHandle = fileHandle;
    result.handle = fileHandle;
  } catch (ex) {
    console.error("failed to fetch file", ex);
    return false;
  }

  const file = await fileHandle.getFile();
  try {
    const text = await file.text();
    result.text = text;
    return result;
  } catch (ex) {
    console.error("failed to get content", ex);
    return false;
  }
}

async function reloadFile() {
  const result = {
    handle: null,
    text: ""
  };

  /** @type FileSystemHandle */
  let fileHandle;
  try {
    fileHandle = globalFSHandle;
    result.handle = fileHandle;
  } catch (ex) {
    console.error("failed to fetch file", ex);
    return false;
  }

  const file = await fileHandle.getFile();
  try {
    const text = await file.text();
    result.text = text;
    return result;
  } catch (ex) {
    console.error("failed to get content", ex);
    return false;
  }
}

function isNativeFileSystemSupported() {
  // eslint-disable-next-line no-undef
  return "showOpenFilePicker" in window;
}

async function overwrite() {
  if (!nativeFSSupported) {
    return;
  }

  if(!globalFSHandle) {
    return;
  }

  clearTimeout(globalOverwriteTimeout);
  globalOverwriteTimeout = setTimeout(async function() {
      const fsHandle = await saveFile(
        serializeSource(),
        globalFSHandle
      );
      if (fsHandle) {
        globalFSHandle = fsHandle;
        writeLog("saved");
      } else {
        writeLog("failed to save");
      }
    },
    3000);
}

async function saveNew() {
  if (!nativeFSSupported) {
    alert("nfs not supported");
    return;
  }

  const fsHandle = await saveFile(
    serializeSource(),
    null
  );
  if (fsHandle) {
    globalFSHandle = fsHandle;
    writeLog("saved");
  } else {
    writeLog("failed to save");
  }
}

async function saveOverwrite(content) {
  if (!nativeFSSupported) {
    alert("nfs not supported");
    return;
  }

  const fsHandle = await saveFile(
    content,
    globalFSHandle
  );
  if (fsHandle) {
    globalFSHandle = fsHandle;
    writeLog("saved");
  } else {
    writeLog("failed to save");
  }
}

const nativeFSSupported = isNativeFileSystemSupported();
writeLog(`support for nfs: ${(nativeFSSupported) ? "yes" : "no"}`);


export default {

  components: {
    "jspec-editor": jspecEditor.JspecEditor,
    "jspec-view-designer": jspecViewDesigner.JspecViewDesigner
  },
  data() {
    return {
      root: {},
      text: "",
      showLogicalName: false,
      viewDesigner: {
        viewPath: "",
        showEditor: false,
        view: null
      },
      actions: {
        selected: null
      },
      config: {
        show: false,
        globalFontSize: getStorage("config.globalFontSize", 12) //px
      }
    };
  },
  methods: {
    openJspec() {
      openFile().then((result) => {
        this.root = JSON.parse(result.text);
      });
    },
    reloadJspec() {
      reloadFile().then((result) => {
        this.root = JSON.parse(result.text);
      });
    },
    saveJspec() {
      saveOverwrite(JSON.stringify(this.root, null, 2));
    },
    toggleLogicalName() {
      this.showLogicalName = !this.showLogicalName;
    },
    showViewDeisgner() {
      this.viewDesigner.showEditor = true;
    },
    hideViewDeisgner() {
      this.viewDesigner.showEditor = false;
    },
    viewEditStart(path) {
      this.viewDesigner.view = this.viewDesigner.viewPath.split(".")
        .reduce((memo,path) => { return memo[path]; }, this.root);
      this.viewDesigner.editing = true;
    },
    onSelect(root, node, key) {
      let val = node[key];
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
      if(node == root) {
        for(var k in root) {
          if(root[k] == val) {
            path = k;
          }
        }
      }
      this.traverse(root, root, "", getAbsPath);

      this.viewDesigner.viewPath = path;

      this.actions.selected = { key: key, node: node, val: node[key] };

      console.log(root, node, key, path);
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
    copyEntry() {
      navigator.clipboard.writeText(JSON.stringify(this.actions.selected.val))
        .then(() => {
          console.log("Text copied to clipboard...")
        })
        .catch(err => {
          console.log('Something went wrong', err);
        });
    },
    showConfig() {
      this.config.show = true;
    },
    changeFontSize() {
      // let html = document.querySelector("#editor-container");
      // html.style.fontSize = `${this.config.globalFontSize}px`;
      setStorage("config.globalFontSize", this.config.globalFontSize);
    }
  },
  mounted() {
  }
}
</script>

<template>


      <div class="container" style="position:sticky; top:0px; left:0px; right:0px;">
        <div class="title">JSPEC EDITOR</div>
        <button class="button" @click="openJspec()">OPEN</button>
        <button class="button" @click="saveJspec()">SAVE</button>
        <button class="button" @click="reloadJspec()">RELOAD</button>
        <button class="button" @click="copyEntry()">COPY</button>
        <button class="button" @click="toggleLogicalName()">SHOW/HIDE NAME</button>
        <button class="button" @click="showViewDeisgner()">VIEW DESIGNER</button>
        <button class="button" @click="showConfig()">CONFIG</button>
      </div>
      <div :style="`padding-left:1em; font-size:${config.globalFontSize}px;`" id="editor-container">
        <jspec-editor :root="root" :node="root" :entryParent="root" :entryKey="null" :level="0" 
            :open-state="true" :show-name="showLogicalName" :on-select="onSelect"></jspec-editor>
      </div>

      <div v-if="viewDesigner.showEditor" 
          style="position:fixed; left:0px; right:0px; top:0px; bottom:0px; background-color:rgba(0,0,0,0.5); z-index:99999"
          @click.stop="hideViewDeisgner()">
        <div style="position:fixed; left:100px; right:100px; top:100px; bottom:100px; background-color:#FFF;">
          <div style="position:absolute; left:0px; right:0px; top:0px; height:32px; background-color:#555; padding:5px;" @click.stop>
            <input type="text" v-model="viewDesigner.viewPath" />
            <button class="button" @click.stop="viewEditStart(viewDesigner.editViewPath)">EDIT</button>
          </div>
          <div v-if="viewDesigner.view" style="position:absolute; left:0px; right:0px; top:32px; bottom:0px;">
            <jspec-view-designer :root="root" :view="viewDesigner.view"></jspec-view-designer>
          </div>
        </div>
      </div>


      <template v-if="config.show">
        <div style="position:fixed;
            top:calc(50vh - 100px); left:calc(50vw - 150px); z-index:9999; background-color:#FFF;
            text-align:center; border:solid 1px #888; border-radius:10px;
            padding:10px; min-width:300px; min-height:200px;">
          <span>CONFIGURATION</span>
          <br/>
          <br/>
          <label>FontSize: <input v-model="config.globalFontSize" @change="changeFontSize()"/></label>
          <br/>
          <br/>
          <br/>
          <button class="button" @click="config.show = false">CLOSE</button>
        </div>
      </template>

</template>

<style scoped>
</style>

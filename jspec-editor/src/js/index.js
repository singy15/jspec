const Vue = require('vue');
import {jspecEditor} from './jspec-editor.js';
import {jspecViewDesigner} from './jspec-view-designer.js';

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

window.app = Vue.createApp({
  components: {
    "jspec-editor": jspecEditor,
    "jspec-view-designer": jspecViewDesigner
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
      }
    };
  },
  methods: {
    openJspec() {
      openFile().then((result) => {
        this.root = JSON.parse(result.text);
        document.title = globalFSHandle.name;
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

      //console.log(root, node, key, path);
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
        child = node[key];
        if(this.nodep(child)) {
          this.visit(root, child, absPath, nextop);
        }
      }
    },
    plaincopyEntry() {
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
      let n = clone(this.actions.selected.val);
      this.visit(n,n,"",rec);

      navigator.clipboard.writeText(JSON.stringify(n, null, "  "))
        .then(() => {
          //console.log("Text copied to clipboard...")
        })
        .catch(err => {
          //console.log('Something went wrong', err);
        });
    },
  },
  mounted() {
  }
}).mount('#app');


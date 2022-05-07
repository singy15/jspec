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
    }
  },
  mounted() {
  }
}).mount('#app');


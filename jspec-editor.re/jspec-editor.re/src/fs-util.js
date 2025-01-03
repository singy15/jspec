
let globalFSHandle;

let acceptType = [
  {
    description: "JSON file",
    accept: {
      "text/plain": [".json"],
    },
  },
];

function writeLog() { }

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
        types: acceptType,
      });
      globalFSHandle = handle;
    }
    await writeFile(handle, contents);
    return handle;
  } catch (ex) {
    const msg = "failed to save";
    //console.error(msg, ex);
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
      types: acceptType,
    });
    globalFSHandle = fileHandle;
    result.handle = fileHandle;
  } catch (ex) {
    //console.error("failed to fetch file", ex);
    return false;
  }

  const file = await fileHandle.getFile();
  try {
    const text = await file.text();
    result.text = text;
    return result;
  } catch (ex) {
    //console.error("failed to get content", ex);
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

  if (!globalFSHandle) {
    return;
  }

  clearTimeout(globalOverwriteTimeout);
  globalOverwriteTimeout = setTimeout(async function () {
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
    return fsHandle;
  } else {
    writeLog("failed to save");
    return false;
  }
}

const nativeFSSupported = isNativeFileSystemSupported();
writeLog(`support for nfs: ${(nativeFSSupported) ? "yes" : "no"}`);

export default {
  openFile: openFile,
  saveFile: saveOverwrite,
};

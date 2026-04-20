<script setup>
import { ref, reactive, onMounted, watch, nextTick } from "vue";
import JspecEditor from "./components/JspecEditor.vue";
import fsUtil from "./fs-util.js";
import { Draft2019 } from "json-schema-library";

const showConfig = ref(false);
const enableValidation = ref(true);
const validationSchemaKey = ref("$type");
const enableReference = ref(true);
const referencePrefix = ref("#");
const showCloseParen = ref(false);

const data = reactive({
  root: {
    help: ["This is a simple JSON editor."],
    example: {
      string: "abc",
      number: 1234,
      boolean: true,
      nullValue: null,
      undefinedValue: undefined,
      nestedObject: {
        key1: "value1",
        key2: "value2",
      },
      array: ["val1", 1234, false],
      reference: "#example.nestedObject",
      referenceError: "#example.doesNotExist",
      types: {
        book: {
          name: "book",
          schema: {
            type: "object",
            required: ["title", "price"],
            properties: {
              title: {
                type: "string",
              },
              author: {
                type: "string",
              },
              price: {
                type: "number",
              },
            },
          },
        },
      },
      data: {
        book1: {
          "@type": "#example.types.book",
          title: "book1",
          price: 1000,
        },
        book2: {
          "@type": "#example.types.book",
          title: "book2",
          price: "2000",
        },
        book3: {
          "@type": "#example.types.book",
          title: "book3",
          author: "john doe",
        },
        books: [
          {
            "@type": "#example.types.book",
            title: "book1",
            price: 1000,
          },
          {
            "@type": "#example.types.book",
            title: "book2",
            price: "2000",
          },
        ],
      },
    },
  },
});

const modified = ref(false);

onMounted(() => {
  window.data = data;
});

async function openFile() {
  let result = await fsUtil.openFile();
  if (!result) return;
  let parsed = JSON.parse(result.text);
  data.root = parsed;

  nextTick(() => {
    commit();
  });
}

async function saveFile() {
  let result = await fsUtil.saveFile(JSON.stringify(data.root, null, "  "));
  if (!result) return;
  commit();
}

watch(
  data,
  () => {
    taint();
  },
  { deep: true },
);

function commit() {
  modified.value = false;
}

function taint() {
  modified.value = true;
}

function resolve(root, path) {
  return path
    .substring(1)
    .split(".")
    .reduce((m, x) => m?.[x], root);
}

function validate(value, schema) {
  return new Draft2019(schema).validate(value);
}

function validateAll(cur, root, path, errors = []) {
  Object.keys(cur).forEach((k) => {
    let v = cur[k];

    if (k === validationSchemaKey.value) {
      let err = resolve(root, cur[k])?.schema
        ? validate(cur, resolve(root, cur[k])?.schema)
        : [{ message: "no schema found" }];
      //if(err.length > 0) {
      errors.push({ path: path.join("."), error: err });
      //}
    }

    if (v != null && v !== undefined && typeof v === "object") {
      validateAll(v, root, [...path, k], errors);
    }
  });

  return errors;
}

function reportError(errors) {
  let failures = errors.filter((e) => e.error.length > 0);
  let report = [`validate ${errors.length} objects`];
  report.push("---");
  if (failures.length > 0) {
    report.push(
      failures
        .map((e) => {
          return [`PATH: ${e.path}`, ...e.error.map((x) => x.message)].join(
            "\n",
          );
        })
        .join("\n"),
    );
  } else {
    report.push(`no error found.`);
  }
  alert(report.join("\n"));
}
</script>

<template>
  <div style="padding-left:5px;">
    <div class="container flex-row header" style="padding: 5px 0;">
      <span class="mr1 title">JSON EDITOR</span>
      <button class="button mr1" @click="openFile()">OPEN</button>
      <button class="button mr1" @click="saveFile()">
        {{ modified ? "! " : "" }}SAVE
      </button>
      <button
        class="button mr1"
        @click="reportError(validateAll(data.root, data.root, []))"
      >
        VALIDATE
      </button>
      <button class="button mr1" @click="showConfig = true">CONFIG</button>
    </div>
    <JspecEditor
      :object="data.root"
      :parent-obj="data"
      :parent-key="'root'"
      :root-obj="data.root"
      :enable-ref="enableReference"
      :path="''"
      :show-close-paren="showCloseParen"
    />
  </div>

  <div v-if="showConfig" class="config-screen-container">
    <div class="config-container">
      <span>Configuration</span>
      <br />
      <label>
        <input type="checkbox" v-model="enableValidation" />
        Use Validation
      </label>
      <br />
      <label
        >Schema Key:&nbsp;
        <input v-model="validationSchemaKey" />
      </label>
      <br />
      <label>
        <input type="checkbox" v-model="enableReference" />
        Use Reference
      </label>
      <br />
      <label
        >Reference Prefix:&nbsp;
        <input v-model="referencePrefix" />
      </label>
      <br />
      <label>
        <input type="checkbox" v-model="showCloseParen" />
        Show close paren
      </label>
      <br />
      <!--
      <label>
        <input type="checkbox" v-model="minify" @change="changeMinify" />
        Use Minify
      </label>
      <br />
      -->
      <span class="clickable button1" @click="showConfig = false">Close</span>
    </div>
  </div>
</template>

<style scoped>
.clickable {
  cursor: pointer;
}

.button1 {
  display: inline-block;
  min-width: 3em;
  background-color: #444;
  text-align: center;
  vertical-align: middle;
  font-size: 0.9em;
  padding: 3px;
}

.config-screen-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.config-container {
  background-color: #333;
  border: solid 1px #555;
  z-index: 99999;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}


.container {
  display: flex;
}

.flex-row {
  flex-direction: row;
}

.title {
  font-size: 1.0em;
}

.button {
  border: solid 1px #ccc;
  color: #eee;
  background-color: #333;
  cursor: pointer;
  font-size: 0.9em;
}

.mr1 {
  margin-right: 1em;
}

.header {
  position: sticky;
  top: 0;
  background-color: #333;
}
</style>

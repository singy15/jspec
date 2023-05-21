const { createApp } = Vue;

let templateHtml = `<!DOCTYPE html>
<html>
  <body>
    <div id="app">
@html
    </div>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="~/js/@viewName.js"></script>
  </body>
</html>

`;

let templateJs = `const { createApp } = Vue;
let app = createApp({
  data() {
    return @model;
  },
  computed: {},
  methods: {}
}).mount('#app');

`;

let exampleModel = `{
  foo: "bar"
}`;

var app = createApp({
  data() {
    return {
      viewName : "ViewName",
      html: "<span>example</span>",
      model: exampleModel,
    };
  },
  computed: {
    generatedHtml() {
      let html = prettier.format(
        templateHtml.replace("@html", this.html).replace("@viewName", this.viewName), {
          parser: "html",
          plugins: prettierPlugins,
      });
      this.setLink(html,this.generatedJs);
      return html;
    },
    generatedJs() {
      let js = prettier.format(
        templateJs.replace("@model", this.model), {
          parser: "babel",
          plugins: prettierPlugins,
      });
      this.setLink(this.generatedHtml,js);
      return js;
    }
  },
  methods: {
    downloadHtml() {
      console.log("html");
    },
    downloadJs() {
      console.log("js");
    },
    setLink(html,js) {
      let linkHtml = document.getElementById("downloadHtml");
      if(linkHtml) {
        let blob = new Blob([ html ], { "type" : "text/plain" });
        linkHtml.download = this.viewName + ".cshtml";
        linkHtml.href = window.URL.createObjectURL(blob);
      }

      let linkJs = document.getElementById("downloadJs");
      if(linkJs) {
        let blob = new Blob([ js ], { "type" : "text/plain" });
        linkJs.download = this.viewName + ".js";
        linkJs.href = window.URL.createObjectURL(blob);
      }
    }
  },
  mounted() {
    this.setLink(this.generatedHtml, this.generatedJs);
  }
}).mount('#app');


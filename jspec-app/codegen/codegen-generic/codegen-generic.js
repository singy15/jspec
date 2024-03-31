const { createApp } = Vue;

function $key() { return app.key };

let app = createApp({
  data() {
    return {
      source: `{ "x" : "foo" }`,
      template: "${$key} www ${x} zzz",
      key: "key1",
    };
  },
  computed: {
    code() {
      try {
        let env = JSON.parse(this.source);
        return (new Function(...Object.keys(env), "return " + "`" + this.template + "`")).call(env, ...Object.values(env));
      } catch(ex) {
        console.log(ex);
        return "";
      }
    }
  },
  methods: {}
}).mount('#app');


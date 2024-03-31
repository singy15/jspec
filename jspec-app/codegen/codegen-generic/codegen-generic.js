const { createApp } = Vue;
let app = createApp({
  data() {
    return {
      source: `{ "x" : "foo" }`,
      template: "${__key__} www ${x} zzz",
      key: "key1",
    };
  },
  computed: {
    code() {
      try {
        let env = JSON.parse(this.source);
        env["__key__"] = this.key;
        return (new Function(...Object.keys(env), "return " + "`" + this.template + "`")).call(env, ...Object.values(env));
      } catch(ex) {
        console.log(ex);
        return "";
      }
    }
  },
  methods: {}
}).mount('#app');


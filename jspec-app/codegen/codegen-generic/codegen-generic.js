const { createApp } = Vue;
let app = createApp({
  data() {
    return {
      source: `{ "x" : "foo" }`,
      template: "www ${x} zzz"
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


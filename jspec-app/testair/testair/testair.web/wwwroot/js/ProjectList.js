const { createApp } = Vue;
let app = createApp({
  data() {
    return {"project":[{"project_id":1,"project_name":"Project1","project_cd":"PJ1"}]};
  },
  computed: {},
  methods: {}
}).mount('#app');


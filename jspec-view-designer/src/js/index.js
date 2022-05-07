const Vue = require('vue');
import {jspecViewDesigner} from './jspec-view-designer.js';

window.app = Vue.createApp({
  components: {
    "jspec-view-designer": jspecViewDesigner
  },
}).mount('#app');


require('./autoresize-editor.scss');

var autoresizeEditor = {
  name: "autoresize-editor",
  props: {
    obj: Object,
    placeKey: String,
  },
  data() {
    return {
      editValue: null,
    };
  },
  methods: {
    updateValue() {
      this.val = this.$refs.input.value;
      this.editValue = this.val;
    },
  },
  computed: {
    val: {
      get: function() {
        return JSON.stringify(this.obj[this.placeKey]);
      },
      set: function(newval) {
        if(newval === "") {
          delete this.obj[this.placeKey];
          return;
        }

        var parsed = null;
        try {
          parsed = eval(newval);
          if(parsed === undefined) {
            throw new Error();
          }
        } catch(e) {
          try {
            parsed = JSON.parse(newval);
          } catch(e2) {
            parsed = newval;
          }
        } 
        this.obj[this.placeKey] = parsed;
      }
    }
  },
  mounted() {
    this.editValue = this.val;
  },
  template: `
    <span>
      <div class="input-text__item">
        <div class="input-text__dummy js-dummy-input-text" :data-placeholder="editValue"></div>
        <input type="text" class="input-text js-input-text" 
            v-model="editValue" ref="input" @change="updateValue()"
            spellcheck="false"/>
      </div>
    </span>
  `
};

module.exports.autoresizeEditor = autoresizeEditor;


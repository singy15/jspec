var inplaceEditor = {
  name: "inplace-editor",
  props: {
    obj: Object,
    placeKey: null,
    style: Object
  },
  data() {
    return {
      editValue: JSON.stringify(this.obj[this.placeKey]),
      width: 10,
      focused: false
    };
  },
  methods: {
    updateValue() {
      this.val = this.$refs.input.value;
      this.editValue = this.val;
    },
    resize() {
      this.width = this.$refs.text.getBoundingClientRect().width;
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
    this.resize();
  },
  template: `
    <span style="display:inline-block;">
      <span ref="text" :style="Object.assign({visibility:'hidden'}, style)">{{editValue}}</span>
      <input type="text" 
          :style="Object.assign({
              width:(width).toString()+'px',
              fontSize:'1.0rem',
              fontFamily:'unset',
              boxSizing:'border-box',
              margin:'0px',
              padding:'0px',
              border:'none',
              outline:(focused)? 'solid 1px #CCC' : 'none',
              marginLeft:(-width).toString()+'px'
            }, style)"
          v-model="editValue" ref="input" 
              @change="updateValue()" 
              @input="resize()" 
              @compositionend="resize()"
              @focus="focused = true"
              @blur="focused = false"
          spellcheck="false"/>
    </span>
  `
};

module.exports.inplaceEditor = inplaceEditor;


var autoresizeEditor = {
  name: "autoresize-editor",
  props: {
    value: null,
    updated: Function,
    style: Object
  },
  data() {
    let tmp = this.value;
    return {
      val: tmp,
      width: 10,
      focused: false,
      before: tmp,
    };
  },
  methods: {
    resize() {
      this.width = this.$refs.text.getBoundingClientRect().width;
    },
    update() {
      this.$emit('updated', this.val, this.before);
      this.before = this.val;
    }
  },
  computed: {
  },
  mounted() {
    this.resize();
  },
  template: `
    <span style="display:inline-block;">
      <span ref="text" :style="Object.assign({visibility:'hidden'}, style)" >{{val}}</span>
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
          v-model="val" ref="input" 
          @change="update()" 
          @input="resize()" 
          @compositionend="resize()"
          @focus="focused = true"
          @blur="focused = false"
          spellcheck="false"/>
    </span>
  `
};

module.exports.autoresizeEditor = autoresizeEditor;


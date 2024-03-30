var autoresizeEditor = {
  name: "autoresize-editor",
  props: {
    value: null,
    updated: Function,
    style: Object,
    onCopy: Function,
    forecolor: {
      type: String,
      default: "#CCC"
    },
    backcolor: {
      type: String,
      default: "#333"
    }
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
    setFocus() {
      this.$refs.input.focus();
    },
    resize() {
      this.width = this.$refs.text.getBoundingClientRect().width;
    },
    update() {
      this.$emit('updated', this.val, this.before);
      this.before = this.val;
    },
    focus() {
      this.focused = true;
      this.$refs.input.selectionStart = 0;
      this.$refs.input.selectionEnd = this.$refs.input.value.length;
    }
  },
  computed: {
  },
  mounted() {
    this.resize();
  },
  template: `
    <span style="display:inline-block; vertical-align:top;">
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
              marginLeft:(-width).toString()+'px',
              background: backcolor,
              color: forecolor
            }, style)"
          v-model="val" ref="input" 
          @change="update()" 
          @input="resize()" 
          @compositionend="resize()"
          @focus="focus()"
          @blur="focused = false"
          @copy="(onCopy)? onCopy() : null"
          spellcheck="false"/>
    </span>
  `
};

module.exports.autoresizeEditor = autoresizeEditor;


var InplaceEditor = {
  name: "inplace-editor",
  props: {
    obj: Object,
    placeKey: null,
    style: Object,
    watchVal: null
  },
  data() {
    return {
      editValue: JSON.stringify(this.obj[this.placeKey]),
      width: 10,
      height: 30,
      focused: false,
      multiline: false
    };
  },
  methods: {
    updateValue() {
      let origValue = this.$refs.input.value;
      this.val = this.$refs.input.value;
      this.editValue = this.val;

      // prevent null error. when value changed to object or array, inplace-editor automatically closed.
      // so, this.$refs.input gone to null.
      if(this.editValue !== "{}" && this.editValue !== "[]" && origValue !== "") {
        this.$nextTick(() => {
          this.resize();
        });
      }
    },
    updateValueMultiline() {
      this.val = JSON.stringify(this.$refs.input.value);
      this.$nextTick(() => {
        this.resize();
      });
    },
    resize() {
      this.width = this.$refs.text.getBoundingClientRect().width;
      if(this.multiline) {
        this.height = this.editValue.split("\n").length * this.$refs.text.getBoundingClientRect().height + 32;
      }
    },
    toggleMultiline() {
      if(!(this.isString && this.focused)) {
        return;
      }

      this.multiline = !this.multiline;
      if(this.multiline) {
        this.editValue = JSON.parse(this.val);
      } else {
        this.editValue = this.val;
      }
      this.$nextTick(() => {
        if(this.multiline) {
          this.$refs.input.focus();
        }
        this.resize();
      });
    },
    onFocused() {
      this.focused = true;
      this.$refs.input.selectionStart = 0;
      this.$refs.input.selectionEnd = this.$refs.input.value.length;
    },
    onBlur() {
      this.focused = false;
    },
    keydown(event) {
      let input = this.$refs.input;
      let curPos = input.selectionStart;
      let tabString = "  ";

      if(9 === event.keyCode) {
        input.value = input.value.substr(0, curPos) 
          + tabString 
          + input.value.substr(curPos, input.value.length);
        input.selectionEnd = curPos + tabString.length;
        event.preventDefault();
      }
    }
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
        // try {
        //   parsed = eval(newval);
        //   if(parsed === undefined) {
        //     throw new Error();
        //   }
        // } catch(e) {
          try {
            parsed = JSON.parse(newval);
          } catch(e2) {
            parsed = newval;
          }
        // } 
        this.obj[this.placeKey] = parsed;
      }
    },
    isString() {
      return (null != this.obj[this.placeKey]) && (typeof(this.obj[this.placeKey]) === 'string');
    }
  },
  mounted() {
    this.editValue = this.val;
    this.resize();
  },
  watch: {
    watchVal: function(newval, oldval) {
      this.editValue = this.val;
      this.$nextTick(function() {
        this.resize();
      });
    }
  },
  template: `
    <span style="display:inline-block;">
      <span ref="text" 
          :style="Object.assign({
            visibility:'hidden',
            fontFamily:(multiline)? 'monospace' : 'unset'}, style)">
        {{editValue}}</span>
      <input type="text"
          v-if="!multiline"
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
              @focus="onFocused()"
              @blur="onBlur()"
              @dblclick="toggleMultiline()"
          spellcheck="false"/>
      <textarea v-model="editValue" 
          v-if="multiline"
          :style="{
            paddingRight:'32px',
            margin:'0px',
            outline:'solid 1px #000',
            border:'none',
            width:(width).toString()+'px',
            display:'inline-block',
            height:(height).toString()+'px',
            whiteSpace:'nowrap',
            marginLeft:(-width).toString()+'px',
            outline:'solid 1px #CCC',
            fontFamily:(multiline)? 'monospace' : 'unset'
          }"
          @change="updateValueMultiline()" 
          @input="resize()" 
          @compositionend="resize()"
          @focus="onFocused()"
          @blur="toggleMultiline(); updateValue(); onBlur()"
          @keydown="keydown($event)"
          spellcheck="false"
          ref="input"
        ></textarea>
      <!--
      <span style="margin-left:1em;"></span>
      <span 
        v-if="isString && focused && !multiline"
        @mouseover="toggleMultiline()" style="vertical-align:top;">...</span>
      -->
    </span>
  `
};

export default {
  InplaceEditor: InplaceEditor
}


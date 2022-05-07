/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/inplace-editor.js":
/*!**********************************!*\
  !*** ./src/js/inplace-editor.js ***!
  \**********************************/
/***/ ((module) => {

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

      // prevent null error. when value changed to object, inplace-editor automatically closed.
      // so, this.$refs.input gone to null.
      if(this.editValue !== "{}" && origValue !== "") {
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
        this.height = this.editValue.split("\n").length * this.$refs.text.getBoundingClientRect().height;
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
    },
    isString() {
      return (null != this.obj[this.placeKey]) && (typeof(this.obj[this.placeKey]) === 'string');
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
              @focus="focused = true"
              @blur="focused = false"
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
            outline:'solid 1px #CCC'
          }"
          @change="updateValueMultiline()" 
          @input="resize()" 
          @compositionend="resize()"
          @focus="focused = true"
          @blur="toggleMultiline(); focused = false;"
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

module.exports.inplaceEditor = inplaceEditor;



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/inplace-editor.js");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wbGFjZS1lZGl0b3IuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0Esc0NBQXNDO0FBQ3RDLDhDQUE4QyxvQkFBb0IsWUFBWSxXQUFXO0FBQ3pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsZ0JBQWdCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ0E7QUFDQSxpRUFBaUU7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1Qjs7Ozs7OztVQ3pKQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vanNwZWMtZWRpdG9yLy4vc3JjL2pzL2lucGxhY2UtZWRpdG9yLmpzIiwid2VicGFjazovL2pzcGVjLWVkaXRvci93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9qc3BlYy1lZGl0b3Ivd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9qc3BlYy1lZGl0b3Ivd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2pzcGVjLWVkaXRvci93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIGlucGxhY2VFZGl0b3IgPSB7XHJcbiAgbmFtZTogXCJpbnBsYWNlLWVkaXRvclwiLFxyXG4gIHByb3BzOiB7XHJcbiAgICBvYmo6IE9iamVjdCxcclxuICAgIHBsYWNlS2V5OiBudWxsLFxyXG4gICAgc3R5bGU6IE9iamVjdFxyXG4gIH0sXHJcbiAgZGF0YSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGVkaXRWYWx1ZTogSlNPTi5zdHJpbmdpZnkodGhpcy5vYmpbdGhpcy5wbGFjZUtleV0pLFxyXG4gICAgICB3aWR0aDogMTAsXHJcbiAgICAgIGhlaWdodDogMzAsXHJcbiAgICAgIGZvY3VzZWQ6IGZhbHNlLFxyXG4gICAgICBtdWx0aWxpbmU6IGZhbHNlXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgbWV0aG9kczoge1xyXG4gICAgdXBkYXRlVmFsdWUoKSB7XHJcbiAgICAgIGxldCBvcmlnVmFsdWUgPSB0aGlzLiRyZWZzLmlucHV0LnZhbHVlO1xyXG4gICAgICB0aGlzLnZhbCA9IHRoaXMuJHJlZnMuaW5wdXQudmFsdWU7XHJcbiAgICAgIHRoaXMuZWRpdFZhbHVlID0gdGhpcy52YWw7XHJcblxyXG4gICAgICAvLyBwcmV2ZW50IG51bGwgZXJyb3IuIHdoZW4gdmFsdWUgY2hhbmdlZCB0byBvYmplY3QsIGlucGxhY2UtZWRpdG9yIGF1dG9tYXRpY2FsbHkgY2xvc2VkLlxyXG4gICAgICAvLyBzbywgdGhpcy4kcmVmcy5pbnB1dCBnb25lIHRvIG51bGwuXHJcbiAgICAgIGlmKHRoaXMuZWRpdFZhbHVlICE9PSBcInt9XCIgJiYgb3JpZ1ZhbHVlICE9PSBcIlwiKSB7XHJcbiAgICAgICAgdGhpcy4kbmV4dFRpY2soKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5yZXNpemUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHVwZGF0ZVZhbHVlTXVsdGlsaW5lKCkge1xyXG4gICAgICB0aGlzLnZhbCA9IEpTT04uc3RyaW5naWZ5KHRoaXMuJHJlZnMuaW5wdXQudmFsdWUpO1xyXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgcmVzaXplKCkge1xyXG4gICAgICB0aGlzLndpZHRoID0gdGhpcy4kcmVmcy50ZXh0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xyXG4gICAgICBpZih0aGlzLm11bHRpbGluZSkge1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5lZGl0VmFsdWUuc3BsaXQoXCJcXG5cIikubGVuZ3RoICogdGhpcy4kcmVmcy50ZXh0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIHRvZ2dsZU11bHRpbGluZSgpIHtcclxuICAgICAgaWYoISh0aGlzLmlzU3RyaW5nICYmIHRoaXMuZm9jdXNlZCkpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMubXVsdGlsaW5lID0gIXRoaXMubXVsdGlsaW5lO1xyXG4gICAgICBpZih0aGlzLm11bHRpbGluZSkge1xyXG4gICAgICAgIHRoaXMuZWRpdFZhbHVlID0gSlNPTi5wYXJzZSh0aGlzLnZhbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5lZGl0VmFsdWUgPSB0aGlzLnZhbDtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XHJcbiAgICAgICAgaWYodGhpcy5tdWx0aWxpbmUpIHtcclxuICAgICAgICAgIHRoaXMuJHJlZnMuaW5wdXQuZm9jdXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBjb21wdXRlZDoge1xyXG4gICAgdmFsOiB7XHJcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMub2JqW3RoaXMucGxhY2VLZXldKTtcclxuICAgICAgfSxcclxuICAgICAgc2V0OiBmdW5jdGlvbihuZXd2YWwpIHtcclxuICAgICAgICBpZihuZXd2YWwgPT09IFwiXCIpIHtcclxuICAgICAgICAgIGRlbGV0ZSB0aGlzLm9ialt0aGlzLnBsYWNlS2V5XTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBwYXJzZWQgPSBudWxsO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBwYXJzZWQgPSBldmFsKG5ld3ZhbCk7XHJcbiAgICAgICAgICBpZihwYXJzZWQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHBhcnNlZCA9IEpTT04ucGFyc2UobmV3dmFsKTtcclxuICAgICAgICAgIH0gY2F0Y2goZTIpIHtcclxuICAgICAgICAgICAgcGFyc2VkID0gbmV3dmFsO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gXHJcbiAgICAgICAgdGhpcy5vYmpbdGhpcy5wbGFjZUtleV0gPSBwYXJzZWQ7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBpc1N0cmluZygpIHtcclxuICAgICAgcmV0dXJuIChudWxsICE9IHRoaXMub2JqW3RoaXMucGxhY2VLZXldKSAmJiAodHlwZW9mKHRoaXMub2JqW3RoaXMucGxhY2VLZXldKSA9PT0gJ3N0cmluZycpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgbW91bnRlZCgpIHtcclxuICAgIHRoaXMuZWRpdFZhbHVlID0gdGhpcy52YWw7XHJcbiAgICB0aGlzLnJlc2l6ZSgpO1xyXG4gIH0sXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxzcGFuIHN0eWxlPVwiZGlzcGxheTppbmxpbmUtYmxvY2s7XCI+XHJcbiAgICAgIDxzcGFuIHJlZj1cInRleHRcIiA6c3R5bGU9XCJPYmplY3QuYXNzaWduKHt2aXNpYmlsaXR5OidoaWRkZW4nfSwgc3R5bGUpXCI+e3tlZGl0VmFsdWV9fTwvc3Bhbj5cclxuICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgIHYtaWY9XCIhbXVsdGlsaW5lXCJcclxuICAgICAgICAgIDpzdHlsZT1cIk9iamVjdC5hc3NpZ24oe1xyXG4gICAgICAgICAgICAgIHdpZHRoOih3aWR0aCkudG9TdHJpbmcoKSsncHgnLFxyXG4gICAgICAgICAgICAgIGZvbnRTaXplOicxLjByZW0nLFxyXG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6J3Vuc2V0JyxcclxuICAgICAgICAgICAgICBib3hTaXppbmc6J2JvcmRlci1ib3gnLFxyXG4gICAgICAgICAgICAgIG1hcmdpbjonMHB4JyxcclxuICAgICAgICAgICAgICBwYWRkaW5nOicwcHgnLFxyXG4gICAgICAgICAgICAgIGJvcmRlcjonbm9uZScsXHJcbiAgICAgICAgICAgICAgb3V0bGluZTooZm9jdXNlZCk/ICdzb2xpZCAxcHggI0NDQycgOiAnbm9uZScsXHJcbiAgICAgICAgICAgICAgbWFyZ2luTGVmdDooLXdpZHRoKS50b1N0cmluZygpKydweCdcclxuICAgICAgICAgICAgfSwgc3R5bGUpXCJcclxuICAgICAgICAgIHYtbW9kZWw9XCJlZGl0VmFsdWVcIiByZWY9XCJpbnB1dFwiIFxyXG4gICAgICAgICAgICAgIEBjaGFuZ2U9XCJ1cGRhdGVWYWx1ZSgpXCIgXHJcbiAgICAgICAgICAgICAgQGlucHV0PVwicmVzaXplKClcIiBcclxuICAgICAgICAgICAgICBAY29tcG9zaXRpb25lbmQ9XCJyZXNpemUoKVwiXHJcbiAgICAgICAgICAgICAgQGZvY3VzPVwiZm9jdXNlZCA9IHRydWVcIlxyXG4gICAgICAgICAgICAgIEBibHVyPVwiZm9jdXNlZCA9IGZhbHNlXCJcclxuICAgICAgICAgICAgICBAZGJsY2xpY2s9XCJ0b2dnbGVNdWx0aWxpbmUoKVwiXHJcbiAgICAgICAgICBzcGVsbGNoZWNrPVwiZmFsc2VcIi8+XHJcbiAgICAgIDx0ZXh0YXJlYSB2LW1vZGVsPVwiZWRpdFZhbHVlXCIgXHJcbiAgICAgICAgICB2LWlmPVwibXVsdGlsaW5lXCJcclxuICAgICAgICAgIDpzdHlsZT1cIntcclxuICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiczMnB4JyxcclxuICAgICAgICAgICAgbWFyZ2luOicwcHgnLFxyXG4gICAgICAgICAgICBvdXRsaW5lOidzb2xpZCAxcHggIzAwMCcsXHJcbiAgICAgICAgICAgIGJvcmRlcjonbm9uZScsXHJcbiAgICAgICAgICAgIHdpZHRoOih3aWR0aCkudG9TdHJpbmcoKSsncHgnLFxyXG4gICAgICAgICAgICBkaXNwbGF5OidpbmxpbmUtYmxvY2snLFxyXG4gICAgICAgICAgICBoZWlnaHQ6KGhlaWdodCkudG9TdHJpbmcoKSsncHgnLFxyXG4gICAgICAgICAgICB3aGl0ZVNwYWNlOidub3dyYXAnLFxyXG4gICAgICAgICAgICBtYXJnaW5MZWZ0Oigtd2lkdGgpLnRvU3RyaW5nKCkrJ3B4JyxcclxuICAgICAgICAgICAgb3V0bGluZTonc29saWQgMXB4ICNDQ0MnXHJcbiAgICAgICAgICB9XCJcclxuICAgICAgICAgIEBjaGFuZ2U9XCJ1cGRhdGVWYWx1ZU11bHRpbGluZSgpXCIgXHJcbiAgICAgICAgICBAaW5wdXQ9XCJyZXNpemUoKVwiIFxyXG4gICAgICAgICAgQGNvbXBvc2l0aW9uZW5kPVwicmVzaXplKClcIlxyXG4gICAgICAgICAgQGZvY3VzPVwiZm9jdXNlZCA9IHRydWVcIlxyXG4gICAgICAgICAgQGJsdXI9XCJ0b2dnbGVNdWx0aWxpbmUoKTsgZm9jdXNlZCA9IGZhbHNlO1wiXHJcbiAgICAgICAgICBzcGVsbGNoZWNrPVwiZmFsc2VcIlxyXG4gICAgICAgICAgcmVmPVwiaW5wdXRcIlxyXG4gICAgICAgID48L3RleHRhcmVhPlxyXG4gICAgICA8IS0tXHJcbiAgICAgIDxzcGFuIHN0eWxlPVwibWFyZ2luLWxlZnQ6MWVtO1wiPjwvc3Bhbj5cclxuICAgICAgPHNwYW4gXHJcbiAgICAgICAgdi1pZj1cImlzU3RyaW5nICYmIGZvY3VzZWQgJiYgIW11bHRpbGluZVwiXHJcbiAgICAgICAgQG1vdXNlb3Zlcj1cInRvZ2dsZU11bHRpbGluZSgpXCIgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjp0b3A7XCI+Li4uPC9zcGFuPlxyXG4gICAgICAtLT5cclxuICAgIDwvc3Bhbj5cclxuICBgXHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cy5pbnBsYWNlRWRpdG9yID0gaW5wbGFjZUVkaXRvcjtcclxuXHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ21vZHVsZScgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvanMvaW5wbGFjZS1lZGl0b3IuanNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
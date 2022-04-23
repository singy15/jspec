const Vue = require('vue');
// import {inplaceEditor} from './inplace-editor.js';
import {jspecEditor} from './jspec-editor.js';

var model = {
  "VIEW_COMPONENT_TYPE":{
    "DATETIMEPICKER":"VIEW_COMPONENT_TYPE.DATETIMEPICKER",
    "TEXTBOX":"VIEW_COMPONENT_TYPE.TEXTBOX",
    "NUMBERBOX":"VIEW_COMPONENT_TYPE.NUMBERBOX",
    "BUTTON":"VIEW_COMPONENT_TYPE.BUTTON"
  },
  "DATA_TYPE":{
    "DATETIME":"DATA_TYPE.DATETIME",
    "TEXT":"DATA_TYPE.TEXT",
    "NUMBER":"DATA_TYPE.NUMBER"
  },
  "IO_TYPE":{
    "DB":"IO_TYPE.DB",
    "FILE":"IO_TYPE.FILE",
    "MODEL":"IO_TYPE.MODEL"
  },
  "LAYOUT_TYPE":{
    "RECTANGLE":"LAYOUT_TYPE.RECTANGLE",
    "LINE":"LAYOUT_TYPE.LINE"
  },
  "packages$":{
    "SALE":{
      "views$":{
        "REGISTER_SALE":{
          "viewComponents$":{
            "SALE_NO":{
              "type":"#VIEW_COMPONENT_TYPE.NUMBERBOX",
              "label":"発行日",
              "layout":{
                "type":"#LAYOUT_TYPE.RECTANGLE",
                "x":100,
                "y":100,
                "width":200,
                "height":24
              }
            },
            "ISSUE_DATE":{
              "type":"#VIEW_COMPONENT_TYPE.DATETIMEPICKER",
              "label":"発行日",
              "layout":{
                "type":"#LAYOUT_TYPE.RECTANGLE",
                "x":100,
                "y":100,
                "width":200,
                "height":24
              }
            },
            "DESCRIPTION":{
              "type":"#VIEW_COMPONENT_TYPE.TEXTBOX",
              "label":"摘要",
              "layout":{
                "type":"#LAYOUT_TYPE.RECTANGLE",
                "x":100,
                "y":100,
                "width":200,
                "height":24
              }
            },
            "AMOUNT":{
              "type":"#VIEW_COMPONENT_TYPE.NUMBERBOX",
              "label":"金額",
              "layout":{
                "type":"#LAYOUT_TYPE.RECTANGLE",
                "x":100,
                "y":100,
                "width":200,
                "height":24
              }
            }
          }
        }
      },
      "processes$":{
        "REGISTER":{
          "params$":{
            "VIEW":"#SALE.views$.REGISTER_SALE"
          },
          "steps$":{
            "list$":[
              "(use-package #DOMAIN_SALE)",
              "(define model (new #.models$.SALE))",
              "(copy-to @VIEW model)",
              "(#.ios$.INSERT_SALE model)"
            ]
          }
        }
      }
    },
    "DOMAIN_SALE":{
      "ios$":{
        "INSERT_SALE":{
          "type":"#IO_TYPE.DB",
          "params$":{
            "MODEL":{
              "type":"#DOMAIN_SALE.models$.SALE"
            }
          },
          "sql":"INSERT INTO SALE (SALE_NO,ISSUE_DATE,DESCRIPTION,AMOUNT) VALUES (@MODEL.SALE_NO,@MODEL.ISSUE_DATE,@MODEL.DESCRIPTION,@MODEL.AMOUNT)"
        }
      },
      "models$":{
        "SALE":{
          "SALE_NO":{
            "type":"#DATA_TYPE.NUMBER"
          },
          "ISSUE_DATE":{
            "type":"#DATA_TYPE.DATETIME"
          },
          "DESCRIPTION":{
            "type":"#DATA_TYPE.TEXT"
          },
          "AMOUNT":{
            "type":"#DATA_TYPE.NUMBER"
          }
        }
      }
    }
  }
};

var test = {
  packages$: {
    SALE: {
      viewComponents$: {
        SALE_NO: {
          type: "text",
          name: "SALE NO"
        },
        ISSUE_DATE: {
          type: "date",
          name: "ISSUE_DATE"
        }
      }
    }
  },
  ITEM1: "item1"
};

var test = {
  a1: {
    a10: "v10",
    a11: {
      a111: "v111"
    },
    a12: {
      a121: "v121"
    },
    a13: "v13",
    a14: "v14",
  }
};

window.app = Vue.createApp({
  components: {
    // "inplace-editor": inplaceEditor,
    "jspec-editor": jspecEditor
  },
  data() {
    return {
      root: model,
      text:""
    };
  },
  methods: {
  },
  mounted() {
  }
}).mount('#app');


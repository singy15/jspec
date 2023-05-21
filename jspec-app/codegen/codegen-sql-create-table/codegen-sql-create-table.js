const { createApp } = Vue;
let app = createApp({
  data() {
    return {
      source: "",
      tableName: ""
    };
  },
  computed: {
    sql() {
      try {
        let tableName = this.tableName;
        let columns = [];
        let sqls = [];
        let json = JSON.parse(this.source);
        let primaryKey = "";

        sqls.push(`CREATE TABLE ${tableName} (`);
        Object.keys(json.column).map(k => {
          columns.push([
            " ", 
            `${k}`,
            `${json.column[k].type}`, 
            // ((json.column[k].primaryKey !== 0)? `PRIMARY KEY` : ``)
          ].filter(x => x !== "").join(" "));
        });
        sqls.push(columns.join(",\n"));
        primaryKey = Object.keys(json.column)
          .map(k => [k,json.column[k]])
          .filter(x => x[1].primaryKey !== 0)
          .map(x => x[0])
          .join(", ")
        if(primaryKey !== "") {
          sqls.push(`  ,PRIMARY KEY(${primaryKey})`);
        }
        sqls.push(`);`);

        return sqls.join("\n");
      } catch(ex) {
        console.log(ex);
      }
    }
  },
  methods: {}
}).mount('#app');


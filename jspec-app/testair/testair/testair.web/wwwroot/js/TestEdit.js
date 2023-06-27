const { createApp } = Vue;

// jexcel.validLetter = function (text) {
//     var regex = /([\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC-\u0400-\u04FF-\u3042-]+)/g;
//     return text.match(regex) ? 1 : 0;
// };

let app = createApp({
    components: {
        "trivial-spread": trivialSpread
    },
    data() {
        return {
            projects: [
                //{ project_id: 1, project_name: "Project1", project_cd: "PJ1", text: "PJ1" }
            ],
            testsuites: [
                //{ testsuite_id: 1, project_id: 1, testsuite_name: "TestSuite1", testsuite_cd: "TS1", }
            ],
            currentProjectId: null,
            currentTestsuiteId: null,
            testsuite: {
                testsuite_id: null, testsuite_cd: null, testsuite_name: null
            },
            testcases: [],
            currentTestcaseId: null,
            spread: null,
            unsaved: true
        };
    },
    computed: {
        ddnSourceProject() {
            return this.projects.map(x => { return { text: x.project_name, value: x.project_id }; });
        },
        ddnSourceResultSuccess() {
            return [
                { text: "OK", value: 1 },
                { text: "NG", value: 0 },
                { text: "", value: -1 }
            ];
        },
        currentTestcase() {
            let matched = this.testcases.filter(x => x.testcase_id === this.currentTestcaseId);

            if (matched.length > 0) {
                return matched[0];
            } else {
                return null;
            }
        },
    },
    watch: {
        currentProjectId(newval, oldval) {
            this.loadTestsuites(newval);
        },
        currentTestsuiteId(newval, oldval) {
            let matched = this.testsuites.filter(x => x.testsuite_id === newval);

            if (matched.length > 0) {
                this.testsuite = matched[0];
                this.loadTestcases(newval);
            } else {
                this.testsuite = {
                    testsuite_id: null, testsuite_cd: null, testsuite_name: null
                };
            }
        },
        testcases: {
            deep: true,
            handler(newval, oldval) {
            }
        }
    },
    methods: {
        loadProjects() {
            fetch("/Project", {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then((res) => res.json()).then(json => {
                this.projects = json;
            }).catch(console.error);
        },
        loadTestsuites(projectId) {
            fetch("/Testsuite/FindByProjectId/" + projectId.toString(), {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then((res) => res.json()).then(json => {
                this.testsuites = json;
            }).catch(console.error);
        },
        sortTestcases(testcases) {
            return testcases.sort((a, b) => {
                if (a.no > b.no) return 1;
                if (a.no === b.no) return 0;
                if (a.no < b.no) return -1;
            });
        },
        loadTestcases(testsuiteId) {
            fetch("/Testcase/FindByTestsuiteId/" + testsuiteId.toString(), {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then((res) => res.json()).then(json => {
                let data = this.sortTestcases(json)
                    .map((x, i) => {
                        if (x.result_success === (-1)) {
                            x.result_success = "";
                        } else if (x.result_success === 1) {
                            x.result_success = "OK";
                        } else if (x.result_success === 2) {
                            x.result_success = "NG";
                        }
                        return x;
                    })
                    .map(x => {
                        x.testsuite_id = undefined;
                        return x;
                    });
                if (data.length === 0) {
                    data.push({ no: 1, testcase_cd: "", testcase_name: "", desc_action: "", desc_condition: "", desc_expected: "", result_success: "" });
                }
                this.testcases = data;
                this.$refs.spread.setJson(data);
            }).catch(console.error);
        },
        fetchMaxSortOrder(testsuiteId) {
            return fetch("/Testcase/MaxSortOrderByTestsuiteId/" + testsuiteId.toString(), {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then((res) => res.json()).catch(console.error);
        },
        addTestcase() {
            // this.addOrInsertTestcase();
            this.$refs.spread.appendRow();
        },
        insertTestcase() {
            // this.addOrInsertTestcase(this.currentTestcase);
            this.$refs.spread.insertRow(this.$refs.spread.row);
        },
        addOrInsertTestcase(before) {
            this.fetchMaxSortOrder(this.currentTestsuiteId).then(json => {
                fetch("/Testcase", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        testsuite_id: this.currentTestsuiteId,
                        no: this.testcases.length + 1,
                        testcase_cd: "",
                        testcase_name: "",
                        desc_condition: "",
                        desc_action: "",
                        desc_expected: "",
                        result_success: -1,

                    })
                }).then((res) => res.json()).then(json => {
                    if (before) {
                        this.updateSortOrderAllTestcases();
                    } else {
                        console.log(json);
                        this.loadTestcases(this.currentTestsuiteId);
                    }
                }).catch(console.error);
            });
        },
        delTestcase() {
            // if (this.currentTestcaseId == null) {
            //     return;
            // }

            // fetch("/Testcase/" + this.currentTestcaseId.toString(), {
            //     method: "DELETE",
            //     headers: {
            //         'Accept': 'application/json',
            //         'Content-Type': 'application/json'
            //     },
            // }).then((res) => res.json()).then(json => {
            //     this.currentTestcaseId = null;
            //     this.loadTestcases(this.currentTestsuiteId);
            // }).catch(console.error);

            this.$refs.spread.deleteRow(this.$refs.spread.row);
        },
        updateTestcase(testcase) {
            this.dbUpdateTestcase(testcase).then(json => {
                this.loadTestcases(this.currentTestsuiteId);
            });
        },
        addProject() {
            location.href = "/View/ProjectCreate";
        },
        addTestsuite() {
            fetch("/Testsuite", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    testsuite_cd: "",
                    project_id: this.currentProjectId,
                    testsuite_name: "New Testsuite",
                })
            }).then((res) => res.json()).then(json => {
                this.currentTestcaseId = null;
                this.loadTestsuites(this.currentProjectId);
            }).catch(console.error);
        },
        delTestsuite() {
            fetch("/Testsuite/" + this.currentTestsuiteId.toString(), {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then((res) => res.json()).then(json => {
                this.currentTestcaseId = null;
                this.currentTestsuiteId = null;
                this.loadTestsuites(this.currentProjectId);
            }).catch(console.error);
        },
        updateTestsuite(testsuite) {
            let data = Object.assign({}, testsuite);
            data.testsuite_id = undefined;
            fetch("/Testsuite/" + testsuite.testsuite_id, {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then((res) => res.json()).then(json => {
                this.loadTestsuites(this.currentProjectId);
            }).catch(console.error);
        },
        dbUpdateTestcase(testcase) {
            let data = Object.assign({}, testcase);
            data.testcase_id = undefined;
            return fetch("/Testcase/" + testcase.testcase_id, {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then((res) => res.json()).catch(console.error);
        },
        dbUpdateTestcases(testcases) {
            return fetch("/Testcase/ByTestsuiteId/" + this.currentTestsuiteId, {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(testcases)
            }).then((res) => res.json()).catch(console.error);
        },
        moveTestcase(direction) {
            if (this.currentTestcase == null) return;
            if (this.testcases.length <= 1) return;

            let index = this.testcases.findIndex(x => x.testcase_id === this.currentTestcaseId);

            if ((index === 0) && (direction < 0)) return;
            if ((index === (this.testcases.length - 1)) && (direction > 0)) return;

            let target = this.testcases[index + direction];

            let tmp = target.no;
            target.no = this.currentTestcase.no;
            this.currentTestcase.no = tmp;

            this.dbUpdateTestcase(this.currentTestcase).then(json => {
                this.dbUpdateTestcase(target).then(json => {
                    this.loadTestcases(this.currentTestsuiteId);
                });
            });
        },
        dbBatchUpdateTestcase(targets) {
            if (targets.length > 0) {
                let rest = [...targets];
                let target = rest.shift();
                this.dbUpdateTestcase(target).then(json => {
                    this.dbBatchUpdateTestcase(rest);
                });
            } else {
                this.currentTestcaseId = null;
                this.loadTestcases(this.currentTestsuiteId);
            }
        },
        updateSortOrderAllTestcases() {
            this.testcases.forEach((x, i) => {
                x.no = (i + 1);
            });
            this.dbBatchUpdateTestcase([...this.testcases]);
        },
        styleCommon(column, index) {
            let style = { resize: "none", whiteSpace: "break-spaces" };

            if (column === "testcase_cd") {
                style.textWrap = "nowrap";
            }

            if ((column === "testcase_name") && (index > 0)
                && (this.testcases[index - 1].testcase_name === this.testcases[index].testcase_name)) {
                style.color = "#DDD";
                style.backgroundColor = "#DDD";
            }

            if ((column === "desc_action") && (index > 0)
                && (this.testcases[index - 1].testcase_name === this.testcases[index].testcase_name)
                && (this.testcases[index - 1].desc_action === this.testcases[index].desc_action)
            ) {
                style.color = "#DDD";
                style.backgroundColor = "#DDD";
            }

            if ((column === "desc_condition") && (index > 0)
                && (this.testcases[index - 1].testcase_name === this.testcases[index].testcase_name)
                && (this.testcases[index - 1].desc_action === this.testcases[index].desc_action)
                && (this.testcases[index - 1].desc_condition === this.testcases[index].desc_condition)
            ) {
                style.color = "#DDD";
                style.backgroundColor = "#DDD";
            }

            if ((column === "desc_expected") && (index > 0)
                && (this.testcases[index - 1].testcase_name === this.testcases[index].testcase_name)
                && (this.testcases[index - 1].desc_action === this.testcases[index].desc_action)
                && (this.testcases[index - 1].desc_condition === this.testcases[index].desc_condition)
                && (this.testcases[index - 1].desc_expected === this.testcases[index].desc_expected)
            ) {
                style.color = "#DDD";
                style.backgroundColor = "#DDD";
            }

            return style;
        },
        eventDatachanged() {
            this.testcases = this.$refs.spread.getJson();
        },
        eventSelectcell(info) {
            // console.log(info);
        },

        //initializeSpreadsheet() {
        //    var self = this;
        //    self.spread = jspreadsheet(document.getElementById('spreadsheet'), {
        //        data: [],
        //        rowResize: true,
        //        onchange(instance, cell, x, y, value) {
        //            var cellName = jexcel.getColumnNameFromId([x, y]);
        //            self.testcases = self.spread.getJson();
        //        },
        //        onselection(instance, x1, y1, x2, y2, origin) {
        //            var cellName1 = jexcel.getColumnNameFromId([x1, y1]);
        //            var cellName2 = jexcel.getColumnNameFromId([x2, y2]);
        //            self.spread.openEditor(self.spread.getCell(jexcel.getColumnNameFromId([x1, y1])), null, null);
        //        },

        //        //url : '/Testcase/FindByTestsuiteId/1/spread',
        //        //style: {
        //        //    //A2: 'text-align: left;',
        //        //    //A1:'background-color: orange;',
        //        //},
        //        columns: [
        //            {
        //                type: 'text',
        //                title: 'Code',
        //                width: 80,
        //                name: 'testcase_cd'
        //            },
        //            {
        //                type: 'text',
        //                title: 'Name',
        //                width: 150,
        //                name: 'testcase_name'
        //            },
        //            {
        //                type: 'text',
        //                title: 'Action',
        //                width: 250,
        //                wordWrap: true,
        //                name: 'desc_action'
        //            },
        //            {
        //                type: 'text',
        //                title: 'Condition',
        //                width: 250,
        //                wordWrap: true,
        //                name: 'desc_condition'
        //            },
        //            {
        //                type: 'text',
        //                title: 'Expected',
        //                width: 250,
        //                wordWrap: true,
        //                name: 'desc_expected'
        //            },
        //            {
        //                type: 'dropdown',
        //                title: 'Result',
        //                width: 80,
        //                name: 'result_success',
        //                source: [
        //                    "",
        //                    "OK",
        //                    "NG",
        //                    "N/A",
        //                ]
        //            },
        //        ]
        //    });
        //},
        checkDuplicateCd() {
            let orig = this.testcases.map(x => { return x.testcase_cd; }).filter(x => x !== "" && x != null);
            let uniq = Array.from(new Set(orig));
            return orig.length === uniq.length;
        },
        saveTestcase() {
            if (!(this.checkDuplicateCd())) {
                alert("Duplicate code!");
                return;
            }

            let data = JSON.parse(JSON.stringify(this.testcases));
            data = data
                .map(x => {
                    x.testsuite_id = this.currentTestsuiteId;
                    return x;
                })
                .map((x, i) => {
                    x.no = i + 1;
                    return x;
                })
                .map((x, i) => {
                    if (x.result_success === "") {
                        x.result_success = (-1);
                    } else if (x.result_success === "OK") {
                        x.result_success = 1;
                    } else if (x.result_success === "NG") {
                        x.result_success = 2;
                    }
                    return x;
                });
                // .filter(x => x.testcase_cd !== "");
            this.dbUpdateTestcases(data).then((json) => {
                this.loadTestcases(this.currentTestsuiteId);
            });
        }
    },
    mounted() {
        this.loadProjects();

        //var data = [
        //    //    ['TS01-01', 'Login', 'Press Login button', 'When User-ID is empty', 'Error', ''],
        //    //    ['TS01-02', '', '', 'When Password is empty', 'Error', ''],
        //    //['', '', '', '', '', '1'],
        //];

        //this.initializeSpreadsheet();

        //columns: [
        //            {
        //                type: 'text',
        //                title: 'Code',
        //                width: 80,
        //                name: 'testcase_cd'
        //            },
        //            {
        //                type: 'text',
        //                title: 'Name',
        //                width: 150,
        //                name: 'testcase_name'
        //            },
        //            {
        //                type: 'text',
        //                title: 'Action',
        //                width: 250,
        //                wordWrap: true,
        //                name: 'desc_action'
        //            },
        //            {
        //                type: 'text',
        //                title: 'Condition',
        //                width: 250,
        //                wordWrap: true,
        //                name: 'desc_condition'
        //            },
        //            {
        //                type: 'text',
        //                title: 'Expected',
        //                width: 250,
        //                wordWrap: true,
        //                name: 'desc_expected'
        //            },
        //            {
        //                type: 'dropdown',
        //                title: 'Result',
        //                width: 80,
        //                name: 'result_success',
        //                source: [
        //                    "",
        //                    "OK",
        //                    "NG",
        //                    "N/A",
        //                ]
        //            },

        this.$refs.spread.setColumnDefs([
            {
                width: 50,
            },
            {
                type: 'numer',
                text: 'No',
                width: 50,
                propertyName: 'no',
                columnStyler: (row, col, val, def) => {
                    return { textAlign: 'center' };
                },
                columnFormatter: (row, col, val, def) => {
                    return (row + 1);
                },
                columnEditor: {
                    template: (row, col, val, def) => {
                        return ``;
                    },
                    containerStyle: (row, col, val, def) => {
                        return {};
                    }
                }
            },
            {
                type: 'string',
                text: 'Code',
                width: 80,
                propertyName: 'testcase_cd'
            },
            {
                type: 'string',
                text: 'Name',
                width: 140,
                propertyName: 'testcase_name'
            },
            {
                type: 'string',
                text: 'Action',
                width: 240,
                propertyName: 'desc_action'
            },
            {
                type: 'string',
                text: 'Condition',
                width: 240,
                propertyName: 'desc_condition'
            },
            {
                type: 'string',
                text: 'Expected',
                width: 240,
                propertyName: 'desc_expected'
            },
            {
                type: 'string',
                text: 'Result',
                width: 70,
                propertyName: 'result_success',
            },


            //    { width: 60 },
            //    {
            //        width: 40, propertyName: "id", text: "id",
            //        columnStyler: () => { return { textAlign: "center" }; },
            //        columnType: "number",
            //    },
            //    {
            //        width: 400, propertyName: "desc", text: "desc",
            //        columnStyler: () => { return { textAlign: "left" }; },
            //        columnType: "string",
            //    },
            //    {
            //        width: 50, propertyName: "done", text: "done",
            //        columnStyler: () => { return { textAlign: "center" }; },
            //        columnType: "boolean",
            //        // columnFormatter: (row,col,val,def) => {
            //        //   if(val) {
            //        //     return `<input type="checkbox" checked/>`;
            //        //   } else {
            //        //     return `<input type="checkbox"/>`;
            //        //   }
            //        // },
            //        columnFormatter: (row, col, val, def) => {
            //            return '';
            //        },
            //        columnEditor: {
            //            template: (row, col, val, def) => {
            //                return `<input type="checkbox" id="chk-${row}-${col}" ${(val) ? 'checked' : ''} onclick="clickChk(${row}, ${col}, 'chk-${row}-${col}')">`;
            //            },
            //            containerStyle: (row, col, val, def) => {
            //                return { textAlign: 'center' };
            //            }
            //        }
            //    },
        ]);

    }
}).mount('#app');




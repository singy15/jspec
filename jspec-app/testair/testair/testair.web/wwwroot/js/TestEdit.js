const { createApp } = Vue;
let app = createApp({
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
            currentTestcaseId: null
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
        sortTestcases() {
            this.testcases = this.testcases.sort((a, b) => {
                if (a.sort_order > b.sort_order) return 1;
                if (a.sort_order === b.sort_order) return 0;
                if (a.sort_order < b.sort_order) return -1;
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
                this.testcases = json;
                this.sortTestcases();
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
            this.addOrInsertTestcase();
        },
        insertTestcase() {
            this.addOrInsertTestcase(this.currentTestcase);
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
                        testcase_cd: "",
                        testcase_name: "",
                        desc_condition: "",
                        desc_action: "",
                        desc_expected: "",
                        result_success: -1,
                        sort_order: (before) ? (before.sort_order - 1) : (json + 1)

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
            if (this.currentTestcaseId == null) {
                return;
            }

            fetch("/Testcase/" + this.currentTestcaseId.toString(), {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then((res) => res.json()).then(json => {
                this.currentTestcaseId = null;
                this.loadTestcases(this.currentTestsuiteId);
            }).catch(console.error);
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
        moveTestcase(direction) {
            if (this.currentTestcase == null) return;
            if (this.testcases.length <= 1) return;

            let index = this.testcases.findIndex(x => x.testcase_id === this.currentTestcaseId);

            if ((index === 0) && (direction < 0)) return;
            if ((index === (this.testcases.length - 1)) && (direction > 0)) return;

            let target = this.testcases[index + direction];

            let tmp = target.sort_order;
            target.sort_order = this.currentTestcase.sort_order;
            this.currentTestcase.sort_order = tmp;

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
                x.sort_order = (i + 1) * 100;
            });
            this.dbBatchUpdateTestcase([...this.testcases]);
        }
    },
    mounted() {
        this.loadProjects();
    }
}).mount('#app');


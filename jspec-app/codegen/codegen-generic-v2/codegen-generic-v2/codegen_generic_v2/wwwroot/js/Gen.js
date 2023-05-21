const { createApp } = Vue;
let app = createApp({
    data() {
        return {
            templates: [],
            selectedTemplateId: null,
            current: {
                codegen_template_id: null,
                template_string: "",
                default_model: ""
            },
        };
    },
    computed: {
        generated() {
            try {
                let env = JSON.parse(this.current.model);
                let src = (new Function(...Object.keys(env), "return " + "`" + this.current.template_string + "`")).call(env, ...Object.values(env));
                this.setLink(src);
                return src;
            } catch (ex) {
                console.log(ex);
                return "";
            }
        }
    },
    watch: {
        selectedTemplateId(newval) {
            this.current = Object.assign({}, this.templates.filter(x => x.codegen_template_id === newval)[0]);
            this.current.model = this.current.default_model;
        }
    },
    methods: {
        createTemplate() {
            fetch("/CodegenTemplate", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ template_name: this.current.template_name, template_string: this.current.template_string, default_model: this.current.model })
            }).then((res) => res.json()).then(json => {
                this.loadTemplates();
            }).catch(console.error);
        },
        updateTemplate() {
            fetch("/CodegenTemplate/" + this.current.codegen_template_id.toString(), {
                method: "PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ template_name: this.current.template_name, template_string: this.current.template_string, default_model: this.current.model })
            }).then((res) => res.json()).then(json => {
                this.loadTemplates();
            }).catch(console.error);
        },
        resetModel() { },
        loadTemplates() {
            fetch("/CodegenTemplate", {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then((res) => res.json()).then(json => {
                this.templates = json;
            }).catch(console.error);
        },
        download() { },
        setLink(src) {
            let link = document.getElementById("download");
            if (link) {
                let blob = new Blob([src], { "type": "text/plain" });
                link.download = "artifact";
                link.href = window.URL.createObjectURL(blob);
            }
        }
    },
    mounted() {
        this.loadTemplates();
    }
}).mount("#app");

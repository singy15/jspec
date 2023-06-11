const { createApp } = Vue;
let app = createApp({
    data() {
        return {
            project: {
                project_name: "",
                project_cd: ""
            }
        };
    },
    computed: {},
    methods: {
        create() {
            fetch("/Project", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.project)
            }).then((res) => res.json()).then(json => {
                location.href = "/View/TestEdit";
            }).catch(console.error);

        },
        cancel() { }
    }
}).mount('#app');


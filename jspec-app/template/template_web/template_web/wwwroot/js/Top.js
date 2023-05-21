const { createApp } = Vue;
let app = createApp({
    data() {
        return {

        };
    },
    computed: {},
    methods: {
        openProjects() {
            location.href = "/View/ProjectList";
        }
    }
}).mount('#app');


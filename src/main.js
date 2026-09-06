import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/styles.css";

// Pretty standard Vue 3 boot: pinia first so stores exist before any route renders.
createApp(App).use(createPinia()).use(router).mount("#app");

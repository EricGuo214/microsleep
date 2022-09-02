import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import firebase from "firebase";
import router from "./router";

Vue.config.productionTip = false;

const firebaseConfig = {
  apiKey: "AIzaSyBju_-9cNOWR1AkUomMlTHIMPnosyqZeqQ",
  authDomain: "microsleep-67.firebaseapp.com",
  projectId: "microsleep-67",
  storageBucket: "microsleep-67.appspot.com",
  messagingSenderId: "530132759785",
  appId: "1:530132759785:web:8a4a518010791651422c78",
  measurementId: "G-MR6LRY8S0D"
};

firebase.initializeApp(firebaseConfig);

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { createFirebaseConfig } from "./composables/createFirebaseConfig";
import { useFireBase } from "../src/composables/useFireBase";
import "./assets/app.css";

const app = createApp(App).use(router).mount("#app");

const { firebaseConfig } = createFirebaseConfig();

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

useFireBase()
  .checkIsSignIn()
  .then((path) => router.push(path));

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { createFirebaseConfig } from "./components/composables/createFirebaseConfig";
import { useFireBase } from "../src/components/composables/useFireBase";

createApp(App).use(router).mount("#app");
const { firebaseConfig } = createFirebaseConfig();
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);

const { checkIsRegistred } = useFireBase();
checkIsRegistred();

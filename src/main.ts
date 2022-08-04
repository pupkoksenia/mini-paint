import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

createApp(App).use(router).mount('#app')

const firebaseConfig = {
  apiKey: "AIzaSyCjZCaVDC6cw9XckkNT2r6zDNTL3yDyGMI",
  authDomain: "mini-paint-b1c99.firebaseapp.com",
  projectId: "mini-paint-b1c99",
  storageBucket: "mini-paint-b1c99.appspot.com",
  messagingSenderId: "222486269462",
  appId: "1:222486269462:web:043c2b3c3ada97998a2f37",
  measurementId: "G-D2KFG7269X",
  databaseURL: 'https://mini-paint-b1c99-default-rtdb.firebaseio.com/'
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

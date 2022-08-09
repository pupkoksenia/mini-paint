/*VUE_APP_FIREBASE_CONFIG = {
VUE_APP_FIREBASE_API_KEY="AIzaSyCjZCaVDC6cw9XckkNT2r6zDNTL3yDyGMI"
VUE_APP_FIREBASE_AUTH_DOMAIN="mini-paint-b1c99.firebaseapp.com"
VUE_APP_FIREBASE_PROJECT_ID="mini-paint-b1c99"
VUE_APP_FIREBASE_STORAGE_BUCKET="mini-paint-b1c99.appspot.com"
VUE_APP_FIREBASE_MESSAGING_SENDER_ID="222486269462"
VUE_APP_FIREBASE_APP_ID="1:222486269462:web:043c2b3c3ada97998a2f37",
VUE_APP_FIREBASE_MEASUREMENT_ID="G-D2KFG7269X"
*/

export function createFirebaseConfig(){
    const firebaseConfig={
        apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
        authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.VUE_APP_FIREBASE_APP_ID,
        measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
    }
    return {
        firebaseConfig
    }
}


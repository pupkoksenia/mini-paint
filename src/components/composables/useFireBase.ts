import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../main";
import { readonly, ref } from "vue";

type State = {
  user: {
    email: string | null;
    aid: string;
  };
};

export function useFireBase() {
  const state = ref<State>({
    user: {
      email: "",
      aid: "",
    },
  });
  const auth = getAuth();

  const signIn = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        state.value.user.email = userCredential.user.email;
        state.value.user.aid = userCredential.user.uid;
        return "ok";
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-email":
            return "Invalid email";
          case "auth/user-not-found":
            return "No account with that email was found";
          case "auth/wrong-password":
            return "Incorrect password";
          default:
            return "Email or password was incorrect";
        }
      });

  const register = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        state.value.user.email = userCredential.user.email;
        state.value.user.aid = userCredential.user.uid;
        return "ok";
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-email":
            return "Invalid email";
        }
      });

  const getFeedPaints = () =>
    getDocs(collection(db, "users")).then((docs) => {
      let resDocs: any = [];
      docs.forEach((doc) => {
        doc.data().paints.forEach((paint: any) => {
          resDocs.push({
            nameOfPaint: paint.nameOfPaint,
            date: new Date(paint.date.seconds * 1000).toLocaleDateString(),
            userName: doc.data().name,
          });
        });
      });
      resDocs = resDocs
        .sort(
          (prev: any, curr: any) =>
            Date.parse(prev.date) - Date.parse(curr.date)
        )
        .reverse();
      return resDocs;
    });

  const checkIsRegistred = () => 
    onAuthStateChanged(auth, (user) => {
      if (user) {
        state.value.user.email = user.email;
        state.value.user.aid = user.uid;
      } 
      else console.log(false);
    });

  /*const getUserPaints = () => {
    checkIsRegistred()
    let paintsResult: Array<string> = [];
    getDocs(collection(db, "users")).then((docs) => {
      docs.forEach((doc) => {
        if (doc.data().name === state.value.user.email)
          paintsResult = doc.data().paints.slice();
      });
    });
     return paintsResult;
  }*/

  return {
    state: readonly(state),
    signIn,
    //getUserPaints,
    getFeedPaints,
    register,
    checkIsRegistred,
  };
}

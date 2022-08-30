import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../main";
import { readonly, reactive, DeepReadonly } from "vue";
import router from "@/router";

export interface State {
  user: {
    email: string | null;
    uid: string;
    isSignIn: boolean;
  };
}

const state = reactive<State>({
  user: {
    email: "",
    uid: "",
    isSignIn: false,
  },
});

export interface FireBase {
  state: DeepReadonly<typeof state>;
  signIn: (email: string, password: string) => Promise<string>;
  register: (email: string, password: string) => Promise<string | undefined>;
  checkIsSignIn: () => Promise<{
    path: string;
  }>;
  signOutFirebase: () => void;
}

export const useFireBase: () => FireBase = () => {
  const auth = getAuth();

  const signIn = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        state.user.email = userCredential.user.email;
        state.user.uid = userCredential.user.uid;
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
        state.user.email = userCredential.user.email;
        state.user.uid = userCredential.user.uid;
        state.user.isSignIn = true;

        let id: string;

        getDocs(collection(db, "users"))
          .then((docs) => (id = docs.size.toString()))
          .then(() => {
            setDoc(
              doc(db, "users", id),
              {
                name: userCredential.user.email,
                paints: [],
              },
              { merge: true }
            );
          });

        return "ok";
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-email":
            return "Invalid email";
        }
      });

  const checkIsSignIn = () =>
    new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          state.user.email = user.email;
          state.user.uid = user.uid;
          state.user.isSignIn = true;
          resolve(state.user.isSignIn);
        }
      });
    }).then((result) => {
      if (result) return { path: "/" };
      else return { path: "/sign-in" };
    });

  const signOutFirebase = () => {
    signOut(auth).then(() => {
      state.user.email = "";
      state.user.uid = "";
      state.user.isSignIn = false;
    });
  };

  return {
    state: readonly(state),
    signIn,
    register,
    checkIsSignIn,
    signOutFirebase,
  };
};

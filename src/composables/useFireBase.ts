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

export interface State {
  user: {
    email: string | null;
    uid: string;
  };
}

const state = reactive<State>({
  user: {
    email: "",
    uid: "",
  },
});

export interface FireBase {
  state: DeepReadonly<typeof state>;
  signIn: (email: string, password: string) => Promise<string>;
  register: (email: string, password: string) => Promise<string | undefined>;
  checkIsRegistred: () => Promise<unknown>;
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

        let id:string

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

  const checkIsRegistred = () => {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          state.user.email = user.email;
          state.user.uid = user.uid;
          resolve(true);
        } else reject(false);
      });
    });
  };

  const signOutFirebase = () => {
    signOut(auth).then(() => {
      state.user.email = "";
      state.user.uid = "";
    });
  };

  return {
    state: readonly(state),
    signIn,
    register,
    checkIsRegistred,
    signOutFirebase,
  };
};

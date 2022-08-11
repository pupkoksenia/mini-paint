import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  Unsubscribe,
} from "firebase/auth";
import { readonly, reactive, DeepReadonly } from "vue";
import { DataPaint } from "../types";

export interface State {
  user: {
    email: string | null;
    uid: string;
  };
  dataPaints: DataPaint[];
  filter: string;
}

const state = reactive<State>({
  user: {
    email: "",
    uid: "",
  },
  dataPaints: [],
  filter: "",
});

export interface FireBase {
  state: DeepReadonly<typeof state>;
  signIn: (email: string, password: string) => Promise<string>;
  register: (email: string, password: string) => Promise<string | undefined>;
  checkIsRegistred: Unsubscribe;
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
        return "ok";
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-email":
            return "Invalid email";
        }
      });

  const checkIsRegistred = () =>
    onAuthStateChanged(auth, (user) => {
      if (user) {
        state.user.email = user.email;
        state.user.uid = user.uid;
      }
    });

  return {
    state: readonly(state),
    signIn,
    register,
    checkIsRegistred,
  };
};

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  Unsubscribe,
  signOut,
} from "firebase/auth";
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
  checkIsRegistred: Unsubscribe;
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

  const signOutFirebase = () => {
    signOut(auth).then(() => {
      console.log("okay");
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

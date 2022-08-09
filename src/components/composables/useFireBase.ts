import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  Unsubscribe,
} from "firebase/auth";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../main";
import { readonly, reactive, DeepReadonly, computed, ComputedRef } from "vue";
import { DataPaint } from "../types";

export interface State {
  user: {
    email: string | null;
    aid: string;
  };
  dataPaints: DataPaint[];
  filter: string;
}

const state = reactive<State>({
  user: {
    email: "",
    aid: "",
  },
  dataPaints: [],
  filter: "",
});

export interface FireBase {
  state: DeepReadonly<typeof state>;
  sortedFeedPaints: ComputedRef<DataPaint[]>;
  signIn: (email: string, password: string) => Promise<string>;
  getFeedPaints: () => Promise<void>;
  register: (email: string, password: string) => Promise<string | undefined>;
  checkIsRegistred: Unsubscribe;
  setFilterValue: (value: string) => void;
}

export const useFireBase: () => FireBase = () => {
  const auth = getAuth();

  const signIn = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        state.user.email = userCredential.user.email;
        state.user.aid = userCredential.user.uid;
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
        state.user.aid = userCredential.user.uid;
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
      docs.forEach((doc) => {
        doc
          .data()
          .paints.forEach((paint: { nameOfPaint: string; date: Timestamp }) => {
            state.dataPaints?.push({
              nameOfPaint: paint.nameOfPaint,
              date: new Date(paint.date.seconds * 1000).toLocaleDateString(),
              userName: doc.data().name,
            });
          });
      });
    });

  const checkIsRegistred = () =>
    onAuthStateChanged(auth, (user) => {
      if (user) {
        state.user.email = user.email;
        state.user.aid = user.uid;
      }
    });

  const filteredItems = computed(() => {
    if (state.filter)
      return state.dataPaints.filter(
        (p: DataPaint) => p.userName === state.filter
      );
    return state.dataPaints;
  });

  const sortedFeedPaints = computed(() =>
    filteredItems.value
      .sort(
        (prev: DataPaint, curr: DataPaint) =>
          Date.parse(prev.date) - Date.parse(curr.date)
      )
      .reverse()
  );

  const setFilterValue = (value: string) => {
    state.filter = value;
  };
  return {
    state: readonly(state),
    sortedFeedPaints,
    setFilterValue,
    signIn,
    getFeedPaints,
    register,
    checkIsRegistred,
  };
};

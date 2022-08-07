import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../main";

const auth = getAuth();

export const signIn = (email: any, password: any) =>
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      localStorage.setItem("email", userCredential.user.email || "");
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

export const register = (email: any, password: any) =>
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      localStorage.setItem("email", userCredential.user.email || "");
      return "ok";
    })
    .catch((error) => {
      switch (error.code) {
        case "auth/invalid-email":
          return "Invalid email";
      }
    });

export const getFeedPaints = () =>
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
        (prev: any, curr: any) => Date.parse(prev.date) - Date.parse(curr.date)
      )
      .reverse();
    return resDocs;
  });

export const getUserPaints = () => {
  let paintsResult: any = [];
  getDocs(collection(db, "users")).then((docs) => {
    docs.forEach((doc) => {
      if (doc.data().name === localStorage.getItem("email"))
        paintsResult = doc.data().paints;
    });  
  });
  return paintsResult;
};

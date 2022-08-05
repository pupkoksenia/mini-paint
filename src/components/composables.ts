import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

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

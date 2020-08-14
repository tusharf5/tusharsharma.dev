import * as firebase from "firebase/app";

export default async function loadDb() {
  await import("firebase/database");
  try {
    firebase.initializeApp({
      databaseURL: "https://tusharsharma-website.firebaseio.com",
    });
  } catch (error) {
    /*
     * We skip the "already exists" message which is
     * not an actual error when we're hot-reloading.
     */
    if (!/already exists/.test(error.message)) {
      console.error("Firebase initialization error", error.stack);
    }
  }

  return firebase.database().ref("likes");
}

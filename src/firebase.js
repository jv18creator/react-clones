import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyByqZ7xuyiU6qy3gzRfPQZhhKNNKGhJamQ",
    authDomain: "instagram-clone-jv.firebaseapp.com",
    projectId: "instagram-clone-jv",
    storageBucket: "instagram-clone-jv.appspot.com",
    messagingSenderId: "926997532535",
    appId: "1:926997532535:web:3f71ce25163d23876cdb72",
    measurementId: "G-M2V52NJRLW"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {
    db,
    auth,
    storage
};
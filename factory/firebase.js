import Firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBHj8dorgz8AS-OGYQbLfnwZDzah2gg4gQ",
    authDomain: "appcrudfirebase-b14a3.firebaseapp.com",
    projectId: "appcrudfirebase-b14a3",
    storageBucket: "appcrudfirebase-b14a3.firebasestorage.app",
    messagingSenderId: "1015283906370",
    appId: "1:1015283906370:web:70c68cd81fb78bb9577adb",
};

if (!Firebase.apps.length) {
    Firebase.initializeApp(firebaseConfig);
}

export default Firebase;

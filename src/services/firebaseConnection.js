import firebase from "firebase";
import 'firebase/database';
import 'firebase/auth';

let firebaseConfig = {
    apiKey: "AIzaSyCLp3-cWIcW5kwOJ6LACctqv0FoHQ7MNDM",
    authDomain: "appfinances-401db.firebaseapp.com",
    projectId: "appfinances-401db",
    storageBucket: "appfinances-401db.appspot.com",
    messagingSenderId: "1043464177914",
    appId: "1:1043464177914:web:6ee5129919fc118500a143"
  };

  if(!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
  }

  export default firebase;

  
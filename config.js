import firebase from 'firebase'
require('@firebase/firestore')
var firebaseConfig = {
    apiKey: "AIzaSyC47S0ddr95IWECCrVOIt9JP0tPL0tNyrM",
    authDomain: "wily-e5f83.firebaseapp.com",
    projectId: "wily-e5f83",
    storageBucket: "wily-e5f83.appspot.com",
    messagingSenderId: "1012722715191",
    appId: "1:1012722715191:web:8fcd178879630ef0b70db2"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore()
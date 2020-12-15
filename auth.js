// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBqFW_FCdHumjs3pr4Shc6honiMjNgl7rs",
    authDomain: "crew-contract.firebaseapp.com",
    projectId: "crew-contract",
    storageBucket: "crew-contract.appspot.com",
    messagingSenderId: "277713632210",
    appId: "1:277713632210:web:cd1963d616ede2453c260b"
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Make Auth and Firestore references
const auth = firebase.auth();
const db = firebase.firestore();
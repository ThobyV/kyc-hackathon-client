import firebase from 'firebase/app'

firebase.initializeApp({
  apiKey: process.env.REACT_APP_APO_KEY,
  authDomain: "kyc-app-65a63.firebaseapp.com",
  databaseURL: "https://kyc-app-65a63.firebaseio.com",
  projectId: "kyc-app-65a63",
  storageBucket: "kyc-app-65a63.appspot.com",
  messagingSenderId: "795090227071",
  appId: "1:795090227071:web:146c0262754550db4ad44a",
  measurementId: "G-XKNWNY81PY"
});

export default firebase;
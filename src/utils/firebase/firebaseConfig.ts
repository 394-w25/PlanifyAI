// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { initializeFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCqoVVM9bUo-85RsKpb-vkzZr60NDCL_cY',
  authDomain: 'planify-ai-394.firebaseapp.com',
  projectId: 'planify-ai-394',
  storageBucket: 'planify-ai-394.firebasestorage.app',
  messagingSenderId: '701418262433',
  appId: '1:701418262433:web:2f287a3221c0e6732cc5e0',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

const db = initializeFirestore(app, {})

const auth = getAuth(app)

export { auth, db }

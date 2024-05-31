// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABV9wZeFBM6KkpX9jLY-UHx0KnDxdHpPA",
  authDomain: "home-finder-97399.firebaseapp.com",
  projectId: "home-finder-97399",
  storageBucket: "home-finder-97399.appspot.com",
  messagingSenderId: "156580564803",
  appId: "1:156580564803:web:cd0ea7a166888e8180e9f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// 初始化 Firestore 數據庫服務。getFirestore 函數返回一個 Firestore 數據庫實例，允許你在應用中讀取和寫入數據
export const db = getFirestore();
// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js"; // untuk menyalakan firebase pada project
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js"; // untuk mengaktifkan database firestore

const firebaseConfig = {
  apiKey: "AIzaSyAMVnZh-Dkgu4dq_vhRFIfUBur7TgUGsf4",
  authDomain: "aplikasi-input-11aa8.firebaseapp.com",
  projectId: "aplikasi-input-11aa8",
  storageBucket: "aplikasi-input-11aa8.firebasestorage.app",
  messagingSenderId: "113994274515",
  appId: "1:113994274515:web:1b2e5064a36282de3ce626"
};

// Inisialisasi Firebase untuk menyalakan Firebase dan mengaktifkan akses ke firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
//❶↓↓↓以下追記※※※URLのバージョンはimport { initializeApp }のURLに合わせる(10.12.2に書き換える)※※※
//※※必要なGoogleの関数は毎回ここに書き込む。
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuatCvVC1aybh2zJnbrk6DbDAj6PpyPC4",
  authDomain: "skill-records-f67d6.firebaseapp.com",
  projectId: "skill-records-f67d6",
  storageBucket: "skill-records-f67d6.appspot.com",
  messagingSenderId: "684855358016",
  appId: "1:684855358016:web:7d3bcde894a6a2eacc25a5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//❷以下のdb読み込み文章を追記すること
const db = getFirestore(app);
//dbを時刻順に並び替える。
const q = query(collection(db, "chat"), orderBy("time", "desc"));


console.log(serverTimestamp());


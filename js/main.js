
function convertTimestampToDatetime(timestamp) {
  let time = [];
  const _d = timestamp ? new Date(timestamp * 1000) : new Date();
  const Y = _d.getFullYear();
  const m = (_d.getMonth() + 1).toString().padStart(2, '0');
  const d = _d.getDate().toString().padStart(2, '0');
  const H = _d.getHours().toString().padStart(2, '0');
  const i = _d.getMinutes().toString().padStart(2, '0');
  const s = _d.getSeconds().toString().padStart(2, '0');
  time = [`${Y}/${m}/${d} ${H}:${i}:${s}`,`${Y}${m}${d}${H}${i}${s}`];
  return time;
}

// function jsonParse(data){
//   return JSON.parse(data);
// }
// ==========================================================================================
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
const q = query(collection(db, "folder"), orderBy("time", "desc"));
const pq = query(collection(db, "post"), orderBy("time", "desc"));


console.log(app);
console.log(db);
console.log(serverTimestamp());
// =================================関数=========================================================
// function data2Ui(){
// }
console.log(convertTimestampToDatetime(serverTimestamp().second));
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mkId() {
  let id = `${convertTimestampToDatetime(serverTimestamp().second)[1]}_${randomNumber(100, 999)}`;
return id;
}
// ==========================================================================================


    //❸データ送信
    $('#btn_add_folder_element').on('click', function() {
      if ($('#folder_name').val()) {
        const folderData = {
          // file_id:[],
          // ↑フォルダのデータにpostのid入れてた方が探しやすそう。どうなんだろ。
          name: $('#folder_name').val(),
          time: serverTimestamp(),
        };
        console.log(folderData);
        //addDoc(場所, データ)をぶち込む
        addDoc(collection(db, 'folder'), folderData);
        //navにappend・prepend → ここはまとめて関数で画面更新。

      //   $('#folder_wrapper_element').prepend(`<div class="folder" id=${folderData.id}>
      //   <h4>${folderData.name}</h4>
      //   <ul>
      //   </ul>
      // </div>`);

      $('#folder_name').val() = "";
      } else {
        alert('フォルダ名を入力してください。')
      }
    })

    const folderPosts = [];
        // データ取得処理
        onSnapshot(q, (querySnapshot) => {
          console.log(querySnapshot.docs);

          //欲しいものだけ取り出して新しい配列作る
          const documents = [];
          querySnapshot.docs.forEach(function(doc) {
            const document = {
              id: doc.id,
              data:doc.data(),
            };
            documents.push(document);
          });
          console.log(documents);

          //みやすくくしたデータのタグを作る。
          const folderElements = [];
          const postPullElements = [];
          documents.forEach(function(document) {
            folderElements.push(`
              <div class="folder" id=${document.id}>
                <h4>${document.data.name}</h4>
                <ul>
                </ul>
              </div>
            `);
            folderPosts.push(
            {
              folder_id: document.id,
              folder_name: document.data.name,
            }
            );
            postPullElements.push(`
            <option value=${document.id}>${document.data.name}</option>
            `);
          });





          console.log('folderElements');
          console.log(folderElements)
          $('#folder_wrapper_element').empty();
          $('#folder_wrapper_element').prepend(folderElements);
          $('#post_select').prepend(postPullElements);
          console.log(folderElements);
          console.log(folderPosts);
        });




// ==========================================================================================

// data
let folders = [];



$('#btn_add_post_element').on('click', function(){
  alert('クリック');
})

// let folders = [];
// $('#btn_add_folder_element').on('click', function(){
//   // alert('クリック');
//   let folder_name = window.prompt();
//   let folder = {
//     name:folder_name,
//     id:mkId(),
//   }
//   folders.push(folder);
//   console.log(folders);
// })

// post_select
// ================================================================
    //❸データ送信
    $('#send_post').on('click', function() {
      let folderName = "";
      console.log(`select:${$('#post_select').val()}`);
      console.log(`folderPosts:${folderPosts}`);
      folderPosts.forEach(function(folderPost) {
        console.log(folderPost);
        // console.log(jsonParse(folderPost).folder_id);
        console.log(folderPost.folder_name);
        if($('#post_select').val() == folderPost.folder_id){
          folderName = folderPost.folder_name;
        }
      });

      if ($('#post_tag').val()) {
        const postData = {
          id: $('#post_select').val(),
          name: $('#post_name').val(),
          tag: $('#post_tag').val(),
          text:$('#post_text').val(),
          time: serverTimestamp(),
          folder: folderName,
        };
        console.log(postData);
        //addDoc(場所, データ)をぶち込む
        addDoc(collection(db, 'post'), postData);
      } else {
        alert('Youtubeを埋め込んでください。')
      }
    })



    // ＝＝＝＝folderがクリックされたら＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // ◯◯がidの親要素に属するpostを取得

    // function getFolderChilds(folderId) {
    //   let documents = [];
    //   onSnapshot(pq, (querySnapshot) => {
    //     // console.log(querySnapshot.docs);
    //     //欲しいものだけ取り出して新しい配列作る
    //     querySnapshot.docs.forEach(function(doc) {
    //       // console.log(doc.data().id)
    //       if(doc.data().id == folderId) {
    //         const document = {
    //           id: doc.id,
    //           data:doc.data(),
    //         };
    //         documents.push(document);
    //       }
    //     });
    //     console.log(documents);
    //   });
    //   return documents
    // }
    // -------
    let posts = [];
    onSnapshot(pq, (querySnapshot) => {
      // console.log(querySnapshot.docs);
      //欲しいものだけ取り出して新しい配列作る
      querySnapshot.docs.forEach(function(doc) {
          const post = {
            id: doc.id,
            data:doc.data(),
          };
          posts.push(post);
      });
    });
    console.log(posts);
    function getFolderChilds(folderId) {
      let childPosts = [];
      posts.forEach(function(post) {
        if(post.data.id == folderId) {
          const childPost = {
            id: post.id,
            data:post.data,
          };
          childPosts.push(childPost);
        }
      });
      return childPosts
    }
    // console.log(posts);

$(document).on('click', '.folder', function(){
  // 押されたfolderのid取得。
  let folderId =  $(this).attr('id');
  // このidでfolderに属したpostを取得。
  console.log(getFolderChilds(folderId));

});

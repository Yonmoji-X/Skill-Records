
function convertTimestampToDatetime(timestamp) {
  let time = [];
  const _d = timestamp ? new Date(timestamp * 1000) : new Date();
  const Y = _d.getFullYear();
  const m = (_d.getMonth() + 1).toString().padStart(2, '0');
  const d = _d.getDate().toString().padStart(2, '0');
  const H = _d.getHours().toString().padStart(2, '0');
  const i = _d.getMinutes().toString().padStart(2, '0');
  const s = _d.getSeconds().toString().padStart(2, '0');
  time = [`${Y}/${m}/${d} ${H}:${i}:${s}`, `${Y}${m}${d}${H}${i}${s}`];
  return time;
}

// オブジェクト配列中の同一要素を削除した配列を返す。
function goodByeNotOriginal(array){
  const uniqueArray = array.filter((element, index, self) => self.findIndex(e => e.id === element.id) === index);
  console.log(uniqueArray);
  return uniqueArray
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
  // doc,
  // deleteDoc,
  // update,
  // remove,
  // onChildChanged,
  // onChildRemoved,
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
$('#btn_add_folder_element').on('click', function () {
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

    $('#folder_name').val() = "";
  } else {
    alert('フォルダ名を入力してください。')
  }
  location.reload();
})

const folderPosts = [];
const folderElements = [];
const postPullElements = [];
// データ取得処理
onSnapshot(q, (querySnapshot) => {
  console.log(querySnapshot.docs);

  //欲しいものだけ取り出して新しい配列作る
  const documents = [];
  querySnapshot.docs.forEach(function (doc) {
    const document = {
      id: doc.id,
      data: doc.data(),
    };
    documents.push(document);
  });
  console.log(documents);

  //みやすくくしたデータのタグを作る。
  // const folderElements = [];
  // const postPullElements = [];
  documents.forEach(function (document) {
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

  // console.log('folderElements');
  // console.log(folderElements)
  $('#folder_wrapper_element').empty();
  $('#folder_wrapper_element').append(folderElements);
  // $('#folder_wrapper_element').prepend(folderElements);
  $('#post_select').prepend(postPullElements);
  // console.log(folderElements);
  // console.log(folderPosts);
});




// =========================================================================================
let folders = [];

$('#btn_add_post_element').on('click', function () {
  // alert('クリック');
  $('#post-wrapper').empty();
  $('#post-wrapper').prepend(`
  <div class="post">
  <H4>投稿</H4>
  <ul>
    <li>
      <label>タイトル</label>
      <input type="text" id="post_name">
    </li>
    <li>
      <label>フォルダ</label>
      <select id="post_select">
        <option value=""></option>
      </select>
    </li>
    <li>
      <label>Youtube埋め込み</label>
      <textarea name="" id="post_tag" cols="30" rows="10"></textarea>
    </li>
    <li>
      <label>解説</label>
      <textarea name="" id="post_text" cols="30" rows="10"></textarea>
    </li>
    <li>
      <button id="send_post">投稿</button>
    </li>
  </ul>
</div>
`);
$('#post_select').prepend(postPullElements);
});

// ================================================================
//❸データ送信
$(document).on('click', '#send_post', function () {
// $('#send_post').on('click', function () {
  let folderName = "";
  // console.log(`select:${$('#post_select').val()}`);
  // console.log(`folderPosts:${folderPosts}`);
  folderPosts.forEach(function (folderPost) {
    console.log(`folderPost：${folderPost}`);
    // console.log(jsonParse(folderPost).folder_id);
    console.log(folderPost.folder_name);
    if ($('#post_select').val() == folderPost.folder_id) {
      folderName = folderPost.folder_name;
    }
  });

  if ($('#post_tag').val()) {
    const postData = {
      id: $('#post_select').val(),
      name: $('#post_name').val(),
      tag: $('#post_tag').val(),
      text: $('#post_text').val(),
      time: serverTimestamp(),
      folder: folderName,
    };
    console.log(postData);
    //addDoc(場所, データ)をぶち込む
    addDoc(collection(db, 'post'), postData);

    // フォームリセット
    $('#post_select').val('');
    $('#post_name').val('');
    $('#post_tag').val('');
    $('#post_text').val('');
    alert('投稿しました')
  } else {
    alert('Youtubeを埋め込んでください。')
  }
  // location.reload();
});



// ＝＝＝＝folderがクリックされたら＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// -------
let posts = [];
onSnapshot(pq, (querySnapshot) => {
  // console.log(querySnapshot.docs);
  //欲しいものだけ取り出して新しい配列作る
  querySnapshot.docs.forEach(function (doc) {
    const post = {
      id: doc.id,
      data: doc.data(),
    };
    posts.push(post);
  });
});
console.log(posts);

function getFolderChilds(folderId) {
  let childPosts = [];
  posts.forEach(function (post) {
    if (post.data.id == folderId) {
      const childPost = {
        id: post.id,
        data: post.data,
      };
      childPosts.push(childPost);
    }
  });
  return childPosts
}

function getPostById(id) {
  let thisPost = '';
  posts.forEach(function (post) {
    if (post.id == id) {
      const postData = {
        id: post.id,
        data: post.data,
      };
      thisPost = postData
    }
  });
  return thisPost
}

$(document).on('click', '.folder', function () {
  // console.log(folderClickedId);
  let folderId = $(this).attr('id');
  // if ($(`#${folderId} li`)) {
  $('.folder li').remove();
  // $(`#${folderId} li`).remove();
  // } else {
  // 押されたfolderのid取得。
  // このidでfolderに属したpostを取得。
  let folderChilds = getFolderChilds(folderId);
  // 同じ要素が複数入る謎のバグ対策
  folderChilds = goodByeNotOriginal(folderChilds);
  console.log(`folderChilds：${folderChilds}`)
  folderChilds.forEach(function (folderChild) {
    $(`#${folderId} ul`).prepend(`
        <li id='${folderChild.id}'>${folderChild.data.name}</li>
        `);
  });
  // for (let i = 0; i < folderChilds.length; i++) {
  //     $(`#${folderId} ul`).prepend(`
  //       <li id='${folderChilds[i].id}'>${folderChilds[i].data.name}</li>
  //       `);
  // }

  console.log(`folderChilds：${folderChilds}`)
  console.log(folderChilds)
  if (folderChilds.length == 0) {
    alert('まだフォフォルダは空です。記事を追加してください。')
  }
});



// 真ん中に記事表示

$(document).on('click', '.folder li', function () {
  $('.post-wrapper').empty();
  let postId = $(this).attr('id');
  console.log(postId)
  let thisPost = getPostById(postId)
  console.log(thisPost)
  console.log(thisPost.data.name)
  console.log(thisPost.data.tag)
  console.log(thisPost.data.text)
  // $('.post-wrapper').prepend(`
  // $('.post-wrapper').prepend(`
  $('.post-wrapper').append(`
  <div class="post">
    <div class="folder-post-head">
      <div class="post-title">${thisPost.data.name}</div>
      <button class="remove-post" id=${thisPost.id}>削除</button>
    </div>
    <div class="post-mc-wrapper">
      <div class="post-movie">
        ${thisPost.data.tag}
      </div>
      <div class="post-contents">

        <ul>
          <li>
            <h5>解説</h5>
          </li>
          <li>
            <div>${thisPost.data.text}</div>
          </li>
        </ul>

    </div>
  </div>
</div>
  `)
});

// Postの削除
// $(document).on('click', '.remove-post', function () {
//   let postId = $(this).attr('id');
//   // const removePost = ref(db,'post/'+postId)
//   // remove(removePost);
//   // deleteDoc(doc(db, 'post'), postId);
//   // remove()
//   console.log(postId)
// });

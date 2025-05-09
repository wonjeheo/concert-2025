import { db } from './firebase.js';
import {
  doc, getDoc, setDoc, increment, arrayUnion
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
  }, 1800);

  fetch("data/songs.json")
    .then(res => res.json())
    .then(songs => {
      const list = document.getElementById("song-list");
      const title = document.getElementById("song-title");
      const artist = document.getElementById("song-artist");
      const members = document.getElementById("song-members");
      const lyrics = document.getElementById("song-lyrics");
      const image = document.getElementById("song-image");
      const duration = document.getElementById("song-duration");
      const likeBtn = document.getElementById("like-button");
      const likeCount = document.getElementById("like-count");
      const commentInput = document.getElementById("comment-input");
      const commentList = document.getElementById("comment-list");
      const submitComment = document.getElementById("submit-comment");

      let currentSongKey = "";

      songs.forEach((song, index) => {
        const item = document.createElement("div");
        item.className = "song-item";
        item.textContent = `${index + 1}. ${song.title}`;

        item.addEventListener("click", async () => {
          document.querySelectorAll('.song-item').forEach(el => el.classList.remove('active'));
          item.classList.add('active');
          title.textContent = song.title;
          artist.textContent = song.artist;
          image.src = song.image || "songs/img/default.jpg";
          members.innerHTML = `<strong>멤버 구성:</strong><br>` + 
            Object.entries(song.instruments)
              .map(([k, v]) => `<span><strong>${k}</strong>: ${v}</span>`)
              .join(' ');
          duration.textContent = song.duration ? `곡 시간: ${song.duration}` : "";

          // 가사
          if (song.Lyrics && song.Lyrics.endsWith('.txt')) {
            fetch(song.Lyrics)
              .then(res => res.text())
              .then(text => {
                const lines = text.split('\n');
                lyrics.innerHTML = lines.map(line => `<span>${line.trim()}</span>`).join('');
              })
              .catch(() => {
                lyrics.textContent = "가사를 불러오지 못했습니다.";
              });
          } else {
            lyrics.innerHTML = (song.Lyrics || "가사가 준비 중입니다.")
              .split('\n')
              .map(line => `<span>${line}</span>`)
              .join('');
          }

          // Firestore 연결
          currentSongKey = song.title.replace(/\s+/g, "_");

          const likeDoc = doc(db, "songMeta", currentSongKey);
          const likeSnap = await getDoc(likeDoc);
          likeCount.textContent = likeSnap.exists() ? likeSnap.data().likes || 0 : 0;

          // 감상평 로드
          commentList.innerHTML = "";
          if (likeSnap.exists() && likeSnap.data().comments) {
            likeSnap.data().comments.forEach(c => {
              commentList.innerHTML += `<div>${c}</div>`;
            });
          }
        });

        list.appendChild(item);
      });

      // 첫 곡 선택
      const first = document.querySelector(".song-item");
      if (first) first.click();

      // 좋아요
      likeBtn.onclick = async () => {
        if (!currentSongKey || localStorage.getItem(`liked_${currentSongKey}`)) return;
        const ref = doc(db, "songMeta", currentSongKey);
        await setDoc(ref, { likes: increment(1) }, { merge: true });
        const snap = await getDoc(ref);
        likeCount.textContent = snap.data().likes || 0;
        localStorage.setItem(`liked_${currentSongKey}`, "true");
      };

      // 감상평 등록
      submitComment.onclick = async () => {
        const text = commentInput.value.trim();
        if (!text || !currentSongKey) return;
        const ref = doc(db, "songMeta", currentSongKey);
        await setDoc(ref, { comments: arrayUnion(text) }, { merge: true });
        commentList.innerHTML += `<div>${text}</div>`;
        commentInput.value = "";
      };
    });
});

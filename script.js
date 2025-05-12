import { db } from './firebase.js';
import {
  doc, getDoc, setDoc, increment, arrayUnion
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

window.addEventListener('DOMContentLoaded', () => {
  // 로딩 후 본문 표시
  setTimeout(() => {
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
  }, 1800);

  fetch("data/songs.json")
    .then(res => res.json())
    .then(songs => {
      const list       = document.getElementById("song-list");
      const title      = document.getElementById("song-title");
      const artist     = document.getElementById("song-artist");
      const members    = document.getElementById("song-members");
      const lyrics     = document.getElementById("song-lyrics");
      const image      = document.getElementById("song-image");
      const duration   = document.getElementById("song-duration");
      const likeBtn    = document.getElementById("like-button");
      const likeCount  = document.getElementById("like-count");
      const commentInput  = document.getElementById("comment-input");
      const commentList   = document.getElementById("comment-list");
      const submitComment = document.getElementById("submit-comment");
      const description = document.getElementById("song-description");
      const prevBtn    = document.querySelector('.nav-prev');
      const nextBtn    = document.querySelector('.nav-next');

      let currentIndex = 0;
      let currentSongKey = "";

      // 셋리스트 렌더링
      songs.forEach((song, index) => {
        const item = document.createElement("div");
        item.className = "song-item";
        item.dataset.index = index;
        item.textContent = `${index + 1}. ${song.title}`;
        item.addEventListener("click", () => loadSong(index));
        list.appendChild(item);
      });

      // 곡 로드 함수
      function loadSong(idx) {
        if (idx < 0 || idx >= songs.length) return;
        currentIndex = idx;
        const song = songs[idx];

        // 활성화 상태 토글
        document.querySelectorAll('.song-item')
          .forEach(el => el.classList.remove('active'));
        list.querySelector(`[data-index='${idx}']`)
          .classList.add('active');

        // 정보 업데이트
        title.textContent   = song.title;
        artist.textContent  = song.artist;
        image.src           = song.image || "songs/img/default.jpg";
        members.innerHTML   = `<strong>멤버 구성:</strong><br>` +
          Object.entries(song.instruments)
            .map(([k,v]) => `<span><strong>${k}</strong>: ${v}</span>`)
            .join(' ');
        duration.textContent = song.duration ? `곡 시간: ${song.duration}` : "";
          if (song.description && song.description.endsWith('.txt')) {
            fetch(song.description)
              .then(res => res.text())
              .then(text => {
                const lines = text.split('\n');
                description.innerHTML = lines.map(line => `<span>${line.trim()}</span>`).join('');
              })
              .catch(() => {
                description.textContent = "곡 소개를 불러오지 못했습니다.";
              });
          } else {
            description.innerHTML = (song.description || " ")
              .split('\n')
              .map(line => `<span>${line}</span>`)
              .join('');
          }

        // 가사 로드
        if (song.Lyrics && song.Lyrics.endsWith('.txt')) {
          fetch(song.Lyrics)
            .then(r => r.text())
            .then(text => {
              lyrics.innerHTML = text
                .split('\n')
                .map(l => `<span>${l.trim()}</span>`)
                .join('');
            });
        } else {
          lyrics.innerHTML = (song.Lyrics || "가사가 준비 중입니다.")
            .split('\n')
            .map(l => `<span>${l}</span>`)
            .join('');
        }

        // Firestore 메타
        currentSongKey = song.title.replace(/\s+/g, "_");
        const metaDoc = doc(db, "songMeta", currentSongKey);
        getDoc(metaDoc).then(snap => {
          likeCount.textContent = snap.exists() ? snap.data().likes || 0 : 0;
          commentList.innerHTML = "";
          if (snap.exists() && snap.data().comments) {
            snap.data().comments.forEach(c => {
              commentList.innerHTML += `<div>${c}</div>`;
            });
          }
        });
      }

      // 이전/다음 클릭
      prevBtn.addEventListener('click', () => loadSong(currentIndex - 1));
      nextBtn.addEventListener('click', () => loadSong(currentIndex + 1));

      // 최초 로드
      loadSong(0);

      // 좋아요
      likeBtn.addEventListener('click', async () => {
        if (!currentSongKey || localStorage.getItem(`liked_${currentSongKey}`)) return;
        const ref = doc(db, "songMeta", currentSongKey);
        await setDoc(ref, { likes: increment(1) }, { merge: true });
        const snap = await getDoc(ref);
        likeCount.textContent = snap.data().likes || 0;
        localStorage.setItem(`liked_${currentSongKey}`, "true");
      });

      // 감상평 등록
      submitComment.addEventListener('click', async () => {
        const text = commentInput.value.trim();
        if (!text) return;
        const ref = doc(db, "songMeta", currentSongKey);
        await setDoc(ref, { comments: arrayUnion(text) }, { merge: true });
        commentList.innerHTML += `<div>${text}</div>`;
        commentInput.value = "";
      });
    });
});

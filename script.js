setTimeout(() => {
  document.getElementById('intro-screen').style.display = 'none';
  document.getElementById('main-content').style.display = 'block';
}, 1800);

window.addEventListener('DOMContentLoaded', () => {
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

      songs.forEach((song, index) => {
        const item = document.createElement("div");
        item.className = "song-item";
        item.textContent = `${index + 1}. ${song.title}`;

        item.addEventListener("click", () => {
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

          // 📌 .txt 가사 파일 처리
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
        });

        list.appendChild(item);
      });

      const first = document.querySelector(".song-item");
      if (first) first.click();
    });
});

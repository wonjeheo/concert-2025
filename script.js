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
          members.innerHTML = `<strong>멤버 구성:</strong><br>${Object.entries(song.instruments).map(([k, v]) => `${k}: ${v}`).join('<br>')}`;
          duration.textContent = song.duration ? `곡 시간: ${song.duration}` : "";
          lyrics.textContent = song.Lyrics || "가사가 준비 중입니다.";
        });

        list.appendChild(item);
      });

      const first = document.querySelector(".song-item");
      if (first) first.click();
    });
});

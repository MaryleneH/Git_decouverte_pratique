/* ============================================================
 * films.js — mini-films de la séquence « Pourquoi Git ? »
 * Les <video> sont livrés sans src (data-src) et masqués : tant
 * que le fichier n'existe pas dans assets/video/, aucun lecteur
 * cassé et aucune requête inutile — le placeholder reste affiché.
 * Quand le fichier est présent, le bouton s'active : lecture
 * volontaire uniquement (pas d'autoplay), une seule vidéo à la
 * fois. Sans JavaScript, le placeholder statique suffit : tout le
 * contenu pédagogique est dans le texte.
 * ============================================================ */
(function () {
  "use strict";

  var films = document.querySelectorAll(".learning-film");
  if (!films.length || typeof fetch !== "function") return;

  var videos = [];

  films.forEach(function (film) {
    var video = film.querySelector(".learning-film__video");
    var btn = film.querySelector(".learning-film__placeholder");
    var status = film.querySelector('[data-role="status"]');
    if (!video || !btn) return;

    var src = video.getAttribute("data-src");
    if (!src) return;

    fetch(src, { method: "HEAD" })
      .then(function (res) {
        if (!res.ok) return;

        video.src = src;
        var poster = video.getAttribute("data-poster");
        if (poster) {
          fetch(poster, { method: "HEAD" })
            .then(function (p) { if (p.ok) video.poster = poster; })
            .catch(function () {});
        }

        film.classList.add("is-ready");
        btn.disabled = false;
        if (status) status.textContent = "Lancer le mini-film";
        videos.push(video);

        btn.addEventListener("click", function () {
          btn.hidden = true;
          video.hidden = false;
          var playing = video.play();
          if (playing && playing.catch) playing.catch(function () {});
          video.focus();
        });

        // Jamais deux mini-films en même temps
        video.addEventListener("play", function () {
          videos.forEach(function (other) {
            if (other !== video && !other.paused) other.pause();
          });
        });
      })
      .catch(function () {
        // Fichier absent ou hors ligne : le placeholder reste tel quel.
      });
  });
})();

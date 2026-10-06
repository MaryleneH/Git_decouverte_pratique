/* ============================================================
 * films.js — mini-films pédagogiques
 * Les <video> sont livrés sans src (data-src) et masqués.
 * - data-src relatif (fichier du dépôt) : une sonde HEAD vérifie
 *   que le fichier existe — tant qu'il est absent, aucun lecteur
 *   cassé et aucune requête inutile, le placeholder reste affiché.
 * - data-src absolu (https://…, film hébergé hors du site, S3…) :
 *   activation directe, sans sonde — un fetch HEAD cross-origin
 *   dépendrait de la politique CORS du serveur, alors que la
 *   lecture par la balise <video> n'en a pas besoin.
 * Quand le film est disponible, le bouton s'active : lecture
 * volontaire uniquement (pas d'autoplay), une seule vidéo à la
 * fois. Au clic, la lecture ne démarre pas immédiatement : le
 * film est d'abord mis en tampon (état « Chargement du film… »),
 * et ne se lance que lorsque le navigateur estime pouvoir le lire
 * sans interruption (canplaythrough) — avec un garde-fou de
 * quelques secondes pour ne jamais laisser l'utilisateur bloqué
 * sur un réseau lent. Sans JavaScript, le placeholder statique
 * suffit : tout le contenu pédagogique est dans le texte.
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

    function activate() {
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

      var loading = false;

      function reveal() {
        film.classList.remove("is-loading");
        btn.hidden = true;
        video.hidden = false;
        var playing = video.play();
        if (playing && playing.catch) playing.catch(function () {});
        video.focus();
      }

      btn.addEventListener("click", function () {
        if (loading) return;

        // Déjà assez de données en tampon (petit fichier, cache,
        // réseau rapide) : lecture immédiate, sans état d'attente.
        if (video.readyState >= 4 /* HAVE_ENOUGH_DATA */) {
          reveal();
          return;
        }

        // Sinon : on charge d'abord, on ne lit qu'une fois prêt.
        loading = true;
        film.classList.add("is-loading");
        if (status) status.textContent = "Chargement du film…";
        btn.setAttribute("aria-busy", "true");

        // Jauge réelle : à chaque événement progress, la part du
        // film déjà téléchargée (fin du tampon / durée totale)
        // alimente le libellé (« … 42 % ») et la barre du
        // placeholder (variable CSS). Si le navigateur ne fournit
        // pas l'info (durée inconnue, pas d'événements), la jauge
        // reste simplement absente — le spinner suffit.
        var lastPct = -1;
        function onProgress() {
          var pct;
          try {
            if (!isFinite(video.duration) || video.duration <= 0) return;
            if (!video.buffered.length) return;
            pct = Math.min(
              100,
              Math.round(
                (video.buffered.end(video.buffered.length - 1) /
                  video.duration) * 100
              )
            );
          } catch (e) {
            return;
          }
          if (pct === lastPct) return;
          lastPct = pct;
          film.classList.add("has-progress");
          film.style.setProperty("--gsd-film-progress", pct + "%");
          if (status) status.textContent = "Chargement du film… " + pct + " %";
        }

        var timer = null;
        var done = false;
        function start() {
          if (done) return;
          done = true;
          if (timer) clearTimeout(timer);
          video.removeEventListener("canplaythrough", start);
          video.removeEventListener("progress", onProgress);
          film.classList.remove("has-progress");
          btn.removeAttribute("aria-busy");
          reveal();
        }

        // canplaythrough : le navigateur estime pouvoir lire le
        // film jusqu'au bout sans pause de mise en tampon.
        video.addEventListener("canplaythrough", start);
        video.addEventListener("progress", onProgress);
        onProgress(); // données éventuellement déjà en tampon
        video.preload = "auto";
        if (video.readyState === 0) video.load();

        // Garde-fou : sur un réseau très lent, l'estimation peut
        // tarder — on lance quand même après 8 s plutôt que de
        // laisser l'utilisateur devant un spinner sans fin (la
        // mise en tampon continue pendant la lecture).
        timer = setTimeout(start, 8000);
      });

      // Jamais deux mini-films en même temps
      video.addEventListener("play", function () {
        videos.forEach(function (other) {
          if (other !== video && !other.paused) other.pause();
        });
      });
    }

    if (/^https?:\/\//i.test(src)) {
      activate();
      return;
    }

    fetch(src, { method: "HEAD" })
      .then(function (res) {
        if (res.ok) activate();
      })
      .catch(function () {
        // Fichier absent ou hors ligne : le placeholder reste tel quel.
      });
  });
})();

/* ============================================================
 * home-graph.js — décor « historique Git » de l'accueil
 * Clone le template présent uniquement sur la homepage et le
 * place en arrière-plan de la sidebar, sur desktop seulement.
 * Purement décoratif : aria-hidden, aucun événement, aucune
 * information pédagogique ne dépend de ce motif. L'animation
 * d'apparition est entièrement en CSS (_gitgraph.scss), donc
 * neutralisée par prefers-reduced-motion comme le reste du site.
 * ============================================================ */
(function () {
  "use strict";

  var tpl = document.getElementById("home-gitgraph-tpl");
  var sidebar = document.getElementById("quarto-sidebar");
  if (!tpl || !sidebar || !("content" in tpl)) return;

  // Sous 992 px, la sidebar devient un tiroir : pas de décor.
  if (!window.matchMedia("(min-width: 992px)").matches) return;

  var art = tpl.content.firstElementChild;
  if (!art) return;

  sidebar.classList.add("gg-host");
  sidebar.insertBefore(art.cloneNode(true), sidebar.firstChild);
})();

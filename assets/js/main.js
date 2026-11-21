/* devgnc.github.io — language, theme and video controls.
   The initial language and theme are applied by a tiny inline script in <head>
   (before first paint); this file wires up the buttons. */
(function () {
  "use strict";

  var root = document.documentElement;

  // localStorage can throw (private mode, blocked storage): fail silently.
  function store(key, value) {
    try {
      if (value === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (e) { return null; }
    return null;
  }

  /* ---------- Language ---------- */
  function applyLang(lang) {
    root.lang = lang;

    // Page title
    var title = root.getAttribute("data-title-" + lang);
    if (title) document.title = title;

    // Translated attributes: data-i18n="alt aria-label" + data-alt-en / data-alt-fr …
    var els = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < els.length; i++) {
      var attrs = els[i].getAttribute("data-i18n").split(/\s+/);
      for (var j = 0; j < attrs.length; j++) {
        var v = els[i].getAttribute("data-" + attrs[j] + "-" + lang);
        if (v !== null) els[i].setAttribute(attrs[j], v);
      }
    }

    var btns = document.querySelectorAll("[data-set-lang]");
    for (var k = 0; k < btns.length; k++) {
      btns[k].setAttribute("aria-pressed", btns[k].getAttribute("data-set-lang") === lang ? "true" : "false");
    }
    updateThemeLabel();
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("[data-set-lang]") : null;
    if (!btn) return;
    var lang = btn.getAttribute("data-set-lang");
    store("lang", lang);
    applyLang(lang);
  });

  /* ---------- Theme ---------- */
  var themeBtn = document.querySelector("[data-theme-toggle]");
  var themeLabels = {
    en: { light: "Switch to dark theme", dark: "Switch to light theme" },
    fr: { light: "Passer au thème sombre", dark: "Passer au thème clair" }
  };

  function currentTheme() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function updateThemeLabel() {
    if (!themeBtn) return;
    var lang = root.lang === "fr" ? "fr" : "en";
    var label = themeLabels[lang][currentTheme()];
    themeBtn.setAttribute("aria-label", label);
    themeBtn.setAttribute("title", label);
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0E1116" : "#F7F6F2");
    updateThemeLabel();
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      store("theme", next);
      applyTheme(next);
    });
  }

  // Follow the system setting until the visitor picks a theme themselves.
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onChange = function (ev) {
      if (store("theme") === "light" || store("theme") === "dark") return;
      applyTheme(ev.matches ? "dark" : "light");
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* ---------- Looping videos (pause button, reduced motion) ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var medias = document.querySelectorAll(".media");

  for (var m = 0; m < medias.length; m++) {
    (function (box) {
      var video = box.querySelector("video");
      var toggle = box.querySelector(".media-toggle");
      if (!video || !toggle) return;

      function setPaused(paused) {
        box.classList.toggle("is-paused", paused);
        toggle.setAttribute("aria-pressed", paused ? "true" : "false");
      }

      if (reduceMotion) {
        video.removeAttribute("autoplay");
        video.pause();
        setPaused(true);
      } else {
        setPaused(video.paused && !video.autoplay);
      }

      toggle.addEventListener("click", function () {
        if (video.paused) {
          var p = video.play();
          if (p && p.catch) p.catch(function () {});
          setPaused(false);
        } else {
          video.pause();
          setPaused(true);
        }
      });
    })(medias[m]);
  }

  applyLang(root.lang === "fr" ? "fr" : "en");
  applyTheme(currentTheme());
})();

# devgnc.github.io

Personal portfolio of Devrim Genc — data / BI projects. Live at **https://devgnc.github.io**.

Plain HTML, CSS and JavaScript: no build step. GitHub Pages serves the `main` branch as is.

## Structure

```
index.html                  home: intro, internship goal, projects, about, skills, contact
projects/heat-diffusion.html
projects/ter-reliability.html
projects/sov2242.html
404.html
assets/css/style.css        all styles; light / dark tokens at the top
assets/js/main.js           language switch, theme switch, video pause button
assets/fonts/               IBM Plex Sans / Mono, self-hosted (SIL Open Font License)
assets/img/                 WebP images and posters
assets/video/               short MP4 + WebM loops
assets/cv/devrim-genc-cv.pdf
```

## Editing content

**Two languages.** Every translated piece of text exists twice, side by side:

```html
<p data-lang="en">English text</p>
<p data-lang="fr">Texte français</p>
```

CSS shows only the active language (`html[lang]`). English is the default and stays visible without JavaScript. The visitor's choice is saved in `localStorage`.

Translated attributes (`alt`, `aria-label`, meta `content`) use `data-i18n` plus one attribute per language:

```html
<img alt="…" data-i18n="alt" data-alt-en="English alt" data-alt-fr="Texte alternatif">
```

**Two themes.** Colours are CSS variables in `:root` (light) and `html[data-theme="dark"]`. The first visit follows the system setting; the toggle saves the choice.

**Videos.** Each loop sits in a `.media` block with its own pause button and does not autoplay when the visitor has asked for reduced motion. Provide both WebM and MP4, plus a WebP poster.

## Local preview

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Sources

Every figure comes from the project repositories:
[fractal-heat-diffusion](https://github.com/devGnc/fractal-heat-diffusion) ·
[ter-hauts-de-france-reliability](https://github.com/devGnc/ter-hauts-de-france-reliability) ·
SOV2242 (private).

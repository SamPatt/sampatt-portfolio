// Registry for sampatt.com/animations. One entry per animation; newest first.
//
// To add an animation (see also AGENTS.md, "Animations"):
//   1. The poster image goes in the `media` repo under animations/<date>-<slug>/ (served by jsDelivr).
//      Use a new filename for every re-render: jsDelivr caches @main for days. No video files on the site.
//   2. The interactive player goes in public/media/animations/<slug>/player.html with its data and audio.
//      /animations/<slug> shows it full screen, outside the site layout.
//   3. Add an entry below. The hub card is generated from it.
//   4. Add /animations/<slug> to public/sitemap.xml.

const MEDIA = import.meta.env.VITE_MEDIA_BASE ?? 'https://cdn.jsdelivr.net/gh/sampatt/media@main';

const animations = [
  {
    slug: 'satellites',
    title: 'Every Satellite Ever Launched',
    date: '2026-11-25',
    duration: '1:30',
    summary:
      'From Sputnik to Starlink. Every payload ever put into orbit fills one cell on the screen, at the rate it was launched.',
    poster: `${MEDIA}/animations/2026-11-25-satellites/satellites-poster-v10.jpg`,
    player: '/media/animations/satellites/player.html',
  },
];

export default animations;

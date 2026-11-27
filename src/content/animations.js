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
    slug: 'dday',
    title: 'D-Day: The American Beaches',
    date: '2026-11-27',
    duration: '1:17',
    summary:
      'Every man, vehicle and ton of supplies landed at Omaha and Utah, day by day through June 1944, storm and all.',
    poster: `${MEDIA}/animations/2026-11-27-dday/dday-poster-v3.jpg`,
    player: '/media/animations/dday/player.html',
  },
  {
    slug: 'liberty',
    title: 'Liberty Ships vs U-boats',
    date: '2026-11-26',
    duration: '1:19',
    summary:
      'Every ship a U-boat sank, every Liberty ship America built, every U-boat destroyed. The Battle of the Atlantic, one dot at a time.',
    poster: `${MEDIA}/animations/2026-11-26-liberty/liberty-poster-v7.jpg`,
    player: '/media/animations/liberty/player.html',
  },
  {
    slug: 'titanic',
    title: "The Titanic's Lifeboats",
    date: '2026-11-25',
    duration: '1:11',
    summary:
      'Every lifeboat, every seat, everyone aboard. How empty the first boats left, and who got a place in them.',
    poster: `${MEDIA}/animations/2026-11-25-titanic/titanic-poster-v7.jpg`,
    player: '/media/animations/titanic/player.html',
  },
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

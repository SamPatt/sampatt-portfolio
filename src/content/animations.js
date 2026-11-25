// Registry for sampatt.com/animations. One entry per animation; newest first.
//
// To add an animation (see also AGENTS.md, "Animations"):
//   1. Video + poster go in the `media` repo under animations/<date>-<slug>/ (served by jsDelivr).
//      Use a new filename for every re-render: jsDelivr caches @main for days.
//   2. The interactive player (optional) goes in public/media/animations/<slug>/player.html with its data.
//   3. Add an entry below. The hub card and the /animations/<slug> page are generated from it.
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
    video: `${MEDIA}/animations/2026-11-25-satellites/satellites-v10.mp4`,
    poster: `${MEDIA}/animations/2026-11-25-satellites/satellites-poster-v10.jpg`,
    player: '/media/animations/satellites/player.html',
    reading: [
      'Each cell in the background is one satellite, filled in launch order. The clock runs at a constant rate, so the speed of the fill is the real launch rate.',
      'Red cells are Starlink. Each decade, and from 2020 each year, closes into its own labelled block.',
      'The map shows every launch from its launch site, with running totals per site. The blocks under the map are the countries that launch satellites, in the order they first did.',
      'The clock pauses twice: for Sputnik 1 in 1957, with its original radio beeps, and for the first batch of 60 Starlink satellites in 2019.',
    ],
    notes: [
      'Satellite counts are payloads (not rocket bodies or debris) from Jonathan McDowell\'s General Catalog of Artificial Space Objects, 27,602 of them through 30 June 2026. Later launches are not yet fully catalogued.',
      'Countries are credited by the agency that ran the launch. Europe includes ESA and Arianespace (Ariane and Vega); New Zealand is Rocket Lab\'s Electron.',
    ],
    sources: [
      { label: 'GCAT, J. McDowell (CC-BY)', url: 'https://planet4589.org/space/gcat/' },
      { label: 'Sputnik 1 recording, NASA (public domain)', url: 'https://commons.wikimedia.org/wiki/File:Sputnik_beep.ogg' },
    ],
  },
];

export default animations;

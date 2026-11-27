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
    slug: 'earthquakes',
    title: 'Every Big Earthquake Since 1900',
    date: '2026-11-27',
    duration: '1:48',
    summary:
      'Every earthquake of magnitude 6 or more since 1900, and how much of all that energy came from a handful of giants.',
    poster: `${MEDIA}/animations/2026-11-27-earthquakes/earthquakes-poster-v1.jpg`,
    player: '/media/animations/earthquakes/player.html',
  },
  {
    slug: 'space-travellers',
    title: 'Everyone Who Has Been to Space',
    date: '2026-11-27',
    duration: '1:48',
    summary:
      'Everyone who has flown to space, country by country, from Gagarin on, with every name listed as they launch.',
    poster: `${MEDIA}/animations/2026-11-27-space-travellers/space-travellers-poster-v1.jpg`,
    player: '/media/animations/space-travellers/player.html',
  },
  {
    slug: 'exoplanets',
    title: 'Every Planet Found Beyond the Sun',
    date: '2026-11-27',
    duration: '1:57',
    summary:
      'Every planet found around another star, placed on the night sky where its star sits, from a trickle in the 1990s to the Kepler flood.',
    poster: `${MEDIA}/animations/2026-11-27-exoplanets/exoplanets-poster-v1.jpg`,
    player: '/media/animations/exoplanets/player.html',
  },
  {
    slug: 'hurricanes',
    title: 'Every Atlantic Storm Since 1851',
    date: '2026-11-27',
    duration: '1:47',
    summary:
      'Every Atlantic storm since 1851, track by track, with the deaths of the worst from Galveston to Mitch.',
    poster: `${MEDIA}/animations/2026-11-27-hurricanes/hurricanes-poster-v1.jpg`,
    player: '/media/animations/hurricanes/player.html',
  },
  {
    slug: 'tornadoes',
    title: 'Every American Tornado Since 1950',
    date: '2026-11-27',
    duration: '1:54',
    summary:
      'Every tornado recorded in the United States since 1950, each track drawn at its real length, and the outbreaks that killed the most.',
    poster: `${MEDIA}/animations/2026-11-27-tornadoes/tornadoes-poster-v1.jpg`,
    player: '/media/animations/tornadoes/player.html',
  },
  {
    slug: 'rocket-launches',
    title: 'Every Rocket That Tried for Orbit',
    date: '2026-11-27',
    duration: '1:40',
    summary:
      'Every rocket launched toward orbit, where each one flew and where the failures fell, from Sputnik to the Falcon era.',
    poster: `${MEDIA}/animations/2026-11-27-rocket-launches/rocket-launches-poster-v1.jpg`,
    player: '/media/animations/rocket-launches/player.html',
  },
  {
    slug: 'everest',
    title: 'Every Summit of Everest',
    date: '2026-11-27',
    duration: '1:42',
    summary:
      'Every person who has stood on top of Everest, day by day, from 1953 to the crowded spring seasons of today.',
    poster: `${MEDIA}/animations/2026-11-27-everest/everest-poster-v1.jpg`,
    player: '/media/animations/everest/player.html',
  },
  {
    slug: 'chicago-1918',
    title: 'Chicago, Autumn 1918',
    date: '2026-11-27',
    duration: '1:41',
    summary:
      'The 1918 flu in Chicago, death by death through the autumn wave. A bell rings for every hundred.',
    poster: `${MEDIA}/animations/2026-11-27-chicago-1918/chicago-1918-poster-v1.jpg`,
    player: '/media/animations/chicago-1918/player.html',
  },
  {
    slug: 'lewis-and-clark',
    title: "Lewis and Clark, Every Night's Camp",
    date: '2026-11-27',
    duration: '1:50',
    summary:
      "Every night's camp of the Corps of Discovery, from St. Louis to the Pacific and back, 1804 to 1806.",
    poster: `${MEDIA}/animations/2026-11-27-lewis-and-clark/lewis-and-clark-poster-v1.jpg`,
    player: '/media/animations/lewis-and-clark/player.html',
  },
  {
    slug: 'dday',
    title: 'D-Day: The American Beaches',
    date: '2026-11-27',
    duration: '1:17',
    summary:
      'Every man, vehicle and ton of supplies landed at Omaha and Utah, day by day through June 1944, storm and all.',
    poster: `${MEDIA}/animations/2026-11-27-dday/dday-poster-v4.jpg`,
    player: '/media/animations/dday/player.html',
  },
  {
    slug: 'liberty',
    title: 'Liberty Ships vs U-boats',
    date: '2026-11-26',
    duration: '1:19',
    summary:
      'Every ship a U-boat sank, every Liberty ship America built, every U-boat destroyed. The Battle of the Atlantic, one dot at a time.',
    poster: `${MEDIA}/animations/2026-11-26-liberty/liberty-poster-v8.jpg`,
    player: '/media/animations/liberty/player.html',
  },
  {
    slug: 'titanic',
    title: "The Titanic's Lifeboats",
    date: '2026-11-25',
    duration: '1:11',
    summary:
      'Every lifeboat, every seat, everyone aboard. How empty the first boats left, and who got a place in them.',
    poster: `${MEDIA}/animations/2026-11-25-titanic/titanic-poster-v8.jpg`,
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

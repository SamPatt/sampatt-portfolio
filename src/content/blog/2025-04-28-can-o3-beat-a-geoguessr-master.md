---
title: o3 Beats a Master-Level Geoguessr Player—Even with Fake EXIF Data
description: In Which I Try to Maintain Human Supremacy for a Bit Longer
tags:
  - AI
  - artificial-intelligence
  - geoguessr
  - geography
image: >-
  https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-27-19-41.png
send_newsletter: 'false'
type: blog
last_edited: 2025-05-02T15:03:35.000Z
created: 2025-04-28T08:34:44.000Z
---
*Update: Hello HN, MR, and ACX folks! Two quick updates:*

1. *Many comments suggested it was unfair that the o3 model used search in 2 / 5 rounds. I ran those two rounds over again, in a Temporary Chat as before, and ensured they didn't employ search. The results were nearly identical, as you can verify in the updated post.*
2. *I'm unemployed and would love to not be unemployed. If you have a project involving map data - or frankly just anything interesting - send me an email.*

*Update 2: The [map](https://www.geoguessr.com/challenge/gDq4wXvsLU3oNuY8) has now been played by 175 players! o3 is currently holding strong in 13th place.*

*Update 3: ccmdi wrote an informative [blog post](https://ccmdi.com/blog/additional-thoughts-on-llm-geolocation) about the current state of LLM geolocation - they've also created a neat LLM [geolocation benchmark](https://geobench.org/).*

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-29-21-50.png)


# TL;DR

In a head-to-head Geoguessr match, OpenAI’s o3 model out-scored me—a Master I–ranked human—23,179 to 22,054, correctly identifying all five countries and twice landing within a few hundred metres. Even when I embedded fake GPS coordinates in the image EXIF, the model ignored the spoof and still pinpointed the real locations, showing its performance comes from visual reasoning and on-the-fly web sleuthing—not hidden metadata.
# Background
  
Simon Willison made a [post to Hacker News](https://news.ycombinator.com/item?id=43803243) a few days ago about the surprising geolocation ability of the o3 model. He fed it some images, and it was able to guess the location remarkably well.

I left a comment based on my opinion as a Geoguessr player:

> I play competitive Geoguessr at a fairly high level, and I wanted to test this out to see how it compares.
> 
> It's astonishingly good.
> 
> It will use information it knows about you to arrive at the answer - it gave me the exact trailhead of a photo I took locally, and when I asked it how, it mentioned that it knows I live nearby.
> 
> However, I've given it vacation photos from ages ago, and not only in tourist destinations either. It got them all as good or better than a pro human player would. Various European, Central American, and US locations.
> 
> The process for how it arrives at the conclusion is somewhat similar to humans. It looks at vegetation, terrain, architecture, road infrastructure, signage, and it just knows seemingly everything about all of them.
> 
> Humans can do this too, but it takes many thousands of games or serious study, and the results won't be as broad. I have a flashcard deck with hundreds of entries to help me remember road lines, power poles, bollards, architecture, license plates, etc. These models have more than an individual mind could conceivably memorize.

The post and my comment did very well on HN, and provoked some interesting discussion, leading to Simon creating a [short post](https://simonwillison.net/2025/Apr/26/geoguessr/) highlighting my input.

Many people shared the same experiences that Simon and I had, being astounded by how well the models performed. But there were two threads of opposition running through the comments:

1. The models were faking their chain of thought output and only reading the EXIF location data (AKA they're tricking us).
2. The models aren't actually that good at doing this, we cherry picked or otherwise just got lucky.

It's absolutely true that the models will use EXIF data if it's available, and may not tell you that. In fact, they'll use any information they have. I shared a story where this happened to me:

> I was a part of an AI safety fellowship last year and our project was creating a benchmark for how good AI models are at geolocation from images. [This is where my Geoguessr obsession started!]
> 
> Our first run showed results that seemed way too good; even the bad open source models were nailing some difficult locations, and at small resolutions too.
> 
> It turned out that the pipeline we were using to get images was including location data in the filename, and the models were using that information. Oops.

However, the EXIF issue was completely overblown. I only used screenshots in my tests, which have no metadata, and o3 did incredibly well.

But several comments intrigued me:

>You should also see how it fares with incorrect EXIF data. For example, add EXIF data in the middle of Times Square to a photo of a forest and see what it says.

>I think an alternative possible explanation is it could be "double checking" the meta data. Like provide images with manipulated meta data as a test.

>I wonder What happened if you put fake EXIF information and asking it to do the same. ( We are deliberately misleading the LLM )

Hmm... interesting idea.

So to test out the EXIF question, and to prove the geoguessing capabilities of the model definitively, I did a head-to-head test against a Master I level Geoguessr player - me!

# My Skill

To clarify, I'm no Rainbolt or Zi8gzag. Those are _professional_ Geoguessr players, full-time content creators who've been playing for years.

Geoguessr has a division ranking system based on ELO, and those guys are all in the top division, Champion. Below that in descending order are Master I & II; Gold 1, 2, 3; Silver 1, 2, 3; and Bronze. 

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-27-22-51.png)

I'm Master I, trying to grind into the Champions division. My highest ELO was 1188 - currently Champion ELO starts in the ~1230 range. Basically, I'm a master - not an IM or a GM.

I know enough to judge the model's capabilities, and to see if the chain of thought reasoning it puts out makes sense, or is just nonsense. For the reader's sake, I'll explain my own chain of thought for my guesses as well, so you can see how they line up.

## How I tested

* **Map & seed** — A Community World map, seed  
  `gDq4wXvsLU3oNuY8` ([play it yourself](https://www.geoguessr.com/challenge/gDq4wXvsLU3oNuY8)).
* **Mode** — *No Move*. I saw the full Street-View panorama; o3 saw exactly two 90° screenshots (start + opposite direction) 
* **Browsing/tools** — o3 had normal web access enabled. No EXIF in the PNGs; for the spoof test I zipped the file so the metadata survived upload.
* **Scoring** — Standard Geoguessr 0–5,000 points per round, total out of 25,000.


The o3 model's outputs can be very lengthy, and this post would get way too long if I included them all, so I'm embedding them individually as notes, and you can read them as you please. Note that the CoT reasoning also includes images as shown below, but I'm not including them to save space (it creates a lot of cropped images).

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-27-20-13.png)


I'm also using Temporary Chat mode, to ensure that any previous conversations won't impact the guessing.


# The Battle

## Round 1 - Bulgaria

### Human

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-27-17-26.png)

First thought is Europe or Turkey. I then zoom into this pole and the roofs behind it.

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-27-17-37.png)

I'm 99% sure it's Bulgaria now. You see these real tile roofs everywhere, and the concrete poles with upward hooks are typical too.

I scan around and confirm. Now that I've got the country, I begin thinking about the region guess. The obvious information is the terrain and the architecture - fairly large hills, somewhat southern architecture.

I scan the map quickly and find a decent spot and plonk down my marker.
### o3

**Thought for 2m 39s**

{{note:o3-geoguessr-test-round-1-cot}}

**Southern Bulgaria – the small Rhodope-mountain town of Zlatograd, in Smolyan Province.**

### Result

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-27-18-49.png)

I was closer, but not much, I only have a ~100 point lead. Still, I'm feeling like I'm off to a good start.

## Round 2 - Austria

### Human

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-27-17-54.png)

First thought - obvious Europe. The architecture looks Swiss or Austrian, and only a second later I see the domain name on the rear of the car ending in .at - that's a bit too easy! How will the model use that domain?

Region guessing Austria is difficult for me, basically I just look to see if I'm in the mountains or not. There are some hills around, but they aren't the huge mountains. I guess on the eastern side of the country, away from the Alps but still in the hills.

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-27-17-59.png)
Oh no! It's as far west in Austria as you can get. There's a flatter section there near the Swiss and German borders. I'm 381 km away, giving o3 an opportunity - will it capitalize on it?


### o3 - with search

_[I forgot to copy the CoT from this round, and it's a Temporary Chat so it's gone, oops.]_

My best shot: **Dornbirn, Vorarlberg, Austria — roughly 47.41 N 9.73 E (a residential side-street a few blocks north-east of the town centre).**

### Why I landed there

| Clue                                                                            | What it told me                                                                                                                                                                       |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mountain backdrop                                                               | Steep, forested Alp with a sharp west ridge – looks exactly like the Karren/Kapf massif that looms just east of Dornbirn in the Rhine valley.                                         |
| Architecture                                                                    | Mix of **Bregenzerwald-style** timber barns and the red-and-white “Rheintaler Riegelhaus” that’s endemic to northern Vorarlberg; not typical for neighbouring Switzerland or Germany. |
| Street furniture                                                                | Austrian-style blue street-name plates; small red-on-white house-number plaques (standard across Vorarlberg); E-type (EU) traffic signs.                                              |
| The taxi                                                                        | Rear window decal clearly reads **“www.taxilinder.at”**. A quick lookup shows _Taxi Linder GmbH_ is based in **Dornbirn, Vorarlberg**.                                                |
| Licence-plate blur                                                              | Austrian format (but too blurry to read the district code).                                                                                                                           |
| Flat valley street with the mountain dominating the **east-south-east** horizon | Exactly the perspective you get from Dornbirn’s northern residential quarters (Hatlerdorf / Ried / Wallenmahd).                                                                       |

Putting those together, Dornbirn is by far the tightest match. If I had to drop a pin, I’d place it within a couple of hundred metres of Wallenmahd / Riedgasse, just north of the Ache river.

### Result

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-27-18-55.png)


Uh oh.... it nailed it. It would have gotten the 5k too, since it said only a few hundred meters north of the river, and I guessed a bit further than that when I dropped the pin. Ouch. 

It also visited the domain in order to get more information. Using Google during rounds is technically cheating - I'm unsure about visiting domains you find during the rounds though. It certainly violates the spirit of the game, but it also shows the models are smart enough to use whatever information they can to win.

_Update: When I ran it again without search, it used the mountain outline to find the town anyway, see the image below. Search wasn't needed at all!_

Now o3 has a 800 point lead on me. I need a good round!

### o3 - without search

{{note:o3-geoguessr-battle-austria-without-search}}

[Author - this image says it all:]

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-29-16-08.png)


I’m putting us in **Dornbirn, Vorarlberg, Austria – about 47.41 ° N, 9.74 ° E, just east of the town centre**.

**Why Dornbirn?**

|Clue|What it suggests|
|---|---|
|**“.at” web address on the driving-school VW**|Austria|
|**German on the delivery van (“Fach-/Fahrmontage …”)**|German-speaking region|
|**Vertical-board timber houses with deep, carved balconies**|Classic Bregenzerwald / Vorarlberg style rather than Tyrolean stucco or Swiss Appenzell paintwork|
|**Red–white no-stopping signs, metric road markings**|Continental Europe, EU standard signage|
|**Triangular peak with a lower shoulder just to the right**|Looks like the Staufen–Karren duo that rises immediately east of Dornbirn in the Rhine Valley|
|**Flat valley floor but high mountains only a couple of km away**|Matches the Dornbirn basin, not Innsbruck or Salzburg which have broader valley floors|
|**Mix of modern infill and turn-of-the-century villas**|Typical of the residential belts (e.g., Hatlerdorf/Haselstauden) around central Dornbirn|

Put together, the architectural dialect, the Austrian domain, and that very recognizable mountain profile make Dornbirn the best fit.

## Round 3 - Ireland

### Human

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-27-18-02.png)

First thought - Ireland. Dashed yellow outside lines are very rare, and with this terrain and a white EU plate, it's 100% Ireland.

Open ocean to the west, but distant land across the water to the NW and maybe an island SW?

I line up the road angle and check the map, looking on the west coast of Ireland for some islands that make sense.  I spend several minutes scanning, because this is a lot of information, I might be able to get a 5k on this round. 

### o3 - with search

{{note:o3-geoguessr-battle-round-3}}

That​ stark grey limestone, the endless low dry-stone walls, and the yellow dashed line that marks the left-hand shoulder on Irish roads are dead giveaways: you’re in **the Burren, County Clare, Ireland**.  
More precisely, the view is from the **R477 “Coast Road” between Fanore and Ballyvaughan, just south-east of Black Head**, looking across Galway Bay toward the hills of Connemara.

Approximate pin: **53.120 °N, -9.285 °W**.

### o3 - without search

{{note:o3-geoguessr-ireland-without-search}}

**Short answer –** the viewpoint is on the R 477 “coast road” that skirts the limestone karst of **the Burren, County Clare, Ireland – roughly the Black Head/Fanore stretch on the edge of Galway Bay (about 53.13 N, –9.30 W).**

---

### How I got there

|Clue|What it tells us|Why it fits the Burren coast|
|---|---|---|
|**Road markings** – a single white centre-line, with a broken **yellow** line at the road edge.|Yellow edge lines are distinctive to the Republic of Ireland (left-hand traffic).|UK edge lines are white; continental Europe rarely uses yellow in this pattern.|
|**Left-hand‐side parking** and vehicles facing both ways.|Confirms left-hand traffic but Google car happens to be travelling the opposing lane (so the yellow edge line appears on its right).|Consistent with Ireland; Street View often records one direction only.|
|**Drystone walls made of flat, grey limestone slabs**; low, terraced, almost pavement-like outcrops on the hillside.|Classic Burren karst geology.|You see identical walls and limestone pavements between Ballyvaughan and Fanore.|
|**Barren, stepped limestone hillside on one side, open sea on the other.**|Narrow shelf road on a coastal plateau.|The R477 is literally wedged between Galway Bay and the Burren escarpment.|
|**Sparse vegetation – mostly grykes filled with grass and a few low shrubs.**|Karst environment with thin soils.|The Burren’s ecology is famous for exactly this mix.|
|**No hard shoulder, occasional gravel lay-bys where tourists stop.**|Popular scenic route but still a regional road (an “R” road).|The R477 is marketed as part of the Wild Atlantic Way; these gravel pull-offs exist every kilometre or so.|
|**Vehicles & plates** – EU-style, but not yellow (so not UK), and a bright yellow Post/parcel van that isn’t Royal Mail.|Republic of Ireland uses white plates and has several yellow courier fleets.|Again points to ROI rather than NI.|

Put all that together and the only coastal road in Ireland that matches the stone-walled, treeless limestone landscape right down to the water is the Burren coast. The specific curve, with the sea to the north-west and the hillside to the south-east, matches the section just west of Black Head lighthouse, before Fanore beach.

### Result

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-27-19-06.png)

**Seriously?** That's just outrageous. How can it possibly do that? I thought for sure I had this round, I was only 10km away!

The chain of thought is insanely thorough, looking at the road lines, cars, license plates, rocks, water, everything. But here's another trick it uses:

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-27-19-10.png)

More web search! It's cheating, but it's also prospering. I don't want to overstate the web search though - it only knew to search those particular terms first because it properly identified everything in the CoT first. It appears to have used search more to confirm its guess than to generate it.

_Update: As I suspected, search was irrelevant here. It guessed almost identically._

## Round 4 - Colombia

### Human

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-27-18-13.png)

First thought - South America. Road lines look Brazilian, but then I notice the license plates. They're all yellow, which means it's almost certainly Colombia.

I scan some more, and find the classic Colombian cross on the back of this sign.

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-27-18-14.png)

It's very flat here, which is unusual in Colombia, so it narrows it down quite a bit. It's likely either east of the Andes mountain range, or it's coastal. I see quite a few palm trees, and there's lighter / sandy dirt, so I'm leaning towards coastal.

### o3

{{note:o3-geoguessr-battle-round-4-cot}}

This looks like rural Colombia—specifically the hot, low-lying Caribbean-plain corridor that carries Ruta 25 / the Troncal de Occidente between Sincelejo and Caucasia.

Key clues I’m using

|Clue|What it tells me|
|---|---|
|Yellow-on-black license plates (all vehicles)|Colombia (Ecuador also uses yellow, but the typography and plate size here are Colombian).|
|Red banner on the shop roof reading **“Águila Roja”**|That’s a Colombian coffee brand you see on roadside tiendas country-wide.|
|The small green inflatable tent printed **“miNegocio”** and ringed with yellow five-point icons|That’s the Prosperidad Social “Mi Negocio” micro-enterprise program; it tours Colombia’s northern departments.|
|Road markings: double solid yellow centre, white edge line with occasional dashes|Matches INVÍAS standard for Colombia’s two-lane primary highways.|
|Vegetation & architecture|Lowland tropical dry forest / cattle country—typical of northern Bolívar, Sucre and Córdoba.|
|Continuous line of fuel-tankers and containers in the second frame|Classic queue before the Puente San Jorge or a peaje (toll) on Ruta 25.|

Put together, the scene fits the chain of little workshops and comedor stalls that flank **Ruta 25 just west of Planeta Rica, Córdoba Department**—roughly **8.4 ° N, -75.6 ° W**.

That’s my best pin.

### Result

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-27-19-24.png)


Beaten again. It turns out there's a flat section just west of the Andes much further south than I guessed.

Also, in the CoT o3 mentions a town further down the main road and closer to the location, but in the summary it chooses a different town for some reason.

It now leads by ~1,300 points heading into the final round.

## Final round - Slovakia

### Human

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-27-18-23.png)

First thought - Europe, central or eastern.

Zooming in, I see a bollard:

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-27-18-24.png)

These are only found in Czechia or Slovakia. This terrain is flat but with mountains in the distance, which could be either country. I scan around, and see a road sign.

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-27-18-26.png)

It's quite difficult to read. Could it say Kosice? I know that's in Slovakia. We're heading west on this road and it's 25km away.

I see there's another city starting with H that's only 16km, I should be able to scan the map and look for the in-between city to confirm. But I can't find it! 

I'm a bit afraid to guess Kosice, because it's so far east - if it's wrong, especially if it's Czechia, then I'm in trouble. I choose to hedge instead, placing my marker in east Czechia.

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-27-18-32.png)
The wrong decision! I now see my mistake - it wasn't an H I was seeing, it was an M for the city of Michalovce. Will the model be able to read that sign?

I need to be closer here, or o3 will win.
### o3

{{note:o3-geoguessr-battle-round-5-cot}}

**Guess: rural southwestern Slovakia – the Danubian lowlands, on national road 63 a few kilometres east-southeast of Šamorín (≈ 48.03 N, 17.40 E).**

### Why that’s my pick

|Clue|What it suggests|Match here|
|---|---|---|
|**Road furniture**|The white guide-post with a thick black band and two small orange reflectors is the standard Slovak post (Czech posts use red/white circles instead).|✔ Seen in the second shot|
|**Bus-stop sign**|Slovakia (and only a handful of neighbours) uses a _blue square with a yellow border_ for bus stops.|✔ Clear in the first image|
|**Edge/centre markings**|Slovak main roads often have a dashed auxiliary line inside the carriageway plus the classic long-dash centre line. Hungary normally uses solid edge lines; Czechia usually omits the interior dashed line.|✔ Pattern matches Slovakia|
|**Warning sub-plate**|The “↕ 3 km ↕” format and font match Slovak design guidelines word-for-word.|✔ Under the deer-crossing sign|
|**Landscape**|Flat, intensively farmed fields with an occasional centre-pivot irrigator, dotted tree lines, and low hills far to the north – textbook Žitný ostrov / Danube floodplain scenery.|✔ Exactly what’s in frame|
|**Guard-rail colour**|The little blue hand-rail on the side track is common on minor Slovak bridges/culverts and rare elsewhere.|✔ Visible left in the first shot|

Taken together, those push very strongly toward Slovakia, and the terrain fits the stretch of road 63 that runs from Šamorín toward Dunajská Streda. The faint ridgeline on the horizon lines up with the Little Carpathians north-west of that point.

So while I can’t drop a pin to the metre, I’d put us on **road I/63 just past the three-way junction by the hamlet of Kľúčovec, Dunajská Streda district** – give or take a kilometre.

### Result

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-27-19-39.png)

It got the correct country - in fact it got all five countries correct - but it was actually slightly further away, since it chose the max southwest and my hedge was a bit closer.

Still, I only gained a handful of points in that round, and needed a lot more to win.

# Results

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-27-18-34.png)

I got 22,054 points out of a possible 25k. For a completely random seed, this is a good score for me, I got 4,000+ each time (ok, the Colombia guess was 3,983 - close enough!). My average score on this map is closer to 18k. This is likely because 4 out of 5 rounds were in Europe, which is often easier to guess than more rural and less developed areas.

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-04-26-geoguessr/image/2025-04-27-19-41.png)

|       Rnd | Country  | Human dist (km) | o3 dist (km) |  Human pts |     o3 pts | o3 used web?            |
| --------: | -------- | --------------: | -----------: | ---------: | ---------: | :---------------------- |
|         1 | Bulgaria |          **54** |           63 |  **4 856** |      4 755 | No                      |
|         2 | Austria  |             381 |      **0.4** |      3 336 |  **4 999** | **Yes** (domain lookup) |
|         3 | Ireland  |          **10** |          1.2 |  **4 984** |      4 997 | Yes (confirm)           |
|         4 | Colombia |             298 |       **82** |      3 983 |  **4 699** | No                      |
|         5 | Slovakia |         **173** |          265 |  **4 895** |      4 729 | No                      |
| **Total** |          |                 |              | **22 054** | **23 179** |                         |

*(Bold = per-round winner)*

o3 scored 23,179, beating me by just over 1,100 points. A truly impressive performance.

I won rounds 1 and 5, but only by small margins, and it got two ~5k guesses. On both of those rounds, it did use search. [_Update: Search ended up not mattering in those rounds, see the round details above._] However it still beat me in round 4 without search.

One major difference is time spent. I would typically guess within a minute or two, and in many rounds I will guess within 10 seconds. The model would nearly always take more than 2 minutes, and the longest was over 6 minutes! So humans still have the edge when it comes to speed, at the moment.

Remember, this is with only two screenshots per round. No metadata, no prompt engineering, just two .png files - not even zoomed in!


# EXIF spoofing

It turns out, this isn't as simple as it seems.

I initially used the `exiftool` to swap out the metadata from genuine images with GPS data into my screenshots.

Unfortunately, the models didn't notice the EXIF data. They couldn't see it at all. I asked them about it, and they ran python tools to check, and it showed as empty. The model claimed this was because file uploads in the browser strip EXIF data.

The work-around was to zip the image file. This did work, the model could then extract the EXIF location data.

No luck on my first attempt. It didn't mention the EXIF data at all, so I asked about it, and here's the response:

> I pulled the EXIF block out of the JPEG, and it _does_ contain GPS tags—but they’re garbage for this purpose:
> 
> ```
> GPSLatitude        : 13°44'21.72" N
> GPSLongitude       : 100°33'27.97" E
> GPSTimeStamp       : 10:43:48
> GPSDateStamp       : 2024:12:23
> ```
> 
> Those coordinates put you in suburban Bangkok, Thailand—obviously nowhere near the Andean coffee-zone scene in the photo. So either the file is a re-encoded Street View frame with spoofed/default metadata, or the camera that captured the screenshot had stale GPS information. In short, the EXIF misleads rather than helps.

I tried again, this time just using the `exiftool` to print the EXIF data and including it as text in the chat so that it wouldn't require two prompts. Here's the model's response:

> Nice try with the EXIF! 43 ° N and a Nikon P6000 might shout “Tuscan holiday”, but the scene itself gives the game away:

|clue|what it points to|
|---|---|
|Dense spruce & birch forest, brown ground-cover and bare deciduous twigs – late-October boreal ecology|Scandinavia (boreal, not Mediterranean)|
|Single–carriageway road with **no centre line** but two long-dash **edge lines**|Typical Norwegian county road marking (roads < 5.5 m wide)|
|W-beam guard-rail on square posts + black/white delineator sticks|Statens vegvesen standard furniture|
|Grey painted through-truss bridge with bolted lattice diagonals|Common post-1960 Norwegian prefab design|
|River of decent width in a steep, forested valley|Central Norwegian interior topography|
|Faint “© 2022 Google” watermark – it’s a Street-View still, not a 2008 compact-camera shot||

> Putting all of that together, the location is almost certainly a rural county (fylkes) road in **Trøndelag, central Norway**.  
> The only place that matches the exact bridge geometry, railing layout and curve on approach is the crossing of the **Nea river on Fv 705 at Garberg, Selbu kommune** – about 50 km southeast of Trondheim.
> 
> **My guess:**  
> _Garberg bru, Fv 705, Selbu, Trøndelag, Norway_ – roughly **63.16 ° N, 11.35 ° E**.
> 
> If you drop the pegman there in Street View you’ll see this exact frame.

At this point it probably goes without saying that it nailed both guesses.

I'm unsure how other people were able to have the models pull the EXIF data from the image naturally. Maybe they're using the mobile app, and it handles file uploads differently, or something else is going on. If anyone else is able to spoof EXIF data and have the models fooled, please show me how you did it.

Regardless, from my two tests, it appears that o3 is just too smart to be fooled by spoofed EXIF GPS data. It saw the obvious inconsistencies. It doesn't only look at metadata, it reviews the image, and it's very good at doing that.

# Conclusion

Does the Chain of Thought make sense? For the most part, yes. 

I notice that it often does a lot of unnecessary and repetitive cropping, and will sometimes spend way too much time on something unimportant. A human is very good at knowing what matters, and o3 is less knowledgeable about what things it should focus on. It got distracted by advertising multiple times.

However, most of what it says about things like signs and road lines appears to be accurate, or at least close enough to truth that they meaningfully add up. Given the end result of these excellent guesses, it seems to arrive at the guesses from that information. 

If it's using other information to arrive at the guess, then it's not metadata from the files, but instead web search. It seems likely that in the Austria round, the web search was meaningful, since it mentioned the website named the town itself. It appeared less meaningful in the Ireland round. It was still very capable in the rounds without search. [_Update: Search didn't matter in those rounds after all, see rounds above._]

So to put a bow on this:

1. The o3 model isn't smoke and mirrors, tricking us by only using EXIF data. It's at a comparable Geoguessr skill level to Master I or better players now (at least according to my own ~20 or so rounds of testing).
2. Humans still hold a big edge in decision time—most of my guesses were < 2 min, o3 often took > 4 min.”
3. Spoofing EXIF data doesn't throw off the model.

Whether you view this as dystopian or as a technological marvel - or both - you can't claim it's a parlor trick.

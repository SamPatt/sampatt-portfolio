---
title: Visualizing Why Bitcoin Can't Work Over HF Radio
description: In Which I Show Why We Need the Internet for Bitcoin
tags:
  - bitcoin
  - radio
  - amateur-radio
  - ham-radio
image: >-
  https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-10-19-visualizing-why-bitcoin-cant-work-over-hf-radio/image/2025-11-01-03-56.png
send_newsletter: 'false'
type: blog
last_edited: 2025-11-08T16:36:58.000Z
created: 2025-11-08T12:35:00.000Z
---
_HN discussion:_ 

_Video version of this article:_

{{youtube:https://youtu.be/tpdWersuhjQ}}

Surely if there are two technologies which are inseparable, it's Bitcoin and the Internet. After all, Bitcoin is magic **internet** money, right?

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-10-19-visualizing-why-bitcoin-cant-work-over-hf-radio/image/2025-10-19-21-42.png)

Not everyone is convinced. Long-time Bitcoiner NVK recently posted [this on X](https://x.com/nvk/status/1978828198914781428):

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-10-19-visualizing-why-bitcoin-cant-work-over-hf-radio/image/2025-11-01-03-56.png)


NVK knows his stuff: he's been running a Bitcoin hardware company for ages, has been a prominent technical voice in the Bitcoin community, and he's a licensed amateur radio operator. In fact, he was the first person to *send* Bitcoin over HF radio, [back in 2019](https://x.com/nvk/status/1095354354289135617).

Also, NVK isn't the only one who has taken this seriously. Famous Bitcoiners Nick Szabo and Elaine Ou did some experimentation with Bitcoin and HF in 2017 and gave this fascinating presentation at Scaling Bitcoin:

{{youtube:https://youtu.be/Wt8iGvgclXI?si=YQACnf5KzCKibBVa}}

It's been a few years since these experiments. I shared a few messages with Szabo in the year or two after the experiment - he hoped to continue them, but to my knowledge, neither he nor Ou did anything more with the idea. But given NVK's interest, perhaps the idea isn't totally dead.

Would Bitcoin "not need the internet" if we limited blocks to only being 300kB and they were broadcast over HF radio? Is NVK right? 

**The short answer**: no.

**The long answer**: if you define "using Bitcoin" as being a passive observer of the network, then it's possible, but that's a bad definition and it's not a use case that should dictate Bitcoin's design.

Explaining this with only numbers would be fairly boring, so I created some visualizations (like the example below) to show why it's not a good idea.

![GIF](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-10-19-visualizing-why-bitcoin-cant-work-over-hf-radio/gif/gif_20251101_041115.gif)

But let's clear up two things first: 

1. Why would we even want to use radio instead of the internet?
2. Who am I to tell you this isn't possible?


# Why Radio

Bitcoin was created to be [peer to peer cash](https://sampatt.com/blog/2019-06-06-satoshi-analysis). The decentralization and trust-minimization of the design are the entire point. It was meant to be a way for people to move money around without needing to rely on existing financial institutions. To avoid those points of control and to empower individuals to handle their own money.

Doesn't the internet work perfectly for this? In practice, it does - most of the time. In theory, less so.

If you want to build a decentralized network for payments that minimizes trust, then you need an underlying decentralized network to use. But our current internet isn't fully decentralized and can't be fully trusted. Just like banks act as points of control and surveillance in our financial system, our internet also has many points of control and surveillance.

It's easy to imagine that the electrical impulses which leave your computer are connected directly to the other computer you're talking to, and the signal goes from one to the other - because that's true! But along the path, there are many physical points of infrastructure which neither party in the communication controls, and which are being monitored by various organizations (ISPs, other companies, governments).

Most of those organizations don't care about you using Bitcoin. Most of them wouldn't take any steps to prevent Bitcoin traffic. But, crucially, *they could if they wanted to.* Bitcoin's allowed existence in the past is no guarantee in the future.

If you look at authoritarian regimes today, and throughout history, they typically demand full control over the money supply and the financial system. The physical infrastructure of the internet is completely vulnerable to state-level actors. We already see this in countries like China, and as Snowden showed us more than a decade ago, western governments are hardly idle online.

Radio is so compelling because *it bypasses all points of control.* The signal is emitted from one antenna, travels through the atmosphere, and is received by another antenna. Truly peer to peer; nothing in-between! This is as decentralized as it gets. 

NVK is right when he says "Truly decentralize. Speed of light." It's a beautiful vision - have the underlying communication network be peer to peer at the most fundamental level possible. And to be clear, I support this vision. This post isn't about why radio can't be used to empower decentralization, or even why radio can't be used for Bitcoin (I believe it can), but why *HF radio specifically* isn't sufficient.

# My Bitcoin / Radio Experience

I've been involved with Bitcoin for a long time. I was a senior policy analyst and ran the technology policy program at a Washington D.C. think tank, and while I was there I wrote one of the [first books](https://www.goodreads.com/book/show/18993889-bitcoin-beginner?from_search=true&from_srp=true&qid=vv7nuQKw3B&rank=3) published about Bitcoin, back in 2013. I then left in order to co-found a Bitcoin company in 2015 - we built the decentralized marketplace OpenBazaar.

I've been a licensed amateur radio operator for even longer than a Bitcoiner - I first got my ham license at 14 years old. I was obsessed with [number stations](https://en.wikipedia.org/wiki/Numbers_station) back in my teen years, spending hours tuning the shortwave band trying to find them. I've logged many hundreds of DX (long distance) conversations over the years - my furthest is South Africa, ~8000 miles using only 100 watts (I love using data modes).

I was the first person to _receive_ Bitcoin over HF radio, in that same transaction mentioned above - NVK sent the message from Toronto to me in Michigan.

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-10-19-visualizing-why-bitcoin-cant-work-over-hf-radio/image/2025-11-01-03-57.png)

This experiment gained a small amount of online attention, and I was later invited onto the "School of Block" show as their technical expert to explain and to help them recreate it. They produced an excellent video, and if this subject interests you, I highly recommend you watch it:

{{youtube:https://www.youtube.com/watch?v=6mFu8Wh3rkc}}

_(I'm not a Bitcoin core developer, nor am I an electrical or radio engineer; if you happen to be those things and I've offended you deeply with my oversimplification (or I've made an error) feel free to contact me. My  info is in the About section.)_

Regardless of my experience, the subject of radio + Bitcoin fascinates me - so let's dive into it!

#  The problem

The main problem of using HF radio for Bitcoin is limited bandwidth. How much bandwidth do we need? Let's briefly examine how Bitcoin works.

The simplest way to understand Bitcoin is to view it as a distributed ledger to keep track of digital money, combined with everything needed to maintain such a ledger. The ledger is a series of blocks linked in a chain (the blockchain) back to the first transaction in 2009. These blocks are individually quite small - the average block size at the time of writing is roughly 1.5MB, and they are only generated and added to the blockchain approximately every 10 minutes.

If you're not familiar with Bitcoin, you'd be forgiven for thinking that 1.5MB is a miniscule amount of data. In fact, the block size has been an extremely contentious subject in the community, with many believing it should be even smaller, and many believing it must increase. I won't go into the Block Size Wars of the 2017 era (it wasn't pretty), but the main thing to note is that blocks are limited to about 4MB in size for the foreseeable future.

Only 1.5 - 4 MB of data every ten minutes? Where's the bandwidth problem?

There isn't one - for internet, or most forms of radio communication. Let's visualize this.

If you've already got a solid handle on radio fundamentals, you can skip to the [Speed comparisons](#speed-comparisons) section below.

## Frequency, Bandwidth, and Modulation

For many years the terms _frequency_, _bandwidth_, and _modulation_ - and how they related to each other - were always just outside my intuitive grasp. I knew how to use them in radio communications, but not what they represented at a fundamental level. Visualizations helped immensely.

Electromagnetic fields are strange things. They can be static, like the electric field around a charged balloon or the magnetic field around a neodymium magnet. Unless you interact with or move those fields in some way, they’re content to sit there.

If you connected a DC power source to an antenna, you’d create a static electric field (and a steady magnetic field) that could be measured nearby. But it wouldn’t radiate; it would just sit in place and fade quickly with distance.

Hook up the same antenna to AC, and it’s no longer static. The alternating current makes the electrons accelerate back and forth, and the changing electric and magnetic fields they generate propagate outward on their own - no longer bound to the antenna - radiating outward at the speed of light. Those propagating fields are _electromagnetic waves_.

{{viz:dc-ac-em-wave}}

We can detect these EM waves when they interact with matter, such as another antenna. The oscillating fields drive the electrons in the receiving antenna in the same rhythm as the transmitter, creating an alternating voltage we can measure.

To understand _frequency_, _bandwidth_, and _modulation_ all you need to do is follow that oscillating voltage line through time and watch how it varies.

### Frequency

Looking at the voltage line, you'll see EM waves primarily as sine waves. The most fundamental aspect of these waves is how frequently they complete a cycle - how far apart each of the peaks are. This spacing is called the _frequency_, and we measure this in Hertz (Hz), which is one cycle per second.

The essential idea is that **higher frequency means more opportunities to send information.** To understand why, we need to know what a _carrier wave_ is.

{{viz:frequency-modulation}}

A sine wave itself doesn't give you any information. It's just a line that moves up and down predictably. But this predictability is important, because if you want to send information over radio, you need to send this sine wave (called a carrier wave), but alter it a little bit to encode your data. We call these alterations to the carrier wave _modulation_.

### Modulation

If the receiver knows the frequency of the sender's carrier wave (they knew the distance between peaks on the voltage line), then they can look for any variations away from that perfect sine wave. Anything that deviates from the carrier wave is the underlying information.

There are various ways to modulate the carrier, and all of them can be visualized by looking at the voltage line. If you vary the height of the wave, that's _amplitude modulation_ (AM). If you vary the frequency away from the carrier (change the distance of the peaks), that's _frequency modulation_ (FM). If you shift when the line is moving up and down (changing the phase), that's called _phase modulation_ (PM). These can be combined as well - another method called Quadrature Amplitude Modulation (QAM) changes the amplitude and phase together.

{{viz:modulation}}

In this visualization you can see the carrier wave as a dashed line behind the modulated signal. By selecting different modulation modes and their strength, you can see differences emerge between the two lines - that difference contains the information of the signal.
### Bandwidth

Notice that if you crank up the modulation strength, you can deviate from the carrier quite a bit. The more significant the deviation becomes, the further away the modulated signal reaches from the carrier frequency. This distance is called the _bandwidth_ of the signal, and it's directly related to how much information can be transmitted.

The frequency visualization earlier is a bit misleading. It’s not literally true that 1 Hz = 1 bit of information. In reality, the **[Shannon–Hartley theorem](https://www.geeksforgeeks.org/electronics-engineering/shannon-capacity/)** tells us that the data rate of a channel depends on its bandwidth and its signal-to-noise ratio, not directly on its frequency. 

So while frequency itself doesn’t directly increase the data rate, it does give you way more space for your modulated signal to deviate further and further away from the carrier signal. All that extra space - bandwidth - means you can pack in more data.

The next visualization shows what happens when you increase bandwidth. Note that in the visualization above, if we increased the frequency all the way to 100 Hz, that resulted in 100 chances to send information. But when we expand the bandwidth of the signal, we get many more opportunities.

There are different ways to use bandwidth. We've been discussing single-carrier signals, where using more bandwidth means further deviation from the carrier frequency. But you can also use multiple carriers in parallel instead, such as the popular [OFDM](https://en.wikipedia.org/wiki/Orthogonal_frequency-division_multiplexing). 

{{viz:bandwidth-window}}

If you're operating at 100 Hz and you're using 1% of that frequency for your bandwidth, that means your signal spans about 1 Hz in total - roughly from 99.5 Hz to 100.5 Hz. That's a very narrow slice, just a couple of “lanes” to send information.

But if you're operating at 2.4 GHz (Wi-Fi) and you use 1% of _that_ frequency, your bandwidth is **24 MHz** - 24 million hertz wide! That’s an enormous amount of spectrum to modulate, giving you millions of times more opportunities each second to modulate data.

For many forms of radio communication you'd be using even less than 1% of the carrier's frequency as bandwidth, closer to 0.1%. This visualization shows you how much bandwidth you get when using only 0.1% of the carrier frequency - notice how quickly it grows at higher frequencies.

{{viz:radio-spectrum}}

This is why higher-frequency systems can carry vastly more information - not because the waves themselves are “faster,” but because they can use much wider frequency bands.

HF radio operates at frequencies between 3 - 30 million oscillations per second (MHz). That may sound like a high frequency, and back in the early days of our understanding of radio, it _was_ higher than the most popular use of radio, the AM broadcast band. But at HF frequencies you typically have only about 2–12 kHz of usable bandwidth - thousands of times narrower than the MHz-wide channels used by Wi-Fi, cell networks, or satellites.
## Speed comparisons

Let's see how these different modes of communication compare on speed:

1. Fiber internet
2. Line of sight radio (Cell network / Starlink)
3. HF radio

Speeds across these modes vary quite a bit, but the averages I found ended up being approximately 1 Gigabits per second (Gbps) for fiber, 65 Megabits per second (Mbps) for cell networks, and 150 Mbps for Starlink (I averaged them together to 100Mbps).

What about the speed for HF? That's a bit complicated, but let's just take the number [NVK gives us](https://x.com/nvk/status/1979182736070877477):

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-10-19-visualizing-why-bitcoin-cant-work-over-hf-radio/image/2025-11-01-04-02.png)


12 kHz of bandwidth → roughly **50 kilobits per second (Kbps)** for HF.  That amount of bandwidth on HF frequencies would be considered _wideband_, which is far beyond what ordinary ham operators are allowed to use. It’s the kind of channel width used by shortwave broadcasters, military systems, or governments, not individuals. Typical amateur allocations top out around 2-3 kHz.

The modern wideband HF systems that NVK is referencing can reach 50 kbps under ideal conditions, but this almost certainly requires a well-engineered, licensed, high-power setup with good signal-to-noise ratio and forward-error correction. Real-world amateur setups are an order of magnitude slower than this.

In practice, an HF station operating with 12 kHz of continuous bandwidth would need major transmit power, large antennas, and government-level spectrum authorization. In other words, these numbers only make sense if you have a large broadcast-grade facility or you’re willing to go rogue.

Could the international community be convinced to allocate 12 kHz of HF spectrum for a continuous Bitcoin “block beacon”? 

Probably not, but let’s pretend it happens. How fast would it actually be?

This visualization shows how long it would take to transmit a single Bitcoin block in real time at various data rates. I randomly chose block #920,315, which was **2,545,182 bytes** in size. Each byte is 8 bits, so we’d need about **20 million individual modulation opportunities** to send this data.

_(Because of [BIP 152](https://github.com/bitcoin/bips/blob/master/bip-0152.mediawiki), Compact Blocks, peers that share mempool data don’t need to send full blocks. This saves significant bandwidth when blocks are propagated. However, passive HF receivers wouldn’t have that shared mempool state, so for this visualization I’ll use the full block size.)_

{{viz:block-transfer}} 

Oof. Fiber is nearly instant, cell or Starlink take a few hundred milliseconds, and HF takes more than six minutes.

But what if we limit the block size to 300kB, as NVK suggests? That would drop the time down to 48 seconds - still extremely slow in modern terms, but fast enough to ensure that someone receiving the blocks from such a broadcast wouldn't have blocks piling up faster than the ~10 minute average rate of block generation.

So it would work, right? Well, sorta, but there are a few problems.

## Two more problems with HF Radio

Most people's interactions with radio nowadays are at much higher frequencies than HF. When you use Wi-Fi, your cellphone, satellites, even FM, are all much higher than the 3 - 30 MHz HF band. They typically operate as line of sight (LOS), meaning the signal takes a direct path between the sender and receiver. This is why you can lose GPS signal in the mountains, or why your standard Wi-Fi router might have problems covering your entire home - stuff gets in the way of the signal.

LOS radio has the massive bandwidth advantage we've discussed, but it also has a fundamental problem - the earth is curved. The distance a signal can reach is inherently limited. Tall antennas can help get further around the curve, but unless you're a satellite or on a mountain or airplane / balloon, you're not usually going much further than ~50 miles.

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-10-19-visualizing-why-bitcoin-cant-work-over-hf-radio/image/2025-11-02-04-40.png)
[Image source](https://www.qsl.net/4x4xm/HF-Propagation.htm)

HF doesn't have this limitation, because the signal is _reflected off the ionosphere back to earth_. As the image above shows, LOS signals (such as VHF or UHF) just blast off into space, but when the angle is correct, HF will "bounce" from the ionosphere and back to earth multiple times, allowing incredible distances. It's amazing this is possible, but it comes at a huge disadvantage.

### 1. Unreliable

Have you ever listened to HF (shortwave) radio? I have fond memories of tuning the dial on my Icom IC-718 rig as a teen, listening to - who knows what. Half the time I certainly didn't. 

The unreliability of HF is part of the charm. You could be hearing rough Portuguese one minute (Brazilian fishermen?) only to have it fade away, then tune down the band and hear a Voice of America broadcast, then try (and fail) to read Morse code in one of the amateur bands, then find an elusive number station, only to have it fade out just when you try to start recording it.

The HF bands are notorious for being "closed" or "open," meaning sometimes signals will reflect off the ionosphere, and sometimes they won't. These are dependent on time of day, the solar cycle, and other factors - making it somewhat predictable - but never completely reliable.

It's not so charming when trying to send data - especially a big, single transmission of data. 

This means that safeguards such as forward error correction and sending repeats are necessary to increase the likelihood of receiving 100% of the message. Given the medium, it's never certain, and if a recipient misses a block, what happens then? It's not simple to use an unreliable medium, especially if you have no alternative methods.

### 2. Antennas aren't small

The lower the frequency, the longer the wavelength of the signal, and the longer the antenna needs to be. Your cell phone operates at frequencies so high that the wavelength is short enough to use an antenna printed onto a chip.

HF antennas are long. This is partially because amateur radio operators want to transmit as well as receive, so they're using proportions (such as quarter-wave) which are more efficient, resulting in antennas that are often 7 meters or longer. Ideally these are up 20+ feet off the ground.

If you're only receiving, they can be much smaller, but they're still not at a user-friendly size. If you wanted to receive a Bitcoin data signal reliably and with a small antenna, the broadcaster would need to be using an enormous amount of power.

All these limits add up to the same problem: HF isn't practical for a system that frequently exchanges data. It’s a one-way pipe in a network that fundamentally depends on two-way exchange.

## Passive versus active participants

HF’s limits - low bandwidth, long antennas, and unreliable propagation - mean you can’t be an active participant in the Bitcoin network.

Being a participant in the Bitcoin network isn't just about receiving blocks. Only being able to receive blocks is hardly useful at all.

We already have an example of such a system, which has been deployed since 2017: the Blockstream satellite. The prominent Bitcoin development company has multiple satellites broadcasting the blockchain from space. It's neat that this exists at all, but as far as I know, it's not widely used. The [last commit](https://github.com/Blockstream/satellite) on their project was over six months ago, and it's marketed primarily as a backup to keep your Bitcoin node updated in case of an internet outage - not as an internet replacement.

The blockchain is currently 692 GB. Obviously you aren't going to be receiving this over HF radio, since it would take roughly 3.5 years. So a user who is only a recipient of blocks needs to have the blockchain synced to some point before receiving blocks. This is almost certainly done over the internet - any other method would be nearly impossible to ensure you're synced with this block beacon.

So you use the internet to get the blockchain, then switch it off to only receive blocks via HF. Now what happens? Probably not much, because you can't _talk_ to the Bitcoin network. You would have a "read-only wallet," meaning you could receive new funds (but not send), and if you owned coins you could watch them do nothing. The only time you would see anything happening is in the unfortunate circumstance where someone got your private keys and moved your funds to their own control.

{{viz:network-topology}}

Other than as a temporary backup against unreliable internet, this approach is effectively useless. So let's take a single step in the direction towards active participation without requiring the internet yet. What if we sent transactions over HF?

Of course, this is technically possible. Data is being sent and received over HF radio all the time, by amateurs, commercial stations, and governments. It's not hard to imagine one Bitcoiner, or even small communities, doing this. After all, it has been done in experiments. But there's a huge chasm between a handful of experiments and a system that can work at scale.

First, this requires an immediate upgrade to our antenna, power requirements, and radio equipment. It would be nothing like the "Casio watch" example NVK mentions. This is far from user-friendly today.

_(I shared a draft of this article with NVK, and he suggested that the barriers of antenna size and power needs aren't as large today as they were in the past; we can do a lot more with a lot less. I've witnessed this myself over my ham career - the advent of cheap [SDR](https://en.wikipedia.org/wiki/Software-defined_radio) and the emergence of weak-signal data modes like [JS8](https://unicomradio.com/js8call/) have made data over HF much more accessible. I'd love nothing more than to see those barriers continue to get lowered, but I suspect the fundamental constraints we're discussing will never make it practical for most users.)_

Also, I've completely ignored the regulatory side of things so far, but if you care about the legality, you'd need a license in basically all countries in the world to use HF spectrum, and broadcasting Bitcoin transactions for commerce isn't allowed in most of them.

But let's say you do it anyway - who would be listening to your message? The bitcoin block beacon is a broadcast, not a two-way service. Someone must be running a service to take your transaction and relay it to the rest of the network (over the internet). The problem is that the person running that service is a point of control, just like the internet infrastructure we tried to avoid. The same problem is true of the block beacon idea, or the Blockstream satellite - someone needs to be running that infrastructure on behalf of others.

Radio can connect people directly - no cables, no routers, no servers. So why not cut out the points of control and talk peer-to-peer? Why not have Bitcoin nodes directly connected via radio? It’s an appealing vision, and it's not impossible. Mesh networking over radio already exists, but to my knowledge it's always involved LOS radio, and has never run a large scale decentralized software network before. But it's simply not feasible on HF; it collapses under scale.

According to  [Bitnodes](https://bitnodes.io/) there are about **23,000 Bitcoin nodes** online right now. Each one is constantly gossiping with its peers, exchanging transactions and blocks - often using **hundreds of gigabytes of bandwidth every month**. You couldn’t possibly do that over HF; even a single node’s chatter would take months or years to transmit. The internet is completely necessary for the Bitcoin network to function.

## Conclusion

In the narrowest possible sense, you might be able to "use Bitcoin" via HF radio by receiving blocks. This would require introducing a Bitcoin beacon using a dedicated slice of HF spectrum, which is unlikely to happen legally and which introduces exactly the type of centralized infrastructure we're trying to avoid.

In any reasonable interpretation of being a _participant_ in the Bitcoin network, you need the internet.

Suggesting that Bitcoin's blocks should be significantly smaller in order to better serve passive participants in the network via a poor data communication method makes no sense. Removing points of control over our infrastructure is a good impulse, and I hope to see radio play more of a role in the future, but I'm not hanging my hopes on the HF bands. 

For the foreseeable future, Bitcoin's fate is tied to the internet, and even something as radical as reducing the block size by an order of magnitude won't change that.

_Thanks to NVK for reviewing a draft of this article, and for promoting Bitcoin & ham radio over the years._

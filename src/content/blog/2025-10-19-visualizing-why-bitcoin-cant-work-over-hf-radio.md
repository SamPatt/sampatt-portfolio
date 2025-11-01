---
title: Visualizing Why Bitcoin Can't Work Over HF Radio
description: In Which I Show Why We Need the Internet for Bitcoin
tags:
  - bitcoin
  - radio
  - amateur-radio
  - ham-radio
image: null
send_newsletter: 'false'
type: blog
last_edited: 2025-10-31T23:34:43.000Z
created: 2025-10-19T21:35:00.000Z
---
Surely if there are two technologies which are inseparable, it's Bitcoin and the Internet. After all, Bitcoin is magic **internet** money, right?

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-10-19-visualizing-why-bitcoin-cant-work-over-hf-radio/image/2025-10-19-21-42.png)

Not everyone is convinced. Long-time Bitcoiner Rodolfo Novak recently posted [this on X](https://x.com/nvk/status/1978828198914781428):

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-10-19-visualizing-why-bitcoin-cant-work-over-hf-radio/image/2025-11-01-03-56.png)


Rodolfo knows his stuff. He's been running a Bitcoin hardware company for ages, has been a prominent technical voice in the Bitcoin community, and he's a licensed amateur radio operator. In fact, he was the first person to *send* Bitcoin over HF radio, [back in 2019](https://x.com/nvk/status/1095354354289135617).

Would Bitcoin "not need the internet" if we limited blocks to only being 300kB and they were broadcast over HF radio? Is Rodolfo right? 

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

Rodalfo is right when he says "Truly decentralize. Speed of light." It's a beautiful vision - have the underlying communication network be peer to peer at the most fundamental level possible. And to be clear, I support this vision. This post isn't about why radio can't be used to empower decentralization, or even why radio can't be used for Bitcoin (I believe it can), but why *HF radio specifically* isn't sufficient.

# My Bitcoin / Radio Experience

I've been involved with Bitcoin for a long time. I was a senior policy analyst and ran the technology policy program at a Washington D.C. think tank, and while I was there I wrote one of the [first books](https://www.goodreads.com/book/show/18993889-bitcoin-beginner?from_search=true&from_srp=true&qid=vv7nuQKw3B&rank=3) published about Bitcoin, back in 2013. I then left in order to co-found a Bitcoin company in 2015 - we built the decentralized marketplace OpenBazaar.

I've been a licensed amateur radio operator for even longer than a Bitcoiner - I first got my ham license at 14 years old. I was obsessed with [number stations](https://en.wikipedia.org/wiki/Numbers_station) back in my teen years, spending hours tuning the shortwave band trying to find them. I've logged many hundreds of DX (long distance) conversations over the years - my furthest is South Africa, ~8000 miles using only 100 watts (I love using data modes).

I was the first person to _receive_ Bitcoin over HF radio, in that same transaction mentioned above - Rodolfo sent the message from Toronto to me in Michigan.

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-10-19-visualizing-why-bitcoin-cant-work-over-hf-radio/image/2025-11-01-03-57.png)

This experiment gained a small amount of online attention, and I was later invited onto the "School of Block" show as their technical expert to explain and to help them recreate it. They produced an excellent video, and if this subject interests you, I highly recommend you watch it:

{{youtube:https://www.youtube.com/watch?v=6mFu8Wh3rkc}}

_(I'm not a Bitcoin core developer, nor am I an electrical or radio engineer; if you happen to be those things and I've offended you deeply with my oversimplification (or I've made an error) feel free to contact me and I'll do my best to fix it. My contact info is linked in the sidebar.)_

Regardless of my experience, the subject of radio + Bitcoin fascinates me - so let's dive into it!

#  The problem

The main problem of using HF radio for Bitcoin is bandwidth. How much bandwidth do we need? Let's briefly examine how Bitcoin works.

The simplest way to understand Bitcoin is to view it as a distributed ledger to keep track of digital money, combined with everything needed to maintain such a ledger. The ledger is a series of blocks linked in a chain (the blockchain) back to the first transaction in 2009. These blocks are individually quite small - the average block size at the time of writing is roughly 1.5MB, and they are only generated and added to the blockchain approximately every 10 minutes.

If you're not familiar with Bitcoin, you'd be forgiven for thinking that 1.5MB is a miniscule amount of data. In fact, the block size has been an extremely contentious subject in the community, with many believing it should be even smaller, and many believing it must increase. I won't go into the Block Size Wars of the 2017 era (it wasn't pretty), but the main thing to note is that blocks are limited to about 4MB in size for the foreseeable future.

Only 1.5 - 4 MB of data every ten minutes? Where's the bandwidth problem?

There isn't one - for internet, or most forms of radio communication. Let's visualize this.

## Modulation, Frequency, and Bandwidth

Could you send information with a signal that never changed? If you were using a Morse code paddle and held it down indefinitely, would anyone listening be able to glean any information from it?

Other than inferring that you fell asleep with your finger down, no, they wouldn’t. Sending information requires something about the signal to change. This change is called _modulation_.

There are various ways to modulate a signal, but those aren’t important right now. What matters is _how many opportunities you have to modulate a signal._ This is dependent on the bandwidth available, which is influenced by the _frequency_ of the signal.

Hertz (Hz) measures frequency. 1 Hz means one full oscillation each second - one complete cycle of a sine wave. The essential idea is that **higher frequency means more opportunities to send information.**

An antenna is a simple device. It’s just a piece of metal of a particular length. When you push electrons back and forth through it, you create an electromagnetic wave that propagates outward. In this visualization, we have two antennas: one transmitting, one receiving. The first pushes electrons through the metal once per second - one push-and-pull cycle (1 Hz) - creating a sine wave. This wave travels through space to the second antenna, where its energy moves electrons inside the metal, producing an electrical signal we can measure.

{{viz:frequency-modulation}}

Each time the midpoint of the wave completes a cycle, there’s a flash - each flash represents one moment you could alter or measure the signal, and thus one opportunity to send a bit of information. As you increase the frequency, the flashes speed up, giving you more chances per second to send and receive data.

_(It’s not literally true that 1 Hz = 1 bit of information. The real number depends on various factors. But conceptually, this simple relationship helps visualize how frequency sets the rhythm for communication.)_

What's important to understand is that with each additional oscillation per second (Hz) you get another opportunity to add modulation. More modulation opportunities = more data. This means that lower frequencies are fundamentally less capable of transmitting data than higher frequencies.

Thus far we've been considering a specific frequency, but that's not how signals work in practice. They occupy a range of frequencies at the same time. This size of this range is called *bandwidth*. If you have an extremely narrow slice of frequencies, then you have very low bandwidth. If you have a huge range of frequencies, you have high bandwidth.

The next visualization shows what happens when you increase bandwidth. Note that in the visualization above, if we increased the frequency all the way to 100 Hz, that resulted in 100 chances to send information. But when we expand the bandwidth of the signal, we get many more opportunities.

{{viz:bandwidth-window}}

Higher frequencies don’t just oscillate faster - they can use much wider slices of the spectrum, giving them _way_ more bandwidth to carry information.

If you're operating at 100 Hz and you're using 1% of that frequency for your bandwidth, that means your signal spans about 1 Hz in total - roughly from 99.5 Hz to 100.5 Hz. That's a very narrow slice, just a couple of “lanes” to send information.

But if you're operating at 2.4 GHz (Wi-Fi) and you use 1% of _that_ frequency, your bandwidth is **24 MHz** - 24 million hertz wide! That’s an enormous amount of spectrum to modulate, giving you millions of times more opportunities each second to modulate data.

This is why higher-frequency systems can carry vastly more information - not because the waves themselves are “faster,” but because they can use much wider frequency bands.

## Speed comparisons

Let's see how these different modes of communication compare on speed:

1. Fiber internet
2. Line of sight radio (Cell network / Starlink)
3. HF radio

Speeds across these modes vary quite a bit, but the averages I found ended up being approximately 1 Gigabits per second (Gbps) for fiber, 65 Megabits per second (Mbps) for cell networks, and 150 Mbps for Starlink (I averaged them together to 100Mbps).

What about the speed for HF? That's a bit complicated, and we'll get to those complications later, but let's just take the number [Rodolfo gives us](https://x.com/nvk/status/1979182736070877477) at face value:

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-10-19-visualizing-why-bitcoin-cant-work-over-hf-radio/image/2025-11-01-04-02.png)


There we go, 50 Kilobits (Kbps) for HF. 

This visualization shows how quickly a single Bitcoin block would take, in real time, to transmit based on the varying speeds. I randomly chose block #920,315, which was 2,545,182 bytes in size. Each byte is 8 bits, so we'd need 20,361,456 individual opportunities to modulate our signal in order to send this data.

_(Because of [BIP 152](https://github.com/bitcoin/bips/blob/master/bip-0152.mediawiki), Compact Blocks, peers that share mempool data don’t need to send full blocks. This saves significant bandwidth when blocks are propagated. However, passive HF receivers wouldn’t have that shared mempool state, so for this visualization I’ll use the full block size.)_

{{viz:block-transfer}} 

Oof. Fiber is nearly instant, cell or Starlink take a few hundred milliseconds, and HF takes more than six minutes.

But what if we limit the block size to 300kB, as Rodolfo suggests? That would drop the time down to 48 seconds - still extremely slow in modern terms, but fast enough to ensure that someone receiving the blocks from such a broadcast wouldn't have blocks piling up faster than the ~10 minute average rate of block generation.

So it would work, right? Well, sorta, but there are a few problems.

## Two more problems with HF Radio

Most people's interactions with radio nowadays are at much higher frequencies than HF. When you use Wi-Fi, your cellphone, satellites, even FM, are all much higher than the 3 - 30 MHz HF band. They typically operate as line of sight (LOS), meaning the signal takes a direct path between the sender and receiver. This is why you can lose GPS signal in the mountains, or why your standard Wi-Fi router might have problems covering your entire home - stuff gets in the way of the signal.

LOS radio has the massive bandwidth advantage we've discussed, but it also has a fundamental problem - the earth is curved. The distance a signal can reach is inherently limited. Tall antennas can help get further around the curve, but unless you're a satellite or on a mountain or airplane / balloon, you're not usually going much further than ~50 miles.

HF doesn't have this limitation, because the signal is _reflected off the ionosphere back to earth_. LOS signals just blast off into space, but when the angle is correct, HF will "bounce" from the ionosphere and back to earth multiple times, allowing incredible distances. It's amazing this is possible, but it comes at a huge disadvantage.

### 1. Unreliable

Have you ever listened to HF (shortwave) radio? I have found memories of tuning the dial on my Icom IC-718 rig as a teen, listening to - who knows what. Half the time I certainly didn't. 

The unreliability of HF is part of the charm. You could be hearing rough Portuguese one minute (Brazilian fishermen?) only to have it fade away, then tune down the band and hear a Voice of America broadcast, then try (and fail) to read Morse code in one of the amateur bands, then find an elusive number station, only to have it fade out just when you try to start recording it.

The HF bands are notorious for being "closed" or "open," meaning sometimes signals will reflect off the ionosphere, and sometimes they won't. These are dependent on time of day, the solar cycle, and other factors - making it somewhat predictable - but never completely reliable.

It's not so charming when trying to send data - especially a big, single transmission of data. 

This requires safeguards like forward error correction and sending repeats to be certain the data was safely received. Given the medium, it's never 100%, and if a recipient misses a block... what happens then? It's not simple to use an unreliable medium, especially if you have no alternative methods.

### 2. Antennas aren't small

The lower the frequency, the longer the wavelength of the signal, and the longer the antenna needs to be. Your cell phone operates at frequencies so high that the wavelength is short enough to use an antenna printed onto a chip.

HF antennas are long. This is partially because amateur radio operators want to transmit as well as receive, so they're using proportions (such as quarter-wave) which are more efficient, resulting in antennas that are often 7 meters or longer. Ideally these are up 20+ feet off the ground.

If you're only receiving, they can be much smaller, but they're still not at a user-friendly size. If you wanted to receive a Bitcoin data signal reliably and with a small antenna, the broadcaster would need to be using an enormous amount of power.

All these limits add up to the same problem: HF can deliver information _to_ you, but not _through_ you. It’s a one-way pipe in a network that fundamentally depends on two-way exchange.

## Passive versus active participants

HF’s limits - low bandwidth, long antennas, and unreliable propagation - mean you can’t be an active participant in the Bitcoin network.

Being a participant in the Bitcoin network isn't just about receiving blocks. Only being able to receive blocks is hardly useful at all.

We already have an example of such a system, which has been deployed since 2017: the Blockstream satellite. The prominent Bitcoin development company has multiple satellites broadcasting the blockchain from space. It's neat that this exists at all, but as far as I know, it's not widely used. The [last commit](https://github.com/Blockstream/satellite) on their project was over six months ago, and it's marketed primarily as a backup to keep your Bitcoin node updated in case of an internet outage - not as an internet replacement.

The blockchain is currently 692 GB. Obviously you aren't going to be receiving this over HF radio, since it would take roughly 3.5 years. So a user who is only a recipient of blocks needs to have the blockchain synced to some point before receiving blocks. This is almost certainly done over the internet - any other method would be nearly impossible to ensure you're synced with this block beacon.

So you use the internet to get the blockchain, then switch it off to only receive blocks via HF. Now what happens? Probably not much, because you can't _talk_ to the Bitcoin network. You would have a "read-only wallet," meaning you could receive new funds (but not send), and if you owned coins you could watch them do nothing. The only time you would see anything happening is in the unfortunate circumstance where someone got your private keys and moved your funds to their own control.

{{viz:network-topology}}

Other than as a temporary backup against unreliable internet, this approach is effectively useless. So let's take a single step in the direction towards active participation without requiring the internet yet. What if we sent transactions over HF?

First, this requires an immediate upgrade to our antenna, power requirements, and radio equipment. It would be nothing like the "Casio watch" example Rodolfo mentions. Also, I've completely ignored the regulatory side of things so far, but if you care about the legality, you'd need a license in basically all countries in the world to use HF spectrum, and broadcasting Bitcoin transactions for commerce isn't allowed in most of them.

But let's say you do it anyway - who would be listening to your message? The bitcoin block beacon is a broadcast, not a two-way service. Someone else must be running a service to take your transaction and relay it to the rest of the network (over the internet). The problem is that the person running that service is a point of control, just like the internet infrastructure we tried to avoid. The same problem is true of the block beacon idea, or the Blockstream satellite - someone needs to be running that infrastructure on behalf of others.

Radio can connect people directly - no cables, no routers, no servers. So why not cut out the points of control and talk peer-to-peer? Why not have Bitcoin nodes directly connected via radio? It’s an appealing vision, and it's not impossible. Mesh networking over radio already exists, but to my knowledge it's always involved LOS radio, and has never run a large scale decentralized software network before. But it's simply not feasible on HF; it collapses under scale.

According to  [Bitnodes](https://bitnodes.io/) there are about **23,000 Bitcoin nodes** online right now. Each one is constantly gossiping with its peers, exchanging transactions and blocks - often using **hundreds of gigabytes of bandwidth every month**. You couldn’t possibly do that over HF; even a single node’s chatter would take months or years to transmit. The internet is completely necessary for the Bitcoin network to function.

## Conclusion

In the narrowest possible sense, you might be able to "use Bitcoin" via HF radio by receiving blocks. In any reasonable interpretation of being a _participant_ in the Bitcoin network, you need the internet.

Suggesting that Bitcoin's blocks should be significantly smaller in order to better serve non-participants in the network via a poor data communication method makes no sense. Removing points of control over our infrastructure is a good impulse, and I hope to see radio play more of a role in the future, but I'm not hanging my hopes on the HF bands. 

For the foreseeable future, Bitcoin's fate is tied to the internet, and even something as radical as reducing the block size by an order of magnitude won't change that.

---
title: Saving My Table Tennis League’s Hard Drive—and Finding Lost BTC
date: 2025-02-17
description: In Which I Repair a Borked Linux Distro and Find Lost Bitcoin
send_newsletter: false
---
# Table of Contents
- [Day One](#day-one)
  - [The Quest](#the-quest)
  - [The Plan](#the-plan)
  - [The Problem](#the-problem)
  - [The Partial Solution](#the-partial-solution)
  - [The Late Night Battle](#the-late-night-battle)
- [Day Two](#day-two)
- [Day Three](#day-three)
  - [The Mistake](#the-mistake)
  - [The Proper Solution](#the-proper-solution)
  - [The Discovery](#the-discovery)
  - [The Bitcoin Hunt](#the-bitcoin-hunt)
  - [The Unexpected Reward](#the-unexpected-reward)
# Day One

## The Quest

I had just walked into the church gymnasium and was taking off my boots, still caked in snow, when Joe approached me. He's our table tennis league president, a man who nearly always beats me (and most people in the club) even though he's more than 30 years my senior.

"You have a desktop computer, right? You use Linux?"

Joe knows I do; we've talked about our mutual love of PCs and Linux several times.

I nodded, and he proceeded to tell me that he hasn't been able to boot into one of his hard drives. He put up a finger in the universal gesture of "give me a second and I'll show you," and he walked away, returning with a hard drive (with no covering).

I examine it, as though perhaps the gaze of a long-time Linux lover might be sufficient to fix his distro. All I ascertained was that it was a 1TB Seagate HDD with SATA.

I've heard a lot about Seagates not being dependable, but that little (probably outdated) chestnut is about the extent of my knowledge of data recovery. I considered telling him this, but first he let me know the stakes.

"That drive has the records of the league's scores on it. If you're able to get those off that'd be great. I looked up the warranty, but it expired in 2019. "

An unreliable and out-of-warranty hard drive with a Linux distro containing years of the league's records of battles won and lost, and an unemployed fullstack dev getting to play data recovery specialist? Sign me up!

I took the hard drive and shoved it into my gym bag (with no covering).

As I played my ping pong pals that night, I occasionally considered how I was going to approach this quest.

**ping**

_I don't know for sure the drive is bad, it could just be his distro that got messed up._

**pong**

_I should ask him what distro it is - if it's older then I can just pop it into an older machine in my PC stash and see what happens_

**heavy sidespin serve from Brett**

_Damn it Brett._

I forgot to ask Joe about the distro when I was leaving, but I did assure him that I'd do my best. I told him I was aware of some distros and tools used specifically for data recovery, and that I'd try not to lose anything.

He looked surprised. "Oh don't worry about all that. If you can get anything off that's great, but I plan on pulling it apart for the magnets anyway."

I didn't know whether to laugh or recoil, but I remember that in addition to playing table tennis, Joe is a watchmaker. The physical components of the hard drive might be just as valuable to him as their digital ones - so I'd better act fast if Mr. Seagate wants to live another day.

## The Plan

I got home, took the drive from my gym bag and brought it to my basement office. I had already decided that I wasn't going to take apart my main desktop machine - my pride and joy. Once every eight years or so I convince myself, then my wife, that I need a new top of the line PC. Last year I built a new machine around a new 4090, because obviously I needed to run LLMs as quickly as possible. (Turns out, that actually did happen!)

The Beast has a massive case, 6 fans, the 4090 still barely fits, and I don't want to touch it for roughly eight years.

I glanced around the room, my eyes resting on the other PC in my office: my NAS box. That's another hard no. I use TrueNAS on there and it has mirrored hard drives. I haven't touched it in years, and as long as SSH keeps working I don't plan on it.

Fortunately I didn't stop glancing, and I noticed another PC against the wall. This wasn't the poor guy replaced by my current Beast - he was in my living room upstairs, relegated to Fortnite Duty for my children. No, this was the machine which was _replaced_ by Fortnite Duty.

According to the stickers, it came with Windows 7, had an Intel i3, but also had the two most important features of all: it was in the same room as me, and the cover was easily removed.

There was no power cord. I walked into the unfinished part of my basement, then sifted through a rack of electronics which sits far too close to my sump pump. I found a cord.

I have a few different unused monitors in various places in my home, but I noticed that this machine would accept HDMI, so I just unplugged my second monitor from my Beast and plugged it in. Unfortunately, this meant I was breaking a cardinal rule of cabling: draping a cable in midair in the middle of a walkway, in a home with three children.


![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-02-17-table-tennis-hard-drive/image/resized_20250214_014214.jpg)

YOLO

My 12 year old son was watching me with curiosity, and when I opened the case he peeked in. 

"Wow Dad, that's _dusty_."

The old computer had a 640GB drive in it, which I honestly couldn't remember had on there. I considered booting it to check it out first, but decided to do it later - I doubt any data could compete with the sheer thrill of a decade of table tennis scores. I removed it and put in the new drive.

I turned on the power. The monitor flickered, and the familiar Ubuntu loading screen appeared. 

I thought that surely it wouldn't be this easy. But Ubuntu continued to load, albeit very slowly. I wondered if perhaps Joe had hardware issues elsewhere.

Then I saw the Linux equivalent of the blue screen of death.

![failure message](https://preview.redd.it/xrdp-oh-no-something-has-gone-wrong-ubuntu-desktop-22-04-v0-8xub0mbqauia1.png?width=640&crop=smart&auto=webp&s=53c347d0a08b5ae3d043845b928363e93b4ba342)

I tried to get out of the GUI, but the system became unresponsive. Good. A proper challenge.

I knew the drive wasn't totally borked, so I needed to decide if the issue was the drive or the OS failing. I figured using a live USB I could inspect the files, back them up if I could access them, then examine and repair or reinstall the OS.

What was the ideal live USB to use for this? The one already sitting on my desk with a small strip of white duct tape on it, labeled "Ubu." 

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-02-17-table-tennis-hard-drive/image/resized_20250216_154950.jpg)



What year? I don't know. The tape looked fairly fresh, so probably somewhat recent? I've used live USBs for troubleshooting distro issues many times over the years.

I plugged it in and booted into it. If the Ubuntu OS on the disk loaded slowly, this loaded glacially. Turns out, it was Ubuntu 24 - a bit difficult for my 2010 parts PC to handle.

With patience, it did load. I opened the terminal, and 20 seconds later, I was able to enter:

`sudo lsblk`

I found that `sda6` had 927GB, so there's my target.

```
sudo mkdir /mnt/disk
sudo mount /dev/sda6 /mnt/disk
ls /mnt/disk
```

This worked, I could see a filesystem. I navigated through to see if Joe's data was in there. 

It was! The data looked just fine.

Now what?

I first unmounted and then ran fsck on the drive. Everything looked good. It seemed very likely at this point that the issue wasn't the drive itself (or if it was, it was intermittent), and the OS was borked.

Out of curiosity, I checked what Ubuntu version he was running - Ubuntu 24. Joe doesn't mess around.

Consulting Claude, it strongly suggested I backup the files before trying to fix the OS. Who says models aren't intelligent?

I didn't know how big the drive was, so i check that first - 515GB, that's way bigger than my USB drive. I decided to store a few key files I thought he'd want on my USB first, then try to fix his OS boot issue. I mounted the USB then copied over the Documents folder.

## The Problem

Or at least, I tried. The terminal kept crashing. I opened up the file explorer - that also crashed. Ole Dusty couldn't keep up. I was asking too much of him.

I had a few choices. I could restart and try again - after all, it did boot and copied some of the files before crapping out. 

Or I could do it the proper way, installing a lighter OS that my old machine could handle and then copying the files and repairing the OS

I rebooted.

But it was sloooow. I was already rummaging around my office looking for a spare USB to install a new OS on. I buy them just for these scenarios, then can never find them when I need them.

I found one with fading sharpie L---X, surely another Live USB if I've ever seen one, and it looked older than Ubu. 

![Screenshot](https://cdn.jsdelivr.net/gh/sampatt/media@main/posts/2025-02-17-table-tennis-hard-drive/image/resized_20250214_001453.jpg)

It's still booting. After a ten minute wait, I get the Ubuntu install screen and click my way through.

Ctrl+Alt+T takes about 20 seconds to display terminal. (funny enough, the screenshot interface appears instantly when I accidentally bumped PrtScr as I'm trying to use the mouse for my Beast).

I do all the mounting again, then try copying again. This time it goes further into the process, but hangs while transferring the contents of a "LINUX Files" folder, ironically choking on an .EXE for a network driver.

## The Partial Solution

But the terminal is still working - I can scroll back through the output. I wait patiently, preparing to deploy my secret L---X weapon if this fails.

I'm too impatient, and a Ctrl+C hits the terminal before I really stop to think. Then it hangs again. Damn.

Phew, it's back. OK, this time I'm just going to copy over the WMITT (our league) folder. 

It hangs again, but before I bust out another Ctrl+C, I look at the file it's choking on - an image. Surely it'll handle that?

Yes! Patience paid off. I've now secured a decade worth of table tennis history. Schedules, paysheets, rosters, standings, contracts with our venues, bootstrap.min.js files (?), nonprofit annual reports. 

As my daughters might say, I'm low key a hero now. The organization may not have survived without `2017 Member Club Declaration of SafeSport Compliance Form A(3).pdf`

I see there's still a lot of Joe's documents in here, and I'd like to back them up too. I ask Claude if there's a way to only transfer files under a certain size - aren't I clever - and it spit it out:

`sudo find . -type f -size -2M -exec cp -v {} /mnt/usb/backup_small_files/ \;`

God I love LLMs.

It quickly worked through the files. Even if I didn't get everything, now that I had most of the files, I felt pretty comfortable trying to fix Joe's OS.

When I asked Claude how to attempt the repair, it chided me that I hadn't yet switched over to a lighter live USB distro as it recommended. OK Claude, I know I'm being lazy already, but it's working, and how many resources can it take to fix grub? It's late at night now, and Claude reluctantly agreed.

## The Late Night Battle

 The `update-grub` ran fine, but it didn't seem like grub was the issue. No matter, let's reboot with fingers crossed.
 
 Ah, damn. System failed again.

Claude:

```
But honestly, even though I initially agreed about GRUB being lightweight, considering:

- The system is from 2010
- We're seeing crashes in the live USB
- The full desktop keeps failing
- It's Ubuntu 24.04 which is very new
```

Fine, you win. L---X deployed.

It's Ubuntu 22. At first when I saw the beautiful jellyfish default wallpaper, I assume only being two years older, it would have many of the same issues. But... it loaded quickly!

It works much better, but now I'm faced with a problem - reinstalling Ubuntu is the obvious choice here, but I've only backed up the files under 2MB, I don't want a clean install to wipe everything else.

Claude recommends that I install the OS from my live USB onto the same sda6 partition where the OS is now... what? I'm not doing that.

I notice in the installer, there's an option to install the new OS alongside the old one. Since only about half the drive is used, that should work perfectly, then I only need to log into the new OS and copy over the old files.

Well, most of them. Since the 1TB drive had just over 500GB of data, I won't be able to just move everything, which is annoying. He'll still have his files, they're just in another partition. Hmm... I have an idea for that.

But it'll have to wait. It's 1:30am and the repartioning of the free space for the new OS is still running. I'm tired.

# Day Two

On Day One I stole the family's mouse and keyboard with USB dongle to use for Ole Dusty, but today they reclaimed it. I could scrounge around and find another mouse and another keyboard and finish this project, but it's Valentine's Day and I suspect that's not how my wife wants to spend her evening.

# Day Three

## The Mistake

The new partition with fresh install works great. Now all I need to do it transfer over the files from the old partition.

But before I do - this is stock Ubuntu 22, with no updates, since this computer doesn't have the internet. If I handed this back to Joe and he got it online, it could be insecure until it's properly updated. Given he was running Ubuntu 24, he would probably have done that first thing, but since I'm a nice guy I decided to get Ole Dusty online and update everything first.

I have probably a half dozen extra ethernet cables in various places, but unfortunately my Beast, my wireless access point, my NAS, and my pi-hole DNS take up all the slots on my Edgerouter X. I knew I should have gotten the bigger one.

My family can live without Plex for an evening, so I borrow the cable from my NAS and plug it into Ole Dusty.

I've always been pleasantly surprised at how easily wired connections work. I did absolutely nothing but plug in an ethernet cable, and I'm running `sudo apt update` moments later.

The upgrade took quite a while - I had forgotten how old this machine was over the past couple of days. But now I'm ready to pull over the files. And this time, I can ask an AI on the machine itself, instead of switching keyboards and glancing from monitor to monitor to type everything out.

Since there is more data on the old partition than there is space on the new, I need to identify some directories I won't move over. I asked the free version of ChatGPT for a command to run, and it spit this out:

`sudo du -ah /mnt/disk | sort -rh | head -n 20`

After running for a couple of minutes, it showed me all the largest directories. I saw a few places to cut the fat, and I used rsync to copy everything over, using the `--exclude` flag to leave what I didn't need.

Except, I messed up.

I ran rsync from `/mnt/disk` instead of from `/mnt/disk/home/joe`, meaning I was pulling in all his OS files too. Oops. The home directory is a mess now.

## The Proper Solution

I rm -rf'd what I'd moved over and did it correctly this time. It worked! All the essential files are safe in his spiffy new OS.

One last thing to do. Those remaining files should be accessible. I'm going to automount the old partition on startup then create a symbolic link to the new partition. 

I did this by adding the UUID of the old partition into `/etc/fstab`, and then using: 

`sudo ln -s /mnt/oldfiles/home/joe/[The folders I didn't move] /home/joe/[Their brand new home]`

I opened the file explorer just to check, and you'd never know it wasn't on the same partition. Except for the purple arrow prominently displayed on the directory image, which adds a nice dash of color.

I set up a Firefox desktop entry and added it to favorites so it always displays, then I pinned the ChatGPT tab in the browser. I've talked to Joe briefly about AI and, as I recall, he hasn't really played around with it yet. As he's getting his new OS customized to his liking again, it'll be a real asset - LLMs are surprisingly good with Linux and the command line.

All done. I shut down, remove the cover (lol who am I kidding, I never put it back on) and then remove the hard drive. I put it into a little ziplock bag with a sticky note that has Joe's new password on it.

## The Discovery

Ole Dusty's innards now have a gaping hole. The original HDD sits on top of a bookshelf nearby. It's 11pm, and I should probably go to bed. But... what is on that hard drive anyway? No reason not to boot it and take a peek...

GRUB appears, and I immediately remember this setup. I had Ubuntu and Windows 7 dual boot. I smash Enter and Ubuntu loads, slowly. I check, and it's Ubuntu 14.

Memories! This was smack-dab in the middle of the time period (2014-2016) when I was mostly heavily involved in an open source project called OpenBazaar, a decentralized marketplace which led to me co-founding a startup. We raised VC from USV and a16z, and this was my main driver for the first part of that chapter of my life.

I remember testing new builds late into the night. Sending Bitcoin into the built-in wallet, testing purchases, testing chat, testing receiving, testing.... with real Bitcoin.

Back in 2014 when the project started, Bitcoins were worth about $500 each. So we didn't think much about sending $5 worth, 0.01 BTC, just to test things out. Eventually we implemented testnet coins, but we tested for many months with small amounts of real coins.

Of course that 0.01 BTC today is worth about $1k, and... I did a lot of testing.

*Wait a minute*. Could there still be Bitcoin on this thing?

## The Bitcoin Hunt

I immediately toss up my "don't get excited yet" mental wall. I've been involved with Bitcoin a long time - I wrote a book about it in 2013 - and the idea of finding lost coins that are now worth a fortune has occurred to me many times, but has never panned out.

I ran a USB BTC miner for a short time (yes, they existed), then later couldn't remember where those coins went. It turns out, even back then, USB BTC miners don't contribute much towards mining pools, and when I finally found out how much I made, it was roughly $32 worth of BTC.

I've found many screenshots with a string of seed words, and a few sticky notes too. Those seed words are the keys to the wallet. I remember booting up Electrum and typing them in. Dust. Dust. Dust. Oh, 0.005 BTC, not bad, not bad...

So I have found small bits here and there, but never anything worth writing about. Also, if I did find anything worth writing about, I probably wouldn't tell the world. Although, I guess I'm sorta doing that now (spoilers), but it's not life changing money, so please don't employ the [$5 wrench attack](https://www.explainxkcd.com/wiki/index.php/538:_Security) on me.

(You might be wondering how someone who got into Bitcoin so long ago would even bother with such trifling amounts. That's a long story for another day, but the bottom line is that Bitcoin isn't what it used to be. I wanted Bitcoin to be used as digital p2p cash, not just be a digital store of value (i.e. speculative asset), so I spent most of my coins. I don't regret it. Much. If you want more information on this aspect of Bitcoin's history, my brother co-authored a [book on the subject](https://www.amazon.com/Hijacking-Bitcoin-Hidden-History-BTC/dp/B0CXWBCWDR).)

Here's the cool way that this _could_ have happened:

I dig through the OpenBazaar database files, writing a custom script to extract the private keys then automatically checking them against a blockchain explorer to see if they have balances. My fleet fingers flit across my keyboard, then I slam Enter and watch  - hoodie hood fully deployed - the terminal in anticipation... the custom ASCII loading bar I built out of my sheer love for coding moves ever farther, as my focus narrows on the terminal output... 

50 BTC BALANCE FOUND. TIME TO RETIRE BRO.

Unfortunately the truth is much more mundane.

I spent some time diving into the keys in the various databases of various OpenBazaar instances. To make this long story slightly shorter, they contained no Bitcoin. I was careful to always move any remaining funds into the new wallet I was testing.

But - I found an Electrum wallet. Two, actually. Because this machine is offline (I'm not plugging in my Ubuntu 14 distro with Bitcoin keys on it), it hasn't synced to the blockchain, so I don't know if the balances are accurate. I see one of the wallets has a 2.97 BTC balance. Again, I can't even get excited - that much Bitcoin was something I would certainly have tracked and sent to a newer wallet at some point.

Unfortunately the wallet was password protected, meaning I couldn't just extract the seed and pop it into another Electrum wallet running on my Beast. I was paranoid about security back then. I'm paranoid about security today, but I was back then too.

I have various KeePass files floating around the filesystem. Oh boy. What a fun game this will be!

I eventually unlock a KeePass file and the Electrum wallets and... they're empty, the coins were moved ages ago. I must have had the seed backed up elsewhere, and imported them from a different machine. 

Oh well, it was a fun trip down memory lane.

## The Unexpected Reward

I decide to look back through my password manager though, and I notice another string of words, suspiciously like a Bitcoin seed phrase.

Here's the thing - we used this same scheme to backup the keys used for OpenBazaar's peer ID. So these seed phrases from this era aren't always Bitcoin. But what do I have to lose?

I type them into Electrum again, pressing Enter as the autocomplete suggestions pop up. As I finish the last word, the Electrum display changes the text at the bottom of the modal to say, "Seed Phrase: old." That's a good sign.

I click Next, and the wallet begins to synchronize transactions. This is a SPV wallet, meaning it doesn't need the full blockchain, and it syncs quickly. This is another good sign - multiple transactions means I was using it for a while.

My mental "don't get excited yet" wall is being torn down as the transaction count builds up. Are these finally the forgotten coins of my crypto daydreams?

It finishes loading. I look at the balance: **0.0464 BTC**

Electrum automatically displays the dollar amount: **$4,498**.

!!!

I'm a bit stunned. It may not be the early retirement of my crypto daydreams, but I'll take it.

I've never been happier to repair a linux distro for a friend.

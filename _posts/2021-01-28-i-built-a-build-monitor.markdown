---
layout: post
title:  I built a build monitor
date:   2021-01-28 00:00:00 +0000
category: guides  
tags:
    - Observability
    - Tech
    - CI/CD 
    - Path to Production
image: /assets/2021-01-28-i-built-a-build-monitor/lonely.gif
code: https://github.com/mzworthington/gpio-build-monitor
tech:
    - CircleCI
    - Raspberry-pi
    - Python
---

Christmas is usually a time for me to catch up with friends and family. Every day tends to be filled with drinks and dinners with friends or recovering on the sofa, it's an enjoyable few weeks in which I am not particularly productive. This year is different. The pandemic ruined everyone's plans and I now have lots of time on my hands, this is a perfect opportunity to learn something new.

<!--more-->

I wasn't sure what I wanted to do, so I started by outlining some constraints

## The project must be

### Technical

The last few months I haven't grown my technical skills, I had got myself in a little bit of a rut. My team and I had gotten into a good flow building a new application. We knew the domain well, the requirements were super clear, our backlog was well refined. This all sounds like a dream, however each day I would write a bit of Java, maybe a bit of React, occasionally tweak a pipeline or two, it was much the same each day. This wasn't a bad thing, but I hate feeling stale and wanted something that would excite me. I also knew I wanted a break from Java and React.

### Tangible

This opportunity felt unique (I hope it's unique). I wanted a reminder of what I did over this period, something I could see in my house, not hidden away in a repo. This had to be something I could touch.

### Useful

I don't have a particularly long attention span. I get bored pretty quickly and jump from shiny new thing to shiny new thing. I’ve realised that when I’m building something that I don't have a use for (things like todo list and hello world apps), I tend to lose interest pretty quickly, I get setup, I write a test, I close my laptop. But when I’m building something that I know people will use or that will solve a problem I get obsessed, it fills my head and I'm overcome with excitement.

### Open source

If it has a use for me, it might have a use for someone else. And if I'm lucky folks might even contribute making it even more useful for everyone. 

### Fast lead time

I only have a few weeks, I didn't want the new year to come around with nothing to show for my time. I wanted to be able to build and release something quickly. If I feel that its useful I’m sure I will iterate on whatever I build, but the first version of whatever I’m building must be done by the new year.

### Small footprint 

I do not have a very big house. Whatever I was going to build must fit in my office, a small box room that was already feeling pretty cramped.

<hr/>

## What could I build? 

So now I had my constraints I could start to think about what I could build. I thought about the amount of information I used to have available to myself when I worked in an office with real people. We had information radiators everywhere. 

Something I really missed was a big, bright build monitor.

[![monitor](/assets/2021-01-28-i-built-a-build-monitor/monitor.webp){:style="max-height:500px"}](/assets/2021-01-28-i-built-a-build-monitor/monitor.webp)

Understanding the state of my pipelines at a glance is incredibly valuable and something I really missed.

Now I know there are solutions to this. I could read the emails I get on each broken build or open a tab on my browser with the monitor status, or I could even install plugins. But for me none of these really worked.

I try to put time aside to read and reply to emails, if I don't do this I’m constantly jumping around never finishing anything. I set aside mornings, just after lunch and end of day to go through my emails. If my build is broken this would not work and I would finish a (bad)day with an inbox like this.

[![email](/assets/2021-01-28-i-built-a-build-monitor/email.webp){:style="max-height:500px"}](/assets/2021-01-28-i-built-a-build-monitor/email.webp)

I’m not sure why I abuse tabs as much as I do, I can never seem to just close them down. I spend a day opening tab after tab, barely spending more than a few minutes on each, and when I want to find something I know I have open I tend to just open another tab. Having a build status page open in my mess of a browser carries zero value, it's just another tab that will never be looked at again.

[![tab](/assets/2021-01-28-i-built-a-build-monitor/tab.webp){:style="max-height:500px"}](/assets/2021-01-28-i-built-a-build-monitor/tab.webp)

I really like CC tray; I think it's a lovely app that does a great job, however some of the build server technologies that I’m using do not currently work with CC tray without some tweaking. These are usually solved problems that just require some small bit of data manipulation to get working, but they go to the bottom of my priority pile, always something that I’ll get to later.

I also decided that I wanted to decouple my laptop from my build server, in the same way as the office. I wanted to know the state of my builds regardless if my laptop was open or not. I wanted to be able to look away from my screen and quickly know if a build needed my attention.

<hr/>

## So I got to work 

| I bought some stuff                    | [![stuff](/assets/2021-01-28-i-built-a-build-monitor/stuff.webp)](/assets/2021-01-28-i-built-a-build-monitor/stuff.webp)     |
| And I got my Pi up and running.           | [![pi](/assets/2021-01-28-i-built-a-build-monitor/start-pi.webp)](/assets/2021-01-28-i-built-a-build-monitor/start-pi.webp) |
| I turned on some lights                   | [![lights](/assets/2021-01-28-i-built-a-build-monitor/lights.webp)](/assets/2021-01-28-i-built-a-build-monitor/lights.webp)  |
| Started to throw together a bit more code | [![code](/assets/2021-01-28-i-built-a-build-monitor/code.webp)](/assets/2021-01-28-i-built-a-build-monitor/code.webp)     |
| I bought a frame                          | [![frame](/assets/2021-01-28-i-built-a-build-monitor/frame.webp)](/assets/2021-01-28-i-built-a-build-monitor/frame.webp)     |
| Drilled some holes                        | [![holes](/assets/2021-01-28-i-built-a-build-monitor/holes.webp)](/assets/2021-01-28-i-built-a-build-monitor/holes.webp)     |
| Installed my program                      | [![install](/assets/2021-01-28-i-built-a-build-monitor/install.webp)](assets/2021-01-28-i-built-a-build-monitor/install.webp)     |
| Started the monitor on reboot             | [![reboot](/assets/2021-01-28-i-built-a-build-monitor/reboot.webp)](/assets/2021-01-28-i-built-a-build-monitor/reboot.webp) |
| And got visibility back!                  | [![visible](/assets/2021-01-28-i-built-a-build-monitor/visible.webp)](/assets/2021-01-28-i-built-a-build-monitor/visible.webp)|

<hr/>

## How does it work?

Starts with a configuration file.

[![config](/assets/2021-01-28-i-built-a-build-monitor/config.webp)](/assets/2021-01-28-i-built-a-build-monitor/config.webp)

I then abstracted the basic functionality of the lights away behind a board service.

[![board](/assets/2021-01-28-i-built-a-build-monitor/board.webp)](/assets/2021-01-28-i-built-a-build-monitor/board.webp)

And made sure it runs on my machine...

[![fail](/assets/2021-01-28-i-built-a-build-monitor/fail.webp)](/assets/2021-01-28-i-built-a-build-monitor/fail.webp)

Unsurprisingly my mac is not compatible with a GPIO board. I decided on a quick and easy workaround. When I'm running locally I will use a stub of the library and when I'm running with the optimized flag I will use the GPIO library. This should give me the flexibility I want and allow me to cotinue building the app on my laptop.

[![mock](/assets/2021-01-28-i-built-a-build-monitor/mock.webp)](/assets/2021-01-28-i-built-a-build-monitor/mock.webp)

I then started on the integrations. I wanted to monitor my CircleCI and GitHub Action pipelines to start with. Both have really easy to use and well documented APIs.

[![integration](/assets/2021-01-28-i-built-a-build-monitor/gha-integration.webp)](/assets/2021-01-28-i-built-a-build-monitor/gha-integration.webp)

I have many pipelines running over many servers. I want to aggregate these results. I also wanted to get my results as quickly as possible. Using asynctio I would fire off all the requests for the configured pipelines in 1 go. I would also set an is_running flag, allowing me to light up an LED on the monitor. I could then aggregate the results, using this aggregate to display the status of all my builds.  

[![aggregate](/assets/2021-01-28-i-built-a-build-monitor/aggregate.webp)](/assets/2021-01-28-i-built-a-build-monitor/aggregate.webp)

Now I need to turn on some lights.

- If the is_running flag is try the blue light would turn on
- If **all** the builds are passing the green light would turn on (and red light off)
- If **any** of the builds are not passing the light red would turn on (and green light off)
- If **any** of the builds are building the yellow light would pulse
- If **any** of the builds have an unknown status the red and green light would turn on
- If there has been a connection issue the purple light would turn on (not pictured)

[![blink](/assets/2021-01-28-i-built-a-build-monitor/blink.webp)](/assets/2021-01-28-i-built-a-build-monitor/blink.webp)

And my first iteration is done! 

1. Read the config
2. Setup the logger
3. Setup the board
4. Get build status
5. Show user 
6. Wait
7. Rinse and repeat

[![overview](/assets/2021-01-28-i-built-a-build-monitor/overview.webp)](/assets/2021-01-28-i-built-a-build-monitor/overview.webp)

<hr/>

## How to build your own

### Shopping list

| Item                  | Price     |
| --------------------- | --------- |
| Raspberry pi zero     | £9.30     |
| LEDs                  | £0.02 X 5 |
| Resistors             | £0.01 X5  |
| Frame                 | £4.00     |
| Switch                | £3.00     |
| Solder                | £0.01     |
| SD card               | £4.08     |
| --------------------- | --------- |
| **Total**             | £20.54    |

### Software

**Python 3.8**

`pip3 install git+https://github.com/mzworthington/gpio-build-monitor#egg=monitor`

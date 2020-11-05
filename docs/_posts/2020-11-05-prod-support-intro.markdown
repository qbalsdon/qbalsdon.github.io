---
layout: post
title:  "Sleeping with one eye open: Experiences with production support"
date:   2020-11-05 00:00:00 +0000
categories: Soft skills
---

 > You wake up and two phones, your iPad and watch are ringing. It's 2am and you see there are messages on all the devices and eventually you become conscious enough to realise something is wrong. You roll out of bed, answer the work phone, and realise you've been called to assist in a live production issue. What now? Now, it's time to shine.

I've been doing production support for an app for nearly three years. At any given point in the day we could have had 100000 people using the app live. It's my intention to share some of my learnings in a manner that will be a benefit to others. I've made a lot of mistakes, but thankfully none of them ever lead to complete shutdown. Whether you're supporting a shiny new app or a long running system hopefully some of the experiences I've had may be of help to someone just getting started.

I remember being one of the 30 million customers affected by the [O2 certificate issue in December 2018][o2-outage], and I looked on at TSB in absolute horror when a [botched IT upgrade][tsb-meltdown] led to over 1.9 million customers not having access to their accounts from the 20th of April to the 20th of May 2018. These incidents are not isolated, and it's my hope that we can take a page out of Monzo's book, where they actually managed to get [good press][monzo-success] from an outage by being open, honest and non-confrontational with their customer base.

I am going to divide the discussion into a series of parts:

 1. Put on the right hat: Assuming the role of a support engineer
 1. Ask questions: Getting to know the problem
 1. Have your tools ready: Being ready for analysis
 1. Trust your team: Code reviews, quality assurance and best practice are your friends
 1. Take downtime: Ensure you recover
 1. Reflections: What does the ideal production support structure look like?

[o2-outage]: https://www.theguardian.com/business/2018/dec/06/o2-customers-unable-to-get-online
[tsb-meltdown]: https://www.theguardian.com/business/2018/jun/06/timeline-of-trouble-how-the-tsb-it-meltdown-unfolded
[monzo-success]: https://econsultancy.com/monzo-outage-is-it-possible-to-fail-in-a-good-way/

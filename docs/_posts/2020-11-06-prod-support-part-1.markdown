---
layout: post
title:  "Experiences with production support, Part 1: Put on the right hat"
date:   2020-11-06 00:00:00 +0000
categories: Soft skills
---

Obviously when you get called out in the middle of the night no one cares what you are wearing, as long as you are wearing something. The idea is make sure you are not trying the perform the role or follow the agenda you may have whilst going about your day-to-day.

The most important task for a production call out is to **diagnose the problem, delegate work and determine next steps**. You might be a software engineer, quality assurance tester or a scrum master by day, but by night you need to step in as the force of reason for figuring out the problem, and help resolve the issue as best and as quickly as possible. Your skills might come in handy, but more often than not I have found that experience can bring bias with it, especially when tensions are high and you are being rushed to fix a problem. Add fatigue and frustration, and people aren't exactly at their best.

 > As a development team we were always trying to get time allocated to refactoring a particular feature in the code. It was mostly written in JavaScript and caused us no end of headaches. We even warned that it would eventually fail and cause production issues. It never did fall over, but the temptation, whenever an issue was raised, was to blame that part of the code in the hopes that we would get to re-write it.

In ["Thinking, Fast and Slow"][TFS], Daniel Kahneman introduces readers to the [S.O.C.S technique][SOCS], which I have found particularly helpful while doing production support:
 - Analyse the **S**ituation
 - Make a list of **O**ptions
 - Present the options and discuss the **C**onsequences
 - Choose the **S**olution with the best possible outcome

I care about my code and I care about the particular features that I write. No matter how many call-outs there were I have always found myself checking my Android features first, even though over 60% of our customer base were using iOS, and I needed to remember there was also desktop and web solutions. Generally when encountering an issue it's better to be agnostic and try to view all systems equally so they aren't overlooked.

As someone looking after the front end, we were the first group to be alerted when there was an issue. However just because there is a problem being reported on the front end doesn't mean that the front end is the _**root cause**_ of the issue. It is really pertinent that as a support engineer you stay focussed on the diagnosis of the issue. More on this in the next post about [Asking questions][PART3].

Usually on the team we would have two engineers assigned to support. We called these roles primary and secondary. Primary was the person on most high alert, and if they became unavailable or overwhelmed, the secondary would get called out. These roles were really helpful when bigger call-outs happened. After that we could escalate to management if there was something we felt was beyond our control or we needed to make changes in the availability of the application features.

 > There was an instance when a [Hardware Security Module][HSM] in one of our data centres failed. Another team member had to drive a new one to the DC in order to replace it, while the Primary and I (Secondary) remained and dealt with the call out. What went really well is that Primary remained on point, dealing with re-routing, load management and mitigation, while I took on communication, dealing with the flurry of management questions and answers so that the Primary could focus and only have pertinent questions filtered, keeping me up to date so I could communicate out. It didn't really matter who was doing what, we just agreed on a course of action quickly and got stuck in.

Knowing who to call for what kind of issue was always of utmost importance. Knowing that escalation was about getting permission, having a contact for other teams if the problem was higher up in the pipeline. It's calming to know that there is a team behind you, and very reassuring that when these things happen, you are not alone. This will be discussed further in [Part 4: Trust your team][PART4].

Having clearly defined roles is critical when supporting software, just as much as knowing the roles of the other players on your team. When an incident occurs, you want to be as _*effective as possible as quickly as possible*_. Nothing will ever be more important than executing a plan.

[TFS]: https://www.amazon.co.uk/Thinking-Fast-Slow-Daniel-Kahneman/dp/0141033576
[SOCS]: https://shelleybablitz.focalpointcoaching.com/blogs/solve-problems-with-the-socs-model
[HSM]: https://en.wikipedia.org/wiki/Hardware_security_module
[PART3]: https://qbalsdon.github.io/
[PART4]: https://qbalsdon.github.io/

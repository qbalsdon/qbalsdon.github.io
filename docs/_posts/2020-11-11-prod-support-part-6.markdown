---
layout: post
title:  "Experiences with production support, Part 6: Reflections"
date:   2020-11-11 00:00:06 +0000
categories: Soft skills
comments_id: 8
---

What would I have changed in the last few years of production support? Short answer: a lot.

> Once there was a breakdown on the server that ran the alerting tool. The problem is that the tool was running on the main production server and that server was also the load balancer. So not only was there a problem, the load balancer was out, **and** we didn't get notified.

### Device utilisation

I should have made better use of the fact that I have a work phone and a personal phone. Having an Apple watch to stay connected was very helpful, but using one phone as my "this means I'm on call" phone should have been the route I went down. Once I missed a call out, and after that I was so worried of letting the team down again, I set up all my devices. Two phones, watch, iPad, kitchen sink - if I could connect it, I did. The problem is when you actually get called the house lights up like a disco, and my partner is not the one on call.

### Rotation management

I came up with a fairly easy way to indicate on my calendar that I was on call. However, it would have been better if there was a system in place. I'll explain one of my more "formal" experiences and then give my recommendation on how to improve.

I found that the humans creating the support calendar would struggle to evenly distribute the team for support shifts given their availability. We'd fill in a Doodle poll of our availability, and then we'd have to extract a report telling us when we were on call. The system would not tell us who we were on call with, and could only tell us two things: If you were on call, and if you were primary. This is a good lesson in reading between the lines to obtain information, but also a fantastic example of reporting fails.

I proposed an end-to-end solution:
1. Support staff can log into a dashboard that lists the requirements for being on duty and whether you have met them (and provide mechanisms for obtaining them). The engineer can integrate their calendars and then determine in the next month when they will be willing to make themselves available.
1. Managers can log in and see the calendar of availability. The system will have a recommendation ready based on how much that staff member has been on call in the past (experience) and how utilised they have been for the upcoming month. As a staff member becomes more or less utilised their recommendation level decreases or increases.
1. Once a schedule has been published, then system creates entries in staff members calendars. The entry will contain specific details about their role, partner and escalation contacts.
1. Staff members who cannot make their shift for whatever reason can use the system to update their availability at any given moment, with a link in the calendar entry. The system should be capable of requesting another user take their place, with an agree / disagree link.

Some more global companies are opting for a "follow the sun" approach where people are on call only during work hours. Other than being extremely resource heavy, it requires more handover, management and domain knowledge.

### Releasing from ~~master~~ main

I do feel that it's really difficult knowing what is going to be released when you create a release branch from main, and all PR's are merged into main. I find this practice dubious and very worrying. I feel that tickets should be merged into a feature branch and those features absorbed into a release when they are ready. Then merge release branches into main.

I know this is going into branching management, and this is religious ground for some. I'm just pointing out that how you create release branches is extremely important and I don't think organisations as a whole have fully understood what is sneaking out into the wild.

### Conclusion

I hope that I have achieved my goal: sharing my ideas and experiences in a manner that is helpful to the reader. Supporting live software is not an easy task, and the burden grows with the user base. The network effect is a phenomena I find more and more interesting. If you need to do production support it means your application is truly alive and even potentially vital.

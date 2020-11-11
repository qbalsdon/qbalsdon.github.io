---
layout: post
title:  "Experiences with production support, Part 3: Have your tools ready"
date:   2020-11-10 00:00:03 +0000
categories: Soft skills
comments_id: 4
---

> One of the strangest and most complimentary requests when I left one of my teams was to distribute an export of my bookmarks. I realised we had done a lot of screen sharing and the team must have seen how I organise myself.

Tooling can be several elements. It can be your run books, reports, or even your bookmarks. It's really important that when a call out happens, that you know where to start finding out what is going on.

### Access

The most important part of any toolkit is maintaining access to those tools. I would strongly recommend some system for informing a user that they either do not have access to something they may need *before* they become active on production support, otherwise they may not be able to perform their function.

> At once place we had a 3 month "no use" policy in place where if the system went unused, access would automatically be revoked. This posed a serious problem because there was no warning that access was going to be removed and no mechanism which made it clear WHICH tool was being revoked, or how to re-obtain or maintain access. There was a period for a few months where I was the only person in the team with access to a particular critical system, and so I would get called out to make production changes even when not on support.

A lot of the time, I do not feel that documentation is the most useful manner of maintaining these things. In a future post I'm going to talk about how much I love scripting, but it's lead me to see that if you have a *script* or some system, it usually means that it gets maintained a lot better than documentation. I prefer my documentation to live a little. It also means that changes to the manner in which access is maintained can be managed better.

### Run books

The team had collaboratively decided that for every feature, there would be a [run book][RUNBOOK]. The run book had on it:
 - The name of the feature
 - The core team responsible for delivery
 - Emergency contact information
 - Status report link
 - Architecture diagrams (dependency lists)
 - Repository link

This was reviewed by the support team before the feature went live. This allows us to quickly access the specific information for that feature and gain access quickly if needed.

### Reports

To paraphrase [@stahnma][TESTINGQUOTE]:

> Everyone has a testing environment, it's only the fortunate who separate it from production.

It may seem obvious, but reporting on a live production app is absolutely critical. However it's important to remember that in production you are dealing with a few factors:
 - Obfuscated code: Your crashes are not always going to be as readable as you like. I recommend you know how to [deobfuscate][DEOBFUSCATE] your production code.
 - Anonymised data: You may not be able to isolate a particular user, only a session - so remember to have anonymised session id's when a user accesses the system so that you can at least follow a journey. It's also vital to remember to maintain your own integrity when on a call out - do not take user passwords or other personal information.
 - The data you have. Remember you can only obtain information on what is logged, and problems may be occurring in areas you may not have thought of before. Being able to read in between the lines is such an important step when attempting to reproduce an issue.

Some of the more interesting issues I have seen:  
- ISP filtering of specific packet types causing massive slow downs and timeouts.
- Device settings specific web view rendering problems
- Invisible 3rd party OEM security issues. e.g. [The Samsung S10 fingerprint debacle][S10HACK]

Having an accessible reporting tool in place that is reliable is critical. You don't want to be working with 20 minute old data, or something that takes a while to warm up. I had a tool once that would freeze once the very small database was full, required to be re-built and once built would lose all previous data. It was not a great experience for diagnosis.

### Communication

I have found having multiple communication tools incredibly frustrating over the years. I remember being on a call where we were using an internal tool, Slack, WhatsApp, text messages and email to communicate with different parties. Not only does this lend itself to problems in getting information to relevant parties, pose a massive security threat to the business, but it's blatantly distracting. Use one tool to which everyone has access. And remember that you are dealing with confidential and proprietary information.

Keeping in touch with the team during a call out is essential, you'll be sending and receiving information at all times and need to be flexible enough to change focus at a moments notice. If you follow the primary / secondary model, know who your partner is and how to contact them quickly.

[RUNBOOK]: https://en.wikipedia.org/wiki/Runbook
[DEOBFUSCATE]: https://support.google.com/googleplay/android-developer/answer/9848633?hl=en-GB&visit_id=637405961451784697-1905723958&rd=1
[TESTINGQUOTE]: https://twitter.com/stahnma/status/634849376343429120
[S10HACK]: https://arstechnica.com/gadgets/2019/10/galaxy-s10-fingerprint-reader-defeated-by-screen-protectors-phone-cases/

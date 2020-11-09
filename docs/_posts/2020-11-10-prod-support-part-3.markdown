---
layout: post
title:  "Experiences with production support, Part 3: Have your tools ready"
date:   2025-11-10 00:00:03 +0000
categories: Soft skills
comments_id: 4
---

> One of the strangest and most complimentary requests when I left one of my teams was to distribute an export of my bookmarks. I realised we had done a lot of screen sharing and the team must have seen how I organise myself.

Tooling can be several elements. It can be your run books, reports, or even your bookmarks. It's really important that when a call out happens, that you know where to start finding out what is going on.

### Access

The most important part of any toolkit is maintaining access to those tools. I would strongly recommend some system for informing a user that they either do not have access to something they may need *before* they become active on production support, otherwise they may not be able to perform their function.

> At once place we had a 3 month "no use" policy in place where if the system went unused, access would automatically be revoked. This posed a serious problem because there was no warning that access was going to be removed and no mechanism which made it clear WHICH tool was being revoked, or how to obtain or maintain access. There was a period for a few months where I was the only person in the team with access to a particular critical system, and so I would get called out to make production changes even when not on support.

### Run books

The team had collaboratively decided that for every feature, there would be a run book. The run book had on it:
 - The name of the feature
 - The core team responsible for delivery
 - Emergency contact
 - Status report link
 - Architecture diagrams



---
Make sure you have the access you need, and a mechanism for ensuring that you still have access. Also make sure you aren't the only one with that access.

Stay in contact. Know who is with you

Use reports - try to make reports before a callout happens. The business generally cares about money lost, so anything that prevents users from spending money are to be considered core business journeys. Also be able to read between the lines. Reports can only tell you what is, and the information is actually fairly brittle. 1000 crashes does not mean a single user crashed 1000 times but also does not mean 1000 users crashed once either.

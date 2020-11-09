---
layout: post
title:  "Experiences with production support, Part 2: Ask questions"
date:   2020-11-09 00:00:02 +0000
categories: Soft skills
---

 > "One of the first things taught in introductory statistics textbooks is that correlation is not causation. It is also one of the first things forgotten. - [Thomas Sowell][CAUSE]"

If you come out sounding like an expert on something and it turns out you're wrong, it's very difficult to come back. Reputational damage can only be undone over a long period of time.

What does a term mean? Admit when you don't understand

Separate concerns: Is it happening on both Android and iOS? What about web or desktop?

What is the evidence of the problem? Evidence is tricky because the source may not always be reliable. I have had experienced QA's tell me the app is crashing when all it was doing was reporting an error. Clarifying steps to reproduce is extremely important and can be very tricky. I have had people tell me they open a screen and then go back, and I assumed that they waited for loading to complete before going back, only to find hours later that they didn't wait for it to load, or they were in a specific orientation. It's always best to be able to reproduce first before assuming you know what the issue is.

Called out because a manager was monitoring DownDetector.com

What caused the call out? Twitter complaint, system report (based on historic usage), management personal device? All of these tell you something, and all information is useful.

When did we last make changes? What were those changes? How easy is it to go back?

|                      | App           | Backend component |
| -------------------- | ------------- | ----------------- |
| Lag                  |               |                   |
| Crash                |               |                   |
| Service availability |               |                   |
| Connectivity         |               |                   |
| Baseline variance    |               |                   |



Your direct affiliates are not always responsible either - every time Samsung does an update, or a new phone gets developed, you have a new affiliate. Understanding fragmentation beyond just the scope of Android is very important.

Determine the impact: To customers and to the business

 - Feature affected
 - Reports
 - Users affected
 - Downtime
 - Resolution

Asking questions can also help when attempting to suggest the cause of an issue. I have found that rather than making blanket statements, but asking questions, helps guides conversations.

 > There is a big difference between stating "The payments is failing" and asking "I see that our users are getting 401 errors when trying to make a payment, could it be that sessions are being expired prematurely?"

 [CAUSE]: https://www.quotemaster.org/q0695e82f492f6f87510558b1e9bda9a9

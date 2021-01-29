---
layout: post
title:  "A11y"
date:   20yy-MM-dd 00:00:00 +0000
categories: Accessibility
comments_id:
---

<!--
screenshot tests for a11y
https://www.polidea.com/blog/accessibility-mistakes-to-avoid-when-implementing-it-in-an-android-app/
https://www.w3.org/TR/WCAG20/

Look up US, UK and EU laws regarding accessibility
https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps

Accessibility is a
 - design
 - development
 - testing
 - quality assurance
 - i18n
activity
ignore any element in the SDLC at design time and you risk having enormous fixes

Accessibility as a concept is less popular than the least popular language on SO
https://insights.stackoverflow.com/trends?tags=accessibility%2Cjulia

Respect our end users - passive exclusion
Inclusion of differently abled
More than just a minimum legal requirement

DANGER: Last minute regulation compliance leads to overtime and poor quality
Design implications

Comes down to a problem in refinement - it's not considered part of DoD

Write more tests
Lint Rules
Google do something but it's not enough

Screen shot tests with font size changes: https://stackoverflow.com/questions/32692459/how-to-change-font-size-by-adb-command

Ensuring that testers can test a11y means creating entry points for various states

https://getaccessible.com/

Practical advice:
 - Write lint checks
 - kotlin extension functions for setImageResource
 - use the libraries
 - android:contentDescription="@null" :O

 https://withintent.uncorkedstudios.com/tutorial-debugging-android-accessibility-818cfd361414
 > Here’s the crux of the issue: __**many developers don’t to know the difference between something that “fixes the problem” and something that makes their app inaccessible.**__ In attempting to make a quick fix, we eliminate our ability to make an accessible choice.
-->

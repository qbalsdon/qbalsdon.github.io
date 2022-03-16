---
layout: post
title:  "View Binding: Yes DataBinding: No"
date:   20yy-MM-dd 00:00:00 +0000
categories: Android ViewBinding DataBinding
comments_id:
---

By the time I publish this, Jetpack compose is already a thing and most people are probably using that. However in my latest project I have hd the ~dis~pleasure of using ViewBinding, a Butter-knife (link) like approach to "simplifiying" Android data binding to XML.

Problems with binding:
1. Custom view don't work in preview
1. Mixing up references if you have nested XML files
1. Unused variables are not marked as such
1. Hard coding package names into strings
  1. Stylistically awful
  1. Means if I want to reuse the view, I have to reuse the data structure


<!--
screenshot tests for a11y
https://www.polidea.com/blog/accessibility-mistakes-to-avoid-when-implementing-it-in-an-android-app/
https://www.w3.org/TR/WCAG20/

Look up US, UK and EU laws regarding accessibility
https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps

Accessibility is a
 - ethical
 - design
 - development
 - testing
 - quality assurance
 - i18n
activity
ignore any element in the SDLC at design time and you risk having enormous fixes

Accessibility as a concept is less popular than the least popular language on SO
https://insights.stackoverflow.com/trends?tags=accessibility%2Cjulia

"It's not about designing for disabilities - it's about designing for all users"


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

 https://developer.android.com/codelabs/a11y-testing-espresso#0
 https://github.com/google/talkback/tree/92eb6dd4461e53fc904052b7fbe9b77ddfbf930a
 https://medium.com/microsoft-mobile-engineering/android-accessibility-resolving-common-talkback-issues-3c45076bcdf6
-->

<!--
PRESENTATION

DEFENCE OF A11y
 - Addressing an issue before it's a problem
 - Data - % of a11y users
 - Cost of non-compliance
   - Bad user experience - look for reviews online
   - Security (vulnerable users)
   - Lawsuit
 - Acknowledge it takes time and effort

STATE OF THE NATION
 - The good, the bad and the ugly

GUIDES
 - Common mistakes
 - Where to find info
 - Existing tools
 - Our tools
-->

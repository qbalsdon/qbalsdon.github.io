---
layout: post
title:  "Mobile Screen Reader Cheat Sheets"
date:   2023-05-10 00:00:00 +0000
categories: Accessibility, Testing, TalkBack, VoiceOver
comments_id: 21
---

1. [Introduction](#introduction)
2. [Cheat sheets](#cheat-sheets)
3. [Off and on again](#turning-on-and-off)
4. [Conclusion](#conclusion)

## Introduction

I was watching a [Deque talk on how to use Talkback][0] and some of the sections stuck with me: 
- ["How non-sighted users use TalkBack"][1]
- ["How partially sighted users use TalkBack"][2]

And it got me thinking, "~~How~~ do developers use TalkBack?" I have to admit learning how to use it was not a fun experience for me, and normally learning it comes from necessity. I only learned about actions a year ago, and I've been doing this for a while as a specialization.

## Cheat sheets

### Android

[Download the Android Cheat Sheet][3]

<table style="text-align: center;">
    <tr><td colspan="3"><b>GESTURES</b></td></tr>
    <tr>
        <td>Next element<br/><img src="/images/cs_an_01_next.png" width="50%"/>Single finger swipe<br/>left to right<br/><code>ALT + →</code>
        </td>
        <td>Previous element<br/><img src="/images/cs_an_02_previous.png" width="50%"/>Single finger swipe<br/>right to left<br/><code>ALT + ←</code>
        </td>
        <td>Tap or activate<br/><img src="/images/cs_an_03_activate.png" width="50%"/>Single finger swipe<br/>double tap<br/><code>ALT + ENTER</code>
        </td>
    </tr>
    <tr>
        <td>Scroll down<br/><img src="/images/cs_an_04_scroll_down.png" width="50%"/>Two finger swipe<br/>lower to hight<br/><code>↓</code>
        </td>
        <td>Scroll up<br/><img src="/images/cs_an_05_scroll_up.png" width="50%"/>Two finger swipe<br/>higher to lower<br/><code>↑</code>
        </td>
        <td>Back<br/><img src="/images/cs_an_09_back.png" width="50%"/>Single finger swipe<br/>down then left<br/><code>ALT + BACKSPACE</code>
        </td>
    </tr>
    <tr>
        <td>Choose granularity<br/><img src="/images/cs_an_06_granularity.png" width="50%"/>Single finger swipe<br/>"V" or "^" shape<br/><code>CTRL + ALT + SHIFT + ↓</code>
        </td>
        <td>Next at granularity<br/><img src="/images/cs_an_07_granularity_next.png" width="50%"/>Single finger swipe<br/>lower to higher<br/><code>ALT + ↓</code>
        </td>
        <td>Previous at granularity<br/><img src="/images/cs_an_08_granularity_previous.png" width="50%"/>Single finger swipe<br/>higher to lower<br/><code>ALT + ↑</code>
        </td>
    </tr>
    <tr>
        <td colspan="3">
        Open menu<br/><img src="/images/cs_an_10_actions.png" width="15%"/>Single finger swipe<br/>Up and right<br/><code>ALT + SPACE</code>
        </td>
    </tr>
</table>

### iOS

[Download the iOS Cheat Sheet][4]

<table style="text-align: center;">
    <tr><td colspan="3"><b>GESTURES</b></td></tr>
    <tr>
        <td>
            Next element<br/><img src="/images/cs_an_01_next.png" width="50%"/>Single finger swipe<br/>left to right<br/><code>→</code>
        </td>
        <td>
            Previous element<br/><img src="/images/cs_an_02_previous.png" width="50%"/>Single finger swipe<br/>right to left<br/><code>←</code>
        </td>
        <td>
            Tap or activate<br/><img src="/images/cs_an_03_activate.png" width="50%"/>Single finger<br/>double tap<br/><code>VO + SPACEBAR</code>
        </td>
    </tr>
    <tr>
        <td>
            Select reading control (rotor)<br/><img src="/images/cs_ios_14_rotor.png" width="50%"/>Two fingers<br/>Bottle cap "twist"<br/><code>VO + CMD + →</code>
        </td>
        <td>
            Next reading control<br/><img src="/images/cs_an_07_granularity_next.png" width="50%"/>Single finger swipe<br/>higher to lower<br/><code>↓</code>
        </td>
        <td>
            Previous reading control<br/><img src="/images/cs_an_08_granularity_previous.png" width="50%"/>Single finger swipe<br/>lower to hight<br/><code>↑</code>
        </td>
    </tr>
    <tr>
        <td>
            Back<br/><img src="/images/cs_ios_13_back.png" width="50%"/>Two finger swipe<br/>"Z" shape<br/><code>ESCAPE</code>
        </td>
        <td>
            Scroll down<br/><img src="/images/cs_ios_11_scroll_down.png" width="50%"/>Three finger swipe<br/>lower to hight<br/><code>OPTION + ↓</code>
        </td>
        <td>
            Scroll up<br/><img src="/images/cs_ios_12_scroll_up.png" width="50%"/>Three finger swipe<br/>higher to lower<br/><code>OPTION + ↑</code>
        </td>
    </tr>
    <tr>
        <td>
            Switch apps<br/><img src="/images/cs_ios_15_switch_app.png" width="50%"/>Four finger swipe<br/>Horizontal swipe<br/><code>VO + SHIFT + &#91;</code>
        </td>
        <td colspan="2">
            Use actions<br/><img src="/images/cs_ios_16_actions.png" width="55%"/>Open rotor, select action reading control, double tap<br/><code>VO + CMD + →, ↑, VO + SPACEBAR` </code>
        </td>
    </tr>
</table>

> VO = the modifier for VoiceOver commands: the Control and Option keys.

## Turning on and off

I want this to be brief, so that it's not an entire page. Turning off your assistive technology tools can be the most frustrating thing, so being prepared to turn it off is paramount to productivity and success. I recommend turning on, navigating a little and turning off just to try it out. Both devices offer a variety of shortcuts that borderline into the problematic when you try to document them all - discover what works best for you.

### Android

#### Off

{% highlight bash %}
adb shell settings put secure enabled_accessibility_services \"\";
settings put secure accessibility_enabled 0; 
settings put secure touch_exploration_enabled 0;
{% endhighlight %}

You may only need the first line, but I've tested on my fair share of devices to know it's not the same everywhere

#### On

On most phones:

> Open settings 
>   -> Accessibility 
>   -> TalkBack 
>   -> Use TalkBack

<button type="button" class="collapsible" data-expands="section_code_pixel_on">
Turning on TalkBack on a Pixel device with ADB
</button>
<div id="section_code_pixel_on" class="content">
{% highlight bash %}
adb shell settings put secure enabled_accessibility_services "com.google.android.marvin.talkback/.TalkBackService";
{% endhighlight %}
</div>

<button type="button" class="collapsible" data-expands="section_code_samsung_on">
Turning on TalkBack on a Samsung device with ADB
</button>
<div id="section_code_samsung_on" class="content">
{% highlight bash %}
adb shell settings put secure enabled_accessibility_services "com.samsung.android.accessibility.talkback/com.samsung.android.marvin.talkback.TalkBackService";
{% endhighlight %}
</div>

### iOS

#### On and off
> Open settings 
>   -> Accessibility 
>   -> VoiceOver 
>   -> Toggle on and off

## Conclusion

These cheat sheets are by no means exhaustive. Screen readers are complicated and how they are used even more so. There are far more comprehensive sheets out there, but I found them cognitively overwhelming. It's my hope that developers get better at using assistive technologies, as it empowers us to create better apps. I hope this is not overwhelming, but just enough to get you started and excited.


[AND_01]: /images/cs_an_01_next.png "Next"
{: height='100em' }
[AND_02]: /images/cs_an_02_previous.png "Previous"
{: height='100em' }
[AND_03]: /images/cs_an_03_activate.png "Activate"
{: height='100em' }
[AND_04]: /images/cs_an_04_scroll_down.png "Scroll down"
{: height='100em' }
[AND_05]: /images/cs_an_05_scroll_up.png "Scroll up"
{: height='100em' }
[AND_06]: /images/cs_an_06_granularity.png "Granularity"
{: height='100em' }
[AND_07]: /images/cs_an_07_granularity_next.png "Granularity next"
{: height='100em' }
[AND_08]: /images/cs_an_08_granularity_previous.png "Granularity previous"
{: height='100em' }
[AND_09]: /images/cs_an_09_back.png "Back"
{: height='100em' }
[AND_10]: /images/cs_an_10_actions.png "Actions"
{: height='100em' }
[IOS_11]: /images/cs_ios_11_scroll_down.png "Scroll down"
{: height='100em' }
[IOS_12]: /images/cs_ios_12_scroll_up.png "Scroll up"
{: height='100em' }
[IOS_13]: /images/cs_ios_13_back.png "Back"
{: height='100em' }
[IOS_14]: /images/cs_ios_14_rotor.png "Rotor"
{: height='100em' }
[IOS_15]: /images/cs_ios_15_switch_app.png "Switch app"
{: height='100em' }
[IOS_16]: /images/cs_ios_16_actions.png "Actions"
{: height='100em' }


[HEADINGS_RECYCLERVIEW]: /images/heading_recyclerview.gif "Headings navigation via a recyclerview"
{: height='500px' border='1px solid black' }

[0]: https://youtu.be/7KlwcAY_hRg
[1]: https://youtu.be/7KlwcAY_hRg?t=358
[2]: https://youtu.be/7KlwcAY_hRg?t=850
[3]: /resources/talkback_cheatsheet.pdf
[4]: /resources/voiceover_cheatsheet.pdf
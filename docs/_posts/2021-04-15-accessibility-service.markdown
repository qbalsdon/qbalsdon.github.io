---
layout: post
title:  "Android Accessibility Actions using the Android Debug Bridge"
date:   2021-04-15 00:00:01 +0000
categories: Android Kotlin Accessibility ADB
comments_id: 14
---

I recently asked a question on [StackOverflow][6] where I asked if it were possible to navigate an application in accessibility mode using the Android Debug Bridge. I am not one to just wait for an answer to appear, and came up with my own solution. The question got some nice attention early on, and since I wanted the answer to be concise, I answered to the bare minimum. However I would like to document a more fleshed out answer here.

The answer will need have three parts in order to be considered complete:
1. A script to enable the accessibility shortcut (once set up)
2. A broadcast receiver to respond the events that can then invoke the
3. Accessibility service to act on behalf of the user

[The code for this can be accessed here.][9]

## tl;dr Why?

It could be argued that plugging in a keyboard and using the [Switch Access][12] feature to navigate with accessibility can achieve the same goal with much less effort. In most user-oriented cases that would be a fair assessment. However, as a developer / automation tester, my device is normally plugged into my computer so that I can debug the code that I am currently writing, and it becomes tedious and diminishes focus if I constantly have to be changing cables, devices etc. Additionally, I used [scrcpy][16] in order to save my phone screen (and neck) and I have come to the conclusion that touching my device should be unnecessary in order to be effective at doing my job.

After a brief look into [Switch Access][12] I did find that the volume keys can navigate the app, but it does not work with `adb shell input keyevent KEYCODE_VOLUME_[DOWN | UP]` - which is unfortunate. While Google has expressly stated this option is [intended for developers][13] I found it cumbersome in that is adjusts the volume streams in addition to navigation, and not a solution as the ADB instructions are ignored.

![alt text][IMAGE_3] | ![alt text][IMAGE_4] | ![alt text][IMAGE_5] |

So switch access doesn't work, the next real question is "Why didn't the TalkBack team give us these controls elsewhere?" Great question, I have been [scouring for a good answer to this][17]. I think it has to do with the [**absolutely undeniable fact that managing focus is an accessibility anti-pattern**][15] as Qasid Sadiq puts it so eloquently:

> So something similar that people like to do is manage accessibility focus themselves. And again, this is a bad idea. accessibility focus has to be determined by the accessibility service, and just like announcements this creates an inconsistency in experience. And actually, that one of the biggest issues that accessibility users face, inconsistency, across applications and over time.
>
> You see, there are a lot of applications, and if you as an app developer decide to break with the paradigms of accessibility interaction from the rest of the system, you're making your users' lives frustrating, cause now that accessibility user, every time they open your application, they've got to throw out all of their expectations in terms of how their interaction works. And they've got to relearn this whole new UI at a very fundamental level.
>
> So the best thing you can do for your accessibility user is to maintain consistency over time and with a system.
>
> __[ - Qasid Sadiq, Google I/O 19 "Demystifying Android Accessibility development"][14]__

This is probably why there is no API for focus navigation on a programmable level. While I understand their goal in curbing abuse of that system, I do not believe my goals have never been to create a hack on behalf of someone else, but rather to make the automation and developer interaction with these systems much easier and ... well ... accessible. What I am not sure of, however, is that there is so much code that <a href="#super-important-caveat">__looks__ like it should work</a>.

## Understanding Accessibility on Android

I have come to the conclusion that there are 2 layers of input on Android. They are the "input" layer and the "accessibility" layer. When you type on the keyboard, perform swipe gestures, these actions are performed on the input layer. Some actions may get passed on to the accessibility layer, when it's enabled. However actions performed by the ADB input actions are NEVER (in my experience) passed to this layer. This would explain why `adb shell input ...` or simply recording a keyboard action and playing it back does not appear to work well with TalkBack. I have no reference for this other than the [Google documentation refers to two types of focus, namely input focus and accessbility focus][1]. It's not a far stretch, but I have no solid evidence for it.

The shorter part of the answer is that this is possible to do, but it's relatively involved, which is annoying. You can't perform an accessibility action via ADB, you would have to create an [Accessibility service][2] in order to [act on behalf of an Accessibility user][3] and create a [Broadcast Receiver][4] so that it can take input via the ADB. And so I did.

### Broadcast service: responding to ADB events

It's fairly simple to implement a [broadcast receiver][4]. There are two main elements upon which there are some points worth noting:
1. How and when the service is registered
2. Constructing intents for the Android Debug Bridge

A [broadcast receiver][4] cannot exist in isolation, running all the time, it has to have an association with some other lifecycle element. This is acceptable since the receiver itself cannot perform an accessibility action, for this the accessibility service is required. The registration of the service will be demonstrated in the next section.

The receiver that was implemented can take intents from other apps, as well as the ADB.

{% highlight bash %}
adb shell am broadcast -a com.balsdon.talkback.accessibility -e ACTION
    "ACTION_SWIPE_LEFT"
    "ACTION_SWIPE_RIGHT"
    "ACTION_SWIPE_UP"
    "ACTION_SWIPE_DOWN"
    "ACTION_FOCUS_ELEMENT"
        -e PARAMETER_ID "resourceId"
        -e PARAMETER_TEXT "some text"
        -e PARAMETER_TYPE "element type" --e DIRECTION "[DIRECTION_FORWARD | DIRECTION_BACK]"
        -e PARAMETER_HEADING "[DIRECTION_FORWARD | DIRECTION_BACK]"
    "ACTION_VOLUME_UP"
    "ACTION_VOLUME_DOWN"
    "ACTION_VOLUME_MUTE"
    "ACTION_VOLUME_SET" --ei PARAMETER_VOLUME 20
{% endhighlight %}

These are some of the commands I that I find the most tedious while working with accessibility - and I think the ability to control the volume was one of the better features. I find that the volume of the voice can sometimes be quite disruptive.

The receiver achieves this in the following manner:

{% highlight kotlin %}
override fun onReceive(context: Context?, intent: Intent?) {
    require(context != null) { "Context is required" }
    require(intent != null) { "Intent is required" }
    require(AccessibilityBroadcastService.instance != null) { "Service is required" }
    val serviceReference = AccessibilityBroadcastService.instance!!

    intent.getStringExtra(ACCESSIBILITY_ACTION)?.let {
        serviceReference.apply {
            when (it) {
                ...
                ACTION_SWIPE_LEFT -> swipeHorizontal(true)
                ACTION_SWIPE_RIGHT -> swipeHorizontal(false)
                ACTION_SWIPE_UP -> swipeVertical(true)
                ACTION_SWIPE_DOWN -> swipeVertical(false)
                ...
            }
        }
    } ?: serviceReference.swipeHorizontal(true)
}
{% endhighlight %}

There is an argument to be made for enabling the clicking of elements, however [my bash script][7] for achieving this does not require accessibility and works in conjunction with the service:

{% highlight bash %}
# !! PART OF A WHOLE OTHER REPO !!
#...
POS=$(sh midOf -e "$ELEMENT") # midOf gets the node-based UI from the ADB and parses the XML
adb -s $DEVICE shell input tap $POS
{% endhighlight %}

Although since the original publication I have decided to perform the action on behalf of the user:
{% highlight bash %}
adb shell am broadcast -a com.balsdon.talkback.accessibility -e ACTION "ACTION_CLICK"
{% endhighlight %}

#### Super important caveat!

It's important to note that I have been very specific in naming the actions. For example, ACTION_SWIPE_LEFT and ACTION_FOCUS_ELEMENT(PARAMETER_HEADING: BACK) seem as if they should be more closely related - in the sense that a swipe LEFT should focus the previous node in the hierarchy according to one set of granularity, and ACTION_FOCUS_ELEMENT(PARAMETER_HEADING: BACK) is just the "headings only" version of that granularity. This was the original intention, as it's dangerous to do a left swipe and expect to go back to the previous element, since the action associated with the gesture can be modified by the user.

The reasoning here is twofold:
  1. I wanted to ensure developers are aware of what they are getting exactly what they ask for, and
  2. the accessibility team has [not made their transversal algorithm available through an API][17], and so in the default granularity, selecting the next and previous nodes would require a re-write on this side and therefore have no guarantee of one-to-one behaviour. I have also tried the following, which simply yields a NullReferenceException:

  {% highlight kotlin %}
    val currentNode = findFocus(FOCUS_ACCESSIBILITY)
    if (currentNode != null) {
      val nextNode = currentNode.focusSearch(FOCUS_FORWARD)
      if (nextNode != null) { // always get a null here :(
        nextNode.performAction(ACTION_ACCESSIBILITY_FOCUS)
      }
    }
  {% endhighlight %}
### Accessibility service: Acting on behalf of the user

The [Google documentation][2] defends the creation of an accessibility service in the following manner:

> An accessibility service is an application that provides user interface enhancements to assist users with disabilities, or who may temporarily be unable to fully interact with a device. For example, users who are driving, taking care of a young child or attending a very loud party might need additional or alternative interface feedback.

There is a [Google codelab][18] which takes developers through a journey of explaining the different elements of an accessibility service. The highlights are:

  - The service implements the [`AccessibilityService`][8] class and implements the `onServiceConnected` method. This is where the our receiver is registered
{% highlight kotlin %}
override fun onServiceConnected() {
      registerReceiver(accessibilityActionReceiver, IntentFilter().apply {
          addAction(ACCESSIBILITY_CONTROL_BROADCAST_ACTION)
          priority = 100        
      })
  }
{% endhighlight %}

  - Manifest registration

  {% highlight XML %}
  <service
      android:name="com.balsdon.accessibilityBroadcastService.AccessibilityBroadcastService"
      android:enabled="true"
      android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE">
      <intent-filter>
          <action android:name="android.accessibilityservice.AccessibilityService" />
      </intent-filter>
      <meta-data
          android:name="android.accessibilityservice"
          android:resource="@xml/accessibility_service_config" />
  </service>
  {% endhighlight %}

  - XML Configuration

  {% highlight XML %}
  <accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:accessibilityFlags="flagDefault|flagReportViewIds"
    android:canPerformGestures="true"
    android:canRetrieveWindowContent="true"
    />
  {% endhighlight %}

This is enough to get the code to be registered as an Accessibility service. It will appear as such inside `Settings -> [Smart Assistance] -> Accessibility` In order to set it up as the accessibility shortcut (on my device, by pressing the VOLUME_UP and VOLUME_DOWN button for 3 seconds), follow the `Accessibility shortcut` menu and choose "Accessibility Broadcast Dev" under `Select feature` - However it is not necessary to set it up as a shortcut.

![alt text][IMAGE_1] | ![alt text][IMAGE_2]

The last element is to enable TalkBack and the feature at the same time. In my [previous post][10] I utilised a mechanism for saving particular key presses via the memory buffer. As "fun" as this is I think it would be more reliable to make the accessibility service "stick" when I toggle it. Thankfully this is possible to do, as when an accessibility service exists on a device, more than one can be toggled at a time by delimiting them with ":". In my origin TalkBack toggle script I had:

{% highlight bash %}
$VALUE_ON="com.google.android.marvin.talkback/com.android.talkback.TalkBackPreferencesActivity"

adb shell settings put secure enabled_accessibility_services $VALUE_ON
{% endhighlight %}

and to start multiple services:

{% highlight bash %}
TALKBACK="com.google.android.marvin.talkback/com.google.android.marvin.talkback.TalkBackService"
ALLYSERVICE="com.balsdon.AccessibilityDeveloperService/.AccessibilityDeveloperService"
VALUE_ON="$TALKBACK:$ALLYSERVICE"

adb shell settings put secure enabled_accessibility_services $VALUE_ON
{% endhighlight %}

And there you go! This is a more granular approach to navigation of a device in accessibility mode for developers. I hope that it will help all sorts of people, as it could be used in automation testing or even remote control.

Here is a [link to the video][19] demonstrating the commands in action.

<!-- ![alt text][IMAGE_0] -->
[IMAGE_1]: /images/accessibility_service_01.png "Settings -> [Smart Assistance] -> Accessibility"
[IMAGE_2]: /images/accessibility_service_02.png "Settings -> [Smart Assistance] -> Accessibility -> Accessibility shortcut"
[IMAGE_3]: /images/accessibility_service_03.png "Switch Access"
{: width="400px"}
[IMAGE_4]: /images/accessibility_service_04.png "Switch Access"
{: width="400px"}
[IMAGE_5]: /images/accessibility_service_05.gif "Switch Access Usage"
{: width="400px"}

  [1]: https://developer.android.com/guide/topics/ui/accessibility/service#focus-types
  [2]: https://developer.android.com/guide/topics/ui/accessibility/service
  [3]: https://developer.android.com/guide/topics/ui/accessibility/service#act-for-users
  [4]: https://developer.android.com/reference/android/content/BroadcastReceiver
  [5]: https://support.google.com/accessibility/android/answer/7650693?hl=en
  [6]: https://stackoverflow.com/questions/66790141/adb-accessibility-focus-change
  [7]: https://github.com/qbalsdon/talos/blob/main/scripts/tap
  [8]: https://developer.android.com/reference/android/accessibilityservice/AccessibilityService
  [9]: https://github.com/qbalsdon/accessibility_broadcast_dev
  [10]: https://qbalsdon.github.io/android/scripting/key-press/automation/2021/03/30/recording-key-presses.html
  [11]: https://github.com/qbalsdon/talos/blob/main/scripts/talkback
  [12]: https://support.google.com/accessibility/android/answer/6122836
  [13]: https://support.google.com/accessibility/android/answer/6122836?hl=en
  [14]: https://youtu.be/bTodlNvQGfY?t=1017
  [15]: https://www.w3.org/TR/WCAG20/#consistent-behavior
  [16]: https://github.com/Genymobile/scrcpy
  [17]: https://issuetracker.google.com/issues/185546073
  [18]: https://codelabs.developers.google.com/codelabs/developing-android-a11y-service?hl=th#0
  [19]: https://www.youtube.com/watch?v=GV9MV0Yw38E

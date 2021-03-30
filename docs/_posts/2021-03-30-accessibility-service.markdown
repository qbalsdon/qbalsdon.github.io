---
layout: post
title:  "Android Accessibility Actions using the Android Debug Bridge"
date:   2021-03-30 00:00:01 +0000
categories: Android Kotlin Accessibility ADB
comments_id: 14
---

I recently asked a question on [StackOverflow][6] where I asked if it were possible to navigate an application in accessibility mode using the Android Debug Bridge. I am not one to just wait for an answer to appear, and came up with my own solution. The question got some nice attention early on, and since I wanted the answer to be concise, I answered to the bare minimum. However I would like to document a more fleshed out answer here.

The answer will need have three parts in order to be considered complete:
1. A script to enable the accessibility shortcut (once set up)
2. A broadcast receiver to respond the events that can then invoke the
3. Accessibility service to act on behalf of the user

[The code for this can be accessed here.][9]

## Understanding Accessibility on Android

I have come to the conclusion that there are 2 layers of input on Android. They are the "input" layer and the "accessibility" layer. When you type on the keyboard, perform swipe gestures, these actions are performed on the regular layer. Some actions may get passed on to the accessibility layer, when it's enabled. However actions performed by the ADB input actions are NEVER passed to this layer. This is why simply recording a keyboard action and playing it back does not appear to work.

I have no reference for this other than the [Google documentation refers to two types of focus, namely input focus and accessbility focus][1]. It's not a far stretch, but I have no solid evidence for it.

The shorter part of the answer is that this is possible to do, but it's relatively involved, which is annoying. You can't perform an accessibility action via ADB, you would have to create an [Accessibility service][2] in order to [act on behalf of an Accessibility user][3] and create a [Broadcast Receiver][4] so that it can take input via the ADB. This sounds like the answer, but there is one problem: You cannot activate accessibility services via the ADB! This has to be done manually **each time accessibility is toggled** or through [**accessibility shortcuts**][5] - of which there can be only one.

### Broadcast service: responding to ADB events

It's fairly simple to implement a [broadcast receiver][4]. There are two main elements upon which there are some points worth noting:
1. How and when the service is registered
2. Constructing intents for the Android Debug Bridge

A [broadcast receiver][4] cannot exist in isolation, running all the time, it has to have an association with some other lifecycle element. This is acceptable since the receiver itself cannot perform an accessibility action, for this the accessibility service is required. The registration of the service will be demonstrated in the next section.

The receiver that was implemented can take intents from other apps, as well as the ADB.

{% highlight bash %}
adb shell am broadcast -a com.balsdon.talkback.accessibility
adb shell am broadcast -a com.balsdon.talkback.accessibility -e ACTION "ACTION_NEXT"
adb shell am broadcast -a com.balsdon.talkback.accessibility -e ACTION "ACTION_PREV"
adb shell am broadcast -a com.balsdon.talkback.accessibility -e ACTION "ACTION_HEADING_NEXT"
adb shell am broadcast -a com.balsdon.talkback.accessibility -e ACTION "ACTION_HEADING_PREV"
adb shell am broadcast -a com.balsdon.talkback.accessibility -e ACTION "ACTION_VOLUME_UP"
adb shell am broadcast -a com.balsdon.talkback.accessibility -e ACTION "ACTION_VOLUME_DOWN"
adb shell am broadcast -a com.balsdon.talkback.accessibility -e ACTION "ACTION_VOLUME_SET" --ei PARAMETER_VOLUME 20
{% endhighlight %}

These are the commands I that I find the most tedious while working with accessibility - and I think the ability to control the volume was one of the better features. I find that the volume of the voice can sometimes be quite disruptive.

The receiver achieves this in the following manner:
{% highlight kotlin %}
override fun onReceive(context: Context?, intent: Intent?) {
    require(context != null) { "Context is required" }
    require(intent != null) { "Intent is required" }
    require(AccessibilityBroadcastService.instance != null) { "Service is required" }
    val serviceReference = AccessibilityBroadcastService.instance!!

    intent.getStringExtra(ACCESSIBILITY_ACTION)?.let {
        log("AccessibilityActionReceiver", "  ~~> PARAMETER: [$it]")
        serviceReference.apply {
            when (it) {
                ACTION_MENU -> swipeUpLeft() // currently not working
                ACTION_WHAT -> findFocusedViewInfo()
                ACTION_PREV -> swipeHorizontal(false)
                ACTION_VOLUME_SET -> setVolume(intent.getIntExtra(PARAMETER_VOLUME, 10))
                ACTION_VOLUME_UP -> adjustVolume(true)
                ACTION_VOLUME_DOWN -> adjustVolume(false)
                ACTION_HEADING_NEXT -> swipeVertical(true)
                ACTION_HEADING_PREV -> swipeVertical(false)
                //default is just next
                else -> swipeHorizontal(true)
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

### Accessibility service: Acting on behalf of the user

The [Google documentation][2] defends the creation of an accessibility service in the following manner:

> An accessibility service is an application that provides user interface enhancements to assist users with disabilities, or who may temporarily be unable to fully interact with a device. For example, users who are driving, taking care of a young child or attending a very loud party might need additional or alternative interface feedback.<a href="#note1"><sup>1</sup></a>

There is a Google codelab which takes developers through a journey of explaining the different elements of an accessibility service. The highlights are:

  - The service implements the [`AccessibilityService`][8] class and implementsthe `onServiceConnected` method. This is where the our receiver is registered
{% highlight kotlin %}
override fun onServiceConnected() {
      registerReceiver(accessibilityActionReceiver, IntentFilter().apply {
          addAction(ACCESSIBILITY_CONTROL_BROADCAST_ACTION)
          priority = 100        
      })
  }
{% endhighlight %}
  - Maifest registration
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
This is enough to get the code to be registered as an Accessibility service. It will appear as such inside `Settings -> [Smart Assistance] -> Accessibility` In order to set it up as the accessibility shortcut (on my device, by pressing the VOLUME_UP and VOLUME_DOWN button for 3 seconds), follow the `Accessibility shortcut` menu and choose "Accessibility Broadcast Dev" under `Select feature`

![alt text][IMAGE_1] | ![alt text][IMAGE_2]

The last element is to enable Talkback and the feature at the same time. Currently the way this works is that the service is deactivated whenever Talkback is toggled. This is frustrating as it feels like it's taking me back right to the beginning of the problem. I JUST want to send accessibility key presses via ADB. However now I have everything, except the ability to turn it on automatically. Thankfully this is covered in my [previous post][10].

<!-- ![alt text][IMAGE_0] -->
[IMAGE_1]: /images/accessibility_service_01.png "Settings -> [Smart Assistance] -> Accessibility"
[IMAGE_2]: /images/accessibility_service_02.png "Settings -> [Smart Assistance] -> Accessibility -> Accessibility shortcut"

#### Notes

<a name="note1"><sup>1</sup></a>I think that services should be marked as "sticky" or "non-sticky" so that when accessibility is toggled, the USER has the option of whether a service is automatically enabled when Talkback is toggled. Having to add a further command just to enable the accessibility service feels rather like a hack. It also means users would have to occupy the accessibility shortcut on their device, which is a severely limited resource.


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
<!--
{% highlight python %}
{% endhighlight %}
-->

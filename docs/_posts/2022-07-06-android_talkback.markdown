---
layout: post
title:  "A Technical Introduction to Google TalkBack"
date:   2022-07-06 00:00:00 +0000
categories: Android Accessibility TalkBack
comments_id: 18
---

[Google TalkBack][0] is an [accessibility service][1] provided by Google to help users with disabilities use their devices more effectively. When activated, the service will read out the details of the focussed component on the screen and highlight it. The user can adjust the focus by [performing different gestures][2], typically by swiping right (from left to right, or an increasing x value), swiping left (from right to left, or a decreasing x value), and replacing single taps with double taps for interaction with the focussed component. There are more gestures, but these are the basics.

I highly recommend you enable TalkBack, by going to settings, accessibility and selecting TalkBack. Then follow the instructions and tutorials on how to use it. If you get stuck, and have the ADB enabled, just run the following command to turn it off:

`adb shell settings put secure enabled_accessibility_services none`

# What is an accessibility service?

[Accessibility services][1] are apps that can come pre-bundled as system apps, or can be installed via the [Play Store][3]. They run in the background and provide additional features such as Text to Speech or specialised gestures for device control. They do not have to provide UI components, which is why they are typically called services and not applications, but additional UI can be added by the service. The most common accessibility service is called TalkBack, but there are many others, and [developers can create their own][4].

In a previous blog I wrote my [own accessibility service to help developers perform TalkBack gestures][10] using the ADB.

# How TalkBack affects the Android system

When TalkBack is activated, an invisible interaction layer is added to the screen. This layer:
1. Adds a highlight to the focussed element, usually a bright green box
2. Uses text to speech to dictate the current focussed element
3. Prevents any input other than the specified gestures like swipes and taps

![A phone with an opaque layer covering the screen at an offset to indicate it is invisible][100] | ![A Pixel phone with TalkBack on, opened at the display settings screen. The background is black and the back button at the top is highlighted. Swipes are made visible with a white dot and Text To Speech can be read via toast messages appearing at the bottom. Swipe left. The top block is highlighted and "Display" is read aloud. Swipe right, the back button is highlighted and "Navigate Up, Button, Double Tap to activate" is displayed. Swipe right. Brightness small heading is highlighted, toast message "Brightness". Swipe right, Brightness control is highlighted, toast displays "Brightness level, 60%, Double Tap to activate". Swipe right, Adaptive brightness control focussed, toast message "Adaptive Brightness, Double tap to activate" is displayed. Swipe right, Adaptive brightness switch focussed, toast message "ON, Adaptive Brightness Switch, Double Tap to toggle" is displayed. Swipe right. Lock display small heading is highlighted, toast message "Lock display". Swipe left, Adaptive brightness switch focussed, toast message "ON, Adaptive Brightness Switch, Double Tap to toggle" is displayed. Double tap, Toggle turns off, toast displays "OFF". Double tap, Toggle turns on, toast displays "ON". Repeat OFF and ON. Swipe left, Adaptive brightness control focussed, toast message "Adaptive Brightness, Double tap to activate" is displayed. Single tap, nothing happens. Double tap, new screen opens with "Adaptive Brightness" at the top. The highlighted control is the top left back button, toast message "Adaptive brightness, Navigate up button, out of list, double tap to activate." Double tap, back to the Display screen with the Adaptive brightness control focussed, toast message "Adaptive Brightness, Double tap to activate" is displayed. Swipe left, Brightness control is highlighted, toast displays "Brightness level, 59%, Double Tap to activate"][101]

Accessibility services navigate the system through the [AccessibilityNodeInfo][8] that is created for every component on the screen. These nodes contain meta data and actions that can be performed from that node. This creates a relationship mapping in the form of a tree structure.

## Why this layer matters

This layer, although adding UI elements, is completely undetectable itself. The reason for this probably has to do with not creating an infinite loop. If, for example, you told the screen reader to announce all `toast` messages, it would do just that. But then if you enabled the feature that outputs all spoken output as a `toast` message, that would create an undesirable feedback loop. (FYI: TalkBack text to speech "`toasts`" are not actually Android system-level `toast` messages)

As a result, developers and users are not able to extract any information from the accessibility layer that is created. This is demonstrated by the fact that if you run `adb shell uiautomator dump`, a command which outputs the current UI as an XML file, not only are accessibility services disabled while the extraction takes place (and then re-enabled), but the file will not contain any [AccessibilityNodeInfo][8] objects or elements created by accessibility services.

This is why when interacting with the device using the android debug bridge (ADB), taps and swipes work as if accessibility services are turned off. This phenomenon also explains the fact that if you are attempting to use an emulator, or [scrcpy][9], certain aspects of the accessibility UX will be lost. By interacting with a mirrored device the action is technically bypassing the accessibility layer and interacting on the device itself. Another example is "Colour correction" (found under settings, accessibility, text and display) - on an emulator or mirrored device this appears non-functional, however if you look at the mirrored device's actual screen you will see the changes.

This is (probably) why TalkBack is not installed on emulators, coupled with the difficulty of performing accessibility gestures with a mouse.

This plugin-based approach has a lot of benefits for the Android ecosystem: it means that developers and companies can take responsibility for accessibility at a platform level, without having to modify the Android source code. It also allows updates to be served at a smaller scale, rather than having to be dependant on operating system updates.

# Keyboard control vs Switch Access

As a developer, I usually don't plug a keyboard into my device. This is for a few reasons:
1. I don't need a keyboard (selfish, I am not all my users)
2. I need to keep my debugger active (and a cable is a reliable connection, wireless has been known to be temperamental)
3. I like keeping my device fully charged
4. I use a screen mirror ([scrcpy][9]) to save my screen and my neck

It's relevant to note that [**Switch Access**][11], another accessibility service that allows users to control a phone through a special input device, is not the same as plugging in a keyboard. The "Switch Controller" can be a keyboard but can also be a custom buttoned Human Interface Device (H.I.D.), as any keys can be mapped. Switch access uses between two and six keys, the two primary keys for movement and selection. Navigation is done similarly to TalkBack, by controlling focus with a highlighted component, but with small tweaks and additional menus added to the screen.

When using Keyboard control, however, the highlight is far less visible (if at all) and controls are a little more diverse. In addition, there is no Text To Speech, granularity or special actions. While there is a [list of key codes for Android][11], not all of them are default, meaning they don't all work in all apps. There is also no default "long tap" mechanism as far as I can tell.

|Key|Android KeyCode|Action|
|&larr;|KEYCODE_DPAD_LEFT|Previous horizontal element or scroll left|
|&uarr;|KEYCODE_DPAD_UP|Previous vertical element or upward scroll|
|&rarr;|KEYCODE_DPAD_RIGHT|Next horizontal element or scroll right|
|&darr;|KEYCODE_DPAD_DOWN|Next vertical element or downward scroll|
|&crarr;|KEYCODE_ENTER|Tap current focus|
|↹|KEYCODE_TAB|Focus next|
|SHIFT+↹||Focus previous|
|⌫|KEYCODE_BACKSPACE|Delete last typed character|
||KEYCODE_BACK|Press the back button|
|ALT+ESC|KEYCODE_HOME|Press the home button|

These can be sent via ADB by using `adb shell input keyevent [KEYCODE]` - just be aware that these bypass the accessibility layer.

# Developing accessibility services

It is vital to keep in mind that while Android provides a lot of meta data and secure access to an active accessibility service, that they are not meant to be used for anything other than enabling users to engage with applications, as stated in the [Android AccessibilityService API documentation][6]:

> ... only services that are designed to help people with disabilities access their device or otherwise overcome challenges stemming from their disabilities are eligible to declare that they are accessibility tools.
>
> ...
>
> The tools must support people with disabilities as their primary purpose. A general assistant that is voice-activated, for example, that targets a large user population but would help users with motor impairments in some situations, would not qualify as an accessibility tool. Most developers of accessibility tools spend most of their user research understanding the complex challenges that people with a particular set of disabilities face when using their devices, and tailor a solution to meet those challenges. It should be obvious when reading the Google Play Store description of an accessibility tool who those users are and how the app helps them meet the challenges they face.
>
> Other examples of apps that are not accessibility tools are: antivirus software, automation tools, assistants, monitoring apps, cleaners, password managers, and launchers.

This doesn't mean you cannot create an accessibility service for this reason, it just means you will not be permitted to distribute it via the Google Play Store. Some exceptions to the rule do exist, an example is the [Android Accessibility Scanner][5], an accessibility service not intended for disabled users but rather developers who wish to check the touch target sizes and colour contrasts for the apps that they create.

Accessibility services should declare that they are such services by setting the "[isAccessibilityTool][7]" flag to `true` in their manifest, because by not doing so newer versions of Android will not display a security warning notification after activation.

# Summary

Google TalkBack falls under a specific category of applications called Accessibility Services, of which there are many. Developers are permitted to create their own Accessibility Services, and can distribute them in the Google Play Store as long as their purpose is to help people with disabilities.

There is an invisible interaction layer that is created upon enabling TalkBack, which acts as a buffer between the user and the device, and allows for a different set of gestures to be performed to interact with the device. The service and layer are not accessible on an emulator or mirrored device using debug tools, an emergent property of their implementation and security level.

[0]: https://support.google.com/accessibility/android/answer/6283677?hl=en-GB
[1]: https://developer.android.com/reference/android/accessibilityservice/AccessibilityService
[2]: https://support.google.com/accessibility/android/answer/6151827?hl=en-GB&ref_topic=10601570
[3]: https://play.google.com/store/search?q=TalkBack&c=apps
[4]: https://codelabs.developers.google.com/codelabs/developing-android-a11y-service#0
[5]: https://play.google.com/store/apps/details?id=com.google.android.apps.accessibility.auditor
[6]: https://support.google.com/googleplay/android-developer/answer/10964491?hl=en
[7]: https://developer.android.com/reference/android/R.styleable#AccessibilityService_isAccessibilityTool
[8]: https://developer.android.com/reference/android/view/accessibility/AccessibilityNodeInfo
[9]: https://github.com/Genymobile/scrcpy
[10]: https://qbalsdon.github.io/android/kotlin/accessibility/adb/2021/04/15/accessibility-service.html
[11]: https://developer.android.com/reference/android/view/KeyEvent

[100]: /images/talkback_layer.png "TalkBack layer"
{: height="400px"}
[101]: /images/a11y_demo.gif "TalkBack Demo"
{: height="400px"}

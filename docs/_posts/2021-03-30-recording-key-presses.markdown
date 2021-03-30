---
layout: post
title:  "Android: recording key presses for later scriptable playback"
date:   2021-03-30 00:00:00 +0000
categories: Android Scripting Key-Press Automation
comments_id: 16
---

Recently I needed to be able to press the VOLUME_UP and VOLUME_DOWN keys at the same time for 3 seconds. I find writing a post rather than relying on StackOverflow posts is more helpful, especially when there is a little more that needs to be said. While this is documented in the [README][0] of the code where I use it, I think it makes a fairly good post on it's own.

I have found the best way to reverse engineer button presses is to
1. Identify the device - `/dev/input/device[n]`
2. Record the usage

{% highlight bash %}
adb shell
    cat /dev/input/event[n] > /mnt/sdcard/some_awesome_action
    # do your action
    # ctrl + c
    # if the file is empty, you have the wrong device
    exit

adb pull /mnt/sdcard/some_awesome_action
{% endhighlight %}

3. Open up a [hex editor][5] and identify the ups and downs
e.g. this is a VOLUME_UP, KEY_DOWN:

> `00 | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 0a | 0b | 0c | 0d | 0e | 0f`<br/>
> `03 | 88 | 61 | 60 | 9e | 5e | 0a | 00 | 01 | 00 | 73 | 00 | 01 | 00 | 00 | 00`<br/>
> `03 | 88 | 61 | 60 | 9e | 5e | 0a | 00 | 00 | 00 | 00 | 00 | 00 | 00 | 00 | 00`<br/>

if you run `adb shell getevent -l` and `adb shell getevent -lp` you'll find that `73` is the key (position 0a, specifically, the VOLUME_UP key) and position 0c is the event type (down). Every press has a reset (all 00's).

4. Create a script with the timing involved as well as the key presses. **Timing is not recorded with the device buffer**
{% highlight bash %}
  INPUT_DEVICE="/dev/input/event1" # VOLUME KEYS EVENT FILE
  VOLUME_DOWN=114 #0x0072
  VOLUME_UP=115   #0x0073
  BLANK_EVENT="sendevent $INPUT_DEVICE 0 0 0"

  INST_DN="sendevent $INPUT_DEVICE 1 $VOLUME_DOWN 1 && $BLANK_EVENT && sendevent $INPUT_DEVICE 1 $VOLUME_UP 1 && $BLANK_EVENT"
  INST_UP="sendevent $INPUT_DEVICE 1 $VOLUME_DOWN 0 && $BLANK_EVENT && sendevent $INPUT_DEVICE 1 $VOLUME_UP 0 && $BLANK_EVENT"

  adb -s "$DEVICE" shell "$INST_DN"
  sleep 3
  adb -s "$DEVICE" shell "$INST_UP"
{% endhighlight %}

[0]: https://github.com/qbalsdon/accessibility_broadcast_dev#scripting
<!--
[#]: link
-->
<!--
{% highlight python %}
{% endhighlight %}
-->
<!--
![alt text][REF]
[REF]: /images/name.ext "alt"
-->

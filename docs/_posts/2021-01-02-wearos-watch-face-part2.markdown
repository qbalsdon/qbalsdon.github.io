---
layout: post
title:  "Wear OS Watch Face, Part 2: Watch Face Elements"
date: 2021-01-02 00:00:00 +0000
categories: WearOS Programming Android Kotlin
comments_id: 12
---
The diagram below is the result of several hours of considerate pulling apart and re-thinking several different elements regarding Android ~~Wallpaper~~ Wear OS Watch Face Architecture. It halves a 500 line code file into several smaller classes, and hopefully the following discussion will clarify the reasoning of the component separation and provide a better understanding of the Wear OS watch face ecosystem.

The [sample code can be found here][CODE_SAMPLE].

<canvas id="overall-uml" class="nomnoml"></canvas>
<script>
    var source = "\
    [<abstract>CanvasWatchFaceService];\
    [<abstract>WatchFaceService];\
    [<abstract>WatchFaceEngineHandler];\
    [<abstract>WatchFaceRenderer];\
    [<abstract>WatchFaceRenderable];\
    [<abstract>WatchFaceRenderable]o--+[WatchScreenSettings];\
    [<abstract>CanvasWatchFaceService]<:--[<abstract>WatchFaceService];\
    [<abstract>WatchFaceService]o--:>[<abstract>WatchFaceEngineHandler];\
    [<abstract>WatchFaceService]o-+[WatchFaceEngine];\
    [<abstract>WatchFaceService]o--+[<abstract>WatchFaceRenderer];\
    [<abstract>WatchFaceRenderer]--:>[<abstract>WatchFaceRenderable];\
    [WatchFaceEngine]+--o[<abstract>WatchFaceEngineHandler];\
    [WatchFaceEngine]--:>[Updateable];\
    [WatchFaceEngine]o--+[InteractiveTimeUpdateHandler];\
    [Updateable]o--+[InteractiveTimeUpdateHandler];\
    [InteractiveTimeUpdateHandler]--:>[Handler]";

    showGraph("overall-uml", source);
</script>

[Part 1][SITE_PART1] focused on the [`WatchFaceRenderable.kt`][CODE_WATCHFACERENDERABLE] and [`WatchFaceRenderer.kt`][CODE_WATCHFACERENDERER] classes, which reduces the complexity of drawing a watch face to simple canvas drawing. This mechanism allows implementations of [`WatchFaceRenderer.kt`][CODE_WATCHFACERENDERER] to be injected into watch face and standard Android applications, for the purpose of separating concerns, debugging and testing.

<canvas id="WatchFaceRenderable-uml" class="nomnoml"></canvas>
<script>
    var source = "\
    [WatchFaceRenderable];[WatchFaceRenderer];\
    [<abstract>WatchFaceRenderable\
    |setTimeZone(timeZone: TimeZone);\
  	render(canvas: Canvas, time: Long);\
  	initialise();\
  	updateStyle();\
  	surfaceChanged(width: Int, height: Int)\
    |currentTime: Calendar;\
  	invalidate: (() -> Unit)?;\
    screenSettings: WatchScreenSettings];\
    [<abstract>WatchFaceRenderer\
      |initImages(resources: Resources);\
      drawWatchFace(canvas: Canvas)\
      |resources: Resources?\
    ];\
    [WatchFaceRenderable]<:--[WatchFaceRenderer]";

    showGraph("WatchFaceRenderable-uml", source);
</script>

The above classes are all that need to be understood in order to get an initial Wear OS watch face rendering on a [canvas][DOCS_CANVAS], with [`ExampleWatchRenderer.kt`][CODE_EXAMPLEWATCHRENDERER] as a general guide that also demonstrates how to incorporate bitmaps as background images. The [`injection`][DOCS_HILT] of the [`ExampleWatchRenderer.kt`][CODE_EXAMPLEWATCHRENDERER] is defined in the [`WatchFaceModule.kt` in the `watchfacerenderer` module][CODE_MODULE].

### Service and Engine

At the core of every Watch Face is the [`WatchFaceService.kt`][CODE_WATCHFACESERVICE], which has an inner class of type `WatchFaceEngine` - this engine does most, if not all, the heavy lifting required for the watch face. It responds to the lifecycle of the watch face (handled by the [`WatchFaceService.kt`][CODE_WATCHFACESERVICE]), much like an activity. It gets notified if the watch face's state changes. An interesting discussion to be had is whether inner classes violate [SOLID principles][ARTICLE_SOLID], namely that of single responsibility. This discussion is left for the comments and potentially a future article.

<canvas id="service-uml" class="nomnoml"></canvas>
<script>
    var source = "\
    [<abstract>CanvasWatchFaceService];\
    [<abstract>WatchFaceService|onCreateEngine(): WatchFaceEngine];\
    [WatchFaceEngine\
    | onCreate(holder: SurfaceHolder);\
      onPropertiesChanged(properties: Bundle);\
      onTimeTick();\
      onAmbientModeChanged(inAmbientMode: Boolean);\
      onInterruptionFilterChanged(interruptionFilter: Int);\
      onSurfaceChanged(holder: SurfaceHolder, format: Int, width: Int, height: Int);\
      onDraw(canvas: Canvas, bounds: Rect);\
      onVisibilityChanged(visible: Boolean);\
      onComplicationDataUpdate(complicationId: Int,data: ComplicationData?);\
      onDestroy()\
    ];\
    [<abstract>CanvasWatchFaceService]<:--[<abstract>WatchFaceService];\
    [<abstract>WatchFaceService]o-+[WatchFaceEngine]\
    ";

    showGraph("service-uml", source);
</script>

The [service documentation][DOCS_CANVASWATCHFACESERVICE] demonstrates the simple relationship between a service and it's `Engine` - the [`CanvasWatchFaceService`][DOCS_CANVASWATCHFACESERVICE] is a [foreground service][DOCS_FOREGROUND_SERVICE] that will fire the necessary events in the `Engine` which in turn can be processed by the watch face.

There are a few methods of which are worth taking note:
+ [`onPropertiesChanged`][DOCS_PROPERTIESCHANGED]: used to determine the screen states of
  + [`lowBitAmbientStatus`][DOCS_LOWBITAMBIENT]: fewer bits per colour in ambient mode
  + [`isBurnInProtectionMode`][DOCS_BURNINPROTECTION]: view is periodically offset when in ambient mode
+ [`onInterruptionFilterChanged`][DOCS_ONINTERRUPTIONFILTER]: Used to indicate that the watch face is in `Mute Mode`, where the "_watch face should adjust the amount of information it displays_." It's assumed from the example code that [modifying the alpha][CODE_MUTEMODE] is appropriate for the simple watch face, and hiding any extra information for more [__complicated__](#a-small-note-on-complications) faces.
+ [`onVisibilityChanged`][DOCS_ONVISIBILITYCHANGED]: Used to update the time zone to default, register the [broadcast receiver][DOCS_BROADCASTRECIEVER] to listen to time zone changes and ensure that the interactive mode timer is operational if necessary.

### Interactive Mode Handler

While the `Engine` inner class has a `onTimeTick()` method, it is not sufficient for a watch face in interactive mode. According to the [documentation][DOCS_ONTIMETICK]:

> In ambient mode, the system calls the <a href="https://developer.android.com/reference/android/support/wearable/watchface/WatchFaceService.Engine#onTimeTick()">`Engine.onTimeTick()`</a> method every minute. It is usually sufficient to update your watch face once per minute in this mode. To update your watch face while in interactive mode, you must provide a custom timer as described in <a href="https://developer.android.com/training/wearables/watch-faces/drawing#Timer">Initialize the custom timer</a>.


The [sample code][CODE_MYWATCHFACE_INITIAL] has an added `Handler` that is used to ["Handle updating the time periodically in interactive mode"][CODE_MYWATCHFACE_INITIAL_499]. The control of the `handler` is managed every time `onAmbientModeChanged()` and `onVisibilityChanged()` are invoked. The primary function is to ensure that every second, on the second, `invalidate` is invoked. These methods are mutually recursive with a check every loop.

{% highlight kotlin %}
 /**
  * https://developer.android.com/reference/kotlin/android/os/Handler
  * There are two main uses for a Handler:
  *     (1) to schedule messages and runnables to be executed at
  *         some point in the future; and
  *     (2) to enqueue an action to be performed on a different
  *         thread than your own.
  */
 class EngineHandler<T : TimeUpdateHandler>(reference: T)
     : Handler(Looper.getMainLooper()) {
     private val mWeakReference: WeakReference<T> = WeakReference(reference)

     companion object {
         /**
          * Message id for updating the time periodically in interactive mode.
          */
         const val MSG_UPDATE_TIME = 0
     }

     override fun handleMessage(msg: Message) {
         mWeakReference.get()?.let {
             when (msg.what) {
                 MSG_UPDATE_TIME -> it.handleUpdateTimeMessage()
             }
         }
     }
 }
 ...
 // [WatchFaceService.WatchFaceEngine]
 /**
 * Handle updating the time periodically in interactive mode.
 * INTERACTIVE_UPDATE_RATE_MS = 1000
 */
 override fun update() {
     invalidate()
     if (shouldTimerBeRunning()) {
         val timeMs = System.currentTimeMillis()
         val delayMs = INTERACTIVE_UPDATE_RATE_MS - timeMs % INTERACTIVE_UPDATE_RATE_MS
         updateTimeHandler.sendEmptyMessageDelayed(MSG_UPDATE_TIME, delayMs)
     }
}
{% endhighlight %}

### WatchFaceEngineHandler

In order to separate the `WatchFaceEngine` (event handler) from the [`WatchFaceRenderer.kt`][CODE_WATCHFACERENDERER] (rendering handler), the [`WatchFaceEngineHandler.kt`][CODE_WATCHFACEENGINEHANDLER] interface is used to surface and simplify the important events from the `WatchFaceEngine` to the [`WatchFaceService.kt`][CODE_WATCHFACESERVICE] class, allowing implementations to be agnostic of the `WatchFaceEngine` lifecycle.

{% highlight kotlin %}
interface WatchFaceEngineHandler {
    val inAmbientMode: Boolean

    fun engineCreated()
    fun updateProperties(lowBitAmbientStatus: Boolean, isBurnInProtectionMode: Boolean)
    fun updateAmbientMode(inAmbientMode: Boolean)
    fun updateMuteMode(inMuteMode: Boolean)
    fun surfaceChanged(holder: SurfaceHolder, format: Int, width: Int, height: Int)
    fun render(canvas: Canvas, bounds: Rect?, time: Long)
    fun updateComplications(watchFaceComplicationId: Int, data: ComplicationData?)
    fun setTimeZone(timeZone: TimeZone)
}
{% endhighlight %}

The [`WatchFaceService.kt`][CODE_WATCHFACESERVICE] class is able communicate events to the [renderable components][CODE_WATCHFACERENDERABLE], which are both watch faces and [complications](#a-small-note-on-complications). This is why [WatchFaceRenderer.kt][CODE_WATCHFACERENDERER] which implements [WatchFaceRenderable][CODE_WATCHFACERENDERABLE] rather than being one class.

### A small note on complications

The discussion has naturally tended towards the next logical step in the journey to complete an Android Wear OS watch face: complications. This section aims to be a brief teaser to the concept, which will be covered in more detail in part 3.

{% highlight kotlin %}
abstract class WatchFaceRenderable {
    var currentTime: Calendar
    var invalidate: (() -> Unit)?
    var screenSettings: WatchScreenSettings
    fun setTimeZone(timeZone: TimeZone) { ... }

    abstract fun render(canvas: Canvas, time: Long)
    abstract fun initialise()
    abstract fun updateStyle()
    abstract fun surfaceChanged(width: Int, height: Int)
}
{% endhighlight %}

As can be seen from the [`WatchFaceRenderable.kt`][CODE_WATCHFACERENDERABLE] abstract class, all these methods relate to the rendering of the watch face **in addition to** any other visual components, such as [__complications__][DOCS_COMPLICATIONS]. While these elements will be the particular focus of a subsequent article, complications are defined as follows:

> A complication is any feature in a watch face that is displayed in addition to time. For example, a battery indicator is a complication. The Complications API is for both watch faces and data provider apps.

A watch face [complication][ARTICLE_COMPLICATION] is a traditional [horological][ARTICLE_HOROLOGY] term for an element displayed on the face that goes beyond of the concept of hours, minutes and seconds. These are the smaller screen elements that display something else that may interest the user, such as steps, light bulb status or calendar events.

[ARTICLE_SOLID]: https://www.freecodecamp.org/news/solid-principles-explained-in-plain-english/
[ARTICLE_HOROLOGY]: https://en.wikipedia.org/wiki/Horology#:~:text=Horology%20(%22the%20study%20of%20time,of%20the%20measurement%20of%20time.
[ARTICLE_COMPLICATION]: https://en.wikipedia.org/wiki/Complication_(horology)#:~:text=In%20horology%2C%20a%20complication%20refers,known%20as%20a%20simple%20movement.
[SITE_PART1]: https://qbalsdon.github.io/wearos/programming/android/kotlin/2020/12/30/wearos-watch-face-part1.html

[DOCS_CANVASWATCHFACESERVICE]: https://developer.android.com/training/wearables/watch-faces/service
[DOCS_FOREGROUND_SERVICE]: https://developer.android.com/guide/components/services#Types-of-services
[DOCS_ONTIMETICK]: https://developer.android.com/training/wearables/watch-faces/drawing#TimeTick
[DOCS_COMPLICATIONS]: https://developer.android.com/training/wearables/watch-faces/complications
[DOCS_CANVAS]: https://developer.android.com/reference/android/graphics/Canvas
[DOCS_HILT]: https://developer.android.com/training/dependency-injection/hilt-android
[DOCS_PROPERTIESCHANGED]: https://developer.android.com/reference/android/support/wearable/watchface/WatchFaceService.Engine#onPropertiesChanged(android.os.Bundle)
[DOCS_BURNINPROTECTION]: https://developer.android.com/reference/android/support/wearable/watchface/WatchFaceService.html#PROPERTY_BURN_IN_PROTECTION
[DOCS_LOWBITAMBIENT]: https://developer.android.com/reference/android/support/wearable/watchface/WatchFaceService.html#property_low_bit_ambient
[DOCS_ONINTERRUPTIONFILTER]: https://developer.android.com/reference/android/support/wearable/watchface/WatchFaceService.Engine.html#onInterruptionFilterChanged(int)
[DOCS_ONVISIBILITYCHANGED]: https://developer.android.com/reference/android/support/wearable/watchface/WatchFaceService.Engine.html#onvisibilitychanged
[DOCS_BROADCASTRECIEVER]: https://developer.android.com/guide/components/broadcasts

[CODE_WATCHFACERENDERABLE]: https://github.com/qbalsdon/wearOS/blob/main/watchfacerenderer/src/main/java/com/balsdon/watchfacerenderer/WatchFaceRenderable.kt
[CODE_EXAMPLEWATCHRENDERER]: https://github.com/qbalsdon/wearOS/blob/main/watchfacerenderer/src/main/java/com/balsdon/watchfacerenderer/example/ExampleWatchRenderer.kt
[CODE_WATCHFACERENDERER]: https://github.com/qbalsdon/wearOS/blob/main/watchfacerenderer/src/main/java/com/balsdon/watchfacerenderer/WatchFaceRenderer.kt
[CODE_WATCHFACESERVICE]: https://github.com/qbalsdon/wearOS/blob/main/app/src/main/java/com/balsdon/watchapplication/service/WatchFaceService.kt
[CODE_MYWATCHFACE_INITIAL]: https://github.com/qbalsdon/wearOS/commit/5f70b6e4dcc4be9210ee1d1e486c2ba9a77e19ef#diff-86510bcc89d3a5aa885d3a200bba7bc73ca6054e72fbd3d3b5a6d6de21648ee7
[CODE_MYWATCHFACE_INITIAL_499]: https://github.com/qbalsdon/wearOS/commit/5f70b6e4dcc4be9210ee1d1e486c2ba9a77e19ef#diff-86510bcc89d3a5aa885d3a200bba7bc73ca6054e72fbd3d3b5a6d6de21648ee7R499
[CODE_WATCHFACEENGINEHANDLER]: https://github.com/qbalsdon/wearOS/blob/main/app/src/main/java/com/balsdon/watchapplication/service/WatchFaceEngineHandler.kt
[CODE_MODULE]: https://github.com/qbalsdon/wearOS/blob/main/watchfacerenderer/src/main/java/com/balsdon/watchfacerenderer/di/WatchFaceModule.kt
[CODE_SAMPLE]: https://github.com/qbalsdon/wearOS
[CODE_MUTEMODE]: https://github.com/qbalsdon/wearOS/commit/5f70b6e4dcc4be9210ee1d1e486c2ba9a77e19ef#diff-86510bcc89d3a5aa885d3a200bba7bc73ca6054e72fbd3d3b5a6d6de21648ee7R269

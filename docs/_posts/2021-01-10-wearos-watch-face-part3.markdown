---
layout: post
title:  "Wear OS Watch Face, Part 3: Watch Face Complications"
date: 2021-01-10 00:00:00 +0000
categories: WearOS Programming Android Kotlin
comments_id: 13
---

This part of the series was the most difficult for me. The concepts behind complications are incredibly tied to the Android ecosystem, and specifically the Wear OS framework. I have done my best at all times to separate the __rendering__ elements from the **watch** specific components.

A Watch Face complication, as mentioned in Part 2, is a horological term that refers to a part of a watch face that is not concerned with hours, minutes and seconds. These elements are more complex in the information age, because they could be __anything__. This last article is not concerned with the data that is provided to the complication, but rather the element that uses existing [complication data providers][DOCS_COMPLICATION_PROVIDERS] to render information on the watch face.

<canvas id="complications-uml" class="nomnoml"></canvas>
<script>
    var source = "\
    [<abstract>WatchComplicationsRenderer];\
    [<abstract>ComplicationDataSource];\
    [<abstract>WatchFaceRenderer];\
    [<abstract>WatchFaceRenderable];\
    [WatchScreenSettings];\
    [<abstract>WatchFaceRenderable]<:--[<abstract>WatchFaceRenderer];\
    [<abstract>WatchFaceRenderable]<:--[<abstract>WatchComplicationsRenderer];\
    [<abstract>WatchFaceRenderable]+-[<abstract>WatchScreenSettings];\
    [<abstract>WatchComplicationsRenderer]+-[<abstract>ComplicationDataSource]";

    showGraph("complications-uml", source);
</script>

The [`ComplicationDataSource.kt`][CODE_COMPLICATIONDATASOURCE] class associates the data that should be rendered with the element that is drawn on the screen. Data to be rendered is collected by the  [`ComplicatedWatchFaceService.kt`][CODE_COMPLICATEDWATCHFACESERVICE] and updates the rendering element. However the positioning of the elements on the screen are handled separately by the implementation of the [`ComplicationsRenderer`][CODE_COMPLICATIONSRENDERER], the example can be found in [`ExampleWatchComplicationRenderer.kt`][CODE_EXAMPLECOMPLICATIONSRENDERER]:

{% highlight kotlin %}
class ExampleWatchComplicationRenderer(context: Context) : WatchComplicationsRenderer(context) {
    companion object {
        const val LEFT_COMPLICATION_ID = 0
        const val RIGHT_COMPLICATION_ID = 1

        val complicationsList = intArrayOf(
            LEFT_COMPLICATION_ID,
            RIGHT_COMPLICATION_ID
        )
    }

    override val complicationIdList: IntArray
        get() = complicationsList

    override fun updateStyle() {
        dataSource.updateStyle(screenSettings)
    }

    override fun surfaceChanged(width: Int, height: Int) {
        val sizeOfComplication = width / 4
        val midpointOfScreen = width / 2

        val horizontalOffset = (midpointOfScreen - sizeOfComplication) / 2
        val verticalOffset = midpointOfScreen - sizeOfComplication / 2

        val leftBounds =  // Left, Top, Right, Bottom
            Rect(
                horizontalOffset,
                verticalOffset,
                horizontalOffset + sizeOfComplication,
                verticalOffset + sizeOfComplication
            )

        val rightBounds =  // Left, Top, Right, Bottom
            Rect(
                midpointOfScreen + horizontalOffset,
                verticalOffset,
                midpointOfScreen + horizontalOffset + sizeOfComplication,
                verticalOffset + sizeOfComplication
            )

        dataSource.complicationDrawableList.apply {
            get(LEFT_COMPLICATION_ID)
                .bounds = leftBounds
            get(RIGHT_COMPLICATION_ID)
                .bounds = rightBounds
        }
    }
}
{% endhighlight %}

The advantage of separation of rendering from specific data proves vital for the `harness` so that a dummy data source ([`DrawableComplicationDataSource.kt`][CODE_DRAWABLECOMPLICATIONDATASOURCE]) can be provided in order to render the complications on the [`WatchFaceView.kt`][CODE_WATCHFACEVIEW]. Once again, this abstraction in the Wear OS Watch Face itself means that the [`ComplicatedWatchFaceService.kt`][CODE_COMPLICATEDWATCHFACESERVICE] only concerns itself with the specific lifecycle attributed with complications.

I strongly recommend going through [Google's CodeLab on Wear OS watch face complications][CODELAB_COMPLICATIONS] and start making watch faces. It's also advisable to go through the [activity code][CODE_COMPLICATIONACTIVITY] to see the manner in which a user can select which complication gets rendered on the screen.

[CODE_COMPLICATIONDATASOURCE]: https://github.com/qbalsdon/wearOS/blob/main/watchfacerenderer/src/main/java/com/balsdon/watchfacerenderer/ComplicationDataSource.kt
[CODE_COMPLICATEDWATCHFACESERVICE]: https://github.com/qbalsdon/wearOS/blob/main/app/src/main/java/com/balsdon/watchapplication/complication/ComplicatedWatchFaceService.kt
[CODE_COMPLICATIONSRENDERER]: https://github.com/qbalsdon/wearOS/blob/main/watchfacerenderer/src/main/java/com/balsdon/watchfacerenderer/WatchComplicationsRenderer.kt
[CODE_EXAMPLECOMPLICATIONSRENDERER]: https://github.com/qbalsdon/wearOS/blob/main/watchfacerenderer/src/main/java/com/balsdon/watchfacerenderer/example/ExampleWatchComplicationRenderer.kt
[CODE_WATCHFACEVIEW]: https://github.com/qbalsdon/wearOS/blob/main/harness/src/main/java/com/balsdon/harness/ui/view/WatchFaceView.kt
[CODE_DRAWABLECOMPLICATIONDATASOURCE]: https://github.com/qbalsdon/wearOS/blob/main/harness/src/main/java/com/balsdon/harness/ui/view/DrawableComplicationDataSource.kt
[CODE_COMPLICATIONACTIVITY]: https://github.com/qbalsdon/wearOS/blob/main/app/src/main/java/com/balsdon/watchapplication/complication/activity/ExampleComplicationConfigActivity.kt

[DOCS_COMPLICATION_PROVIDERS]: https://developer.android.com/training/wearables/watch-faces/complications#:~:text=Apps%20that%20provide%20data%20(such,rendered%20on%20a%20watch%20face.

[CODELAB_COMPLICATIONS]:https://developer.android.com/codelabs/complications#0

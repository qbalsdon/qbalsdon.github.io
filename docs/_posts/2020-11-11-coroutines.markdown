---
layout: post
title:  "YACB: Yet Another Coroutine Blog"
date:   2020-11-11 00:00:10 +0000
categories: TL;DR, Android, Kotlin, Coroutines, Programming
comments_id: 9
---

Ever since [coroutines][CROUTINE] were introduced I have been long suffered to read up about them. Whenever I do there always seems to be something in the way. It all seems complicated and long winded. I know we need asynchronous requests, I know threading is a thing. I'm tired of reading articles that defend threading, just show me how to coroutine.

In your app build.gradle:

```
implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-android:1.3.9'
```

In your Activity:
```
    private suspend fun longRunningBackgroundThread() {
        doSomeWork()
        runOnUiThread {
            makeACallToMainThread()
        }
    }

    // ...

    someJob = MainScope().launch {
            withContext(Dispatchers.IO) { // ensures running on separate thread
                longRunningBackgroundThread()
            }
        }

    // ...

    someJob.cancel() // if you need to cancel it
```

[AsyncTasks][ASYNCTASK] took me forever to adopt, however they eventually won me over because they were Android agnostic and could be used in several places without context. I'm not a fan of boilerplate and [Background Services][BCKSERVICE] seemed overkill.

I strongly recommend reading the [Android Developers Blog][DEVBLOG] and if you have the time, do their [codelab][CODELAB], as it takes the reader through testing coroutines. It seems like [coroutine scope][CSCOPE] needs to come from the [ViewModel][VIEWMODEL] and Google is really pushing for that type of architecture, which I would also recommend. The approach above is designed to be very quick and I think it's rather dirty.

I think the main reason for pushing the [coroutine scope][CSCOPE] into the [ViewModel][VIEWMODEL] is that technically, that is where the decision to be asynchronous should be made. Your data layer should be written in a synchronous manner so that you can test it independently. And you should shy away from too much on an Activity / Fragment is because they're so full of Android state you'll need to be careful that it is terminated when the Activity / Fragment terminates, lest there be race conditions.

[DEVBLOG]: https://medium.com/androiddevelopers/coroutines-on-android-part-i-getting-the-background-3e0e54d20bb
[ASYNCTASK]: https://developer.android.com/reference/android/os/AsyncTask
[BCKSERVICE]: https://developer.android.com/training/run-background-service/create-service
[CODELAB]: https://codelabs.developers.google.com/codelabs/kotlin-coroutines/#0
[VIEWMODEL]: https://developer.android.com/topic/libraries/architecture/viewmodel
[CSCOPE]: https://medium.com/@elizarov/coroutine-context-and-scope-c8b255d59055
[CROUTINE]: https://kotlinlang.org/docs/reference/coroutines-overview.html

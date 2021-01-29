---
layout: post
title:  "Kotlin Multipltoform Mobile"
date:   20yy-MM-dd 00:00:00 +0000
categories: Dev-skills Cross-Platform Kotlin KMM
comments_id:
---


[IMAGE_KMM_ARCHITECTURE]: https://kotlinlang.org/lp/mobile/static/sdk-811ad35a3742e58b40278b7a984fc289.svg
<!--
I'm very pro-native. I don't like dart as a language and I am not a fan or wrapping, which is distinct from adapting - discuss

Very adament that if you are going cross platform, that you understand the impact on the SDLC, and that minimal conversion effort is spent if the decision to go native is taken

TDD approach: Business Logic proved before any UI takes shape

CHANGES:
 + Looking at "Project" structure - KMM shared lib is hidden in some areas
 + Training stakeholders to value function over form through rigorous tests

https://dev.to/s2engineers/the-future-of-cross-platform-development-kotlin-multiplatform-35n8

## Introduction

  + I started off as a Xamarin developer and found myself native within a year. I have developed on Ionic and Cordova and have limited experience with Flutter.
  + Why cross platform is necessary and why it's frustrating for native developers.
    + What are the goals of cross platform? Are they realistic?

## Cross Platform Comparisons

  + Architecture and wrapping styles used in the most popular cross platform solutions
  Cordova:
  https://cordova.apache.org/docs/en/latest/guide/overview/

  React Native:
  https://medium.com/@zizoribeiro/the-new-architecture-of-react-native-part-1-5172e7efe0cf

  Flutter:
  https://flutter.dev/docs/resources/architectural-overview
  > Cross-platform frameworks typically work by creating an abstraction layer over the underlying native Android and iOS UI libraries, attempting to smooth out the inconsistencies of each platform representation. App code is often written in an interpreted language like JavaScript, which must in turn interact with the Java-based Android or Objective-C-based iOS system libraries to display UI. All this adds overhead that can be significant, particularly where there is a lot of interaction between the UI and the app logic.

  > By contrast, Flutter minimizes those abstractions, bypassing the system UI widget libraries in favor of its own widget set. The Dart code that paints Flutter’s visuals is compiled into native code, which uses Skia for rendering. Flutter also embeds its own copy of Skia as part of the engine, allowing the developer to upgrade their app to stay updated with the latest performance improvements even if the phone hasn’t been updated with a new Android version. The same is true for Flutter on other native platforms, such as iOS, Windows, or macOS.

  Xamarin:
  https://devopedia.org/xamarin


### Cross platform vs multiplatform

https://medium.com/mindful-engineering/getting-started-with-kotlin-multiplatform-part-1-working-with-mobile-platforms-1fd76ce2f055

https://trends.google.com/trends/explore?cat=31&q=React%20Native,Flutter,NativeScript,Xamarin

> When a tool allows you to write a code once and that can be built for multiple platforms that we can call a cross-platform. While a code that can able to run on multiple platforms is multiplatform.

## Cross Platform Critiscm

  + App citizenship
  + Software Development Lifecycle
  + Actual numbers to back up claims of speed, efficacy and cost saving
  + Saves time: developers who don't know the internals need to learn those internals, like Android BLE and location relationship. Bugs fixed on one platform need to be double checked on the other platform. A lot of the learning is going to be from the beginning, meaning while you might be getting a web professional, you're not getting a mobile professional.

  https://topdevs.org/blog/crossplatform-vs-native-app-development 

## Kotlin Multiplatform Mobile

Sample code and structure discussion

### Why Kotlin is a good idea

  + Strong language with growing support
  + Concise code
  + Runs on the JVM, ported to JS

### Managing expectations

  + Native is always necessary
  + Need to train stakeholders to have an appetite for testing rather than pretty visuals

### Current state

  + KMM is still alpha and Kotlin native doesn't have all the libraries it needs
  + Libraries are slowly being developer
-->

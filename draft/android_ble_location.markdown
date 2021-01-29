---
layout: post
title:  "Exposing yourself: Why Android requires location to be enabled for Bluetooth Low Energy"
date:   20yy-MM-dd 00:00:00 +0000
categories: Android Bluetooth-Low-Energy Location
comments_id:
---

<!--
Make an Android engineer squirm: Ask them why you need Location services on in order to enable Bluetooth Low Energy

Google is making location services more fragmented as of Android 11: https://developer.android.com/about/versions/11/privacy/location

BLE https://developer.android.com/guide/topics/connectivity/bluetooth-le

## What is Bluetooth Low Energy
https://en.wikipedia.org/wiki/Bluetooth_Low_Energy
 + Personal area network
 + https://www.link-labs.com/blog/bluetooth-vs-bluetooth-low-energy

## Location?

https://www.polidea.com/blog/a-curious-relationship-android-ble-and-location/
Apparently to do with the MAC address and what is communicated
 > There is a number of BLE beacon protocols that may be used to locate the user via information transmitted in the ScanRecord’s data.

+ Look at Beacon protocols
+ Look ar ScanRecord's data

 > Each BluetoothDevice has its own unique identifier called the MAC address. It is possible to locate the user given the knowledge of BLE peripherals locations and MAC addresses.

If this is about the MAC address, why isn't internet access like this as well?


Google won't fix it: https://issuetracker.google.com/issues/37065090
Apple doesn't have this problem
-->

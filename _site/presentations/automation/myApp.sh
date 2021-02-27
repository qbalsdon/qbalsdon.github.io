#!/bin/sh
NAME=$1
sh tap -e "filter"
adb shell input text "$NAME"
sh tap -e "app_name"

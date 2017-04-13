#!/bin/bash
if [ -e $(npm root -g)/bbpr.config.js ]
then mv $(npm root -g)/bbpr.config.js $(npm root -g)/bbpr/bbpr.config.js
fi

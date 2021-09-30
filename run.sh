#!/bin/bash
source .env
screen -L -Logfile bot.log -mdS outinbot node index.js

#!/bin/bash
export DBURL=mongodb://172.17.0.1/tuoj
export ADDR=https://oj.thusaac.org
node /srv/tuoj-web/server/config/exec.js

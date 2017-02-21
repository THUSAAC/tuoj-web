#!/bin/bash
export DBURL=mongodb://172.17.0.1/tuoj
cd /srv/tuoj-web
npm i
bower --allow-root i
grunt concat
node /srv/tuoj-web/tools/initdb.js

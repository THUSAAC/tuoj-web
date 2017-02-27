#!/bin/bash
cd ..
curpath=$(pwd)
docker build ./img -t tuoj-web
docker run --rm -v $curpath/oj:/srv/tuoj-web tuoj-web bash /srv/tuoj-web/tools/install.sh

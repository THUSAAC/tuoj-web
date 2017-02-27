#!/bin/bash
cd ..
curpath=$(pwd)
docker run --rm -i -p 127.0.0.1:8004:3333 -v $curpath/oj:/srv/tuoj-web tuoj-web bash /srv/tuoj-web/tools/run.sh

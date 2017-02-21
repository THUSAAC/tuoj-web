#!/bin/bash
curpath=$(pwd)
docker run --rm -i -p 8004:3333 -v $curpath/oj:/srv/tuoj-web tuoj-web bash /srv/tuoj-web/tools/run.sh

FROM ubuntu:16.04
ADD tuoj-web /srv/tuoj-web
RUN echo "http://mirrors.tuna.tsinghua.edu.cn/ubuntu xenial main restricted universe multiverse" >/etc/apt/sources.list ; \
apt-get update ; \
apt-get install nodejs npm ; \
npm install -g nrm ; \
nrm use taobao ; \
npm install -g bower grunt-cli ; \
cd /srv/tuoj-web ; \
npm i ; \
bower i ; \
grunt concat 


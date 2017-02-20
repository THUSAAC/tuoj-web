FROM ubuntu:16.04
ADD tuoj-web /srv/tuoj-web
RUN echo "deb http://mirrors.tuna.tsinghua.edu.cn/ubuntu/ xenial main restricted universe multiverse\n\
deb http://mirrors.tuna.tsinghua.edu.cn/ubuntu/ xenial-updates main restricted universe multiverse\n\
deb http://mirrors.tuna.tsinghua.edu.cn/ubuntu/ xenial-backports main restricted universe multiversen\n\
deb http://mirrors.tuna.tsinghua.edu.cn/ubuntu/ xenial-security main restricted universe multiverse\n" > /etc/apt/sources.list ; \
curl -sL https://deb.nodesource.com/setup_7.x | -E bash - ; \
apt update ; \
apt install -y nodejs 
RUN apt install -y npm ; \
npm install -g nrm ; \
nrm use taobao ; \
npm install -g bower grunt-cli ; \
cd /srv/tuoj-web ; \
npm i ; \
bower i ; \
grunt concat 


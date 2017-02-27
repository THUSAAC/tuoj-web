TUOJ Web Server
===

Let's make Tri-UOJ

# How to init
## Using docker
If you have docker on your local computer, you can run 

```
tools/startdb.sh
tools/build.sh
```

separately to initialize the project.

## Manually
TUOJ web server depends on `npm`, `bower`, `grunt-cli`.

By default, you should concat client files using grunt.

You should run following commands to initialize the app.

Install npm

```
sudo apt-get install nodejs npm mongodb # maybe other packman tools
```

Install nrm and nrm to switch your npm source to taobao (which is faster)

```
sudo npm install -g nrm
nrm use taobao
```

Install packages

```
cd ./oj
npm install
sudo npm install -g bower grunt-cli
bower install
```

# How to start the app
## Docker
We have a `docker-compose` startup config file. You may run 

```
tools/compose.sh
``` 

to start two docker containers.

## Manually
You need to start mongodb server manually if needed (on mac and windows for example).

It is usually not needed on linux. You may run `mongo` to test if you already have had a mongodb server running.

```
mongod
```

And then start the nodejs app by running

```
cd ./oj
grunt
```


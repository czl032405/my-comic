## my-comic-server

Heroku App, NestJS, 代理接口、代理下载图片

## my-comic-mp

微信小程序, weui

## my-comic-serverless

微信云开发, Comic Apis [pica][pingcc]

## todo

- [ ] mangabz
- [ ] auto testing

## magabz images

1. http://www.mangabz.com/m94617-p3/
   -> MANGABZ_CID / COMIC_MID / MANGABZ_VIEWSIGN / MANGABZ_VIEWSIGN_DT
2. http://www.mangabz.com/m94617-p3/chapterimage.ashx?cid=94617&page=3&key=&_cid=94617&_mid=73&_dt=2020-01-21+20%3A33%3A10&_sign=c12f486d7f8b3c4e1058561b9b56baf9
   eval
   ....

3.

## project commands

```s
# run script with scope
lerna run --scope *server  dev --parallel
lerna run --scope *serverless  dev --parallel
lerna run --scope *mp  dev --parallel
lerna run build --parallel

```

## deploy server on heroku

```s
git subtree push --prefix packages/my-comic-server origin heroku

```

## lerna commands

```s
# Create a new lerna repo or upgrade an existing repo to the current version of Lerna.
lerna init

# Bootstrap the packages in the current Lerna repo. Installing all their dependencies and linking any cross-dependencies.
lerna bootstrap

# Create a new release of the packages that have been updated. Prompts for a new version and updates all the packages on git and npm.
lerna publish

#Check which packages have changed since the last release.
lerna changed

#Diff all packages or a single package since the last release
lerna diff [package?]

#Run an npm script in each package that contains that script.
lerna run [script]

#List all of the public packages in the current Lerna repo.
lerna ls

```

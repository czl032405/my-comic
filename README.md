## my-comic-server

Nestjs, Pica Api, Cloudinary, Heroku

## my-comic-mp

微信小程序, weui

## my-comic-serverless

微信云开发

## todo

- [ ] my-comic-mp / pagination on comics and eps
- [ ] my-comic-mp / search

- [x] my-comic-server / add api to proxy loading pica image
- [x] my-comic-server / gzip & zip image
- [ ] my-comic-server / use github action to only deploy dist files
- [ ] my-comic-server / use process.argv to trigger cron job on cron.ts

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

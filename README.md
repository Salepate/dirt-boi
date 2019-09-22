# Dirt-Boi 1.0.0 (dev)

## Description

Dirt-Boi is a discord bot made for serving my selfish purposes (and acquiring NodeJS experience).

It can be extended with commands, services and plugins

## Development

### Commands

A command let a discord user makes use of it

```
!kick <user> : Elegantly discards a user from a server
```

### Services

service are background routines that accompany commands and deliver more functionalities

by default a restful api service is provided so plugins and commands can fetch and create new routes

### Plugins

a plugin pack commands and services together and offers extra initialization callbacks

## Setup

(web-frontend) is not used at this time

1. clone repo
1. in root folder `npm i`
1. edit `discord-service/src/index.ts` and set your token
1. edit `discord-service/assets/bot.config.json` and set your app data (todo merge 3/4)
1. `cd discord-service`
1. `npm run dev` to run the bot and automatically rebuild on changes
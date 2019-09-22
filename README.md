# Dirt-Boi 1.0.0 (dev)

## Description

Dirt-Boi is a discord bot made for serving my selfish purposes (and acquiring NodeJS experience).

It can be extended with commands, services and plugins

## Development

### Commands

A command can be invoked by a discord user

```
!kick <user> : Elegantly discards a user from a server
```

### Services

services are background routines that accompany commands and deliver more functionalities

by default a restful api service is provided so plugins and commands can fetch and create new routes

### Plugins

a plugin packs commands and services together and offers extra initialization callbacks

## Setup

*web-frontend is not used at this time*

* Create an application/bot
    1. create application at https://discordapp.com/developers/applications/
    1. create bot in the created application
    1. set redirect uri(s)
    1. get token from bot
    1. get client id/secret from application
* Setup Dirt Boi
    1. clone repo
    1. in root folder `npm i`
    1. edit `discord-service/src/index.ts` and set your token
    1. edit `discord-service/src/assets/bot.config.json` and set your app data (todo merge 3/4)
    1. `cd discord-service`
    1. `npm run dev` to run the bot and automatically rebuild on changes
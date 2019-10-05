import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import BotService from '../../../bot/bot-service'
import BotClient from '../../../bot/bot-client'
import { ParamsDictionary, Request, Response } from 'express-serve-static-core'



const server = express()

export interface ApiService {
    addRoute: (id: string, route: string, callback: (req: Request, resp:Response) => void) => boolean
}

const startApi = (bot: BotClient) => {
    server.use(cors())
    server.use(cookieParser())
    return new Promise<boolean>((r => {
        const port = process.env.PORT || 3000
        server.listen(port, () => {
            console.log(`: express server listening on port ${port}`)
            r(true)
        }).on('error', (err) => {
            console.log(`: unable to start express server:\n${err}`)
            r(false)
        })
    }))
}

const addRoute = (id: string, route: string, callback: (req: Request<ParamsDictionary>, resp:Response) => any) => {
    server.get(`/${id}/${route}`, callback)
    return true
}

const api: ApiService = {
    addRoute: addRoute
}

const apiService: BotService = {
    run: startApi,
    service: api,
    name: "service-api"
}

export default apiService
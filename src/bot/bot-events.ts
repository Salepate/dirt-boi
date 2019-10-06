import { MessageSource } from "./message-source"

type MessageListener = (src: MessageSource.Source, message: string) => any

interface MessageMap {
    [event: string] : EventMap
}

interface EventMap {
    [id: string] : MessageListener[]
}

type BotEvent = 
{
    messages: MessageMap
}

const events: BotEvent = 
{
    messages: {}
}

export const addMessageListener = (event: string, id: string, listener: MessageListener) => {
    events.messages[event] = events.messages[event] || {}
    events.messages[event][id] = events.messages[event][id] || []

    if ( !events.messages[event][id].includes(listener)) {
        events.messages[event][id].push(listener)
    } else {
        console.log(`: cannot add listener because it has already been registered (event: ${event})`)
    }
}


export const removeMessageListener = (event: string, id: string, listener: MessageListener) => {
    if ( events.messages[event] && events.messages[event][id] && events.messages[event][id].includes(listener)) {
        events.messages[event][id].splice(events.messages[event][id].indexOf(listener), 1)
    }
    else {
        console.log(`: cannot remove listener because it has not been registered (event: ${event})`)
    }
}

export const dispatchMessage = (event: string, id: string, source: MessageSource.Source, message: string) => {
    if ( events.messages[event] && events.messages[event][id] && events.messages[event][id].length > 0 ) {
        events.messages[event][id].map(listener => { listener(source, message)})
    }
}

export default BotEvent
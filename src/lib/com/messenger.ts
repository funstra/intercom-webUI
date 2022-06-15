// export default function(){

// }
const INTERCOM_IP = "intercom.local"
const ws = new WebSocket(`ws://${INTERCOM_IP}/ws`)

ws.onopen = () => {
    ws.send('hello from client')
}

ws.onmessage = message => {
    console.log(message.data)
}

export function send(msg) {
    ws.send(msg)
}
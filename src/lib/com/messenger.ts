
// const INTERCOM_IP = "intercom.local"
// const ws = new WebSocket(`ws://${INTERCOM_IP}/ws`)

// let m = ""
// let next = false
// ws.onopen = () => {
//     console.log('ws open');
//     ws.send('conf -p')
// }
// ws.onmessage = message => {
//     console.log(message.data)
//     if (message.data === "c -n") {
//         console.log('create chain command');
//         next = true
//     }
//     if(next){

//     }
// }


// export function send(msg) {
//     ws.send(msg)
// }


// export function send(ws: WebSocket) {
//     ws.send("")
// }
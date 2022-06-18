import { writable, Writable } from "svelte/store"
type MsgType = "createChain" | "removeChain" | "editChain" | null

export const currentMsgType: Writable<MsgType> = writable(null)

export function send(ws: WebSocket, msg: string, msgType: MsgType) {
    currentMsgType.set(msgType)
    ws.send(msg)
}
import io from "socket.io"
import { Server } from "http";

let wss = io()

export function initWSS(server: Server){
    wss = io(server)
}

export default wss;
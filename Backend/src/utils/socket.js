import express from "express"
import http from "http"
import { Server } from "socket.io";

const app = express()
const server = http.createServer(app)

const socketMap = {}
export const getSocketId = (userId) => {
    return socketMap(userId)
}
const io = new Server(server,{
    cors:{
        origin: "http://localhost:5173"
    }
})
io.on('connection', (socket)=>{
    console.log(socket.id);
    const userId = socket?.handshake.query.userId;
    if(userId) socketMap[userId] = socket.id
    io.emit("getOnlineUsers",Object.keys(socketMap))
    socket.on("disconnect",()=>{
        console.log("A user disconnected",socket.id)
        delete socketMap[userId]
        io.emit("getOnlineUsers",Object.keys(socketMap))
    })
})

export {app,server,io} 
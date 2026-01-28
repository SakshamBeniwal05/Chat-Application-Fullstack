import { app, server } from "./utils/socket.js"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser"
import { userRouter } from "./routes/user.route.js"
import { messageRouter } from "./routes/message.route.js"
import express from "express"

dotenv.config()

app.use(cors({
    origin: process.env.CORS_ENV,
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(userRouter)
app.use(messageRouter)
    ; (async () => {
        try {
            await mongoose.connect(process.env.MONGO_URL)
            app.get("/", (req, res) => {
                res.send("<h1>Server started</h1>")
            })
            server.listen(process.env.PORT)
        } catch (error) {
            console.log(error);
        }
    })()
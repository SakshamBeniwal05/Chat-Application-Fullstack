import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser"
import { userRouter } from "./routes/user.route.js"
import { messageRouter } from "./routes/message.route.js"

dotenv.config()
const app = express()
app.use(cors({
    origin:process.env.CORS_ENV,
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
            app.listen(process.env.PORT)
        } catch (error) {
            console.log(error);
        }
    })()
import { Router } from "express";

const messageRouter = Router()

messageRouter.get('/api/message',(req,res)=>{
    res.send("<h1>Hello NIggas</h1>")
})

messageRouter.get('/api/message')
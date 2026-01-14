import { Router } from "express";
import {signUp,login} from "../controller/user.controller.js"

export const userRouter = Router()

userRouter.get('/api/user',(req,res)=>{
    res.send("<h1>Hello NIggas</h1>")
})

userRouter.post('/api/user/register',signUp)
userRouter.post('/api/user/login',login)
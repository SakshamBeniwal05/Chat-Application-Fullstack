import { Router } from "express";
import {signUp,login,logout,updateProfile,checkAuth} from "../controller/user.controller.js"
import { protectedRoute } from "../middleware/auth.middleware.js";

export const userRouter = Router()

userRouter.get('/api/user',(req,res)=>{
    res.send("<h1>Hello NIggas</h1>")
})

userRouter.post('/api/user/register',signUp)
userRouter.post('/api/user/login',login)
userRouter.get('/api/user/logout',logout)
userRouter.post('/api/user/updateProfile',protectedRoute,updateProfile)
userRouter.get('/api/user/check',protectedRoute,checkAuth)
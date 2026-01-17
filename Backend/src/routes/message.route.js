import { Router } from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getMessage, getOtherUsers, sentMessage } from "../controller/message.controller.js";

export const messageRouter = Router();
messageRouter.get('/api/message', (req, res) => {
    res.send("<h1>Message API</h1>")
});

messageRouter.get('/api/message/getUsers', protectedRoute, getOtherUsers);
messageRouter.get('/api/message/:id', protectedRoute, getMessage);
messageRouter.post('/api/message/:id', protectedRoute, sentMessage);
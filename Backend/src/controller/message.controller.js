import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { cloudinaryUploader } from "../utils/cloudinary.js";
import { getSocketId, io } from "../utils/socket.js";

export const getOtherUsers = async (req, res) => {
    try {
        const currentUser = req.user._id
        const allUsers = await User.find({ _id: { $ne: currentUser } }).select("-password")
        res.status(200).json(allUsers)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const sentMessage = async (req, res) => {
    try {
        const { message, photo } = req.body;
        const { id: reciverId } = req.params;

        let photoURL = null;
        if (photo) {
            photoURL = await cloudinaryUploader(photo);
        }

        const newMessage = await Message.create({
            sender: req.user._id,
            reciver: reciverId,
            message,
            photo: photoURL,
        });

        const reciverSocketId = getSocketId(reciverId)
        if (reciverSocketId) {
            io.to(reciverSocketId).emit("newMessage", newMessage)
        }

        return res.status(201).json(newMessage);

    } catch (error) {
        console.error("Send message error:", error)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getMessage = async (req, res) => {
    try {
        const { id: reciverId } = req.params
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: myId, reciver: reciverId },
                { sender: reciverId, reciver: myId }
            ]
        })
        return res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
}
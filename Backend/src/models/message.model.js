import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reciver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String
    },
    photo: {
        type: String
    }
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);
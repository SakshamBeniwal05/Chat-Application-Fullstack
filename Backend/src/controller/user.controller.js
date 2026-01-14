import { User } from "../models/user.model.js";
import bcrypt from "bcrypt"

export const signUp = async (req, res) => {
    const { fullName, userName, email, password } = req.body

    if ([fullName, userName, email, password].some(field => field?.trim === "")) {
        res.status(204)
        res.json("All fields Required")
    }
    if (await User.findOne({ email })) {
        res.status()
        res.json("User already Exist")
    }

    const cryptPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        fullName,
        userName,
        email,
        password: cryptPassword
    })

    console.log(newUser);
    const data = await User.find({ _id: newUser._id }).select("-password")
    res.status(200).json(data)
}

export const login = async (req, res) => {

    const { email, password } = req.body

    if ([email, password].some(field => field?.trim === "")) return res.status(204).json("All fields Required")

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
        res.status(400).json("Invalid Credentials")
    }
    const match = await bcrypt.compare(password, existingUser.password)
    if (!match) {
        res.status(400).json("InCorrect Password")
    }
    else {
        const data = await User.findOne({ email }).select("-password")
        res.status(200).json(data)
    }
}

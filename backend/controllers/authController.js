import User from "../model/User.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { upsertStreamUser } from "../lib/stream.js";
export const signup = async (req, res) => {

    const { email, fullName, password } = req.body

    try {
        // validationas
        if (!email || !fullName || !password) {


            return res.status(400).json({ success: false, message: "Al fields are required" })


        }
        if (password.length < 6) {

            return res.status(400).json({ success: false, message: "Password must be at least 6 character long" })


        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {

            return res.status(400).json({ success: false, message: "Invalid email format" })

        }
        const existingUser = await User.findOne({ email })

        if (existingUser) {

            return res.status(400).json({ success: false, message: "User already exist" })

        }
        // hashing password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        // creating random avatar
        const index = Math.floor(Math.random() * 100) + 1 //generates a number between 1-100
        const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`
        //creating the new user   
        const newUser = await User.create({ email, fullName, password: hashedPassword, profilePic: randomAvatar })
        // creating stream user

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,

                image: newUser.profilePic || ""

            })
            console.log("stream user created")

        } catch (error) {
            console.log("Error creating stream user ", error)

        }
        //   generate token and set cookie
        generateTokenAndSetCookie(newUser._id, res)
        return res.status(201).json({ success: true, message: "User has been created", user: newUser })

    } catch (error) {
        console.log("Error in signup controller", error)

        return res.status(500).json({ success: false, message: "Internal Server Error" })
    }

};
export const login = async (req, res) => {


    try {

        const { email, password } = req.body
        if (!email || !password) {


            return res.status(400).json({ success: false, message: "All Fields are required" })

        }

        const user = await User.findOne({ email })
        if (!user) {

            return res.status(400).json({ success: false, message: "User not found" })


        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {


            return res.status(400).json({ success: false, mesasge: "Invalid password" })

        }
        generateTokenAndSetCookie(user._id, res)


        return res.status(200).json({ success: true, message: "User logged in" })



    } catch (error) {
        console.log("Error in logging", error)
        return res.status(500).json({ success: false, message: "Internal Server Error" })

    }





};
export const logout = async (req, res) => {

    res.clearCookie("jwt")
    return res.status(200).json({ success: true, message: "Logged out successfully" })

};
export const onboard = async (req, res) => {



}
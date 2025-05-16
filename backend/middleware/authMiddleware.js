import jwt from "jsonwebtoken"
import User from "../model/User.js"
export const protectRoute = async (req, res, next) => {

    try {


        const token = req.cookies.jwt

        if (!token) {

            return res.status(400).json({ success: false, message: "Unauthorised no token povided" })


        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

        if (!decoded) {

            return res.status(400).json({ success: false, message: "Unauthorised -Invalid token" })

        }

        const user = await User.findById(decoded.userId).select("-password")


        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized - user not found" })

        }
        req.user = user
        next()




    } catch (error) {
        console.log("error in verifying user", error)
        return res.status(400).json({ succcess: false, message: "Internal server Error" })
    }

}
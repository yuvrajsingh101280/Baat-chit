import express from "express"
import { login, logout, onboard, signup } from "../controllers/authController.js"
import { protectRoute } from "../middleware/authMiddleware.js"
const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.post("/onboarding", protectRoute, onboard)

// checks if the user is authenticated or not


router.get("/me", protectRoute, (req, res) => {

    res.status(200).json({ success: true, user: req.user })



})

export default router
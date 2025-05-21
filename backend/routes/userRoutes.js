import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { getMyFriends, getRecommendedUsers } from "../controllers/userController.js";


const router = express.Router()
// apply middleware to all routes
router.use(protectRoute)
router.get("/", getRecommendedUsers)
router.all("/friends", getMyFriends)


export default router
import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { getMyFriends, getRecommendedUsers, sendFriendRequest, acceptFriendRequest, getFriendRequest, getOutgoingFriendRequests } from "../controllers/userController.js";


const router = express.Router()
// apply middleware to all routes
router.use(protectRoute)
router.get("/", getRecommendedUsers)
router.get("/friends", getMyFriends)
router.post("/friend-request/:id", sendFriendRequest)
router.put("/friend-request/:id/accept", acceptFriendRequest)
router.get("/friend-requests", getFriendRequest)
router.get("/outgoing-friend-requests", getOutgoingFriendRequests)


export default router
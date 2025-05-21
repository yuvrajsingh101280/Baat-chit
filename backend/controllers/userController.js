import User from "../model/User.js"

export const getRecommendedUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id
        const currentUser = req.user
        const recommendedUsers = await User.find({

            $and: [


                { _id: { $ne: currentUserId } },//exclude the current user
                { _id: { $nin: currentUser.friends } },//exclude the current user;s frinends
                { isOnboarded: true }

            ]




        })
        res.status(200).json({ success: true }, recommendedUsers)
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }



}
export const getMyFriends = async (req, res) => {

    try {


        const user = await User.findById(req.user.id).select("friends")





    } catch (error) {

    }





}
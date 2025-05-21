import FriendRequest from "../model/friendRequest.js"
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
        res.status(200).json(recommendedUsers)
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }



}
export const getMyFriends = async (req, res) => {

    try {


        const user = await User.findById(req.user.id).select("friends").populate("friends", "fullName profilePic nativeLanguage learningLanguage")


        res.status(200).json(user.friends)


    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: "Internal Server Error" })

    }





}

export const sendFriendRequest = async (req, res) => {

    try {

        const myId = req.user._id

        const { id: reciepientId } = req.params



        // prevent sending req to yourself

        if (myId === reciepientId) {

            res.status(400).json({ messae: "You can't send friends to yourself" })


        }


        // check whether the reciepient is available or not


        const recipient = await User.findById(reciepientId)
        if (!recipient) {

            return res.status(404).json({ message: "Recipient not found" })


        }
        // cehck if they are already friends

        if (recipient.friends.includes(myId)) {

            return res.status(400).json({ message: "You are already friends with this user" })


        }



        // check if the request already exist
        const existingRequest = await FriendRequest.findOne({



            $or: [

                { sender: myId, recipient: reciepientId },
                {
                    sender: recipientId, recipient: myId
                }



            ]

        })

        if (existingRequest) {

            return res.status(400).json("A friend request already exist between you and this user")


        }

        const friendRequest = await FriendRequest.create({ sender: myId, recipient: recipientId })


        res.status(200).json(friendRequest)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }


}

export const acceptFriendRequest = async (req, res) => {


    try {
        const { id: requestId } = req.params
        const friendRequest = await FriendRequest.findById(requestId)


        if (!friendRequest) {

            return res.status(400).json({ messae: "Friend request not found" })

        }
        // verify the current user is the recipient



        if (friendRequest.recipient.toString() !== req.user.id) {

            return res.status(400).json({ message: "You are not authorized to accept this request" })



        }
        friendRequest.status = "accepted"
        await friendRequest.save()


        // add each user to the other;s friends array

        // $addToSet: adds elements to an array only if they don not already exist

        await User.findByIdAndUpdate(friendRequest.sender, {


            $addToSet: { friends: friendRequest.recipient }

        })


        await User.findByIdAndUpdate(friendRequest.recipient, {

            $addToSet: {

                friends: friendRequest.sender

            }

        });

        return res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        console.log(error)

        return res.status(500).json({ message: "Internal server error" })
    }

}
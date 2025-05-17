import FriendRequest from "../models/FriendRequest.js";
import User from "../models/user.model.js";

export const getRecomendedUsers = async(req,res)=>{
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recomendedUsers = await User.find({
            $and:[
                {_id :{$ne:currentUserId}},//exclude current user
                {_id:{$nin:currentUser.friends}}, // exclude current user friends
                {isOnboarded:true}
            ]
        })

        res.status(200).json(recomendedUsers)



    } catch (error) {
        console.log("Error while fetching recomended users",error);
        res.status(500).json({message:"Internal server error"})
        
    }
}

export const getMyFriends = async(req,res)=>{
    try {
 const user = await User.findById(req.user.id)
 .select("friends")
 .populate("friends","fullName profilePic nativeLanguage learningLanguage")

 res.status(200).json(user.friends)
    } catch (error) {
        console.error("error in myFriends controller",error.message);
        res.status(500).json({message:"Internal server error"})
    }
}


export const sendFriendRequest = async(req,res)=>{
    try {
        const myId = req.user.id;
        const {id:recipientId} = req.params 

        //prevent sending req to ourselves
        if(myId === recipientId){
return res.status(400).json({message:"you cannot send friendRequest to yourself"})
        }

        const recipient = await User.findById(recipientId);
        if(!recipient){
            return res.status(404).json({message:"Recipient not found"})
        }


    //CHECK ALREADY FRIENDS

// if (recipient.friends.some(friendId => friendId.toString() === myId)) {
//   return res.status(400).json({ message: "You are already friends with this user" });
// }
                                    //OR
     if(recipient.friends.includes(myId)){
            return res.status(400).json({message:"you are already friends with this user"})
        }

        // CHECK IF FRIEND REQUEST ALREADY EXISTS

        const existingRequest = await FriendRequest.findOne({
         $or:[
                {sender:myId , recipient:recipientId},
                {sender:recipientId , recipient:myId}
            ]
        })

        if(existingRequest){
            return res.status(400).json({message:"a friend request already exists between you and this user"})
        }

        const friendRequest = await FriendRequest.create({
            sender:myId,
            recipient:recipientId
        });

        return res.status(201).json(friendRequest);

    } catch (error) {
        console.error("Error sending friend request",error.message);
        res.status(500).json({message:"Internal server error"})
        
    }
}


export const acceptFriendRequest = async(req,res)=>{
    try {
        const {id:requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId);

        if(!friendRequest){
            return res.status(404).json({message:"friend request not found"});
        }

        // verify if current user is recepent 
        if(friendRequest.recipient.toString() !== req.user.id){
        return res.status(403).json({message:"you are not authorizede to accept this request"});
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        //add each user to other friend array
        await User.findOneAndUpdate(friendRequest.sender,{
            $addToSet:{friends:friendRequest.recipient}
        })

        await User.findOneAndUpdate(friendRequest.recipient,{
            $addToSet:{friends:friendRequest.sender}
        })


        res.status(200).json({message:"Friend request accepted"})
        
    } catch (error) {
console.log("Error in acceptFriendRequest controller",error.message);
return res.status(500).json({message:"Internal server error"})
    }
}


export const getFriendRequest = async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}


export const getOngoingFriendRequest = async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}
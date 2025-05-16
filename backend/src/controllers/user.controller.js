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
        
    } catch (error) {
        
    }
}

export const sendFriendRequest = async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}


export const getFriendRequest = async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}



export const acceptFriendRequest = async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}

export const getOngoingFriendRequest = async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}
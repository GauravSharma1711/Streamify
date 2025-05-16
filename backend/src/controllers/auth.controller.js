
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { upsertStreamUser } from '../lib/stream.js';



export const signup = async(req,res)=>{
    try {
        const {fullName , email , password} = req.body;

        if(!fullName || !email || !password){
            return res.status(400).json({message:"all fields are required"})
        }

        if(password.length<6){
            return res.status(400).json({message:"Password must be atleast 6 characters"})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({ message: "Invalid email format" });
}

    

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"email already exists"})
        }

        const idx = Math.floor(Math.random()*100)+1 // no bw 1-100
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic:randomAvatar,
        })

// save user in stream as well

try {
    await upsertStreamUser({
    id:newUser._id.toString(),
    name:newUser.fullName,
    image:newUser.profilePic || ""
});
console.log(`stream user created for ${newUser.fullName}`);
} catch (error) {
    console.log("Error creating stream user",error);
}



const token = jwt.sign(
    { userId:newUser._id, },
   process.env.JWT_SECRET,
   {  expiresIn:"7d" },
)

   res.cookie("jwt",token,{
  maxAge:7*24*60*60*1000,
  httpOnly:true,
  sameSite:"strict",
  secure:process.env.NODE_ENV==="production",
   })

res.status(201).json({success:true,user:newUser});


    } catch (error) {
        console.log("error in signup controller",error);
        return res.status(500).json({message:"error creating user"})
        
    }

}


export const login = async(req,res)=>{
    try {
        const {email,password} = req.body
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"})
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"Invalid credentials"})
        }

        const isPasswordCorrect = await user.matchPassword(password)
        if(!isPasswordCorrect){
             return res.status(401).json({message:"Invalid credentials"})
        }

        const token =  jwt.sign(
            { userId :user._id },
               process.env.JWT_SECRET,
             {expiresIn:"7d"}
        )

        res.cookie("jwt",token,
            {
                maxAge:7*24*60*60*1000,
                httpOny:true,
                sameSite:"strict",
                secure:process.env.NODE_ENV==="production",
            })

         res.status(201).json({
             success:true,
            message:"user logged in successfully",
            user:user
        })

 


    } catch (error) {
        console.log("error in login controller",error);
        return res.status(500).json({message:"error loggingin user"})
        
    }
    
}


export const logout = async(req,res)=>{
    try {
        
        res.clearCookie("jwt");

        return res.status(201).json({message:"user logged out successfully"})
    } catch (error) {
        console.log("error in logout controller",error);
        return res.status(500).json({message:"error logging out user"})
        
    }
    
}

export const onboard = async(req,res)=>{
    try {
        const userId = req.user._id;

        const{fullName,bio,nativeLanguage,learningLanguage,location}=req.body

        if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location){
            return res.status(401).json({message:"All fields are required"})
        }


        const updatedUser = await User.findOneAndUpdate(userId,{
         ...req.body,
         isOnboarded:true
        },{new:true})


        if(!updatedUser){
            return res.status(404).json({message:"User not found"});
        }

        // UPDATE THE USER INFO IN STREAM
        try {
            await upsertStreamUser({
                id:updatedUser._id.toString(),
               name:updatedUser.fullName,
               image:updatedUser.profilePic || "",
            })

    console.log(`stream user updated after onboarding for ${updatedUser.fullName}`);
            
        } catch (error) {
        console.log("Error creating stream user",error);
        }

        res.status(200).json({success:true,user:updatedUser})


    } catch (error) {
        console.error("Error in onboarding controller",error);
     res.status(500).json({message:"Internal server error"})
        
    }
}
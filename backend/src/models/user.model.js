import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({

    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    bio:{
        type:String,
        default:"",
    },
     profilePic:{
        type:String,
        default:"",
     },
       nativeLanguage:{
        type:String,
        required:true,
    },
      learningLanguage:{
        type:String,
        required:true,
    },
    location:{
      type:String,
      default:"",
    },
    isOnboarded:{
        type:Boolean,
        default:false,
    },
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]



},{timestamps:true})


const User = mongoose.model("User",userSchema);

//pre hook
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    }
    try {
     const salt = await bcrypt.genSalt(10);
     this.password = await bcrypt.hash(this.password,salt);
   } catch (error) {
    next(error);
    
   }
})

export default User
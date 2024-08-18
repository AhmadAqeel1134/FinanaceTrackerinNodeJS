const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const UserSchema=mongoose.Schema(
    {
    FirstName:{
        type:String,
        required:true
    },
    SecondName:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Number:{
        type:Number,
        required:true,
        unique:true
    },
    CNIC:{
        type:Number,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    }
   
});
UserSchema.pre('save',async function(next){
    try {
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(this.Password,salt);
        this.Password=hashedPassword;
        next();
        
    } catch (error) {
        console.log('Unable to hash password');   
        next(error);
    }

})

const User=mongoose.model('User',UserSchema);
module.exports=User;
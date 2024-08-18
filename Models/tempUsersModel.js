const mongoose=require('mongoose');
const tempUser=mongoose.Schema(
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
    }
);
const Temp=mongoose.model('Temp',tempUser);
module.exports=Temp;

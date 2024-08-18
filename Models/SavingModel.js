const mongoose=require('mongoose');
const  SavingSchema=mongoose.Schema(
    {
        CNIC:{
            type:Number,
            ref:'User',
            required:true
        },
        TargetAmount:{
            type:Number,
            default:0,
            required:true
        },
        TargetDate:{
            type:String,
            required:true
        },
        CurrentAmount:{
          type:Number,
          default:0,
          required:true
        },
        isAchieved:{
            type:Boolean,
            default:false
        }
    }
);
const SavingModel=mongoose.model('SavingModel',SavingSchema);
module.exports=SavingModel;
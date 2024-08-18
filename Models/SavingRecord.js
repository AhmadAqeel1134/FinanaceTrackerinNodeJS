//This file will keep track that in order to achieve saving goal , which amount is added and on which date
const mongoose=require('mongoose');
const SavingGoalsRecord=mongoose.Schema({
    CNIC:{
        type:Number,
        ref:'User',
        required:true
    },
    AmtAdded:{
        type:Number,
        default:0,
        required:true
    },
    AmtDate:{
        type:String,
        required:true
    },
     Time:{
              type: Date,
              default:()=>{
              currentTime=new Date();
              //manually adjusting the time according to Pakistan's Standard Time
              currentTime.setHours( currentTime.getHours()+5);   
              return currentTime;
            }
        }

});
const SavingRecord=mongoose.model('SavingRecord',SavingGoalsRecord);
module.exports=SavingRecord;
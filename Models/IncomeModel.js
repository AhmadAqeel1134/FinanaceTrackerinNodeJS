const mongoose=require('mongoose');
const IncomeSchema=mongoose.Schema(
    {
    CNIC: {
            type: Number, //unique users id fetch from Mongo DB
            ref: 'User',
            required: true
          },
     TaskName:{
            type:String,
            required:true,
             unique:true
          },
    //Source means the type of work i.e a backend developer should enter backend as its source
    Source:{
             type: String,
            required: true
          },
    Amount:{
            type: Number,
            required: true
          },
    Date: {
            type: String,
            required: true
          },
    Category:{
            type: String,
            enum: ['salary', 'freelance', 'investments', 'other'],   //user can select only of the four categories
            required: true
          },
    Time: {
            type: Date,
            default:()=>{
              currentTime=new Date();
              //manually adjusting the time according to Pakistan's Standard Time
              currentTime.setHours( currentTime.getHours()+5);   
              return currentTime;
            }
        }
    }
);
const Income=mongoose.model('Income',IncomeSchema);
module.exports=Income;
const mongoose=require('mongoose');
const ExpenseSchema=mongoose.Schema({
    CNIC:{
        //CNIC is being treated as unique id
        type:Number,  
        ref:'User',
        required:true
    },
    Amount:{
        type:Number,
        required:true,
        default:0
    },
    Date:{
        type:String,
        required:true
    },
    Category:{
        type:String,
       required:true
    },
    ItemPurchased:{
        type:String,
        required:true,
        unique:true
    },
    Time:{
        type:Date,
        default:()=>{
            const currentTime=new Date();
            currentTime.setHours(currentTime.getHours()+5);
            return currentTime;
        }
    }
});
const Expense=mongoose.model('Expense',ExpenseSchema);
module.exports=Expense;
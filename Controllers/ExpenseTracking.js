//Requiring Models used in project
const User=require('../Models/UserRegModel.js');
const Expense=require('../Models/ExpenseModel.js');



//End points for Expense Tracking 
//Adding Expense,Updating Expense, Deletion and Seeing the total expense
exports.AddExpenseRecord=async(req,res)=>{
    const{CNIC,Amount,Date,Category,ItemPurchased}=req.body;
    const isUserExist=await User.findOne({CNIC});
    if(!isUserExist)
    {
        return res.status(404).json({message:`User Not Found`});
    }
   //user with entered CNIC 
    try 
    {
       const newExpense=await Expense.create({CNIC,Amount,Date,Category,ItemPurchased});
            return res.status(200).json({
                newExpense,
            message:`Successfully added the expense record`});    
    } catch (error)
    {
     return res.status(404).json({message:error.message});   
    }
}

exports.userTotalExpense=async(req,res)=>{
  const {CNIC}=req.body;
  const isUserExist=await Expense.findOne({CNIC});
  if(!isUserExist)
  {
    return res.status(404).json({message:`CNIC : ${CNIC} Not Found`});
  }
  try{
  const totalExpense=await Expense.aggregate([
  { $match:{CNIC:CNIC}},
  {
    $group:
    {
        _id:null,
        totalExpense:{$sum:"$Amount"},
     //displaying all the expense records
        records:
        {
           $push:
           {
            Amount:"$Amount",
            Date:"$Date",
            Category:"$Category",
            ItemPurchased:"$ItemPurchased"
            
           }
        }
    }
  }]);
  if(totalExpense.length===0)
  {
    return res.status(400).json(`No expense record found against CNIC : ${CNIC}`);
  }
  const ExpenseSum=totalExpense[0].totalExpense;
  const Record=totalExpense[0].records;
  return res.status(200).json({
    message:`Total Expense against CNIC : ${CNIC} = ${ExpenseSum}`,
    records:Record
  });
}
catch(error){
    return res.status(500).json({message:`Unable to calculate expense`});
}
}
exports.DeleteExpense=async(req,res)=>{
  const {CNIC,ItemPurchased,Date}=req.body;
  console.log('CNIC = ' + CNIC);
  const isUserExist=await Expense.findOne({CNIC,ItemPurchased,Date});
  if(!isUserExist)
  {
  return res.status(404).json({message:`Expense Record not found`});
  }
  try{
  if(ItemPurchased===isUserExist.ItemPurchased && Date===isUserExist.Date)
  {
    //expense record found
    await Expense.deleteOne(isUserExist);
    return res.status(200).json({message:`Successfully Deleted the Expense Record`});
  }
  else{
    return res.status(404).json({message:`Credentials Not Matched against CNIC ${CNIC}`});
  }
}
catch(error){
    return res.status(500).json({message:error.message});
}
}
exports.UpdateExpenseRecord=async(req,res)=>{
    const{CNIC,ItemPurchased,Date}=req.params;
    const{Amount,date,Category,itemPurchased}=req.body;
    const isUserExist=await Expense.findOne({CNIC,Date,ItemPurchased});
    if(!isUserExist)
    {
        return res.status(404).json({message:`Credentials do not match`});
    }
    try{
    //expense record matched
    isUserExist.Amount=Amount;
    isUserExist.Date=date;
    isUserExist.Category=Category;
    isUserExist.ItemPurchased=itemPurchased;
    await isUserExist.save();
    return res.status(200).json({message:`Successfully updated the expense record`});
    }
    catch(error)
    {
        return res.status(500).json({message:error.message});
    }
}

//This file contains routes definition for sorting
const User=require('../Models/UserRegModel');
const Income=require('../Models/IncomeModel');
const Expense=require('../Models/ExpenseModel');

exports.SortIncomeByDate=async(req,res)=>{
    const{CNIC}=req.params;
    if(!CNIC)
    {
        return res.status(400).json({message:`Unable to fetch CNIC`});
    }
    const isUserExist=await User.findOne({CNIC:CNIC});
    if(!isUserExist)
    {
        return res.status(400).json({message:`No user founf against CNIC ${CNIC}`});
    }
    try
    {
    //now let us sort income by date
    const sortedRecord=await Income.find({CNIC}).sort({Date:-1});
    if(!sortedRecord)
    {
        return res.status(400).json({message:`Unable to sort income by date`});
    }
    return res.status(200).json(sortedRecord);
    }
    catch(error)
    {
        return res.status(500).json({message:error.message});
    }

}

exports.SortIncomeInDes=async(req,res)=>{
    const {CNIC}=req.params;  
    if(!CNIC)
    {
        return res.status(400).json({message:`Unable to fetch CNIC`});
    }
    const isUserExist=await User.findOne({CNIC});
    if(!isUserExist)
    {
        return res.status(400).json({message:`No user found against CNIC ${CNIC}`});
    }
    try 
    {
        const sortedRecord=await Income.find({CNIC}).sort({Amount:-1});
     if(!sortedRecord)
      {
        return res.status(400).json({message:`Unable to sort income by amount`});
      }
      return res.status(200).json(sortedRecord);
    } catch (error) 
    {
          return res.status(500).json({message:error.message});
    }
}
exports.SortIncomeInAsc=async(req,res)=>{
    const {CNIC}=req.params;  
    if(!CNIC)
    {
        return res.status(400).json({message:`Unable to fetch CNIC`});
    }
    const isUserExist=await User.findOne({CNIC});
    if(!isUserExist)
    {
        return res.status(400).json({message:`No user found against CNIC ${CNIC}`});
    }
    try 
    {
        const sortedRecord=await Income.find({CNIC}).sort({Amount:1});
     if(!sortedRecord)
      {
        return res.status(400).json({message:`Unable to sort income by amount`});
      }
      return res.status(200).json(sortedRecord);
    } catch (error) 
    {
          return res.status(500).json({message:error.message});
    }
}



exports.SortExpenseByDate=async(req,res)=>{
    const{CNIC}=req.params;
    if(!CNIC)
    {
        return res.status(400).json({message:`Unable to fetch CNIC`});
    }
    const isUserExist=await User.findOne({CNIC:CNIC});
    if(!isUserExist)
    {
        return res.status(400).json({message:`No user founf against CNIC ${CNIC}`});
    }
    try
    {
    //now let us sort income by date
    const sortedRecord=await Expense.find({CNIC}).sort({Date:-1});
    if(!sortedRecord)
    {
        return res.status(400).json({message:`Unable to sort expense by date`});
    }
    return res.status(200).json(sortedRecord);
    }
    catch(error)
    {
        return res.status(500).json({message:error.message});
    }

}

exports.SortExpenseInDes=async(req,res)=>{
    const {CNIC}=req.params;  
    if(!CNIC)
    {
        return res.status(400).json({message:`Unable to fetch CNIC`});
    }
    const isUserExist=await User.findOne({CNIC});
    if(!isUserExist)
    {
        return res.status(400).json({message:`No user found against CNIC ${CNIC}`});
    }
    try 
    {
        const sortedRecord=await Expense.find({CNIC}).sort({Amount:-1});
     if(!sortedRecord)
      {
        return res.status(400).json({message:`Unable to sort expense by amount`});
      }
      return res.status(200).json(sortedRecord);
    } catch (error) 
    {
          return res.status(500).json({message:error.message});
    }
}
exports.SortExpenseInAsc=async(req,res)=>{
    const {CNIC}=req.params;  
    if(!CNIC)
    {
        return res.status(400).json({message:`Unable to fetch CNIC`});
    }
    const isUserExist=await User.findOne({CNIC});
    if(!isUserExist)
    {
        return res.status(400).json({message:`No user found against CNIC ${CNIC}`});
    }
    try 
    {
        const sortedRecord=await Expense.find({CNIC}).sort({Amount:1});
     if(!sortedRecord)
      {
        return res.status(400).json({message:`Unable to sort expense by amount`});
      }
      return res.status(200).json(sortedRecord);
    } catch (error) 
    {
          return res.status(500).json({message:error.message});
    }
}
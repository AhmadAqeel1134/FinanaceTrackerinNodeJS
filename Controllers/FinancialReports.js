//This .js  file contains endpoints definition for generating financial reports
const User=require('../Models/UserRegModel.js');
const Expense=require('../Models/ExpenseModel.js');
const Income=require('../Models/IncomeModel.js');
const SavingModel=require('../Models/SavingModel.js');
const SavingRecord=require('../Models/SavingRecord.js');

//Generating Income Summary
exports.GetMonthlyIncomeSummary=async(req,res)=>{
    const{CNIC,month}=req.params;
    console.log(month);
    const isUserExist=await User.findOne({CNIC:CNIC});
    if(!isUserExist)
    {
        return res.status(400).json({message:`No  user found against CNIC : ${CNIC}`});
    }
    //user found, now we see wether income record exist for this user or not
    const isIncomeExist=await Income.findOne({CNIC:CNIC});
    if(!isIncomeExist)
    {
        return res.status(400).json({message:`No income record found against CNIC : ${CNIC}`});
    }
    //income record found
    try 
    {
        const reqMonth=new RegExp(`^${month}`);
        const incomeRecord=await Income.find({
            CNIC:CNIC,
            Date:{$regex:reqMonth}
        });
        if(incomeRecord.length===0)
        {
            return res.status(400).json({message:`No income record found for this month`});
        }
        //income record found
        return res.status(200).json(incomeRecord);
        
    } catch (error) 
    {
     return res.status(500).json({message:error.message});   
    }
}
exports.GetMonthlyExpenseSummary=async(req,res)=>{
    const {CNIC,month}=req.params;
    const isUserExist=await User.findOne({CNIC:CNIC});
    if(!isUserExist)
    {
        return res.status(400).json({message:`No user found against CNIC : ${CNIC}`});
    }
    //user found
    const isExpenseExist=await Expense.findOne({CNIC:CNIC});
    if(!isExpenseExist)
    {
        return res.status(400).json({message:`No expense record found against CNIC : ${CNIC}`});
    }
    //expense record found
  try
   {
    const reqMonth=new RegExp(`^${month}`);
    const expenseRecord=await Expense.find({
        CNIC:CNIC,
        Date:{$regex:reqMonth}
    });
    if(expenseRecord.length===0)
    {
        return res.status(400).json({message:`No expense record found against CNIC: ${CNIC}`});
    }
     return res.status(200).json(expenseRecord);
  } catch (error)
  {
   return res.status(500).json({message:error.message}); 
  }
}
exports.GetMonthlySavingSummary=async(req,res)=>{
        const{CNIC,month}=req.params;
        const isUserExist=await User.findOne({CNIC});
        if(!isUserExist)
        {
            return res.status(400).json({message:`No user found against CNIC : ${CNIC}`});
        }
        //user found
        const isSavingGoal=await SavingModel.findOne({CNIC});
        if(!isSavingGoal)
        {
            return res.status(400).json({message:`No saving goal found against CNIC : ${CNIC}`});
        }
        //saving goal found, now fetching saving record
        try 
        {
          const reqMonth=new RegExp(`^${month}`);
          const savingRecord=await SavingRecord.find({
            CNIC:CNIC,
            AmtDate:{$regex:reqMonth}
          });  
          if(savingRecord.length===0) 
          {
            return res.status(400).json({message:`No saving record found for this month`});
          }
          //saving record found
          return res.status(200).json(savingRecord);
        } catch (error) 
        {
         return res.status(500).json({message:error.message});   
        } 
}

exports.GetBalanceOverview=async(req,res)=>{

    const{CNIC}=req.body;
    if(!CNIC)
    {
        return res.status(404).json({message:`Unable to fetch CNIC`});
    }
    const isUserExist=await User.findOne({CNIC});
    if(!isUserExist)
    {
        return res.status(400).json({message:`No user found against CNIC :${CNIC}`});

    }
   try{
   
    //calculating total income
    const totalIncome=await Income.aggregate([
        {$match:{CNIC:CNIC}},  
        {
            $group:
            {
             _id:null,
             totalIncome:{$sum:"$Amount"},
            }
         }
    ]);
    //calculating total expense
    const totalExpense=await Expense.aggregate([
        {$match:{CNIC:CNIC}},
        {
            $group:
            {
                _id:null,
                totalExpense:{$sum:"$Amount"}
            }
        }
    ]);
        
    let IncomeSum = totalIncome.length > 0 ? totalIncome[0].totalIncome : 0;
    let ExpenseSum = totalExpense.length > 0 ? totalExpense[0].totalExpense : 0;
    
    let CurrentBal=0;
    CurrentBal=IncomeSum-ExpenseSum;
    const balanceMsg=CurrentBal<1000? "Low Balance":"Sufficient Balance Exists";
    if(IncomeSum>=ExpenseSum)
    {
        return res.status(200).json({
            message:`Current Balance = ${CurrentBal}`,
            balanceMsg,
            IncomeEarned:`Total Earned  = ${IncomeSum}`,
            IncomeSpent:`Total Expense = ${ExpenseSum}`,
        });
    }
    else
    {
         return res.status(200).json({
            message:`Warning! Your expense have exceeded your income`,
            CurrentCredit:`Current Balance = ${CurrentBal}`,
            IncomeEarned:`Total Earned = ${IncomeSum}`,
            IncomeSpent:`Total Expense = ${ExpenseSum}`,
         }); 
    }
   }
   catch(error)
   {
    return res.status(500).json({message:error.message});
   }

}
exports.GetExpenseCategory=async(req,res)=>{
    const{CNIC,Category}=req.params;;
   if(!CNIC || !Category)
   {
    return res.status(400).json({message:`Unable to fetch CNIC or Category`});
   }
   const isUserExist=await User.findOne({CNIC});
   if(!isUserExist)
   {
    return res.status(400).json({message:`No user found against CNIC ${CNIC}`});
   }
   try{
   const expenseCategory=await Expense.find({CNIC,Category});
   if(!expenseCategory)
   {
    return res.status(404).json({message:`Error fetching the expense category`});
   }
   return res.status(200).json(expenseCategory);
   }
   catch(error)
   {
    return res.status(500).json({message:error.message})
   }
}

exports.GetIncomeCategory=async(req,res)=>{
    const {CNIC}=req.params;
    if(!CNIC)
    {
        return res.status(400).json({message:`Unable to fetch CNIC`});
    }
    const isUserExist =await User.findOne({CNIC});
    if(!isUserExist)
    {
        return res.status(404).json({message:`No user found against CNIC ${CNIC}`});
    }
    try{
    const freelanceIncome=await Income.find({CNIC,Category:'freelance'});
    const salaryIncome=await Income.find({CNIC,Category:'salary'});
    const investmentIncome=await Income.find({CNIC,Category:'investments'});
    const othersIncome=await Income.find({CNIC,Category:'other'});
    if(!freelanceIncome || !salaryIncome || !investmentIncome || !othersIncome)
    {
        return res.satus(400).json({message:`Unable to fetch income category`});
    }
    return res.status(200).json({
        message:`Category wise breakdown of Income`,
        freelanceIncome,
        salaryIncome,
        investmentIncome,
        othersIncome
    });
    }
    catch(error)
    {
        return res.status(500).json({message:error.message});
    }



}
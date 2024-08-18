//Requiring Different Models used in project
const User=require('../Models/UserRegModel.js');
const Income=require('../Models/IncomeModel.js');
const Expense=require('../Models/ExpenseModel.js');
const SavingModel=require('../Models/SavingModel.js');
const SavingRecord=require('../Models/SavingRecord.js');

const CsvParser=require('json2csv').Parser;

 
//now dealing with exporting data from MongoDB into Excel
exports.GetUsersData=async(req,res)=>{

    try{
    let UsersArray=[];
    var userRegistered=await User.find({});
    userRegistered.forEach((user)=>{
        const{FirstName,SecondName,Email,Number,CNIC}=user;
        UsersArray.push({FirstName,SecondName,Email,Number,CNIC});
    });

    //now declaring CSV fields
    const csvFields=['FirstName','SecondName','Email','Number','CNIC'];
    const csv_Parser=new CsvParser({fields:csvFields});
    const csvData=csv_Parser.parse(UsersArray);
    res.setHeader("Content-Type","text/csv");
    res.setHeader("Content-Disposition","attachment:filename=RegisteredUsers.csv");
     res.status(200).end(csvData);
}
catch(error){
    return res.status(500).json({message:error.message});
}
}

exports.GetIncomeRecordInCSV=async(req,res)=>{
    const {CNIC} =req.params; // user whose expense is required in .csv file
    if(!CNIC)
    {
        return res.status(404).json({message:`Unable to fetch CNIC`});
    }
    const isUserExist =await User.findOne({CNIC:CNIC});
    if(!isUserExist)
    {
        return res.status(404).json({message:`No user found against CNIC ${CNIC}`});
    }
    try{
    let IncomeArray=[];
    var IncomeRecord=await Income.find({CNIC:CNIC});

    IncomeRecord.forEach((user)=>{
    const {CNIC,TaskName,Source,Amount,Date,Category}=user;
    IncomeArray.push({CNIC,TaskName,Source,Amount,Date,Category});
    });

    //defining CSV fields
    const CSVFields=['CNIC','TaskName','Source','Amount','Date','Category'];
    const csv_Parser=new CsvParser({fields:CSVFields});
    const csvData=csv_Parser.parse(IncomeArray);

    
    res.setHeader("Content-Type","text/csv");
    res.setHeader("Content-Disposition","attachment:filename=IncomeRecord.csv");
    res.status(200).end(csvData);
    }
    catch(error){
        return res.status(200).json({message:error.message});
    }
}

exports.GetExpenseRecordInCSV=async(req,res)=>{
 
    const {CNIC} =req.params; // user whose expense is required in .csv file
    if(!CNIC)
    {
        return res.status(404).json({message:`Unable to fetch CNIC`});
    }
    const isUserExist =await User.findOne({CNIC:CNIC});
    if(!isUserExist)
    {
        return res.status(404).json({message:`No user found against CNIC ${CNIC}`});
    }
     try 
    {
      let ExpenseArray=[];
      var ExpenseRecord=await Expense.find({CNIC:CNIC});
      ExpenseRecord.forEach((user)=>{
        const{CNIC,Amount,Date,Category,ItemPurchased}=user;
        ExpenseArray.push({CNIC,Amount,Date,Category,ItemPurchased});
      });  
      //defining fields
      const CSVFields=['CNIC','Category','ItemPurchased','Amount','Date'];
      const csv_Parser=new CsvParser({fields:CSVFields});
      const csvData=csv_Parser.parse(ExpenseArray);
      
      res.setHeader("Content-Type","text/csv");
      res.setHeader("Content-Disposition","attachment:filename=ExpenseRecord.csv");
      res.status(200).end(csvData);
    } 
    catch (error)
    {
        return res.status({message:error.message});
        
    }
}
 exports.GetSavingRecordInCSV=async(req,res)=>{
    const {CNIC} =req.params; // user whose expense is required in .csv file
    if(!CNIC)
    {
        return res.status(404).json({message:`Unable to fetch CNIC`});
    }
    const isUserExist =await User.findOne({CNIC:CNIC});
    if(!isUserExist)
    {
        return res.status(404).json({message:`No user found against CNIC ${CNIC}`});
    }
    const isSavingModel=await SavingModel.findOne({CNIC});
    if(!isSavingModel)
        {
            return res.status(404).json({message:`No saving record found against CNIC ${CNIC}`});
        }
       try{
        let SavingRecordArray=[];
        var savingsRecord=await SavingRecord.find({CNIC:CNIC});
        savingsRecord.forEach((user)=>{
            const{CNIC,AmtAdded,AmtDate,Time}=user;
            SavingRecordArray.push({CNIC,AmtAdded,AmtDate,Time});
        });
        //defining fields
        const csvFields=['CNIC','AmtAdded','AmtDate','Time'];
        const csv_Parser=new CsvParser({fields:csvFields});
        const csvData=csv_Parser.parse(SavingRecordArray);
        res.setHeader("Content-Type","text/csv");
        res.setHeader("Content-Disposition","attachment:filename=SavingRecord.csv");
        res.status(200).end(csvData);

       }
       catch(error)
       {
        return res.status(500).json({message:error.message});
       }
 }
 exports.GetBalanceOverview=async(req,res)=>{

    const{CNIC}=req.params;
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
    console.log(totalIncome);
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
        
    console.log(totalExpense);
    let IncomeSum = totalIncome.length > 0 ? totalIncome[0].totalIncome : 0;
    let ExpenseSum = totalExpense.length > 0 ? totalExpense[0].totalExpense : 0;
    
    let CurrentBal=0;
    CurrentBal=IncomeSum-ExpenseSum;
    const balanceMsg=CurrentBal<1000? "Low Balance": "";
    if(IncomeSum>=ExpenseSum)
    {
        return res.status(200).json({
            CurrentCredit:`Current Balance = ${CurrentBal}`,
            IncomeEarned:`Total Earned  = ${IncomeSum}`,
            IncomeSpent:`Total Expense = ${ExpenseSum}`,
            balanceMsg
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
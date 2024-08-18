//Requiring Different Models used in project
const User=require('../Models/UserRegModel.js');
const Income=require('../Models/IncomeModel.js');

//End points for Income Tracking
//Adding income, Updating Income, Read Income Details and Deletion of Incomes

exports.AddIncomeRecord=async(req,res)=>{
    const {CNIC,TaskName,Source,Amount,Date,Category}=req.body;

    try{
        const isUserExist=await User.findOne({CNIC:CNIC});
        if(!isUserExist)
        {
            console.log('CNIC does not match');
            return res.status(404).json({message:`CNIC does not found`});
        }
        console.log('CNIC matched');
        console.log('CNIC = ' + CNIC + 'Source = ' + Source + 'Amount = ' + Amount + 'Date = ' + Date + 'Category = ' + Category);
    const newIncome=await Income.create({CNIC,TaskName,Source,Amount,Date,Category});
    return res.status(200).json(newIncome);
    }
    catch(error){
        console.log('Cannot add new income');
        return res.status(404).json({message:error.message});
    }
}
exports.deleteIncomeRecord=async(req,res)=>{
    const{CNIC,TaskName,Date}=req.body;
     const isUserExist=await Income.findOne({CNIC,TaskName,Date});
     if(!isUserExist)
     {
        console.log('Record Not Found');
        return res.status(404).json({message:`Record Not Found`});
     }
     try{
        
     if(Date===isUserExist.Date && TaskName===isUserExist.TaskName)
     {
        //Date and TaskName to be deleted matched
        await Income.deleteOne({TaskName});
        return res.status(200).json({messaage:`Income Record Deleted`});
     }
     else
     {
        return res.status(404).json({message:`Date or TaskName not matched`});
     }
    }
    catch(error)
      {
        return res.status(500).json({message:`Cannot delete income record`});
      } 
}
exports.updateIncomeRecord=async(req,res)=>{
    const {CNIC,TaskName,Date}=req.params;
    const{taskName,Source,Amount,date,Category}=req.body;
    const isUserExist=await Income.findOne({CNIC,TaskName,Date});
     if(!isUserExist)
     {
        return res.status(404).json({message:`Income Record Not Found`});
     }
     //let us update credentials
     isUserExist.TaskName=taskName;
     isUserExist.Source=Source;
     isUserExist.Amount=Amount;
     isUserExist.Date=date;
     isUserExist.Category=Category;
     await isUserExist.save();  //saving the changes
    return res.status(200).json({
        message:`Successfully updated the record`
    });
}
exports.userTotalIncome=async(req,res)=>{
    const {CNIC}=req.body;
    console.log('CNIC ENTERED : ' + CNIC);
    const isUserExist=await Income.findOne({CNIC});
    if(!isUserExist)
    {
      return res.status(404).json({message:`CNIC : ${CNIC} Not Found`});
    }
    /*we know perform aggregation on Income Schema and match the given CNIC 
     against the income record*/ 
    try{
     const totalIncome=await Income.aggregate([
        {$match:{CNIC:CNIC}},  
        {
            $group:
            {
             _id:null,
             totalIncome:{$sum:"$Amount"},
             records:
             {
               $push:
               {
                TaskName:"$TaskName",
                Source:"$Source",
                Amount:"$Amount",
                Date:"$Date",
                Category:"$Category"
               }
             }
            }
         }
    ]);
    if(totalIncome.length===0)
    {
     console.log(`No income record found against CNIC : ${CNIC}`);
     return res.status(400).json({message:`No income record found against CNIC : ${CNIC}`});
    }
    const UsersTotalIncome=totalIncome[0].totalIncome;
    const Records=totalIncome[0].records;
    console.log(`Total Income against CNIC  ${CNIC}  = ${UsersTotalIncome}`);
    return res.status(200).json({
        message:`Total Income against CNIC ${CNIC}  = ${UsersTotalIncome}`,
        records: Records
    });
    }
    catch(error)
    {
        console.log('Unable to calculate income');
        return res.status(500).json({message:`Unable to calculate income`});
    }
}
//Requiring Different Models used in project
const User=require('../Models/UserRegModel.js');
const SavingModel=require('../Models/SavingModel.js');
const SavingRecord=require('../Models/SavingRecord.js');

exports.SetSavingGoals=async(req,res)=>{
    const{CNIC}=req.params;
    if(!CNIC)
    {
        return res.status(404).json({message:`Unable to fetch CNIC`});
    }
    const isUserExist=await User.findOne({CNIC});
    if(!isUserExist)
    {
        return res.status(404).json({message:`User with CNIC ${CNIC} not found`});
    }
    //user found
     const{TargetAmount,TargetDate}=req.body;
     const targetDateObj=new Date(TargetDate);
     const currentTime=new Date();
     if(targetDateObj<currentTime)
     {
        return res.status(400).json({message:`Target date must be in futute. Date ${TargetDate} has already passed`});
     }
     try
    {
        const newGoal=await SavingModel.create({CNIC,TargetAmount,TargetDate}); 
        return res.status(200).json(newGoal);
    }
    catch (error) 
    {
        return res.status(500).json({message:`Unable to add saving goal`});
    }
}

exports.AddSavingAmount=async(req,res)=>{
    const{CNIC,AmtAdded,AmtDate}=req.body;
    const isUserExist=await User.findOne({CNIC});
    if(!isUserExist)
    {
        return res.status(404).json({messsage:`User with CNIC ${CNIC} not found`});
    }
    //user is regsiered, we now proceed
    const isSavingGoal=await SavingModel.findOne({CNIC});
    if(!isSavingGoal)
    {
        return res.status(404).json({message:`No saving goal found against CNIC : ${CNIC}`});
    }
    //now we found the saving goal,
    try 
    {
        const newRecord=await SavingRecord.create({CNIC,AmtAdded,AmtDate});
        //updating the current amount of saving goal
         isSavingGoal.CurrentAmount=isSavingGoal.CurrentAmount+newRecord.AmtAdded;
          await isSavingGoal.save();
         return res.status(200).json({
            message:`Saving Record Added Successfully`,
            newRecord
        });
    } 
    catch (error)
     {
        return res.status(500).json({message:error.message});
    }
}
exports.GetSavingRecord=async(req,res)=>{
    const {CNIC}=req.body;
    if(!CNIC)
    {
        return res.status(404).json({message:`Unable to fetch CNIC`});
    }
    const isUserExist=await User.findOne({CNIC});
    if(!isUserExist)
    {
        return res.status(404).json({message:`No user found against CNIC ${CNIC}`});
    }
    //user found
    const isSavingGoal=await SavingModel.findOne({CNIC});
    if(!isSavingGoal)
    {
        return res.status(404).json({message:`No saving goal found for user with CNIC ${CNIC}`});
    }
    //saving goal exists for user
    try{
    const totalAmtAdded=await SavingRecord.aggregate([
        {$match:{CNIC:CNIC}},
        {
            $group:
            {
                _id:null,
                totalAmtAdded:{$sum:"$AmtAdded"},
             //displaying all the saving records
                records:
                {
                   $push:
                   {
                    AmtAdded:"$AmtAdded",
                    AmtDate:"$AmtDate",
                    Time:"$Time"
                   }
                }
            }
        }
    ]);
    if(totalAmtAdded.length===0)
    {
        return res.status(404).json({message:`No saving record found for CNIC ${CNIC}`});
    }
    const amtAdded=totalAmtAdded[0].totalAmtAdded;
    const Record=totalAmtAdded[0].records;
    return res.status(200).json({
        message:`Total Amount Added For Saving Goal = ${amtAdded} `,
        records:Record
    });
       }
       catch(error)
       {
        return res.status(500).json({message:`Unable to get saving record`});
    }
 }
 exports.TrackingSavingGoal=async(req,res)=>{
    const {CNIC}=req.params;
    if(!CNIC)
    {
        return res.status(404).json({message:`Unable to fetch CNIC`});
    }
    const isUserExist=await User.findOne({CNIC});
    if(!isUserExist)
    {
        return res.status(404).json({message:`No user found against CNIC ${CNIC}`});
    }
    //user found
    const isSavingGoal=await SavingModel.findOne({CNIC});
    if(!isSavingGoal)
    {
        return res.status(404).json({message:`No saving goal found against CNIC ${CNIC}`});
    }
    //saving goal found
    const target=isSavingGoal.TargetAmount;
    const crAmt=isSavingGoal.CurrentAmount;
    const crDate=new Date();
    const targetDate=new Date(isSavingGoal.TargetDate);
    if(crDate>targetDate && crAmt<target)
    {
        const amtLeft=target-crAmt;
        return res.status(200).json({
            message:`Failed to achieve saving goal.Target Date ${targetDate} has been passed. Leftover amount : ${amtLeft}`
        });
    } 
  else if(crAmt>=target && crDate<=targetDate) //goal achieved within the time frame
    {
        const percentage=(crAmt/target)*100;
        //user has achieved goal
        isSavingGoal.isAchieved=true;
        await isSavingGoal.save();
        return res.status(200).json({
            message:`Saving goal achieved at Date :${crDate}`,
            TargetAmount:target,
            CurrentAmount:crAmt,
            additionalInfo:`Saving Goal Status : ${percentage} %` 
        });
    }
    else if(crAmt<target && crDate<targetDate)
    {
        const amtLeft=target-crAmt;
        const percentage=(crAmt/target)*100;
        return res.status(200).json({
            message:`Target not achieved yet. Amount left to reach goal = ${amtLeft}.Current Date :${crDate}\n Target Date ${targetDate}`,
            additionalInfo:`Saving Goal Status : ${percentage} %`   
        });
    }

 }


//Requiring Different Models used in project
const User=require('../Models/UserRegModel.js');
const TempUser=require('../Models/tempUsersModel.js');


const bcrypt=require('bcrypt');
const nodemailer=require('nodemailer');
const dotenv=require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();


const transporter=nodemailer.createTransport({
    service:'gmail',
    secure:true,
    port:465,
    auth:{
        //sender credential
    user:process.env.myMail,
    pass:process.env.myPassword//less secure app password
    }
});

const sendVerificationEmail = async (newUser,firstName,secondName,verCode)=>{
    try{
         await transporter.sendMail({
               from:process.env.myMail,
               to:newUser,
               subject:'Account Verification',
               text:`Dear ${firstName} ${secondName}, Your account verification code is ${verCode}`});
      }
      catch(error)
      {
        console.log(error);
      }

}

const sendDeletionEmail=async(deleteUser,firstName,secondName)=>{
    try {
        await transporter.sendMail({
            from:process.env.myMail,
            to:deleteUser,
            subject:'Request for Account Deletion',
            text:`Dear ${firstName} ${secondName}, you request for account deletion has been approved.`
            });
    } catch (error) {
        console.log(error);
        res.status(404).json({message:`Unable to deliver mail`});
    }
}

const sendUpdateEmail=async(userEmail,firstName,secondName)=>
{
    try  {
    await transporter.sendMail({
        from:process.env.myMail,
        to:userEmail,
        subject:'Update Account',
        text:`Dear ${firstName} ${secondName}, Your account credentials have been updated`
    });
    } 
    catch (error) {
        console.log('Updating Email Sent');
        res.status(404).json();
     }
}

const sendPasswordVerCode=async(firstName,secondName,userEmail,SecCode)=>{
    try {
        transporter.sendMail({
            from:process.env.myMail,
            to:userEmail,
            subject:'Verification Code for Password Change',
            text:`Dear ${firstName} ${secondName} , your code for password change verification is ${SecCode}`
        });
        
    } catch (error) {
        console.log('Unable to send mail');
        return res.status(500).json({message:`Unable to Send Mail`});
    }
}


let SecNum=0;

function generateRandomNumber(){
    return Math.floor(10000+Math.random()*90000);
}

//End points for User Log In, SignUp and User Authentication

exports.welcome=async(req,res)=>{
    res.send('Finance Tracker');
}

exports.registerUser=async(req,res)=>{
    try
     {
      const newUser=await TempUser.create(req.body);
      console.log('Recepient Email : ', req.body.Email);
       SecNum=generateRandomNumber();
      await sendVerificationEmail(newUser.Email,newUser.FirstName,newUser.SecondName,SecNum);
     
      //defining a token  
         console.log('Secret Num = ' + SecNum); 
         const token=jwt.sign(
           { firstName:newUser.FirstName,secondName:newUser.SecondName,email:newUser.Email,number:newUser.Number,cnic:newUser.CNIC},
            '22I-1134',
            {expiresIn:'2h'}
     );
         return res.status(200).json({
           newUser,
            token
         });
       
    } 
    catch (error) 
    {
        console.log('Unable to register ',error); 
        //deleting from temporary database 
        await TempUser.deleteOne({Email:req.body.Email});
        res.status(500).json({error}); 
    }
}

exports.verifyUser = async (req, res) => {
    const { CNIC } = req.params;
    const { enteredCode } = req.body;

    try {
        const userToVerify = await TempUser.findOne({ CNIC});
        if (!userToVerify) {
            console.log('User Not Found');
            return res.status(404).json({ message: `User with CNIC ${CNIC} not found` });
        }
        console.log('Sec Num ' +SecNum);
        if (enteredCode === SecNum) {
            userToVerify.isVerified = true;
            await userToVerify.save();
        } 
        else
         {
         
            console.log('Invalid verification code');
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        if (userToVerify.isVerified) 
         {
            console.log('User has been verified successfully');
            const userObject = userToVerify.toObject();
            const VerifiedUser = await User.create(userObject);
            await TempUser.deleteOne({ Email: VerifiedUser.Email });

            return res.status(200).json({
                message: `User has been verified successfully.`,
                VerifiedUser
            });
        }
    } 
    catch (error)
    {
        console.log('Error verifying user: ', error);
        return res.status(500).json({ error });
    }
};

exports.signIn=async(req,res)=>{
    const {Email,Password}=req.body;
    console.log('Email Entered :' + Email + '\n Password :' + Password);
    try {
        const validEmailHolder=await User.findOne({Email});
        if(!validEmailHolder)
        {
            return res.status(401).json({message:'Email not found'});
        }
        else
        {
            const isValidPassword=await bcrypt.compare(Password,validEmailHolder.Password);
            if(!isValidPassword)
            {
                return res.status(401).json({message:'Password does not match'});
            }
        }

        const token=jwt.sign(
               { id:validEmailHolder._id, email:validEmailHolder.Email},
               '22I-1134',
               {expiresIn:'2h'}
        );
        console.log(`Successfully logged into your account`);
        return res.status(200).json({
            message:`Successfully logged into account registered on mail : ${Email}`,
            token
    } );
        
    } catch (error) {
        console.log('Unable to log in');
        res.status(500).json({message:error.message});
    }
}

exports.Seeuser=async(req,res)=>{
    const { userName } = req.params;
    console.log('Username   ' + userName);
    const isUserExist=await User.findOne({UserName:userName});
    if(!isUserExist)
    {
        console.log('This user is not registred');
        res.status(404).json({message:'User not registered'});
    }
    else
    {
        const token=jwt.sign(
            {firstName:newUser.FirstName,secondName:newUser.SecondName,email:newUser.Email,number:newUser.Number,cnic:newUser.CNIC},
            '22I-1134',
            {expiresIn:'2h'}
        );
        res.status(200).send({
            FullName:`${isUserExist.FirstName} ${isUserExist.SecondName}`,
            Number:isUserExist.Number,
            token
        });
    }
}
exports.updateUser = async (req, res) => {
    const { FirstName, SecondName, UserName,Email, Number, Password } = req.body;

    try {
        const isUserExist = await User.findOne({ Email:Email });
        if (!isUserExist) {
            return res.status(401).json({ message: 'User Not Exists' });
        }

        const isValidPassword = await bcrypt.compare(Password, isUserExist.Password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Password does not match' });
        }
        isUserExist.FirstName = FirstName;
        isUserExist.SecondName = SecondName;
        isUserExist.UserName=UserName;
        isUserExist.Number = Number;
        isUserExist.Password = Password;
        await isUserExist.save();
        const token=jwt.sign(
            {firstName:isUserExist.FirstName,secondName:isUserExist.SecondName,userName:isUserExist.UserName,number:isUserExist.Number},
            '22I-1134',
           { expiresIn:'2h'}
        );

        console.log('Updated the changes successfully');
        await sendUpdateEmail(Email,FirstName,SecondName);
        res.status(200).json(
            {
            isUserExist,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteUser=async(req,res)=>{
    const {userName}=req.params;
    const {Email,Password}=req.body;
    try{
    const isUserExist= await User.findOne({UserName:userName});
    if(!isUserExist)
    {
        console.log('User Does not Exist');
        res.status(404).json(error);
    }
     const isValidPassword=bcrypt.compare(isUserExist.Password,Password);
     if(!isValidPassword)
     {
        console.log('Password does not match credential');
        res.status(500).json(error);
     }
     //user name and password matched
     console.log('User Verified');
     await User.findOneAndDelete({FirstName});
     console.log('Account Deleted Successfully');
     const token=jwt.sign(
         {_id:isUserExist._id,Email:isUserExist.Email},
        '22I-1134',
        {expiresIn:'2h'}
     );
     res.status(200).json({
        message:`Account has been deleted`,
        token
    });
     await sendDeletionEmail(Email,isUserExist.FirstName,isUserExist.SecondName);
    }
    catch(error){    
         console.log(error);
         res.status(404).json({message:'Unable To Delete Account'});
    }
     
};
exports.forgetPassword=async(req,res)=>{
    const{Email}=req.body;
    console.log('Email : ' + Email);
    const isUserExist=await User.findOne({Email:Email});
    if(!isUserExist)
    {
        console.log('Email not found');
        return res.status(404).json({message:error.message});
    }
     console.log('User Found');
     SecNum=generateRandomNumber();
     console.log('Sec Num  ' +  SecNum);
   await  sendPasswordVerCode(isUserExist.FirstName,isUserExist.SecondName,isUserExist.Email,SecNum);
     return res.status(200).json({message:`Verification code sent to ${isUserExist.Email}`});
}
exports.changePassword=async(req,res)=>{
    const{Email,NewPassword,enteredCode}=req.body;
    console.log('Email = ', Email);
    console.log('Secret Number = ' , SecNum);
    console.log('EnterdCode = ',enteredCode);
    try{
        console.log('try mein aya hai');
    if(enteredCode===SecNum)
    {
        console.log('if condition chali hai');
          //let us update its password
          const isUserExist=await User.findOne({Email});
          isUserExist.Password=NewPassword;
          await isUserExist.save();
          console.log('Password changes successfully');
          return res.status(200).json({message:`Password Changed Successfully`});
        }
        else
        {
           console.log('Verification Failed');
           return res.status(500).json({message:`Can't verify Email`});
        }
    }
    catch(error)
    {
        console.log('Unable to Change Password');
        return res.status(500).json({message:`Unable to Change Password`});
    }
} 
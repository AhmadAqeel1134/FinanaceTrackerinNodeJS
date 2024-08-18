//Requiring the libraries used
const mongoose=require('mongoose');
const express=require('express');
const cors=require('cors');
const dotenv=require('dotenv');
const app=express();
const FinanceRouters=require('./Routers/financeRouters');
app.use(express.json());
app.use(cors());
dotenv.config();

app.use('/api/finance/',FinanceRouters);

//connecting to MongoDB database
mongoose.connect(process.env.ConnectToDB)
.then( ()=>{
    console.log('Connected to database');
}
)
.catch(()=>{
    console.log('Failed to connect to database');
});
module.exports=app;
const express=require('express');
const{GetUsersData,GetIncomeRecordInCSV,GetExpenseRecordInCSV,GetSavingRecordInCSV}=require('../Controllers/ExportToCSV');
const{SetSavingGoals,AddSavingAmount,GetSavingRecord,TrackingSavingGoal}=require('../Controllers/SavingGoals');
const{registerUser,signIn,Seeuser,updateUser,welcome,deleteUser,forgetPassword,changePassword,verifyUser}=require('../Controllers/UserSignInSignUp');
const{AddIncomeRecord,deleteIncomeRecord,updateIncomeRecord,userTotalIncome}=require('../Controllers/IncomeTracking'); 
const{AddExpenseRecord,userTotalExpense,DeleteExpense,UpdateExpenseRecord}=require('../Controllers/ExpenseTracking');   
const{GetMonthlyIncomeSummary,GetMonthlyExpenseSummary,GetMonthlySavingSummary,GetBalanceOverview,GetExpenseCategory,GetIncomeCategory}=require('../Controllers/FinancialReports');
const{SortIncomeByDate,SortIncomeInDes,SortIncomeInAsc,SortExpenseByDate,SortExpenseInDes,SortExpenseInAsc}=require('../Controllers/Sorting');
const router=express.Router();

//routes for user log in, signup and authentication functionality
router.post('/register',registerUser);
router.post('/SignIn',signIn);
router.get('/seeUser/:CNIC',Seeuser);
router.put('/updateUser', updateUser);
router.delete('/DeleteUser/:CNIC',deleteUser);  ///will receive CNIC as a parameter
router.post('/verify/:CNIC',verifyUser);
router.post('/ForgetPassword',forgetPassword);
router.post('/ChangePassword',changePassword);
router.get('/',welcome);

//routes for income tracking
router.post('/AddIncome',AddIncomeRecord);
router.delete('/DeleteIncome',deleteIncomeRecord);
router.put('/UpdateIncome/:CNIC/:TaskName/:Date',updateIncomeRecord);
router.get('/UserTotalIncome',userTotalIncome);  //getting users total income

//routes for expense tracking
router.post('/addExpense',AddExpenseRecord);
router.delete('/deleteExpense',DeleteExpense);
router.get('/UserTotalExpense',userTotalExpense);
router.put('/updateExpenseRecord/:CNIC/:ItemPurchased/:Date',UpdateExpenseRecord);

//routes for saving goals
router.post('/setSavingGoals/:CNIC',SetSavingGoals);
router.post('/addSavingAmt',AddSavingAmount);
router.get('/getSavingRecord',GetSavingRecord);
router.get('/trackingSavingGoal/:CNIC',TrackingSavingGoal);  //requiring CNIC (unique id) as a parameter

//routes for downloading .CSV Files
router.get('/getUsersCsv',GetUsersData);
router.get('/getIncomeCsv/:CNIC',GetIncomeRecordInCSV);
router.get('/getExpenseCsv/:CNIC',GetExpenseRecordInCSV);
router.get('/getSavingRecordCsv/:CNIC',GetSavingRecordInCSV);

//routes for generating financial reports
router.get('/getMonthlyIncomeSummary/:CNIC/:month',GetMonthlyIncomeSummary);
router.get('/getMonthlyExpenseSummary/:CNIC/:month',GetMonthlyExpenseSummary);
router.get('/getMonthlySavingSummary/:CNIC/:month',GetMonthlySavingSummary);
router.get('/getBalanceOverview',GetBalanceOverview);
router.get('/getExpenseCategory/:CNIC/:Category',GetExpenseCategory);
router.get('/getIncomeCategory/:CNIC',GetIncomeCategory);

//routes for sorting 
router.get('/sortIncomeByDate/:CNIC',SortIncomeByDate);
router.get('/sortIncomeInDes/:CNIC',SortIncomeInDes);
router.get('/sortIncomeInAsc/:CNIC',SortIncomeInAsc);
router.get('/sortExpenseByDate/:CNIC',SortExpenseByDate);
router.get('/sortExpenseInDes/:CNIC',SortExpenseInDes);
router.get('/sortExpenseInAsc/:CNIC',SortExpenseInAsc);
module.exports=router;
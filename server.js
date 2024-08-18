const port=10000;
const app=require('./app');
const express=require('express');

app.listen(port,(error)=>{
    if(error)
        console.log(`Server is not listening to the port  ${port}`);
    console.log(`Server is listening to the port  ${port}`);
})
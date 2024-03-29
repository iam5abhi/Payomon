require('dotenv').config()
const express = require('express')
const cors =require('cors')
const dbconn = require('./db/db')
const app =express()
const router = require('./router/Index')
const path = require("path");
const http = require("http");
const customerrouter = require('./router/customer')
const res = require('express/lib/response')
const port =process.env.PORT || 3400

//*********************Midlleware********************** */

app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.use(cors());
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

app.use('/api',router)
app.use('/api/customer',customerrouter)

const environment = process.env.NODE_ENV ;


 app.listen(port,()=>{
     console.log(`Server is running ${port}`)

 })





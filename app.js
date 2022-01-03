require('dotenv').config()
const express = require('express')
const dbconn = require('./DB/db')
const app =express()
const router = require('./router/Index')
const customerrouter = require('./router/customer')
const port =process.env.Port || 3400
//*********************Midlleware********************** */
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//  const logger =(req,res,next)=>{
//      console.log(`[${new Date}] [${req.method}]  [${req.url}]`)
//  }

//  app.use(logger)
app.use('/api',router)
app.use('/api/customer',customerrouter)

app.listen(port,()=>{
    console.log(`Server is running 8000`)
})




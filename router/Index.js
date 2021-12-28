//  const { Router } = require('express');
//  const { check } = require('express-validator')
//  const express =require('express');
//  const router = express.Router();
//  const BussinesController =require('../Controller/businessControllers')
 





const express = require('express')
const { check } = require('express-validator')
const res = require('express/lib/response')
const router = express.Router()
const businessController = require('../Controller/businessControllers')



router.get('/',(req,res)=>{
  console.log(req)
  res.send("hello word");
})

router.post('/signup',
[
  check('name').isEmpty(),
  check('BusinessEmail').isEmail(),
  check('BusinessName').isEmpty(),
  check('password').isLength({ min : 8,max:15}).isEmpty().withMessage('The password must be 8+ chars long and contain a numbers'),
  check('BusinessPhonenumber').isLength({min:10}).withMessage('BusinessPhonenumber must be at least 10 digitNumber')
],
businessController.creatuser
)

router.post('/signIn',[
  check('BusinessEmail').isEmail(),
  check('password').isEmpty()
],
businessController.VerifyBussiness
)


module.exports=router
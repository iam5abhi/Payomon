const express =require("express")
const { check } = require('express-validator')
const res = require("express/lib/response")
const router = express.Router()
const customController = require('../Controller/customerController')
const isAuthenticationCustomer = require('../middleware/CustomerMidddleware')


router.get('/',()=>{
     console.log("hello code softic")
})


router.post('/signup',
[
  check('name').isEmpty(),
  check('email').isEmail(),
  check('password').isLength({ min : 8,max:15}).isEmpty().withMessage('The password must be 8+ chars long and contain a numbers'),
  check('phoneNumber').isLength({min:10}).withMessage('BusinessPhonenumber must be at least 10 digitNumber')
],
customController.createcustomer
)

router.post('/signiIn',
[ 
  check('email').isEmail(),
  check('password').isLength({ min : 8,max:15}).isEmpty().withMessage('The password must be 8+ chars long and contain a numbers'),
],
customController.Verifycustomer
)


router.post('/payment/:id',isAuthenticationCustomer,customController.PayementMethod)


router
     .route('/wallet')
     .get(customController.checkWallet)
     .post(customController.AddMoneyWallet)


router
      .route('/wallet/:id')
     .put(customController.updatewallet)





module.exports = router
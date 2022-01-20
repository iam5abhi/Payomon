const express =require("express")
const { check } = require('express-validator')
const res = require("express/lib/response")
const router = express.Router()
const customController = require('../controller/customerController')
const isAuthenticationCustomer =require('../middleware/CustomerMidddleware')



router
    .route('/')
    .get(isAuthenticationCustomer,(req,res,next)=>{
          res.send("<h1>Hello cod</h1>")
    })


router
   .route('/signup')
   .post([
          check('name').isEmpty(),
          check('email').isEmail(),
          check('password').isLength({ min : 8,max:15}).isEmpty().withMessage('The password must be 8+ chars long and contain a numbers'),
          check('phoneNumber').isLength({min:10}).withMessage('BusinessPhonenumber must be at least 10 digitNumber')
         ],
          customController.createcustomer
        )

router
   .route('/signin')
   .post([ 
          check('email').isEmail(),
          check('password').isLength({ min : 8,max:15}).isEmpty().withMessage('The password must be 8+ chars long and contain a numbers'),
         ],
        customController.Verifycustomer
     )


router 
     .route('/changePassword')
     .post([
             check('newpassword').isLength({ min : 8,max:15}).isEmpty().withMessage('The password must be 8+ chars long and contain a numbers'),
             check('newconfirmpassword').isLength({ min : 8,max:15}).isEmpty().withMessage('The password must be 8+ chars long and contain a numbers') 
           ],isAuthenticationCustomer,customController.customerchangePassword)     

 router
    .route('/BusinessUser')
    .get(isAuthenticationCustomer,
         customController.BusinessUserDetails
    )


router
     .route('/wallet')
     .get(
          isAuthenticationCustomer,
          customController.checkWallet
          )








 router
      .route('/sendMoneytoMerchant')
      .post(isAuthenticationCustomer,customController.sendMoneyToWalletAndbank)          


          
router
     .route('/updatewalletbalancefromcard')
     .put(isAuthenticationCustomer,customController.cardDetails)          



router
     .route('/deletecarddetail')
     .delete(isAuthenticationCustomer,customController.cardDetails)   
     
     
router
    .route('/recentpayment')
    .get(isAuthenticationCustomer,customController.recentPaymentdetails)  
       

module.exports = router

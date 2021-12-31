const express =require("express")
const { check } = require('express-validator')
const res = require("express/lib/response")
const router = express.Router()
const customController = require('../Controller/customerController')
const isAuthenticationCustomer = require('../middleware/CustomerMidddleware')



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
   .route('/signiIn')
   .post([ 
          check('email').isEmail(),
          check('password').isLength({ min : 8,max:15}).isEmpty().withMessage('The password must be 8+ chars long and contain a numbers'),
         ],
        customController.Verifycustomer
     )


router
    .route('/payment/:id')
    .post(
         isAuthenticationCustomer,
         customController.PayementMethod
         )


router
     .route('/wallet')
     .get(
          isAuthenticationCustomer,
          customController.checkWallet
          )


router
     .route('/wallet/:id')
     .put(
          isAuthenticationCustomer,
          customController.updatewallet
          )


router
     .route('/wallet/sendmonytowallet/:id')
     .put(
          isAuthenticationCustomer,
          customController.sendMoenyToWallet
          )     


          
router
     .route('/card')
     .put(isAuthenticationCustomer,customController.cardDetails)          





module.exports = router
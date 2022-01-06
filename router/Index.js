
const express = require('express')
const { check } = require('express-validator')
const res = require('express/lib/response')
const router = express.Router()
const businessController = require('../controller/businessControllers')
const isAuthenticationMerchant = require('../middleware/merchantmiddleware')



router
    .route('/')
    .get((req,res,next)=>{
           res.send("<h1>Hello cod</h1>")
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


// router.route('/').get(isAuthenticationMerchant,businessController.Transaction)

router  
    .route('/addbankdetails')
    .get(isAuthenticationMerchant,businessController.getBankDetails)
        .post([
          check('AccountholderName').isEmpty().isLength({min:4,max:20}).withMessage(`The name  must be 4 chartacter minimum and maximum 15 char`),
          check('AccountNumber').isEmpty().isLength({min:12,max:16}).withMessage(`A/c number min 12 digit number and 16 digit number`),
          check('BankName').isEmpty(),
          check('IFSC_CODE').isLength({min:6}).withMessage('IFSC_CODE must be at least 6')
        ],
    isAuthenticationMerchant,  businessController.AddBank
    )
    .put(isAuthenticationMerchant,businessController.updateBankDetail)
    .delete(isAuthenticationMerchant,businessController.DeletebankDetail)

 
router
     .route('/checkwallet')
     .get(isAuthenticationMerchant,businessController.chekBusinessWallet)    



 router  
     .route('/checksendMoneyDetail')
     .get(isAuthenticationMerchant,businessController.getRecivePaymentDetail)




module.exports=router
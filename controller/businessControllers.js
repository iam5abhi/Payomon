const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const BusinessModel =require('../models/BusinessSchema')
const SecretKey =process.env.SECRET_KEY
const PaymentreceivedModel = require('../models/paymentSchema')
const MerchantModel = require('../models/MerchantBankSchema')
const BusinesWalletModel = require('../models/BusinesWalletSchema');
const { json } = require('express/lib/response');
const { user } = require('firebase-functions/v1/auth');
const { recentPaymentdetails } = require('./customerController');
const res = require('express/lib/response');




const generateToken =(data)=>{
    return jwt.sign({
        _id:data.id,
        email:data.BusinessEmail,
        BusinessPhonenumber:data.BusinessPhonenumber
     },SecretKey,{
        expiresIn: 60 * 60 
     })
}



const creatuser =async(req,res,next)=>{
    
       

      if(req.body.password!=req.body.confirmpassword){
           res.send('password not match');
      }

        //check The Existing user
        BusinessModel.findOne({BusinessEmail:req.body.BusinessEmail},(err,emp)=>{

        if(emp) return res.status(400).json({ auth : false, message :"email exits"})

        const NewBussinessUser ={
            name:req.body.name,
            BusinessName:req.body.BusinessName,
            BusinessEmail:req.body.BusinessEmail,
            password:req.body.password,
            confirmpassowrd:req.body.confirmpassword,
            BusinessPhonenumber:req.body.BusinessPhonenumber,
            pin:Math.floor(1000 + Math.random() * 9000)
        }  

        const newUser =new BusinessModel(NewBussinessUser)

        newUser.save((err,doc)=>{
            if(err){
                res.send(err.message)
            }
            createBusinessWallet(00,NewBussinessUser.name,NewBussinessUser.BusinessPhonenumber)
            res.status(200).json({
                succes: true,
                NewBussinessUser: doc,
              });
        })

        })
      
    
}


////***************************Business User Login Fuctinalty************************************************** */
     const VerifyBussiness = async(req,res,next)=>{
  
        BusinessModel.findOne({ BusinessEmail:req.body.BusinessEmail}, async function (err, user) {
    // email is no valid
    if (!user){
      res.status(400).json({"message":"The email address you entered isn't connected to an account. Please  Create a new account."})
    }

    const isMatch = await user.comparepassword(req.body.password);
    // password does not match
    if (!isMatch) return next(new Error("Invaid credentials", 400));

    //Match The password  then
    //Generate a Token
    const token = generateToken(user);

    res.status(200).json({
      message: "Login SucessFully",
      id: user._id,
      name: user.name,
      email: user.BusinessEmail,
      token: token,
    });
})
                     
}




const GetProfileDetails =async(req,res,next)=>{
    BusinessModel.findOne({ BusinessEmail:req.data.email}, async function (err, user) {
         if(err){
            res.status(500).json({
                "message":"Internal server Error"
            })
         }
         res.status(200).json({
            user
         })
    })
}



//******************************************Check a Bank Details**************************************************************************************************************************** */
 const getBankDetails =async(req,res,next)=>{
   
    MerchantModel.findOne({AccountNumber:req.query.AccountNumber},(err,accontDteails)=>{
       if(!accontDteails){
            res.status(400).json({
                message:'No Account deat'
            })
        }
         res.status(200).json({
            AccountholderName:accontDteails.AccountholderName,
            AccountNumber:accontDteails.AccountNumber
         })
    })
 }
//*******************************************Add Bank details*************************************************************************************************************************** */
 const AddBank  = async(req,res,next)=>{
    const {AccountholderName,AccountNumber,BankName,IFSC_CODE} =req.body
    MerchantModel.findOne({AccountNumber:AccountNumber},(err,bandkdata)=>{
        if(bandkdata){
            res.status(400).json({
                message:'This Account Number Already exits'
            })
        }
    })

    const AdddBanDetails = {
        AccountholderName:AccountholderName,
        AccountNumber: AccountNumber,
        BankName: BankName,
        IFSC_CODE: IFSC_CODE,
        id:req.data._id
      };

    const newAccount =new MerchantModel(AdddBanDetails)

    newAccount.save((err,doc)=>{
        if (err) {
            console.log(err);
            res.status(400).json({
                message:`${err.message}`
            })
          }
          res.status(200).json({
            message:"Accont Added SucessFully",  
            succes: true,
            doc
          });
    })
 }


exports.YourAddedAccounts =(req,res,next)=>{
    MerchantModel.find({id:req.data._id},(err,data)=>{
        if(!data){
            res.status(404).json({
                "message":"data not be found"
            })
        }
        res.status(200).json({
            data
        })
    })
}

//***********************************Update the Bank Details******************************************************************************************************************************** */
 const updateBankDetail =async(req,res,next)=>{
    const AccountNumber=req.query.AccountNumber
      const {AccountholderName,BankName,IFSC_CODE} =req.body
                let updatedData 
                    try{
                        updatedData = await MerchantModel.findOneAndUpdate(AccountNumber,{
                            AccountholderName,AccountNumber,BankName,IFSC_CODE
                        },
                    {new:true} )
                    }catch(err){
                        res.send(error)
                    }
                    req.status.json({
                        Name:updatedData.AccountholderName,
                        AccountNumber:updatedData.AccountNumber,
                        BankName:updatedData.BankName,
                        IFSC_CODE:updatedData.IFSC_CODE
                    })
 }

//*************************************Delete the Bank Detail from my account************************************************************************************************************************** */
const DeletebankDetail =async(req,res,next)=>{
    const AccountNumber=req.query.AccountNumber
             await MerchantModel.findByIdAndRemove(AccountNumber, function(err){
                    if(err){
                        res.send("error",err)
                    }else {
                        res.status(200).json({
                            msg:'Account number is deleted suceessfully'
                        })
                    }
               });
} 

//********************************BusinesswalletFunction*********************************************************************************/
const createBusinessWallet =async(amount,name,phoneNumber)=>{
    const  createdWallet  = new BusinesWalletModel({
            name:name,
            phoneNumber:phoneNumber,
            wallet:amount
          })
         await createdWallet.save()
}


//*****************************************Received Money for customer functionalty************************************************************** */
 exports.BusinessWallet =async(CustomersendingMoney,phoneNumber)=>{
    BusinesWalletModel.findOne({phoneNumber:phoneNumber},function(err,data){
        if(!data){
            res.status(404).json({
                "message":"not found"
            })
        }
        let walletBlnc =parseInt(data.wallet)+parseInt(CustomersendingMoney)
        const updatedWalletBlance={
            wallet:walletBlnc
        }
        
        BusinesWalletModel.findOneAndUpdate({phoneNumber:phoneNumber},{$set:updatedWalletBlance},function(err,result){
            if(!result){
                res.status(500).json({
                    message:err.message
                })
            }else{
                res.status(200).json({
                    result
                })
            }
        })
    })

 }

 //******************************************Check Business Wallet************************************************************** */
const chekBusinessWallet =async(req,res,next)=>{

    BusinesWalletModel.findOne({phoneNumber:req.data.BusinessPhonenumber},(err,walletblan)=>{
          if(err){
            res.status(500).json({
                "message":"Internal Server Error"
            })
          }
          res.status(200).json({
            "message":"Your wallet Blance",
            wallet:walletblan.wallet
          })
    })


}

//************************************Money Recived from the Client details******************************************************************************************************************** */

exports.RecivePaymentDetail =async(customerName,customerMobilenumber,amount,date,MerchantPhoneNumber)=>{
     const paymentData = new PaymentreceivedModel({
        customerName,
        customerMobilenumber,
        amount:amount,
        businessUserPhoneNumber:MerchantPhoneNumber,
        date:date
     })
     await paymentData.save()
}

const getRecivePaymentDetail =async(req,res,next)=>{
    PaymentreceivedModel.find({businessUserPhoneNumber:req.data.BusinessPhonenumber},async function(err,recivePayment){
            if(err){
               res.status(500).json({
                "message":"internal server Error"
               })  
            }
            res.status(200).json({
                recivePayment
            })
    })

}


const WalletBlanceTransferToBankAccount =(req,res,next)=>{

}

module.exports.getBankDetails=getBankDetails
module.exports.AddBank =AddBank
module.exports.creatuser=creatuser
module.exports.VerifyBussiness=VerifyBussiness
module.exports.updateBankDetail =updateBankDetail
module.exports.DeletebankDetail=DeletebankDetail

module.exports.chekBusinessWallet=chekBusinessWallet
module.exports.getRecivePaymentDetail=getRecivePaymentDetail
module.exports.GetProfileDetails=GetProfileDetails
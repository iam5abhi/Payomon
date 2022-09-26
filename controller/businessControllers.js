const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const BusinessModel =require('../models/BusinessSchema')
const SecretKey =process.env.SECRET_KEY
const PaymentreceivedModel = require('../models/paymentSchema')
const MerchantModel = require('../models/MerchantBankSchema')
const BusinesWalletModel = require('../models/BusinesWalletSchema')

const creatuser =async(req,res,next)=>{
    const {name,BusinessName,BusinessEmail,password,confirmpassword,BusinessPhonenumber,pin}= req.body  

  let existingUser
   try{
     existingUser = await BusinessModel.findOne({BusinessEmail:BusinessEmail})
    }catch(err){
       let error =`data cannot be find please try aganin ${err}`
             res.send(error)

    }
    //*******************check user already reqisted ya not******************************* */
    if(existingUser){
       res.send('User is AlreadY Reqisterd')
     }
      
      //***************************hashpassword hacker cannot be hack the password******************************************************** */  
       let hashpassword
       try{ 
            hashpassword = await bcrypt.hash(password,12)
        }
        catch(err){
            const error = `The password Not be bcrypted ${err}`
            res.send(error)
        }

        const CreateDBusiness = new BusinessModel({
            name,
            BusinessEmail,
            BusinessName,
            password:hashpassword,
            BusinessPhonenumber,
            pin:pin
        })
          try{
                if(password===confirmpassword){
//******************************password and confirpassword are same  customer Registration SucessFully************************************************************************************************************************/
                         await  CreateDBusiness.save()
////**********************************calling for Business Wallet****************************************************************************** */                         
                     createBusinessWallet(00,CreateDBusiness.name,CreateDBusiness.BusinessPhonenumber)
                }
            }catch(err){
                let error = `data is not be saved sucessfully ${err}`
                res.send(error)
            }
      res.json({
          Name:CreateDBusiness.name,
          BusinessName:CreateDBusiness.BusinessName,
          BusinessEmail:CreateDBusiness.BusinessEmail,
          BusinessPhonenumber:CreateDBusiness.BusinessPhonenumber,
          password:CreateDBusiness.password,
          Pin:CreateDBusiness.pin
      })
    
}


////***************************Business User Login Fuctinalty************************************************** */
     const VerifyBussiness = async(req,res,next)=>{
               console.log(req.body)
               const {BusinessEmail,password}=req.body
               let User 
               try{
                   User = await BusinessModel.findOne({BusinessEmail:BusinessEmail})
                   console.log(User)
               }catch(err){
                   let error =`Something went Wrong ${err}`
                   res.json({
                       error:error
                   })
               } 
                   if(!User){
                       res.json({
                           msg:`User Does Not extis Please Signup`
                       })
                   }
                   console.log(password)
                   console.log(User.password)
                   const match = await bcrypt.compare(password,User.password)
                   if(match){
                      let token 
                              try{
                                  token  = jwt.sign({
                                      UserId:User.id,
                                      BusinessEmail:User.BusinessEmail,
                                      BusinessPhonenumber:User.BusinessPhonenumber
                                  },SecretKey,{ expiresIn :'1h' })
                              }
                              catch(err){
                                  res.send(err)
                              }
                              res.json({
                                  message:"Bussiness user logged in successful",
                                  UserId:User.id,
                                  BusinessEmail:User.BusinessEmail,
                                  BusinessPhonenumber:User.BusinessPhonenumber,
                                  token:token
                              })         
                   }else{
                       res.send('err')
                   }                    
    }



//******************************************Check a Bank Details**************************************************************************************************************************** */
 const getBankDetails =async(req,res,next)=>{
       const AccountNumber=req.query.AccountNumber
         let ShowAccountDetail 
       try{
         ShowAccountDetail =await MerchantModel.findOne({AccountNumber:AccountNumber})
       }catch(err){
           res.status(500),json({
               msg:'internal server Error'
           })
       }
       console.log(ShowAccountDetail)
       res.status(201).json({
            Name: ShowAccountDetail.AccountholderName,
            AccountNumber:ShowAccountDetail.AccountNumber,
            BankName:ShowAccountDetail.BankName,
            IFSC:ShowAccountDetail.IFSC_CODE
       })
 }
//*******************************************Add Bank details*************************************************************************************************************************** */
 const AddBank  = async(req,res,next)=>{
    const {AccountholderName,AccountNumber,BankName,IFSC_CODE} =req.body
       let existingAccountNumner 
                try{
                    existingAccountNumner = await MerchantModel.findOne({AccountNumber:AccountNumber})
                }catch(err){
                    let errror =`cannot be fetch data ${err}`
                }
                if(existingAccountNumner){
                    res.send('A/c number is already exits')
                }
       let AdddBanDetails  
        try{
             AdddBanDetails =new MerchantModel({
                AccountholderName,
                AccountNumber,
                BankName,
                IFSC_CODE
           })  
                  await AdddBanDetails.save()
        }catch(err){
             res.status(500).json({
                 message:'Bank detail cannot be added',
                 error:err
             })
         }
         res.status(201).json({
            Name: AdddBanDetails.AccountholderName,
            AccountNumber:AdddBanDetails.AccountNumber,
            BankName:AdddBanDetails.BankName,
            IFSC:AdddBanDetails.IFSC_CODE
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
 const BusinessWallet =async(CustomersendingMoney,phoneNumber)=>{
        let initialwallet 
                try{
                initialwallet=await BusinesWalletModel.findOne({phoneNumber:phoneNumber})
                }catch(err){
                    res.send('not fetch data propery')
                }
        let wallet = initialwallet.wallet
        let updateBusinessWallet
                try{
                    updateBusinessWallet = await BusinesWalletModel.findOneAndUpdate(phoneNumber,
                        {
                            wallet:wallet+CustomersendingMoney
                        },{new:true})
                }catch(err){
                    res.send('Transaction failed, Please try again')
                }
 }

 //******************************************Check Business Wallet************************************************************** */
const chekBusinessWallet =async(req,res,next)=>{
     let walletBusiness 
         try{
            walletBusiness =await BusinesWalletModel.findOne({phoneNumber:req.data.BusinessPhonenumber})
         }catch(err){
             res.status(500).send('Internal Server Error')
         }
       res.status(200).json({
           message:"your walllwt blance is",
           wallet:walletBusiness.wallet
       })  
}

//************************************Money Recived from the Client details******************************************************************************************************************** */

const RecivePaymentDetail =async(customerName,customerMobilenumber,amount,date,MerchantPhoneNumber)=>{
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
     try{
               const recivePayment = await PaymentreceivedModel.find({businessUserPhoneNumber:req.data.BusinessPhonenumber})  
                res.json({
                    Data:[{
                        RecivePaymentDetail:recivePayment
                    }]
                })       
     }catch(err){
                 res.sendstatus(500)
     }
}


const WalletBlanceTransferToBankAccount =(req,res,next)=>{

}

module.exports.getBankDetails=getBankDetails
module.exports.AddBank =AddBank
module.exports.creatuser=creatuser
module.exports.VerifyBussiness=VerifyBussiness
module.exports.updateBankDetail =updateBankDetail
module.exports.DeletebankDetail=DeletebankDetail
module.exports.BusinessWallet=BusinessWallet
module.exports.chekBusinessWallet=chekBusinessWallet
module.exports.RecivePaymentDetail=RecivePaymentDetail
module.exports.getRecivePaymentDetail=getRecivePaymentDetail

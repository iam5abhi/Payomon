const bcrypt = require('bcrypt');
const res = require('express/lib/response');
const jwt = require('jsonwebtoken')
const BusinessModel =require('../Model/BusinessSchema')
const SecretKey ="your-256-bit-secret"
const PaymentModel = require('../Model/paymentSchema')
const MerchantModel = require('../Model/MerchantBankSchema')
const BusinesWalletModel = require('../Model/BusinesWalletSchema')


const creatuser =async(req,res,next)=>{
    console.log(req.body,"vikas")
    const {name,BusinessName,BusinessEmail,password,confirmpassword,BusinessPhonenumber,pin}= req.body  
    console.log("Name",name,"BusinessName",BusinessName,"BusinessEmail",BusinessEmail,"password",password,"confirmpassword",confirmpassword,"BusinessPhonenumber",BusinessPhonenumber)

  let existingUser
   try{
     existingUser = await BusinessModel.findOne({BusinessEmail:BusinessEmail})
    }catch(err){
       let error =`data cannot be find please try aganin ${err}`
             console.log(error)

    }
    //*******************check user already reqisted ya not******************************* */
    if(existingUser){
       console.log('User is AlreadY Reqisterd')
     }
      
      //***************************hashpassword hacker cannot be hack the password******************************************************** */  
       let hashpassword
       try{ 
            hashpassword = await bcrypt.hash(password,12)
            console.log(hashpassword,"usresh")
        }
        catch(err){
            const error = `The password Not be bcrypted ${err}`
            console.log(error)
        }

        const CreateDBusiness = new BusinessModel({
            name,
            BusinessEmail,
            BusinessName,
            password:hashpassword,
            BusinessPhonenumber
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
                console.log(error)
            }
      res.status(201).json({
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
         console.log(req.body,"yhjjuyh")
                 const {BusinessEmail,password}=req.body
                 console.log(BusinessEmail,'BusinessEmail',password,'password')
                 let User 
                 try{
                     User = await BusinessModel.findOne({BusinessEmail:BusinessEmail})
                     console.log(User,"vikas")
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
                     const match = await bcrypt.compare(password,User.password)
                     if(match){
                        let token 
                                try{
                                    token  = jwt.sign({
                                        UserId:User.id,
                                        BusinessEmail:User.BusinessEmail
                                    },SecretKey,{ expiresIn :'1h' })
                                }
                                catch(err){
                                    console.log(err)
                                }
                                res.json({
                                    message:"Bussiness user logged in successful",
                                    UserId:User.id,
                                    BusinessEmail:User.BusinessEmail,
                                    token:token
                                })         
                     }else{
                         console.log('err')
                     }                    
    }


 const Transaction = async(req,res,next)=>{
      let transcaction_data 
       try{
         transcaction_data = await PaymentModel.find()
       }catch(err){
           let error = `data could not be find Please try again`
          res.send(`<h1>${error}<h1>`)
       }
       res.status(200).json({
           BusinessPhonenumber:transcaction_data.businessPhoneNumer,
           BusinessName:transcaction_data.businessName,
           BusinessEmail:transcaction_data.b
       })
 }
//******************************************Check a Bank Details**************************************************************************************************************************** */
 const getBankDetails =async(req,res,next)=>{
        console.log(req.query.name)
       const AccountNumber=req.query.name
         let ShowAccountDetail 
       try{
         ShowAccountDetail =await MerchantModel.findOne({AccountNumber:AccountNumber})
       }catch(err){
           res.status(500),json({
               msg:'internal server Error'
           })
       }
       res.status.json({
            Name: ShowAccountDetail.AccountholderName,
            AccountNumber:ShowAccountDetail.AccountNumber,
            BankName:ShowAccountDetail.BankName,
            IFSC:ShowAccountDetail.IFSC_CODE
       })
 }
//*******************************************Add Bank details*************************************************************************************************************************** */
 const AddBank  = async(req,res,next)=>{
    console.log(req.body)
    const {AccountholderName,AccountNumber,BankName,IFSC_CODE} =req.body
       let existingAccountNumner 
                try{
                    existingAccountNumner = await MerchantModel.findOne({AccountNumber:AccountNumber})
                }catch(err){
                    let errror =`cannot be fetch data ${err}`
                }
                if(existingAccountNumner){
                    console.log('A/c number is already exits')
                }
                
        try{
            const AdddBanDetails =new MerchantModel({
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
         res.status.json({
            Name: AdddBanDetails.AccountholderName,
            AccountNumber:AdddBanDetails.AccountNumber,
            BankName:AdddBanDetails.BankName,
            IFSC:AdddBanDetails.IFSC_CODE
         })

 }

//***********************************Update the Bank Details******************************************************************************************************************************** */
 const updateBankDetail =async(req,res,next)=>{
      const AccountNumberC=req.query.name
      const {AccountholderName,AccountNumber,BankName,IFSC_CODE} =req.body
                let updatedData 
                    try{
                        updatedData = await MerchantModel.findOneAndUpdate(AccountNumberC,{
                            AccountholderName,AccountNumber,BankName,IFSC_CODE
                        },
                    {new:true} )
                    }catch(err){
                        console.log(error)
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
    const AccountNumber=req.query.name
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
                    console.log('not fetch data propery')
                }
        let wallet = initialwallet.wallet
        let updateBusinessWallet
                try{
                    updateBusinessWallet = await BusinesWalletModel.findOneAndUpdate(phoneNumber,
                        {
                            wallet:wallet+CustomersendingMoney
                        },{new:true})
                }catch(err){
                    console.log('Transaction failed, Please try again')
                }
 }

 //******************************************Check Business Wallet************************************************************** */
const chekBusinessWallet =async(req,res,next)=>{
    let phoneNumber=req.query.phoneNumber
     let walletBusiness 
         try{
            walletBusiness =await BusinesWalletModel.findOne({phoneNumber:phoneNumber})
         }catch(err){
             res.status(500).send('Internal Server Error')
         }
       res.status(200).json({
           wallet:walletBusiness.wallet
       })  
}

module.exports.getBankDetails=getBankDetails
module.exports.AddBank =AddBank
module.exports.Transaction=Transaction
module.exports.creatuser=creatuser
module.exports.VerifyBussiness=VerifyBussiness
module.exports.updateBankDetail =updateBankDetail
module.exports.DeletebankDetail=DeletebankDetail
module.exports.BusinessWallet=BusinessWallet
module.exports.chekBusinessWallet=chekBusinessWallet



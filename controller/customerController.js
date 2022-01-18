    
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Customer =require('../models/customerSchema') 
const  SecretKey =process.env.SECRET_KEY
const BusinessModel =require('../models/BusinessSchema')
const PaymentModel = require('../models/paymentSchema')
const walletcustomerModel = require('../models/CustomerwalletSchema')
const BusinesWalletModel =require('../models/BusinesWalletSchema')
const BusinessWallet =require('./businessControllers').BusinessWallet
const cardModel =require('../models/cardSchema')
const RecivePaymentDetail = require('./businessControllers').RecivePaymentDetail
const CustomerpaymentModel = require('../models/customerRecentSchema')


const createcustomer =async(req,res,next)=>{
    const {name,email,password,confirmpassword,phoneNumber}= req.body  
    let existingCustomeruser
     try{
       existingCustomeruser = await Customer.findOne({email:email})
      }catch(err){
         let error =`data cannot be find please try aganin ${err}`
            res.send(error)

      }
      //*******************check Customeruser already reqisted ya not******************************* */
      if(existingCustomeruser){
         res.send('Customeruser is AlreadY Reqisterd')
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

        const createdcustomer = new Customer({
            name,
            email,
            password:hashpassword,
            phoneNumber
        })
          try{
                if(password===confirmpassword){
//******************************password and confirpassword are same  customer Registration SucessFully************************************************************************************************************************/
                      await createdcustomer.save()
//*********************************************************************************************************************************** */
//**********************************calling for customer Wallet****************************************************************************** */
          createCustomerWallet(100,createdcustomer.name,createdcustomer.phoneNumber)
//************************************************************************************************************************/
                }
            }catch(err){
                let error = `data is not be saved sucessfully ${err}`
                res.send(error)
            }
//************************************Responce the customer*************************************************************************** */            
            res.status(201).json({
                Name:createdcustomer.name,
                Email:createdcustomer.email,
                Phonenumber:createdcustomer.phoneNumber,
                password:createdcustomer.password
            })
}


////***************************Customeruser Login Fuctinalty************************************************** */
     const Verifycustomer = async(req,res,next)=>{

            const {email,password,phoneNumber}=req.body
                let Customeruser 
                 try{
                      if(email){
                        Customeruser = await Customer.findOne({email:email})
                      }else{
                        Customeruser = await Customer.findOne({phoneNumber:phoneNumber})
                      }
                 }catch(err){
                     let error =`Something went Wrong ${err}`
                     res.json({
                         error:error
                     })
                 } 
                     if(!Customeruser){
                         res.json({
                             msg:`Customeruser Does Not extis Please Signup`
                         })
                     }
                     const match = await bcrypt.compare(password, Customeruser.password)
                           if(match){
                                 let token 
                                   try{
                                       token  = jwt.sign({
                                           userId:Customeruser.id,
                                           Email:Customeruser.email,
                                            Name:Customeruser.name,
                                            Phonenumber:Customeruser.phoneNumber
                                       },SecretKey,{ expiresIn :'1h' })
                                     }
                                     catch(err){
                                         res.send(err)
                                     }
                                     if(email){
                                             console.log(token,"hdvwqj")
                                              console.log(Customeruser.id)
                                              res.json({
                                                message:"Customeruser logged in successful from email",
                                                userId:Customeruser.id,
                                                Email:Customeruser.email,
                                                token:token
                                            }) 
                                      }else{
                                        res.json({
                                               message:"Customeruser logged in successful from Phonenumber",
                                               userId:Customeruser._id,
                                               Phonenumber:Customeruser.phoneNumber,
                                                token:token
                                           })  
                                      }    
                           }else{
                               res.send('err')
                           } 


    }


 const customerchangePassword =async(req,res,next)=>{
      const {oldpassword,newpassword,newconfirmpassword}= req.body
        try{
              if(newpassword===newconfirmpassword){
                      if(oldpassword!=newpassword){
                        let  hashpassword = await bcrypt.hash(newpassword,12)
                            let updatePassword
                            try{
                                 updatePassword  = await Customer.findOneAndUpdate({_id:req.data.userId},{password:hashpassword},{new:true})
                            }catch(err){
                                let error =`Not update  the Password please try again ${err}`
                                res.status(500).json({
                                    msg:error
                                })
                            }
                            res.status(200).json({
                                msg:`Sucessfully change the Password`,
                                data:updatePassword
                            })
                      }else{
                             res.send('before password and After password are not same')
                      }
              }else{
                  res.send('password are Not Same ')
              }
        }catch(err){
            res.send(err)
        }
 }   




//***********************************Create Customer wallet******************************************************************************************* */
const createCustomerWallet =async(amount,name,Phonenumber)=>{
    const data =new walletcustomerModel({
                   money:amount,
                   name:name,
                   Phonenumber:Phonenumber
         })
         await data.save()
}

//**********************************Check the Customer Wallet************************************************************************** */
const checkWallet = async(req,res,next)=>{
    const data = await walletcustomerModel.findOne({Phonenumber:req.data.Phonenumber})
    res.status(201).json({
        data:data
    })
}

//************************************How deduct Money Debit card and Credit Card*************************************************************************************************************************************** */
const cardDetails =async(req,res,next)=>{
       let card =""||req.query.cardNumber
       const {cardnumber,cardExpdate,cvv} =req.body
       if(card===""){
           const data = new cardModel({
                  cardnumber,
                  cardExpdate,
                  cvv
           })
           await data.save()
       }else{
             let showcardDetail =await cardModel.findOne({cardnumber:req.query.cardNumber})
             res.json({
                 card :showcardDetail
                 
             })
             const {cardnumber,cardExpdate,cvv}=showcardDetail
              if(cardnumber && cardExpdate && cvv){
                var initialwallet
                     try{
                             initialwallet = await walletcustomerModel.findOne({Phonenumber:req.data.Phonenumber})
                     }catch(err){
                         let error =`Initial wallet cannot be find ${err}`
                         res.status(500).json({
                             msg:`data no be fetch && pleae try again`,
                             error:error
                         })
                     }
                   let updatedData 
                           try{
                             updatedData = await walletcustomerModel.findOneAndUpdate({Phonenumber:req.data.Phonenumber},{
                            money:req.body.wallet+initialwallet.money*1
                           },
                           {new:true} )
                           }catch(err){
                               res.send(err)
                           }
              }else{
                  res.json({
                      msg:`Invalid card  details and Fill valid card detail`
                  })
              }
        }
}    

const deleteCardDetail =async(req,res,next)=>{
    const cardNumber =req.query.cardNumber
     const data =await cardModel.eleteOne({cardnumber:cardNumber})
     if(data){
         res.send('card is delete sucessfully')
     }else{
         res.send(err)
     }
}


 const sendMoneyToWalletAndbank =async(req,res,next)=>{
     const date = new Date()

     const initialBlance = await walletcustomerModel.findOne({Phonenumber:req.data.Phonenumber})
    let {money } =initialBlance
     if(money<req.body.money){
          const virtualMoney = req.body.money-money
          let updatewallet
                try{
                    updatewallet =await walletcustomerModel.findOneAndUpdate({Phonenumber:req.data.Phonenumber},{
                        money:00
                    },{new:true} )
                }catch(err){
                    res.send(err)
                }
         let MerchantPhoneNumber
         let {phoneNumber}=req.body
                    try{
                        MerchantPhoneNumber= await BusinesWalletModel.findOne({phoneNumber:phoneNumber})
                    }catch(err){
                            res.send("error")
                    }
         let showcardDetail =await cardModel.findOne({cardnumber:req.body.cardNumber})
                res.json({
                    card :showcardDetail
                
                })
         const {cardnumber,cardExpdate,cvv}=showcardDetail
                     if(cardnumber && cardExpdate && cvv){BusinessWallet(req.body.money,MerchantPhoneNumber.phoneNumber),   RecivePaymentDetail(req.data.Name,req.data.Phonenumber,req.body.money,datte) }
     }else{
           let Merchantdetails
           let {phoneNumber}=req.body
                try{
                    Merchantdetails= await BusinesWalletModel.findOne({phoneNumber:phoneNumber})
                    }catch(err){
                        res.send("error")
                }
           let sendingMoney=req.body.money
           let updatewallet 
                    try{
                        updatewallet =await walletcustomerModel.findOneAndUpdate(req.params.id,{
                            money:money-sendingMoney
                        },
                    {new:true} )
                    }catch(err){
                            res.send(err)
                    }
                   console.log(updatewallet.Phonenumber,req.body.money,"wdeuhgher")
                    customerdata= new CustomerpaymentModel({
                        customerPhoneNumber:req.data.Phonenumber,
                        merchantName:Merchantdetails.name,
                        merchantMobileNumber:Merchantdetails.phoneNumber,
                        amount:req.body.money
                    })
                    await customerdata.save()
                    console.log(customerdata)
 //*********************************Calling to the BusinessWallet Function*********************************************************************************************************************************** */
                    BusinessWallet(sendingMoney,Merchantdetails.phoneNumber),
                    RecivePaymentDetail(req.data.Name,req.data.Phonenumber,req.body.money,date)

                    res.send(updatewallet)

        }
      
 }

const recentPaymentdetails=async(req,res,next)=>{
     console.log("weurjlifgjhkdfrjlkg")
      try{
          const recentPayment = await CustomerpaymentModel.findOne({customerPhoneNumber:req.data.Phonenumber})
          console.log(recentPayment)
           res.status(201).json({
               data:recentPayment
           })
      }catch(err){
          res.sendstatus(500)
      }
}

const BusinessUserDetails =async(req,res,next)=>{
    const Number = req.query.Number
       let User 
    
                User =await BusinessModel.findOne({BusinessPhonenumber:Number})
                res.send(User)
}


module.exports.createcustomer=createcustomer
module.exports.Verifycustomer=Verifycustomer
module.exports.checkWallet=checkWallet
module.exports. cardDetails= cardDetails
module.exports.customerchangePassword=customerchangePassword
module.exports.sendMoneyToWalletAndbank=sendMoneyToWalletAndbank
module.exports.deleteCardDetail=deleteCardDetail
module.exports.recentPaymentdetails=recentPaymentdetails
module.exports.BusinessUserDetails=BusinessUserDetails

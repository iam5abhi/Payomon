    
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Customer =require('../Model/Customerschema')
const  SecretKey ="your-256-bit-secret"
const BusinessModel =require('../Model/BusinessSchema')
const PaymentModel = require('../Model/paymentSchema')
const walletcustomerModel = require('../Model/CustomerwalletSchema')
const BusinesWalletModel =require('../Model/BusinesWalletSchema')
const BusinessWallet =require('./businessControllers').BusinessWallet
const cardModel =require('../Model/cardSchema')


const createcustomer =async(req,res,next)=>{
    console.log(req.body,"vikas")
    const {name,email,password,confirmpassword,phoneNumber}= req.body  
    console.log("Name",name,"Email",email,"password",password,"confirmpassword",confirmpassword,"Phonenumber",phoneNumber)

    let existingCustomeruser
     try{
       existingCustomeruser = await Customer.findOne({email:email})
         console.log(existingCustomeruser)
      }catch(err){
         let error =`data cannot be find please try aganin ${err}`
            console.log(error)

      }
      //*******************check Customeruser already reqisted ya not******************************* */
      if(existingCustomeruser){
         console.log('Customeruser is AlreadY Reqisterd')
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
                console.log(error)
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

            const {email,password}=req.body
                let Customeruser 
                 try{
                     Customeruser = await Customer.findOne({email:email})
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
                                         console.log(err)
                                     }
                                      res.json({
                                          message:"Customeruser logged in successful",
                                          userId:Customeruser.id,
                                          Email:Customeruser.email,
                                          token:token
                                      })        
                           }else{
                               console.log('err')
                           }        
    }


const PayementMethod =async(req,res,next)=>{
    console.log(req.params.id)
    const Number = req.params.id
    console.log(Number)
       let User 
            try{
                User =await BusinessModel.findOne({BusinessPhonenumber:Number})
                console.log(User)
                res.json({
                    user:User
                })
            }catch(err){
                let error =`data could not be found ${err}`
                res.json({
                    message:'Data not be found',
                    error:error
                })
            }
        // const {BusinessName,BusinessEmail,BusinessPhonenumber} = User  
        // console.log('BusinessName',BusinessName)
        // console.log('BusinessEmail',BusinessEmail)
        // console.log('BusinessPhonenumber',BusinessPhonenumber)
        const {BusinessName,BusinessEmail,BusinessPhonenumber,amount} = req.body
        console.log('BusinessName',BusinessName,amount)
        console.log('BusinessEmail',BusinessEmail)
        console.log('BusinessPhonenumber',BusinessPhonenumber)

        const kk =new PaymentModel({
            businessPhoneNumer:BusinessPhonenumber,
            businessName:BusinessName,
            businessEmail:BusinessEmail,
            amount:amount
        })
      try{
         kk.save()
         console.log(kk)
      }catch(error){
          console.log('don`t save a data')
      }

    //   res.status(201).json({
    //       id :Sucessfully._id,
    //       BusinessPhonenumber:Sucessfully.businessPhoneNumer,
    //       BusinessName:Sucessfully.businessName,
    //       BusinessEmail:Sucessfully.businessEmail,
    //       Amout:Sucessfully.amount

    //   })
}


//***********************************Create Customer wallet******************************************************************************************* */
const createCustomerWallet =async(amount,name,Phonenumber)=>{
    console.log("name",name),
    console.log("Amount",amount)
    console.log("Phonenumber",Phonenumber)
    const data =new walletcustomerModel({
                   money:amount,
                   name:name,
                   Phonenumber:Phonenumber
         })
         await data.save()
}

//**********************************Check the Customer Wallet************************************************************************** */
const checkWallet = async(req,res,next)=>{
    const data = await walletcustomerModel.find()
    console.log(data)
    res.status(201).json({
        data:data
    })
}
//******************************customer Add money ton Wallet ********************************************************************************************************* */
const updatewallet =async(req,res,next)=>{
    //  console.log(req.User)
    // console.log(req.params.id)
    var initialwallet
            try{
                    initialwallet = await walletcustomerModel.findOne(req.params.id)
            }catch(err){
                let error =`Initial wallet cannot be find ${err}`
                res.status(500).json({
                    msg:`data no be fetch && pleae try again`,
                    error:error
                })
            }
            res.redirect("http://localhost:3400/api/customer/card")
            res.status(200).json({
                route:"http://localhost:3400/api/customer/card"
            })
    // let updatedData 
    //         try{
    //         updatedData = await walletcustomerModel.findOneAndUpdate(req.params.id,{
    //             money:req.body.wallet+initialwallet.money*1
    //         },
    //         {new:true} )
    //         }catch(err){
    //             console.log(error)
    //         }
    //         res.status(200).json({
    //             wallet:updatedData
    //         })
        }

//************************************How deduct Money Debit card and Credit Card*************************************************************************************************************************************** */
const cardDetails =async(req,res,next)=>{
    console.log(req.data. Phonenumber)
       let card = "" ||req.query.cardNumber
       console.log(card==="")
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
                               console.log(error)
                           }
              }else{
                  res.json({
                      msg:`Invalid card  details and Fill valid card detail`
                  })
              }
        }
}       



//******************************SEND Money  Customer To Merchant********************************************************************************************* */
const sendMoenyToWallet=async(req,res,next)=>{
      const id =req.params.id
      var initialwallet
                try{
                        initialwallet = await walletcustomerModel.findOne({_id:id})
                        console.log(initialwallet.money)
                }catch(err){
                    let error =  `could not find a data ${err}`
                    res.status.json({
                        error:error
                    })
                }  
    let MerchantPhoneNumber
    let {phoneNumber}=req.body
                try{
                    MerchantPhoneNumber= await BusinesWalletModel.findOne({phoneNumber:phoneNumber})
                  }catch(err){
                        console.log("error")
                }
   let sendingMoney=req.body.wallet
   let updatewallet
                try{
                    updatewallet =await walletcustomerModel.findOneAndUpdate(req.params.id,{
                        money:initialwallet.money-sendingMoney
                    },
                {new:true} )
                }catch(err){

                }
//*********************************Calling to the BusinessWallet Function*********************************************************************************************************************************** */
        BusinessWallet(sendingMoney,MerchantPhoneNumber.phoneNumber)
        res.json({
            money:updatewallet
        })
}

module.exports.PayementMethod=PayementMethod
module.exports.createcustomer=createcustomer
module.exports.Verifycustomer=Verifycustomer
module.exports.checkWallet=checkWallet
module.exports.updatewallet=updatewallet
module.exports.sendMoenyToWallet =sendMoenyToWallet
module.exports. cardDetails= cardDetails
    
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Customer =require('../Model/Customerschema')
const  SecretKey ="hellocodeoftic76uy687tu"
const BusinessModel =require('../Model/BusinessSchema')
const PaymentModel = require('../Model/paymentSchema')
const walletcustomerModel = require('../Model/CustomerwalletSchema')


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
                console.log(password,"passowrd")
                console.log(confirmpassword,"confirsmpassword")
                if(password===confirmpassword){
                      createdcustomer.save()
                }
            }catch(err){
                let error = `data is not be saved sucessfully ${err}`
                console.log(error)
            }
      res.status(201).json({
          Name:createdcustomer.name,
          Email:createdcustomer.email,
         Phonenumber:createdcustomer.phoneNumber,
          password:createdcustomer.password
      })
}


//     //***************************Business Customeruser Login Fuctinalty************************************************** */
     const Verifycustomer = async(req,res,next)=>{
         console.log(req.body,"yhjjuyh")
                 const {email,password}=req.body
                 let Customeruser 
                 try{
                     Customeruser = await Customer.findOne({email:email})
                     console.log(Customeruser)
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
                     let isValidPassword = false; 
                     try{
                         isValidPassword = bcrypt.compare(password,Customeruser.password)
                     }catch(err){
                         let error =`Something went Wrong ${err}`
                         res.json({
                             error:error
                         })
                     }
          let token 
          try{
              token  = jwt.sign({
                  userId:Customeruser.id,
                  Email:Customeruser.email
              },SecretKey,{ expiresIn :'1h' })
            }
            catch(err){
                console.log(err)
            }
             res.json({
                 message:"Bussiness Customeruser logged in successful",
                 userId:Customeruser.id,
                 Email:Customeruser.email,
                 token:token
             })              
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

const AddMoneyWallet =async(req,res,next)=>{
      console.log(req.body)
      const wallet =req.body
    //   let intialwallet 
    //   try{
    //      intialwallet =await walletcustomerModel.find()
    //      console.log("intialwallet",intialwallet)
    //   }catch(err){
    //       res.status(500).json({
    //           msg:'cannot be find'
    //       })
    //   }  
      const data =new walletcustomerModel({
          money:5000
      })
       data.save()
      console.log(data)
      res.status(201).json({
          wallet:data
      })
}


const checkWallet = async(req,res,next)=>{
    const data = await walletcustomerModel.find()
    console.log(data)
    res.status(201).json({
        data:data
    })
}

const updatewallet =async(req,res,next)=>{
    console.log(req.params.id)
      var initialwallet
       try{
            initialwallet = await walletcustomerModel.findOne(initialwallet)
       }catch(err){
           let error =`Initial wallet cannot be find ${err}`
           res.status(500).json({
               msg:`data no be fetch && pleae try again`,
               error:error
           })
       }
      
    let updatedData 
    try{
       updatedData = await walletcustomerModel.findOneAndUpdate(req.params.id,{
           money:req.body.wallet+initialwallet.money*1
       },
      {new:true} )
    }catch(err){
        console.log(error)
    }
     res.status(200).json({
        wallet:updatedData
    })
}

module.exports.PayementMethod=PayementMethod
module.exports.createcustomer=createcustomer
module.exports.Verifycustomer=Verifycustomer
module.exports.AddMoneyWallet=AddMoneyWallet
module.exports.checkWallet=checkWallet
module.exports.updatewallet=updatewallet

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const BusinessModel =require('../Model/BusinessSchema')
const SecretKey ="chuijswswuqd6429097"


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
            hashpassword = bcrypt.hash(password,12)
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
                console.log(password,"passowrd")
                console.log(confirmpassword,"confirsmpassword")
                if(password===confirmpassword){
                  CreateDBusiness.save()
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


//     //***************************Business User Login Fuctinalty************************************************** */
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
                     let isValidPassword = false; 
                     try{
                         isValidPassword = bcrypt.compare(password,User.password)
                     }catch(err){
                         let error =`Something went Wrong ${err}`
                         res.json({
                             error:error
                         })
                     }
          let token 
          try{
              token  = jwt.sign({
                  UserId:User.id,
                  BusinessEmail:User.BusinessEmail
              },SecretKey,{ expiresIn :'1h' })
            }
            catch(err){
                console.log(err)
            }S
             res.json({
                 message:"Bussiness user logged in successful",
                 UserId:User.id,
                 BusinessEmail:User.BusinessEmail,
                 token:token
             })              
    }



module.exports.creatuser=creatuser
module.exports.VerifyBussiness=VerifyBussiness



const { trim } = require('lodash')
const bcrypt =require('bcrypt')
const mongoose = require('mongoose')

const BusinessSchema  = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    BusinessName:{
        type:String,
        required:true,
        minLength:[3,'name should be min 3 letter'],
        maxLength: [25,'name should be max 15 letter']
    },
    BusinessEmail:{
        type:String,
        required:true,
        unique:[true,"Email should be required"],
        minLength:[3,'name should be min 3 letter'],
        maxLength: [25,'name should be max 15 letter'],
        trim:true
    },
    password:{
        type:String,
        required:true,
    },
    confirmpassowrd:{
        type:String,
        required:true,
        validate: function () {
            return this.confirmpassowrd === this.password;
          },
    },
    BusinessPhonenumber:{
        type:Number,
        required:true,
    },
    pin:{
        type:Number
    }

})

BusinessSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }

    console.log("hello","word")
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(this.password, salt);
  
    this.password = hashed;
    this.confirmpassowrd = undefined;
  });



  BusinessSchema.methods.comparepassword=async function(password){
    return await bcrypt.compare(password,this.password)
  }  



const BusinessModel =new mongoose.model('BusinessModel',BusinessSchema)

module.exports=BusinessModel
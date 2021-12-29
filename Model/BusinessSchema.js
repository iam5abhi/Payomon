const { trim } = require('lodash')
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
    BusinessPhonenumber:{
        type:Number,
        required:true,
    }

})



const BusinessModel =new mongoose.model('BusinessModel',BusinessSchema)

module.exports=BusinessModel
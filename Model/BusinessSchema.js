const { trim } = require('lodash')
const mongoose = require('mongoose')

const BusinessSchema  = mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength:[3,'name should be min 3 letter'],
        maxLength: [15,'name should be max 15 letter']
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
        minLength:[3,'name should be min 3 letter'],
        maxLength: [15,'name should be max 15 letter']
    },
    BusinessPhonenumber:{
        type:Number,
        required:true,
        min:10,
        max:10
    }

})



const BusinessModel =new mongoose.model('BusinessModel',BusinessSchema)

module.exports=BusinessModel
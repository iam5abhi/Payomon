const mongoose = require('mongoose')
const { required } = require('nodemon/lib/config')


const PaymentreceivedShema = mongoose.Schema({
    businessUserPhoneNumber:{
        type:Number,
        required:true,
        select:false
        
    },
    customerName:{
        type:String,
        required:true
    },
    customerMobilenumber:{
        type:Number,
        required:true
    },
    amount:{
            type:Number,
            required:true
    },
    date:{
        type:String
    }
   
})

const PaymentreceivedModel = new mongoose.model('PaymentModel',PaymentreceivedShema)

module.exports =PaymentreceivedModel
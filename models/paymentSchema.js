const mongoose = require('mongoose')


const PaymentreceivedShema = mongoose.Schema({
    customerName:{
        type:String
    },
    customerMobilenumber:{
        type:Number
    },
    amount:{
        tyep:Number
    },
    date:String
   
})

const PaymentreceivedModel = new mongoose.model('PaymentModel',PaymentreceivedShema)

module.exports =PaymentreceivedModel
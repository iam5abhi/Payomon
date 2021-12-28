const mongoose = require('mongoose')


const PaymentShema = mongoose.Schema({
    businessPhoneNumer:{
        type:Number,
        required:true,
        min:10
    },
    businessName:{
        type:String,
        require:true
    },
    businessEmail:{
        type:String
    },
    amount:{
        type:Number
    },
    customerName:{
        type: String,
    },
    customerEmail:{
        type:String
    },
    customerNumber:{
      type:Number
    }
})

const PaymentModel = new mongoose.model('PaymentModel',PaymentShema)

module.exports =PaymentModel
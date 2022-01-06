const mongoose = require('mongoose')



const costomerPaymentSchema = mongoose.Schema({
    customerPhoneNumber:{
        type:Number
    },
    merchantName:{
        type:String
    },
    merchantMobileNumber:{
        type:Number
    },
    amount:{
        type:Number
    }
})

const CustomerpaymentModel = new mongoose.model('CustomerpaymentModel',costomerPaymentSchema)


module.exports =CustomerpaymentModel
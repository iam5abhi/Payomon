const mongoose = require('mongoose')

const MerchantSchema = mongoose.Schema({
    AccountholderName:{
        type:String,
        required:true,
        minlength:3,
        maxlength:10
    },
    AccountNumber:{
        type:Number,
        required:true,
        unique:true,
        min:12,
        max:16
    },
    BankName:{
        type:String,
        required:true,
    },
    IFSC_CODE:{
        type:String,
        required:true
    }
})

const MerchantModel = new mongoose.model('MerchantModel',MerchantSchema)

module.exports = MerchantModel
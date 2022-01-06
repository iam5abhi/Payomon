const mongoose = require('mongoose')

const BusinesWalletSchema =  mongoose.Schema({
    name:{
        type:String,
    },
    wallet:{
        type:Number,
        required:true
    },
    phoneNumber:{
        type:Number
    }
  
})

const BusinesWalletModel = new mongoose.model('BusinesWalletModel',BusinesWalletSchema)

module.exports=BusinesWalletModel
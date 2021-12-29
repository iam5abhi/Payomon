const mongoose = require('mongoose')

const walletSchemacustomer =  mongoose.Schema({
    money:{
        type:Number
    }
})

const walletcustomerModel = new mongoose.model('walletcustomerModel',walletSchemacustomer)

module.exports=walletcustomerModel
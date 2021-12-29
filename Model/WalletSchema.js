const mongoose = require('mongoose')

const walletSchema =  mongoose.Schema({
    wallet:{
        type:Number,
        required:true
    }
})

const walletModel = new mongoose.model('walletModel',walletSchema)

module.exports=walletModel
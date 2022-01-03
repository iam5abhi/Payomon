const mongoose = require('mongoose')


const cardSchema = mongoose.Schema({
    cardnumber:{
        type:Number,
        required:true,
        unique:true
    },
    cardExpdate:{
        type:String,
        require:true
    },
    cvv:{
         type:String,
         required:true
    }
})

const cardModel = new mongoose.model('cardModel',cardSchema)
module.exports=cardModel
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const customerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true , unique : true},
    password: { type: String , required: true},
    profilePic :{type: String },
    phoneNumber : { type : Number, required : true},
})


const Customer = new mongoose.model('Customer', customerSchema);
module.exports = Customer

const mongoose =require('mongoose')
mongoose.connect("mongodb+srv://multiple_user:eqcPCYephUwjVtHJ@cluster0.bdlvx.mongodb.net/test",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true
})
  .then(()=>{
      console.log(`Data is connect sucessfully`)
  })
  .catch((err)=>{
      console.log('Not connnected',err)
  })

module.exports  = mongoose 
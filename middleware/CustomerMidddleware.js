const jwt = require('jsonwebtoken')
const  SecretKey ="hellocodeoftic76uy687tu"


const isAuthenticationCustomer =async(req,res,next)=>{
    console.log(req.headers)
  const token = req.headers["authorization"];
   console.log(token,"vikaskumarshrivastava")
   if(token===null) returnres.status(401).json({
    error: "Token not found",
  });
    jwt.verify(token, SecretKey, function(err, user) {
         if(err) return res.status(401).json({ error: "Invalid token" });
         req.user =user
         next()
  });
}


module.exports =isAuthenticationCustomer
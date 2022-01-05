const jwt = require('jsonwebtoken')
//*****************************This are Seceret Key**************************************************************************** */
const SecretKey =process.env.SECRET_KEY

//****************************************** */
const isAuthenticationMerchant =async(req,res,next)=>{
  try {
      const token = req.headers.authorization.split(' ')[1]
      const data =  jwt.verify(token,SecretKey);
      if (!data) return res.status(401).json({ error: "Invalid token" });
      req.data = data;
      next()
  }catch (err) {
      return err;
  }
}


module.exports =isAuthenticationMerchant
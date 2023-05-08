const jwt = require("jsonwebtoken")
const { JWT_SECRET_KEY, JWT_EXPIRE_TIME } = process.env;
exports.issueJwt = ((user)=>{
    try{
       return  jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
            expiresIn: JWT_EXPIRE_TIME
          });
    }catch (error) {
      return ({message:error.message})
      }

})
const {User} = require("../models")
exports.validateEmail = (emailAdress) => {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailAdress.match(regexEmail)) {
        return true;
    } else {
        return false;
    }
}
exports.isEmailVerified = (async (email) => {
    try {
      
      const user = await User.findOne({
          email
      })
      console.log(user)
      if (user.isEmailVerified) {
        return true;
      } else {
        
        return false;
      }
    }
    catch (error) {
      res.json({ message: error.message, status: 500 });
    }
  })
const {User} = require('../models/user.model')

const userVerify = async (req, res, next)=>{
    const {userId} = req.params;

    let user = await User.findById(userId);

    if(!user){
        res.status(400);
        return res.render('resetForm',{
            success: false,
            timeout: false,
            user_not_found: true
        });
    }

    req.user = user;

    next();

}

module.exports = {userVerify}
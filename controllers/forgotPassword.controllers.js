const { sendMail } = require("../config/sendMail");
const {User} = require("../models/user.model")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const verifyEmail = async (req, res) =>{
    const {email} = req.body;
    

    if(!email){
        res.status(400);
        return res.json({msg: "MISSING_CREDENTIALS"});
    }

    let user;

    try{                                                                
        user = await User.findOne({email}).select('-password');
    }catch(err){
        res.status(500);
        return res.json({msg: "INTERNAL_SERVER_ERROR"});
    }

    if(!user){
        res.status(500);
        return res.json({msg: "USER_NOT_FOUND"});
    }
    let token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_PASSWORD_SECRET ,{expiresIn: '15m'});

    await sendMail(user.email, "hello user", `This link is valid for 15 minutes only \n ${process.env.HOST}/forgot-password/reset-password/${user._id}/${token}`);

    res.status(200);
    return res.json({msg: "EMAIL_SENT"});

}

const resetPassword = async (req, res)=>{
    const {password} = req.body;
    const {userId, token} = req.params;

    let user;
    console.log(token);
    try{
         user = jwt.verify(token, process.env.JWT_PASSWORD_SECRET);
    }catch(err){
        res.status(400);
        return res.render('resetForm',{
            timeout: true
        });
    }

    user = await User.findById(userId);

    if(!user){
        res.status(400);
        return res.render('resetForm',{
            user_not_found: true
        });
    }

    user.password = await bcrypt.hash(password,10);

    await user.save();
    
    return res.render('resetForm',{
        success: true
    });
}


module.exports = {verifyEmail, resetPassword};
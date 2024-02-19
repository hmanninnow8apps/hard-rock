const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");

const authAdmin = async (req, res, next)=>{

    let token;

    //console.log("header:" +JSON.stringify(req.headers));

    if(!req.headers.authorization||!req.headers.authorization.startsWith('Bearer')){
        res.status(400)
        return res.json({msg: "INVALID_TOKEN"})//throw new Error("INVALID_TOKEN");
    }

    token = req.headers.authorization.split(" ")[1];
    let user;

    try{
        user = jwt.verify(token, process.env.JWT_SIGN_SECRET);
    }catch(err){
        res.status(400)
        return res.json({msg: "TOKEN_NOT_VERIFIED"})//throw new Error("NO_RECORD_FOUND");
    }
    
    user = await User.findById(user.id).select('-password');

    

    if(!user){
        res.status(400)
        return res.json({msg: "USER_NOT_AUTHORIZED"})//throw new Error("USER_NOT_AUTHORIZED");
    }

    if(!user.isAdmin){
        res.status(400)
        return res.json({msg: "USER_NOT_AUTHORIZED"})//throw new Error("NO_RECORD_FOUND");
    }

    req.admin = user;

    next();
}

const authUser =async (req, res, next)=>{

    let token;

    if(!req.headers.authorization||!req.headers.authorization.startsWith('Bearer')){
        res.status(400)
        return res.json({msg: "INVALID_TOKEN"})//throw new Error("INVALID_TOKEN");
    }

    token = req.headers.authorization.split(" ")[1];
    let user;

    try{
        console.log(token)
        user = jwt.verify(token, process.env.JWT_SIGN_SECRET);
    }catch(err){
        res.status(400)
        return res.json({msg: "TOKEN_NOT_VERIFIED"})//throw new Error("NO_RECORD_FOUND");
    }

    console.log(user);
    
    user = await User.findById(user.id).select('-password');

    if(!user){
        res.status(400)
        return res.json({msg: "USER_NOT_AUTHORIZED"})//throw new Error("USER_NOT_AUTHORIZED");
    }

    req.user = user;

    next();
}

const authGoogleUser = (req, res, next) =>{
    console.log('success', req);
    res.send('Hello');
}

module.exports = {
    authAdmin,
    authUser,
    authGoogleUser
}
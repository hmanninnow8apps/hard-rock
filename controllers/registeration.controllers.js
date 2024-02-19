const {User} = require("../models/user.model")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const signUp = async (req, res) => {
    let {username, email, password, isAdmin} = req.body;

    console.log(req.body)

    if(!username || !password || !email || typeof isAdmin === 'undefined' ){
        res.status(400)
        return res.json({msg: "MISSING_CREDENTIALS"})//throw new Error("MISSING_CREDENTIALS");
    }

    let user = await User.findOne({email});

    if(user){
        res.status(400)
        return res.json({msg: "USER_ALREADY_EXIST"})//throw new Error("User Already Exist");
    }
    password = await bcrypt.hash(password, 10);
    user = new User({
        username,
        email,
        password,
        isAdmin: isAdmin ? true: false
    })

    //let token = generateToken({id: user._id, isAdmin: user.isAdmin});

    await user.save();

    return res.status(200).json({msg: "SUCCESSFULL_REGISTERATION"});
}

//google auth



const signIn = async (req, res) => {
    const { email, password, isAdmin} = req.body;


    if(!email || !password ||typeof isAdmin === 'undefined'){
        res.status(400)
        return res.json({msg: "MISSING_CREDENTIALS"})//throw new Error("MISSING_CREDENTIALS");
    }

    let user = await User.findOne({email});

    if(!user){
        res.status(400)
        return res.json({msg: "NO_RECORD_FOUND"})//throw new Error("NO_RECORD_FOUND");
    }

    if(isAdmin&&!user.isAdmin){
        res.status(400)
        return res.json({msg: "INVALID_ADMIN"})
    }


    let isCorrect = await bcrypt.compare(password, user.password);

    if(!isCorrect){
        res.status(400)
        return res.json({msg: "INVALID_PASSWORD"})//throw new Error("INVALID_PASSWORD");
        
    }

    let token = generateToken({id: user._id, isAdmin: user.isAdmin});
    return res.status(200).json({token, isAdmin: user.isAdmin, username: user.username});
}

const generateToken = (obj) =>{
    return jwt.sign(obj, process.env.JWT_SIGN_SECRET);
}

const googleAuth = async (req, res) =>{
    console.log(req.user.profile);
    try{
        let user = new User({
            username: req.user.profile.displayName,
            googleId: req.user.profile.id,
            email: req.user.profile.email,
            isAdmin: false
        })
    
        await user.save();
    
        let token = generateToken({id: user._id, isAdmin: user.isAdmin});
        res.setHeader('Access-Control-Allow-Origin', '*')
        return res.status(200).json({token, isAdmin: user.isAdmin, username: user.username});
    }catch(err){
        res.status(500)
        return res.json({msg: "INTERNAL_SERVER_ERROR"})
    }
}

module.exports = {
    signUp,
    signIn,
    googleAuth
}
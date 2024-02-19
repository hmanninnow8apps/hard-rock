const express = require('express');
const { dbConnect } = require('./config/dbConnect');
const dotenv = require('dotenv').config();
const {authAdmin, authUser, authGoogleUser} = require('./middlewares/auth.middleware')
const path = require('path')
let passport = require('passport');


const app = express();
const cors = require('cors');


dbConnect();
require('./config/googleService');

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


var session = require('express-session');
const { googleAuth } = require('./controllers/registeration.controllers');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google/users', googleAuth);


app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get('/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/google/users',
        failureRedirect: '/auth/google'
}));

app.set('view engine', 'ejs');



app.use('/', require('./routes/registeration.routes'));
app.use('/inventory', authAdmin, require('./routes/inventory.routes')); //authAdmin,
app.use('/users', authUser, require('./routes/user.routes')) //authUser,
app.use('/forgot-password', require('./routes/forgotPassword.routes'));

const port = process.env.PORT||5000;

app.listen(port , ()=>{
    console.log(`server started at ${port}`)
})
const router = require('express').Router();
const {verifyEmail, resetPassword} = require('../controllers/forgotPassword.controllers');

router.post('/verify-email', verifyEmail);
router.get('/reset-password/:userId/:token', (req, res)=>{res.render('resetForm')})
router.post('/reset-password/:userId/:token', resetPassword)

module.exports = router
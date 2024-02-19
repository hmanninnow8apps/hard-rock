const { signUp, signIn, googleAuth } = require('../controllers/registeration.controllers');
const router = require('express').Router();

router.post('/signIn', signIn);
router.post('/googleauth',googleAuth)
router.post('/signUp', signUp);

module.exports = router
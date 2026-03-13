const express = require("express");
const router = express.Router();
const {registerUser, loginUser} = require('../controllers/auth.controller');

// /api/auth 

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/logout', logoutController);


module.exports = router;
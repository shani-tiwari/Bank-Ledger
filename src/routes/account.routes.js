const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const createAccount = require('../controllers/account.controller');

/* 
* POST /api/v1/account/create
* @desc create new account
* @access private/proteced
*/
router.post('/create', authMiddleware, createAccount);



module.exports = router;
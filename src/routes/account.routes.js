const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/auth.middleware');
const {createAccount, getAccount, getBalance} = require('../controllers/account.controller');

/* 
* POST /api/v1/account/create
* @desc create new account
* @access private/protected
*/
router.post('/create', authMiddleware, createAccount);

/**
 * GET /api/v1/account/get
 * @desc get account
 * @access private/protected
 */
router.get('/get', authMiddleware, getAccount);

/**
 * GET /api/v1/account/balance/:accountId
 * @desc get account balance
 * @access private/protected
 */
router.get("/balance/:accountId", authMiddleware, getBalance);

module.exports = router;
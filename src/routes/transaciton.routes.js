const {Router} = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const { systemUserMW } = require('../middleware/auth.middleware');
const {createTransaction, initialFundTransaction} = require('../controllers/transaction.controller');

const transactionRoutes = Router();

/**
 * - POST - /api/transaction/create
 * @desc create new transaction
 * @access private/protected
 */
transactionRoutes.post("/create", authMiddleware, createTransaction);

/**
 * - POST - /api/transaction/system/initial-funds
 * @desc create initial fund transaction
 * @access private/protected
 */
transactionRoutes.post("/system/initial-funds", systemUserMW, initialFundTransaction);

module.exports = transactionRoutes;  
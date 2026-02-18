const express = require("express");
const app = express();
const authRoutes = require('./routes/auth.routes');
const accountRoutes = require('./routes/account.routes');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);

module.exports = app;
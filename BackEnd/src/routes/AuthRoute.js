const express = require('express');
const AuthRouter = express.Router();

const {Login,Register} = require('../controllers/AuthController')

AuthRouter.post('/login',Login);
AuthRouter.post('/register',Register);

module.exports = AuthRouter;

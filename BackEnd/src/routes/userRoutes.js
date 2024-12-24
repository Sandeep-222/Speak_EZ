const express = require('express');
const Router = express.Router();;
const {authenticateUser}=require('../controllers/Middleware/AuthMiddleware')
// Router.post('/auth/login', Login);
const {  createUser,getAllUsers,getUserById,deleteUserById,updateUserById,getUser,Update_Test_Count } = require('../controllers/UserController')

Router.post('/add-user', createUser);
Router.get('/getuser',authenticateUser,getUser)
Router.get('/get-all-user',getAllUsers)
Router.put('/update-user',updateUserById)
Router.delete('/delete-user',deleteUserById)
Router.post('/TestCount',Update_Test_Count)

module.exports = Router;

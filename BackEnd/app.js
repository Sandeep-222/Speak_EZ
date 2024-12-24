const express=require('express')
const InitiateMongoServer=require('./src/config/db')
require('dotenv').config()
const UserRouter=require('./src/routes/userRoutes')
const AuthRouter=require('./src/routes/AuthRoute')
const AIRouter=require('./src/routes/AIServicesRoute')
const bodyParser = require('body-parser')
const cors=require('cors')
const app=express()
app.use(bodyParser.json())
app.use(cors())
app.use('/api',UserRouter);
app.use('/auth',AuthRouter);
app.use('/ai',AIRouter)
const PORT=process.env.PORT
InitiateMongoServer();
app.listen(PORT,()=>{
    console.log(`Listening to port ${PORT}`)
})
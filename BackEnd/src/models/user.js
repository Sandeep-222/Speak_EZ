//FILENAME : User.js

const mongoose = require("mongoose");
const bcrypt=require('bcrypt');
const UserSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  },
  Total_tests:{
    type:Number,
    default:0
  },
  No_AI_interview:{
    type:Number,
    default:0
  },
  No_Written_test:{
    type:Number,
    default:0
  },
  No_Voice_test:{
    type:Number,
    default:0
  },
  AI_interview_monthlyScores: {
    type: [Number], 
    default: Array(12).fill(0)
  },
  Written_test_monthlyScores: {
    type: [Number], 
    default: Array(12).fill(0)
  },
  Voice_test_monthlyScores: {
    type: [Number], 
    default: Array(12).fill(0)
  }
},
{ 
  collection: 'users' 
});


// export model user with UserSchema
module.exports = mongoose.model("user", UserSchema);
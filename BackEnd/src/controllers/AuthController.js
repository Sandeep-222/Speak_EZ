
const User = require("../models/user");
const jwt=require("jsonwebtoken")
const bcrypt = require("bcrypt");
const Register = async (req, res, next) => {
    try {
        // console.log("here")
        // Check if the email already exists
        const {first_name,email,password}=req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already exists',loggedin:false});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new User instance
        const newUser = new User({
          first_name,
          email,
          password:hashedPassword // You might want to hash the password before saving it
        });
    
        // Save the user to the database
        await newUser.save();
    
        // Respond with success message or token
        res.status(201).json({ message: 'User registered successfully',loggedin:true});
      } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal Server Error',loggedin:false});
      }

 
}
const Login=async(req,res,next)=>{
    const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' ,loggedin:false});
    }

    // Check if the password is correct
    const check=await bcrypt.compare(password,user.password);
    // console.log(bcrypt.getRounds(user.password));
    if (!check) {
        console.log(check);
        return res.status(200).json({ error: "Invalid email or password",loggedin:false});
      }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );
      // const token="djksdas";
    // Respond with token
    res.status(200).json({ token ,loggedin:true});
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error',loggedin:false});
  }
}

module.exports = {
    Register,
    Login
  };

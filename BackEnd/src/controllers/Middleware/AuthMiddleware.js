const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticateUser = (req, res, next) => {
    // Get the token from the request headers
    const token = req.headers.authorization;
    // Check if token is present
    // console.log(token)
    if (!token) {
        console.log("no token");
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user object to the request
        next(); // Call the next middleware
    } catch (error) {
        console.log("invalid token");
        return res.status(401).json({ error: 'Invalid token' });
    }
};
module.exports=
{
    authenticateUser
}
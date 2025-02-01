const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; 
  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }
 
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY); 
    req.user = decoded;  
    next();  
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authenticate;

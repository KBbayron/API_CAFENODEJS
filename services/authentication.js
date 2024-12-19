require('dotenv').config(); 
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    console.log('Authenticating...');
    const authHeader = req.headers['authorization']; 
    if (!authHeader) {
        console.log('Authorization header missing');
        return res.sendStatus(401); 
    }

    const token = authHeader.split(' ')[1]; 
    if (!token) {
        console.log('Token missing');
        return res.sendStatus(401); 
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err);
            return res.sendStatus(403); 
        }

        console.log('Token verified successfully');
        res.locals.email = user.email; 
        next();
    });
}


module.exports = { authenticateToken };

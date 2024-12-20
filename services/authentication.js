require('dotenv').config(); 
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']; 
    if (!authHeader) {
        return res.sendStatus(401); 
    }

    const token = authHeader.split(' ')[1]; 
    if (!token) {
        return res.sendStatus(401); 
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.sendStatus(403); 
        }

        res.locals.email = user.email; 
        next();
    });
}


module.exports = { authenticateToken };

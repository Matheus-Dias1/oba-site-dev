const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = {
    authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token === null) return res.status(401).send();
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, data)=>{
            if (err) {
                return res.status(403).send();
            }
            req.data = data;
            next()
        })
    }

    
}
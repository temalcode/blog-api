//dotenv
const dotenv = require('dotenv');
dotenv.config();
//jwt
const jwt = require('jsonwebtoken');


function authenticateUser(req, res, next){
    try{
        jwt.verify(req.cookies.token, process.env.JWT_SECRET, async function(err, user){
            if(err){
                res.status(400).send(err.message);
            } else{
                req.author = user.username;
                next();
            }
        })
    } catch(err){
        res.status(500).send(err.message);
    }
}

module.exports = authenticateUser;
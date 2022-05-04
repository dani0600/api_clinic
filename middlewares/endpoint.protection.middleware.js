const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const endpointProtection = (req, res, next) => {
    // Agafem el token del header del request
    const token = req.headers['authorization'];

    //Comprovem si no hi ha token
    if(!token) return res.status(401).json({error: 'Unprovided Token'});
    else{
        //Verifiquem el token amb la nostra clau JWT
        console.log("entro a comporbar el jwt")
        jwt.verify(token, JWT_SECRET, (err, decoded) => {      
            if (err) {
              return res.json({ error: 'Wrong JWT Token, denegated access'});    
            } else {
              req.decoded = decoded;    
              next();
            }
        });
    }
}

module.exports = {
    endpointProtection
}
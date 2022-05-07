require("dotenv").config();

const jwt = require('jsonwebtoken'),
secret = process.env.JWT_SECRET;

exports.onlySameUserOrAdminCanDoThisAction = (req, res, next) => {
    let userId = req.jwt.userId;
    if (req.params && req.params.userId && userId === req.params.userId) {
        return next();
    } else{
        return res.status(403).send();
    }
};

exports.sameUserCantDoThisAction = (req, res, next) => {
    let userId = req.jwt.userId;
    if (req.params.userId !== userId) {
        return next();
    } else {
        return res.status(400).send();
    }
};
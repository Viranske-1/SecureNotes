const jwt = require("jsonwebtoken");
const { getJwtSecret } = require("../config/env");


const authMiddleware = (req, res, next) => {

    const authorizationHeader = req.headers.authorization;


    if (!authorizationHeader) {
        return res.status(401).json({
            message: "Access denied"
        });
    }


    const match = authorizationHeader.match(/^\s*Bearer\s+(\S+)\s*$/i);


    if (!match) {
        return res.status(401).json({
            message: "Access denied"
        });
    }

    const token = match[1];

    try {

        const decoded = jwt.verify(token, getJwtSecret(), {
            algorithms: ["HS256"]
        });

        if (
            typeof decoded !== "object"
            || decoded === null
            || decoded.userId === undefined
            || typeof decoded.email !== "string"
        ) {
            return res.status(401).json({
                message: "Access denied"
            });
        }

        req.user = decoded;

        return next();

    } catch (error) {

        return res.status(401).json({
            message: "Access denied"
        });

    }

};


module.exports = authMiddleware;

const jwt = require("jsonwebtoken");


const authMiddleware = (req, res, next) => {

    const authorizationHeader = req.headers.authorization;


    if (!authorizationHeader) {
        return res.status(401).json({
            message: "Access denied"
        });
    }


    const [scheme, token] = authorizationHeader.split(" ");


    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Access denied"
        });
    }


    try {

        req.user = jwt.verify(token, process.env.JWT_SECRET);

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Access denied"
        });

    }

};


module.exports = authMiddleware;

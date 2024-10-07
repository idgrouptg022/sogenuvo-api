
const jwt = require("jsonwebtoken");
const { constants } = require("../constants")

const validateToken = async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization

    if (authHeader && authHeader.startsWith("Bearer")) {

        token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(constants.HTTP_CODES.UNAUTHORIZED).json({
                    "messageCode": constants.CALL_BACK_MESSAGES.UNAUTHORIZED_USER.CODE,
                    "message": constants.CALL_BACK_MESSAGES.UNAUTHORIZED_USER.MESSAGE,
                    "data": []
                })
            }
            req.user = decoded.user
            next()
        })

        if (!token) {
            return res.status(constants.HTTP_CODES.UNAUTHORIZED).json({
                "messageCode": constants.CALL_BACK_MESSAGES.UNAUTHORIZED_USER.CODE,
                "message": constants.CALL_BACK_MESSAGES.UNAUTHORIZED_USER.MESSAGE,
                "data": []
            })
        }

    } else {
        return res.status(constants.HTTP_CODES.UNAUTHORIZED).json({
            "messageCode": constants.CALL_BACK_MESSAGES.UNAUTHORIZED_USER.CODE,
            "message": constants.CALL_BACK_MESSAGES.UNAUTHORIZED_USER.MESSAGE,
            "data": []
        })
    }
}

module.exports = validateToken
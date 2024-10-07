const { constants } = require('../../constants')
const db = require('../../models')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const { Op } = require('sequelize')

const Administrator = db.administrators

const login = async(req, res) => {
    try {

        const { email, password } = req.body

        if (!email || email.length > constants.MAX_LENGTHS.EMAIL) {
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.INVALID_EMAIL.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_EMAIL.MESSAGE,
                "data": []
            })
        }

        if (!password || password.length > constants.MAX_LENGTHS.PASSWORD || password.length < constants.MIN_LENGTHS.PASSWORD) {
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.INVALID_PASSWORD.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_PASSWORD.MESSAGE,
                "data": []
            })
        }

        const administrator = await Administrator.findOne({ where: { email: email }})

        const matchPassword = await bcrypt.compare(password, administrator.password)

        if (administrator &&  matchPassword) {

            const lastLogin = new Date;

            await Administrator.update(
                { lastLogin: lastLogin },
                { where: { email: email } }
            )

            const token = jwt.sign({
                user: {
                    id: administrator.id,
                }
            },
                process.env.ACCESS_TOKEN_SECRET_KEY,
                { expiresIn: "1y" }
            )

            return res.status(constants.HTTP_CODES.RESULT_OK).json({
                "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
                "data": [{
                    "administrator": administrator,
                    "token": token
                }]
            })
        }

        return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
            "responseCode": constants.CALL_BACK_MESSAGES.INVALID_EMAIL_PASSWORD.CODE,
            "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_EMAIL_PASSWORD.MESSAGE,
            "data": []
        })

    } catch (error) {
        console.log(error);
        return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
            "responseCode": constants.CALL_BACK_MESSAGES.INVALID_EMAIL_PASSWORD.CODE,
            "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_EMAIL_PASSWORD.MESSAGE,
            "data": []
        }) 
    }
}

module.exports = {login}
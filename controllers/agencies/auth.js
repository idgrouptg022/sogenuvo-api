const { constants } = require('../../constants')
const db = require('../../models')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const { Op } = require('sequelize')

const Agency = db.agencies

const login = async (req, res) => {

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

        const agency = await Agency.findOne({
            where: {
                [Op.or]: [{ email: email }, { phoneNumber: email }]
            }
        })

        if (agency && (await bcrypt.compare(password, agency.password))) {

            const lastLogin = new Date()

            await Agency.update({ lastLogin: lastLogin }, { where: { id: agency.id } })

            const token = jwt.sign({
                user: {
                    id: agency.id,
                }
            },
                process.env.ACCESS_TOKEN_SECRET_KEY,
                { expiresIn: "1y" }
            )

            return res.status(constants.HTTP_CODES.RESULT_OK).json({
                "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
                "data": [{
                    "agency": agency,
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
        console.log(error)
        return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
            "responseCode": constants.CALL_BACK_MESSAGES.INVALID_EMAIL_PASSWORD.CODE,
            "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_EMAIL_PASSWORD.MESSAGE,
            "data": []
        })
    }
}

module.exports = {
    login,
}
const { constants } = require('../../constants')
const db = require('../../models')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const { Op } = require('sequelize')

const Owner = db.owners
const ConfirmationCode = db.confirmationCodes

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

        await ConfirmationCode.destroy({ where: { email: email } })

        const owner = await Owner.findOne({
            where: {
                [Op.or]: [{ email: email }, { phoneNumber: email }]
            }
        })

        if (owner && (await bcrypt.compare(password, owner.password))) {

            const lastLogin = new Date()

            await Owner.update({ lastLogin: lastLogin }, { where: { id: owner.id } })

            const token = jwt.sign({
                user: {
                    id: owner.id,
                    email: owner.email
                }
            },
                process.env.ACCESS_TOKEN_SECRET_KEY,
                { expiresIn: "1y" }
            )

            return res.status(constants.HTTP_CODES.RESULT_OK).json({
                "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
                "data": [{
                    "owner": owner,
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
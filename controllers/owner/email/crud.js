const { constants } = require('../../../constants')
const db = require('../../../models')
const emailValidator = require("email-validator")

const AdditionalEmail = db.additionnalEmails
const Owner = db.owners

const create = async (req, res) => {

    try {

        const { ownerId } = req.params
        const { email } = req.body

        req.body.ownerId = ownerId

        if (!email || email.length > constants.MAX_LENGTHS.EMAIL || !emailValidator.validate(email)) {
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.INVALID_EMAIL.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_EMAIL.MESSAGE,
                "data": []
            })
        }

        if (!await Owner.findByPk(ownerId)) {
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.INVALID_OWNER_DATA.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_OWNER_DATA.MESSAGE,
                "data": []
            })
        }

        if (await AdditionalEmail.findOne({ where: { ownerId: ownerId, email: email } })) {
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.EMAIL_ALREADY_ADDED.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.EMAIL_ALREADY_ADDED.MESSAGE,
                "data": []
            })
        }

        if (await AdditionalEmail.count({ where: { ownerId: ownerId } }) > constants.MAX_LENGTHS.ADITIONNAL_EMAIL) {
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.MAX_ADITIONNAL_EMAIL.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.MAX_ADITIONNAL_EMAIL.MESSAGE,
                "data": []
            })
        }

        const additionalEmail = await AdditionalEmail.create(req.body)

        return res.status(constants.HTTP_CODES.CREATED).json({
            "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
            "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
            "data": [additionalEmail]
        })

    } catch (error) {
        console.log(error)
        return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
            "responseCode": constants.CALL_BACK_MESSAGES.INVALID_EMAIL.CODE,
            "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_EMAIL.MESSAGE,
            "data": []
        })
    }
}

const remove = async (req, res) => {

    try {

        const { emailId } = req.params


        if (!await AdditionalEmail.findByPk(emailId)) {
            return res.status(constants.HTTP_CODES.NOT_FOUND).json({
                "responseCode": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.MESSAGE,
                "data": []
            })
        }

        await AdditionalEmail.destroy({ where: { id: emailId } })

        return res.status(constants.HTTP_CODES.CREATED).json({
            "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
            "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
            "data": []
        })

    } catch (error) {
        console.log(error)
        return res.status(constants.HTTP_CODES.NOT_FOUND).json({
            "responseCode": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.CODE,
            "responseMessage": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.MESSAGE,
            "data": []
        })
    }
}

module.exports = {
    create,
    remove
}
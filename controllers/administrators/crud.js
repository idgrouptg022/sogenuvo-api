const { constants } = require('../../constants')
const emailValidator = require('email-validator')
const fs = require('fs')
const db = require('../../models')
const registrationEmail = require('../../mails/registration')
const bcrypt = require('bcrypt')
const smsService = require('../../sms/createOwner')
const { where } = require('sequelize')
const req = require('express/lib/request')

const Administrator = db.administrators

const create = async(req, res) => {
    try {
        const { fullName, email, password, description } = req.body;

        if (!fullName || fullName.length < constants.MIN_LENGTHS.CARD_NAME || fullName.length > constants.MAX_LENGTHS.CARD_NAME) {
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.INVALID_FULL_NAME.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_FULL_NAME.MESSAGE,
                "data": []
            })
        }

        if (!email || email.length < constants.MIN_LENGTHS.CARD_NAME || email.length > constants.MAX_LENGTHS.EMAIL) {
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.INVALID_EMAIL.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_EMAIL.MESSAGE,
                "data": []
            })
        }

        if (!description || description.length < constants.MIN_LENGTHS.CARD_NAME || description.length > constants.MAX_LENGTHS.CARD_DESCRIPTION) {
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.INVALID_CARD_DESCRIPTION.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_CARD_DESCRIPTION.MESSAGE,
                "data": []
            })
        }

        if (!password || password.trim().length < constants.MIN_LENGTHS.PASSWORD || password.trim().length > constants.MAX_LENGTHS.PASSWORD) {
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.INVALID_PASSWORD.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_PASSWORD.MESSAGE,
                "data": []
            })
        }

        const findEmail = await Administrator.findOne({ where : {
            email : email
            } 
        })

        if (findEmail !== null) {
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.EMAIL_IN_USE.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.EMAIL_IN_USE.MESSAGE,
                "data": []
            })
        }

        const salt = constants.GLOBAL.SBCRYPT_SALT

        req.body.password = await bcrypt.hash(password, salt)

        const administrator = await Administrator.create(req.body);

        return res.status(constants.HTTP_CODES.CREATED).json({
            "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
            "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
            "data": [administrator]
        })

    } catch (error) {
        console.log(error)
        return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
            "responseCode": constants.CALL_BACK_MESSAGES.FILL_ALL_FIELDS.CODE,
            "responseMessage": constants.CALL_BACK_MESSAGES.FILL_ALL_FIELDS.MESSAGE,
            "data": []
        })
    }
}

const read = async(req, res) => {
    try {

        const { id } = req.params

        const administrator = await Administrator.findByPk(id)

        if (!administrator) {
            return res.status(constants.HTTP_CODES.NOT_FOUND).json({
                "responseCode": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.MESSAGE,
                "data": []
            });
        }

        return res.status(constants.HTTP_CODES.RESULT_OK).json({
            "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
            "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
            "data": [administrator]
        })

    } catch (error) {
        console.log(error)
        return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
            "responseCode": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.CODE,
            "responseMessage": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.MESSAGE,
            "data": []
        })
    }
}

const update = async(req, res) => {
    try {

        const { id } = req.params
        const { fullName, email, password, description } = req.body;

        const oldAdministrator = await Administrator.findByPk(id)

        if (!fullName || fullName.length < constants.MIN_LENGTHS.CARD_NAME || fullName.length > constants.MAX_LENGTHS.CARD_NAME) {
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.INVALID_FULL_NAME.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_FULL_NAME.MESSAGE,
                "data": []
            })
        }

        if (!email || email.length < constants.MIN_LENGTHS.CARD_NAME || email.length > constants.MAX_LENGTHS.EMAIL) {
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.INVALID_EMAIL.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_EMAIL.MESSAGE,
                "data": []
            })
        }

        if (oldAdministrator.email !== email) {
            const existingEmail = await Administrator.findOne({ where: { email: email } });
            if (existingEmail !== null) {
                return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.EMAIL_IN_USE.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.EMAIL_IN_USE.MESSAGE,
                    "data": []
                })
            }
        }

        if (password) {
            if (password.length < constants.MIN_LENGTHS.PASSWORD || password.length > constants.MAX_LENGTHS.PASSWORD) {
                return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.INVALID_PASSWORD.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_PASSWORD.MESSAGE,
                    "data": []
                })
            }

            req.body.password = await bcrypt.hash(password, salt)
        }

        await Administrator.update(req.body, { where: { id: id }})

        return res.status(constants.HTTP_CODES.RESULT_OK).json({
            "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
            "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
            "data": []
        })


    } catch (error) {
        console.log(error)
        return res.status(constants.HTTP_CODES.NOT_FOUND).json({
            "responseCode": constants.CALL_BACK_MESSAGES.FILL_ALL_FIELDS.CODE,
            "responseMessage": constants.CALL_BACK_MESSAGES.FILL_ALL_FIELDS.MESSAGE,
            "data": []
        })
    }
}

const remove = async(req, res) => {
    try {

        const { id } = req.params

        const administrator = await Administrator.findByPk(id)

        if (!administrator) {
            return res.status(constants.HTTP_CODES.NOT_FOUND).json({
                "responseCode": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.MESSAGE,
                "data": []
            })
        }

        await Administrator.destroy({ where: { id: id } })

        return res.status(constants.HTTP_CODES.RESULT_OK).json({
            "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
            "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
            "data": []
        })

    } catch (error) {
        console.log(error)
        return res.status(constants.HTTP_CODES.NOT_FOUND).json({
            "responseCode": constants.CALL_BACK_MESSAGES.FILL_ALL_FIELDS.CODE,
            "responseMessage": constants.CALL_BACK_MESSAGES.FILL_ALL_FIELDS.MESSAGE,
            "data": []
        })
    }
}

const list = async(req, res) =>  {
    
    const administrators = await Administrator.findAll()

    return res.status(constants.HTTP_CODES.CREATED).json({
        "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
        "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
        "data": administrators
    })
}

module.exports = {
    create,
    read,
    update,
    remove,
    list
}

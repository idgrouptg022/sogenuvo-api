const { constants } = require('../../constants')
const emailValidator = require("email-validator")
const fs = require('fs')
const db = require('../../models')
const registrationEmail = require("../../mails/registration")
const bcrypt = require('bcrypt')
const smsService = require('../../sms/createOwner')

const Agency = db.agencies
const Owner = db.owners
const CardType = db.cardTypes
const AdditionalEmail = db.additionnalEmails
const Country = db.countries
const City = db.cities


const create = async (req, res) => {

    try {

        const { email, phoneNumber, phoneNumberBis, idCardNumber, password, fullName, cardTypeId, accountType, responsibleFullName, socialReason, additionnalEmails, nif, rccm } = req.body
        const { id } = req.params

        const cardType = await CardType.findByPk(cardTypeId)

        req.body.agencyId = id
        const ownerData = req.body
        const salt = constants.GLOBAL.SBCRYPT_SALT

        const agency = await Agency.findByPk(id)

        if (!agency)
            return res.status(constants.HTTP_CODES.NOT_FOUND).json({
                "responseCode": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.MESSAGE,
                "data": []
            })

        if (!accountType || (accountType !== constants.ACCOUNT_TYPES.PERSONNAL && accountType !== constants.ACCOUNT_TYPES.ENTERPRISE)) {
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.INVALID_ACCOUNT_TYPE.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_ACCOUNT_TYPE.MESSAGE,
                "data": []
            })
        }

        if (email && email.length > 0) {
            if (email.length > constants.MAX_LENGTHS.EMAIL || !emailValidator.validate(email)) {
                return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.INVALID_EMAIL.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_EMAIL.MESSAGE,
                    "data": []
                })
            }

            if (await Owner.findOne({ where: { email: email } })) {
                return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.EMAIL_IN_USE.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.EMAIL_IN_USE.MESSAGE,
                    "data": []
                })
            }
        }

        if (!password || password.length > constants.MAX_LENGTHS.PASSWORD || password.length < constants.MIN_LENGTHS.PASSWORD) {
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.INVALID_PASSWORD.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_PASSWORD.MESSAGE,
                "data": []
            })
        }

        const trimedPhoneNumber = phoneNumber?.replaceAll(" ", "")

        if (!phoneNumber || trimedPhoneNumber.length > constants.MAX_LENGTHS.PHONE_NUMBER
            || trimedPhoneNumber.length < constants.MIN_LENGTHS.PHONE_NUMBER || !isNumeric(trimedPhoneNumber.substring(1))) {
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.INVALID_PHONE_NUMBER.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_PHONE_NUMBER.MESSAGE,
                "data": []
            })
        }

        if (await Owner.findOne({ where: { phoneNumber: phoneNumber } })) {
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.PHONE_NUMBER_IN_USE.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.PHONE_NUMBER_IN_USE.MESSAGE,
                "data": []
            })
        }

        if (!idCardNumber || idCardNumber.length > constants.MAX_LENGTHS.CARD_NUMBER
            || idCardNumber.length < constants.MIN_LENGTHS.CARD_NUMBER) {
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.INVALID_CARD_NUMBER.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_CARD_NUMBER.MESSAGE,
                "data": []
            })
        }

        if (await Owner.findOne({ where: { idCardNumber: idCardNumber } })) {
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.INVALID_CARD_NUMBER.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_CARD_NUMBER.MESSAGE,
                "data": []
            })
        }

        if (!cardTypeId || !cardType) {
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.INVALID_CARD_TYPE_ID.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_CARD_TYPE_ID.MESSAGE,
                "data": []
            })
        }

        if (req.files?.idCard) {
            if (!req.files.idCard.mimetype.startsWith("image")) {
                return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.INVALID_FILE_TYPE.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_FILE_TYPE.MESSAGE,
                    "data": []
                })
            }

            if (req.files.idCard.size > constants.FILE_SIZES.CARD_ID) {
                return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.FILE_TO_LARGE.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.FILE_TO_LARGE.MESSAGE,
                    "data": []
                })
            }

            const dirY = 'db/owners/idCards/' + new Date().getFullYear()

            if (!fs.existsSync(dirY)) {
                fs.mkdirSync(dirY, { recursive: true })
                const dirM = dirY + '/' + (new Date().getMonth() + 1)
                fs.mkdirSync(dirM, { recursive: true })
            } else {
                const dirM = dirY + '/' + (new Date().getMonth() + 1)
                if (!fs.existsSync(dirM)) {
                    fs.mkdirSync(dirM, { recursive: true })
                }
            }

            const time = new Date().getTime()

            const basePath = 'db/owners/idCards/' + new Date().getFullYear() + "/" + (new Date().getMonth() + 1)

            const uploadPath = basePath + "/" + time + req.files.idCard.name

            req.files.idCard.mv(uploadPath, async function (err) {
                if (err) console.log(err)
            })

            ownerData.idCard = uploadPath
        }

        const messageText = `Bonjour ${fullName.substring(fullName.lastIndexOf(" "))}. Bienvenue sur SOGENUVO. votre mot de passe est : ${password}`

        switch (accountType) {
            case constants.ACCOUNT_TYPES.PERSONNAL:

                if (!fullName || fullName.length > constants.MAX_LENGTHS.FULL_NAME
                    || fullName.length < constants.MIN_LENGTHS.FULL_NAME) {
                    return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                        "responseCode": constants.CALL_BACK_MESSAGES.INVALID_FULL_NAME.CODE,
                        "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_FULL_NAME.MESSAGE,
                        "data": []
                    })
                }

                ownerData.password = await bcrypt.hash(password, salt)

                req.body.administratorId = req.user.id

                const personnalOwner = await Owner.create(ownerData)
                await Owner.update({ ref: "SP-" + personnalOwner.id + "-" + new Date().getFullYear().toString().substring(2) }, { where: { id: personnalOwner.id } })

                if (email)
                    registrationEmail.registration(email, password, [])

                smsService.createOwner(phoneNumber, messageText)

                return res.status(constants.HTTP_CODES.CREATED).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
                    "data": [personnalOwner]
                })

                break

            case constants.ACCOUNT_TYPES.ENTERPRISE:

                if (!email || email.length > constants.MAX_LENGTHS.EMAIL || !emailValidator.validate(email)) {
                    return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                        "responseCode": constants.CALL_BACK_MESSAGES.INVALID_EMAIL.CODE,
                        "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_EMAIL.MESSAGE,
                        "data": []
                    })
                }

                if (!responsibleFullName || responsibleFullName.length > constants.MAX_LENGTHS.FULL_NAME
                    || responsibleFullName.length < constants.MIN_LENGTHS.FULL_NAME) {
                    return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                        "responseCode": constants.CALL_BACK_MESSAGES.INVALID_FULL_NAME.CODE,
                        "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_FULL_NAME.MESSAGE,
                        "data": []
                    })
                }

                if (!socialReason || socialReason.length > constants.MAX_LENGTHS.FULL_NAME
                    || socialReason.length < constants.MIN_LENGTHS.FULL_NAME) {
                    return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                        "responseCode": constants.CALL_BACK_MESSAGES.INVALID_SOCIAL_REASON.CODE,
                        "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_SOCIAL_REASON.MESSAGE,
                        "data": []
                    })
                }

                if (nif) {
                    if (nif.length < constants.MIN_LENGTHS.CARD_NUMBER || nif.length > constants.MAX_LENGTHS.CARD_NUMBER) {
                        return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                            "responseCode": constants.CALL_BACK_MESSAGES.INVALID_NIF_NUMBER.CODE,
                            "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_NIF_NUMBER.MESSAGE,
                            "data": []
                        })
                    }

                    if (await Owner.findOne({ where: { nif: nif } })) {
                        return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                            "responseCode": constants.CALL_BACK_MESSAGES.INVALID_NIF_NUMBER.CODE,
                            "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_NIF_NUMBER.MESSAGE,
                            "data": []
                        })
                    }
                }

                if (rccm) {
                    if (rccm.length < constants.MIN_LENGTHS.CARD_NUMBER || rccm.length > constants.MAX_LENGTHS.CARD_NUMBER) {
                        return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                            "responseCode": constants.CALL_BACK_MESSAGES.INVALID_RCCM_NUMBER.CODE,
                            "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_RCCM_NUMBER.MESSAGE,
                            "data": []
                        })
                    }

                    if (await Owner.findOne({ where: { rccm: rccm } })) {
                        return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                            "responseCode": constants.CALL_BACK_MESSAGES.INVALID_RCCM_NUMBER.CODE,
                            "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_RCCM_NUMBER.MESSAGE,
                            "data": []
                        })
                    }
                }

                if (req.files?.cfeCard) {
                    if (!req.files.cfeCard.mimetype.startsWith("image")) {
                        return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                            "responseCode": constants.CALL_BACK_MESSAGES.INVALID_FILE_TYPE.CODE,
                            "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_FILE_TYPE.MESSAGE,
                            "data": []
                        })
                    }

                    if (req.files.cfeCard.size > constants.FILE_SIZES.CARD_ID) {
                        return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                            "responseCode": constants.CALL_BACK_MESSAGES.FILE_TO_LARGE.CODE,
                            "responseMessage": constants.CALL_BACK_MESSAGES.FILE_TO_LARGE.MESSAGE,
                            "data": []
                        })
                    }

                    const dirY = 'db/owners/cfeCards/' + new Date().getFullYear()

                    if (!fs.existsSync(dirY)) {
                        fs.mkdirSync(dirY, { recursive: true })
                        const dirM = dirY + '/' + (new Date().getMonth() + 1)
                        fs.mkdirSync(dirM, { recursive: true })
                    } else {
                        const dirM = dirY + '/' + (new Date().getMonth() + 1)
                        if (!fs.existsSync(dirM)) {
                            fs.mkdirSync(dirM, { recursive: true })
                        }
                    }

                    const time = new Date().getTime()

                    const basePath = 'db/owners/cfeCards/' + new Date().getFullYear() + "/" + (new Date().getMonth() + 1)

                    const uploadPath = basePath + "/" + time + req.files.cfeCard.name

                    req.files.cfeCard.mv(uploadPath, async function (err) {
                        if (err) console.log(err)
                    })

                    ownerData.cfeCard = uploadPath
                }

                ownerData.password = await bcrypt.hash(password, salt)
                ownerData.phoneNumberBis = phoneNumberBis

                req.body.administratorId = req.user.id

                const additionnalEmailsArray = additionnalEmails ? additionnalEmails.split(',') : []

                const enterpriseOwner = await Owner.create(ownerData)

                if (additionnalEmails && additionnalEmails.length > 0) {
                    if (Array.isArray(additionnalEmailsArray)) {
                        if (additionnalEmailsArray.length > constants.MAX_LENGTHS.ADITIONNAL_EMAIL) {
                            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                                "responseCode": constants.CALL_BACK_MESSAGES.MAX_ADITIONNAL_EMAIL.CODE,
                                "responseMessage": constants.CALL_BACK_MESSAGES.MAX_ADITIONNAL_EMAIL.MESSAGE,
                                "data": []
                            })
                        } else {
                            additionnalEmailsArray.forEach(async (additionnalEmail) => {
                                if (emailValidator.validate(additionnalEmail)) {
                                    await AdditionalEmail.create({
                                        ownerId: enterpriseOwner.id,
                                        email: additionnalEmail
                                    })
                                }
                            })
                        }
                    }
                }

                await Owner.update({ ref: "SP-" + enterpriseOwner.id + "-" + new Date().getFullYear().toString().substring(2) }, { where: { id: enterpriseOwner.id } })

                registrationEmail.registration(email, password, Array.isArray(additionnalEmailsArray) ? additionnalEmailsArray : [])

                smsService.createOwner(phoneNumber, messageText)

                return res.status(constants.HTTP_CODES.CREATED).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
                    "data": [enterpriseOwner]
                })
            default:
                return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.INVALID_OWNER_DATA.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_OWNER_DATA.MESSAGE,
                    "data": []
                })
        }

    } catch (error) {
        console.log(error)
        return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
            "responseCode": constants.CALL_BACK_MESSAGES.INVALID_OWNER_DATA.CODE,
            "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_OWNER_DATA.MESSAGE,
            "data": []
        })
    }
}

const read = async (req, res) => {

    try {

        const { ownerId } = req.params

        const owner = await Owner.findOne({ where: { id: ownerId }, include: [AdditionalEmail, CardType] })

        if (owner) {
            return res.status(constants.HTTP_CODES.RESULT_OK).json({
                "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
                "data": [owner]
            })
        } else {
            return res.status(constants.HTTP_CODES.NOT_FOUND).json({
                "responseCode": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.MESSAGE,
                "data": []
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(constants.HTTP_CODES.NOT_FOUND).json({
            "responseCode": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.CODE,
            "responseMessage": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.MESSAGE,
            "data": []
        })
    }

}

const update = async (req, res) => {
    try {

        const { id, ownerId } = req.params
        const { email, phoneNumber, phoneNumberBis, idCardNumber, fullName, cardTypeId, responsibleFullName, socialReason, nif, rccm, password } = req.body

        const odlOwner = await Owner.findByPk(ownerId)

        if (odlOwner?.agencyId != id)
            return res.status(constants.HTTP_CODES.NOT_FOUND).json({
                "responseCode": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.MESSAGE,
                "data": []
            })

        const ownerData = req.body

        if (!odlOwner)
            return res.status(constants.HTTP_CODES.NOT_FOUND).json({
                "responseCode": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.MESSAGE,
                "data": []
            })

        if (email) {
            if (email.length > constants.MAX_LENGTHS.EMAIL || !emailValidator.validate(email)) {
                return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.INVALID_EMAIL.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_EMAIL.MESSAGE,
                    "data": []
                })
            }

            if (odlOwner.email != email) {
                if (await Owner.findOne({ where: { email: email } })) {
                    return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                        "responseCode": constants.CALL_BACK_MESSAGES.EMAIL_IN_USE.CODE,
                        "responseMessage": constants.CALL_BACK_MESSAGES.EMAIL_IN_USE.MESSAGE,
                        "data": []
                    })
                }
            }
        }

        if (phoneNumber) {

            const trimedPhoneNumber = phoneNumber?.replaceAll(" ", "")

            if (trimedPhoneNumber.length > constants.MAX_LENGTHS.PHONE_NUMBER
                || trimedPhoneNumber.length < constants.MIN_LENGTHS.PHONE_NUMBER || !isNumeric(trimedPhoneNumber.substring(1))) {
                return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.INVALID_PHONE_NUMBER.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_PHONE_NUMBER.MESSAGE,
                    "data": []
                })
            }

            if (odlOwner.phoneNumber != phoneNumber) {
                if (await Owner.findOne({ where: { phoneNumber: phoneNumber } })) {
                    return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                        "responseCode": constants.CALL_BACK_MESSAGES.PHONE_NUMBER_IN_USE.CODE,
                        "responseMessage": constants.CALL_BACK_MESSAGES.PHONE_NUMBER_IN_USE.MESSAGE,
                        "data": []
                    })
                }
            }
        }
        if (phoneNumberBis && phoneNumberBis.trim() != '+228') {

            ownerData.phoneNumberBis = phoneNumberBis
        }

        if (idCardNumber) {
            if (idCardNumber.length < constants.MIN_LENGTHS.CARD_NUMBER || idCardNumber.length > constants.MAX_LENGTHS.CARD_NUMBER) {
                return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.INVALID_CARD_NUMBER.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_CARD_NUMBER.MESSAGE,
                    "data": []
                })
            }
        }

        if (fullName) {
            if (fullName.length > constants.MAX_LENGTHS.FULL_NAME
                || fullName.length < constants.MIN_LENGTHS.FULL_NAME) {
                return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.INVALID_FULL_NAME.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_FULL_NAME.MESSAGE,
                    "data": []
                })
            }
        }

        if (cardTypeId) {
            if (!await CardType.findByPk(cardTypeId)) {
                return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.INVALID_CARD_TYPE_ID.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_CARD_TYPE_ID.MESSAGE,
                    "data": []
                })
            }
        }

        if (responsibleFullName) {
            if (responsibleFullName.length > constants.MAX_LENGTHS.FULL_NAME
                || responsibleFullName.length < constants.MIN_LENGTHS.FULL_NAME) {
                return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.INVALID_FULL_NAME.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_FULL_NAME.MESSAGE,
                    "data": []
                })
            }
        }

        if (socialReason) {
            if (socialReason.length > constants.MAX_LENGTHS.FULL_NAME
                || socialReason.length < constants.MIN_LENGTHS.FULL_NAME) {
                return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.INVALID_SOCIAL_REASON.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_SOCIAL_REASON.MESSAGE,
                    "data": []
                })
            }
        }

        if (rccm) {
            if (rccm.length < constants.MIN_LENGTHS.CARD_NUMBER || rccm.length > constants.MAX_LENGTHS.CARD_NUMBER) {
                return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.INVALID_RCCM_NUMBER.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_RCCM_NUMBER.MESSAGE,
                    "data": []
                })
            }
        }

        if (nif) {
            if (nif.length < constants.MIN_LENGTHS.CARD_NUMBER || nif.length > constants.MAX_LENGTHS.CARD_NUMBER) {
                return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.INVALID_NIF_NUMBER.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_NIF_NUMBER.MESSAGE,
                    "data": []
                })
            }
        }

        if (req.files?.idCard) {
            if (!req.files.idCard.mimetype.startsWith("image")) {
                return res.status(constants.STATUS_CODES.RESULT_OK).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.INVALID_FILE_TYPE.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_FILE_TYPE.MESSAGE,
                    "data": []
                })
            }

            if (req.files.idCard.size > constants.FILE_SIZES.CARD_ID) {
                return res.status(constants.STATUS_CODES.RESULT_OK).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.FILE_TO_LARGE.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.FILE_TO_LARGE.MESSAGE,
                    "data": []
                })
            }

            const dirY = 'db/owners/idCards/' + new Date().getFullYear()

            if (!fs.existsSync(dirY)) {
                fs.mkdirSync(dirY, { recursive: true })
                const dirM = dirY + '/' + (new Date().getMonth() + 1)
                fs.mkdirSync(dirM, { recursive: true })
            } else {
                const dirM = dirY + '/' + (new Date().getMonth() + 1)
                if (!fs.existsSync(dirM)) {
                    fs.mkdirSync(dirM, { recursive: true })
                }
            }

            const time = new Date().getTime()

            const basePath = 'db/owners/idCards/' + new Date().getFullYear() + "/" + (new Date().getMonth() + 1)

            const uploadPath = basePath + "/" + time + req.files.idCard.name

            req.files.idCard.mv(uploadPath, async function (err) {
                if (err) console.log(err)
            })

            ownerData.idCard = uploadPath
        }

        if (req.files?.cfeCard) {
            if (!req.files.cfeCard.mimetype.startsWith("image")) {
                return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.INVALID_FILE_TYPE.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_FILE_TYPE.MESSAGE,
                    "data": []
                })
            }

            if (req.files.cfeCard.size > constants.FILE_SIZES.CARD_ID) {
                return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.FILE_TO_LARGE.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.FILE_TO_LARGE.MESSAGE,
                    "data": []
                })
            }

            const dirY = 'db/owners/cfeCards/' + new Date().getFullYear()

            if (!fs.existsSync(dirY)) {
                fs.mkdirSync(dirY, { recursive: true })
                const dirM = dirY + '/' + (new Date().getMonth() + 1)
                fs.mkdirSync(dirM, { recursive: true })
            } else {
                const dirM = dirY + '/' + (new Date().getMonth() + 1)
                if (!fs.existsSync(dirM)) {
                    fs.mkdirSync(dirM, { recursive: true })
                }
            }

            const time = new Date().getTime()

            const basePath = 'db/owners/cfeCards/' + new Date().getFullYear() + "/" + (new Date().getMonth() + 1)

            const uploadPath = basePath + "/" + time + req.files.cfeCard.name

            req.files.cfeCard.mv(uploadPath, async function (err) {
                if (err) console.log(err)
            })

            ownerData.cfeCard = uploadPath
        }

        if (password) {

            if (password.length > constants.MAX_LENGTHS.PASSWORD || password.length < constants.MIN_LENGTHS.PASSWORD) {
                return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.INVALID_PASSWORD.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_PASSWORD.MESSAGE,
                    "data": []
                })
            }

            ownerData.password = await bcrypt.hash(password, salt)
        }

        await Owner.update(ownerData, { where: { id: ownerId } })

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

const remove = async (req, res) => {

    try {

        const { id, ownerId } = req.params

        const odlOwner = await Owner.findByPk(ownerId)

        if (odlOwner?.agencyId != id)
            return res.status(constants.HTTP_CODES.NOT_FOUND).json({
                "responseCode": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.MESSAGE,
                "data": []
            })

        if (!await Owner.findOne({ where: { id: ownerId } })) {
            return res.status(constants.HTTP_CODES.NOT_FOUND).json({
                "responseCode": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.MESSAGE,
                "data": []
            })
        }

        await Owner.destroy({ where: { id: ownerId } })

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

const list = async (req, res) => {

    const { id } = req.params

    return res.status(constants.HTTP_CODES.RESULT_OK).json({
        "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
        "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
        "data": await Owner.findAll({
            where: { agencyId: id },
            include: {
                model: City, include: [Country],
            }
        })
    })
}

function isNumeric(value) {
    return /^\d+$/.test(value)
}

module.exports = {
    create,
    read,
    update,
    remove,
    list,
}
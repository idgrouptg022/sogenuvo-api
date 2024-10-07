const { constants } = require('../../constants')
const db = require('../../models')
const bcrypt = require('bcrypt')

const Agency = db.agencies
const Country = db.countries
const City = db.cities

const create = async (req, res) => {

    try {

        const { responsibleFullName, password } = req.body

        if (!responsibleFullName || responsibleFullName.length < constants.MIN_LENGTHS.CARD_NAME || responsibleFullName.length > constants.MAX_LENGTHS.CARD_NAME)
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.INVALID_FULL_NAME.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_FULL_NAME.MESSAGE,
                "data": []
            })


        if (!password || password.trim().length < constants.MIN_LENGTHS.PASSWORD || password.trim().length > constants.MAX_LENGTHS.PASSWORD)
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.INVALID_PASSWORD.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_PASSWORD.MESSAGE,
                "data": []
            })


        const salt = constants.GLOBAL.SBCRYPT_SALT

        req.body.password = await bcrypt.hash(password, salt)

        const agency = await Agency.create(req.body)

        return res.status(constants.HTTP_CODES.CREATED).json({
            "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
            "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
            "data": [agency]
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

const read = async (req, res) => {

    try {

        const { id } = req.params

        const agency = await Agency.findByPk(id, { include: [Country, City] })

        if (!agency)
            return res.status(constants.HTTP_CODES.NOT_FOUND).json({
                "responseCode": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.MESSAGE,
                "data": []
            })

        return res.status(constants.HTTP_CODES.RESULT_OK).json({
            "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
            "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
            "data": [agency]
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

const update = async (req, res) => {

    try {

        const { id } = req.params
        const { responsibleFullName, password } = req.body

        if (responsibleFullName)
            if (responsibleFullName.length < constants.MIN_LENGTHS.CARD_NAME || responsibleFullName.length > constants.MAX_LENGTHS.CARD_NAME)
                return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.INVALID_FULL_NAME.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_FULL_NAME.MESSAGE,
                    "data": []
                })



        const agency = await Agency.findByPk(id)

        if (!agency)
            return res.status(constants.HTTP_CODES.CREATED).json({
                "responseCode": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.MESSAGE,
                "data": []
            })



        if (password && password.length.trim() > 0) {
            const salt = constants.GLOBAL.SBCRYPT_SALT
            req.body.password = await bcrypt.hash(password, salt)
        }

        await Agency.update(req.body, { where: { id: id } })

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

const remove = async (req, res) => {

    try {

        const { id } = req.params

        const agency = await Agency.findByPk(id)

        if (!agency)
            return res.status(constants.HTTP_CODES.NOT_FOUND).json({
                "responseCode": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.MESSAGE,
                "data": []
            })

        await Agency.destroy({ where: { id: id } })

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

const list = async (req, res) => {

    const agencies = await Agency.findAll({ include: [Country, City] })

    return res.status(constants.HTTP_CODES.CREATED).json({
        "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
        "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
        "data": agencies
    })
}

module.exports = {
    create,
    read,
    update,
    remove,
    list
}
const { constants } = require('../../constants')
const db = require('../../models')

const Car = db.cars
const Owner = db.owners
const Assurance = db.assurances
const TechnicalVisit = db.technicalVisits
const Tvm = db.tvms

const cars = async (req, res) => {

    try {

        const { id } = req.params

        const { offset, limit } = req.body

        const owner = await Owner.findByPk(id)

        if (owner) {
            return res.status(constants.HTTP_CODES.CREATED).json({
                "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
                "data": await Car.findAll({ where: { ownerId: id, state: 1 }, order: [['id', 'DESC']], offset: offset ? offset : 0, limit: limit ? limit : 10 })
            })
        } else {
            return res.status(constants.HTTP_CODES.NOT_FOUND).json({
                "responseCode": constants.CALL_BACK_MESSAGES.INVALID_OWNER_DATA.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.INVALID_OWNER_DATA.MESSAGE,
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

const documents = async (req, res) => {

    try {

        const { id } = req.params

        const owner = await Owner.findByPk(id)

        if (owner) {

            return res.status(constants.HTTP_CODES.CREATED).json({
                "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
                "data": await Car.findAll({where: {ownerId: id}, include: [Assurance, TechnicalVisit, Tvm]})
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

module.exports = {
    cars,
    documents
}
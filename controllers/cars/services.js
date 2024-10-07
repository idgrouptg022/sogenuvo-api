const { constants } = require('../../constants')
const db = require('../../models')
const { Op } = require("sequelize")

const Car = db.cars

const search = async (req, res) => {

    try {

        const { offset, limit, searchQ } = req.body

        const cars = await Car.findAll({
            where: {
                [Op.and]: [{
                    [Op.or]: [
                        {
                            brand: { [Op.like]: `%${searchQ}%` }
                        },
                        {
                            carPlateNumber: { [Op.like]: `%${searchQ}%` }
                        },
                        {
                            model: { [Op.like]: `%${searchQ}%` }
                        },
                        {
                            places: { [Op.like]: `%${searchQ}%` }
                        },
                        {
                            transmission: { [Op.like]: `%${searchQ}%` }
                        }
                    ]
                }, {
                    state: 1
                }]
            },
            offset: offset ? offset : 0,
            limit: limit ? limit : 10,
        })

        return res.status(constants.HTTP_CODES.RESULT_OK).json({
            "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
            "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
            "data": cars
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
    search,
}
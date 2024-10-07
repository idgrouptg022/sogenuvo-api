const { constants } = require('../../../constants')
const db = require('../../../models')

const Car = db.cars
const CarPhotos = db.carsPhotos

const cars = async (req, res) => {

    const { id } = req.params

    return res.status(constants.HTTP_CODES.RESULT_OK).json({
        "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
        "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
        "data": await Car.findAll({ where: { cityId: id } }, { include: [CarPhotos] })
    })
}

module.exports = {
    cars,
}
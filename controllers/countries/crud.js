const { constants } = require('../../constants')
const db = require('../../models')

const Country = db.countries
const City = db.cities
const Car = db.cars
const CarPhotos = db.carsPhotos


const read = async (req, res) => {

    try {

        const { id } = req.params

        const country = await Country.findOne({ where: { id: id }, include: [City] })

        if (country) {
            return res.status(constants.HTTP_CODES.RESULT_OK).json({
                "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
                "data": [country]
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



const list = async (req, res) => {


    return res.status(constants.HTTP_CODES.RESULT_OK).json({
        "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
        "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
        "data": await Country.findAll()
    })
}


const cars = async (req, res) => {

    const { id } = req.params

    return res.status(constants.HTTP_CODES.RESULT_OK).json({
        "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
        "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
        "data": await Car.findAll({ where: { countryId: id } }, { include: [CarPhotos] })
    })
}

module.exports = {
    read,
    list,
    cars,
}
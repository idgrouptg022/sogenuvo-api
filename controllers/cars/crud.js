const { constants } = require('../../constants')
// const smsService = require('../../sms/createOwner')
// const bcrypt = require('bcrypt')
const db = require('../../models')
const fs = require('fs')

const Car = db.cars
const Category = db.categories
const CarPhoto = db.carsPhotos
const Owner = db.owners

const create = async (req, res) => {

    try {

        const { brand, carPlateNumber, carPlateSeries, chassisNumber, grayCardNumber, year, model, ownerId } = req.body

        if (!brand || !carPlateNumber || !carPlateSeries || !chassisNumber || grayCardNumber || !year || !model || !ownerId) {
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.FILL_ALL_FIELDS.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.FILL_ALL_FIELDS.MESSAGE,
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


        req.body.administratorId = req.user.id

        const car = await Car.create(req.body)

        if (req.files?.carPhoto) {

            const dirY = 'db/cars/photos/' + new Date().getFullYear()

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

            const basePath = 'db/cars/photos/' + new Date().getFullYear() + "/" + (new Date().getMonth() + 1)

            if (req.files.carPhoto.length !== undefined) {
                req.files.carPhoto.forEach(async (element) => {
                    const uploadPath = basePath + "/" + time + element.name.replaceAll(' ', '')
                    element.mv(uploadPath, async function (err) {
                        if (err) return res.status(500).send({ err })
                    })
                    await CarPhoto.create({ carPhoto: uploadPath, carId: car.id })
                })
            } else {
                const uploadPath = basePath + "/" + time + req.files.carPhoto.name.replaceAll(' ', '')
                req.files.carPhoto.mv(uploadPath, async function (err) {
                    if (err) return res.status(500).send({ err })
                })

                await CarPhoto.create({ carPhoto: uploadPath, carId: car.id })
            }
        }

        return res.status(constants.HTTP_CODES.CREATED).json({
            "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
            "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
            "data": [car]
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

        const car = await Car.findByPk(id, { include: [CarPhoto, Category] })
        // const car = await Car.findByPk(id, { include: [Assurance, TechnicalVisit, Tvm, Accident, BreakDown, Maintenance, CarPhoto, Category] })

        if (car) {

            return res.status(constants.HTTP_CODES.RESULT_OK).json({
                "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
                "data": [{
                    "car": car,
                    "owner": await Owner.findByPk(car.ownerId),
                    "prices": {
                        "price_1": car.locationFees ? ((car.locationFees / 12) + 6000) : 0,
                        "price_2": car.locationFees ? ((car.locationFees / 4) + 4000) : 0,
                        "price_3": car.locationFees ? ((car.locationFees / 2) + 2000) : 0,
                    }
                }]
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

       const { id } = req.params
        const { carPlateNumber, grayCardNumber, notation } = req.body

        const oldCar = await Car.findByPk(id)

        if (!oldCar) {
            return res.status(constants.HTTP_CODES.NOT_FOUND).json({
                "responseCode": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.MESSAGE,
                "data": []
            })
        }

        if (notation && notation > 0) {

            const newNotation = oldCar.notation === 0 ? notation : (oldCar.notation + notation) / 2

            await Car.update({ notation: newNotation }, { where: { id: id } })

            return res.status(constants.HTTP_CODES.CREATED).json({
                "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
                "data": []
            })
        }

        if (carPlateNumber) {
            if (oldCar.carPlateNumber != req.body.carPlateNumber) {
                const carPlateRows = await Car.findAll({ where: { carPlateNumber: req.body.carPlateNumber } })
                if (carPlateRows.length > 1) {
                    return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                        "responseCode": constants.CALL_BACK_MESSAGES.PLATE_NUMBER_EXISTS.CODE,
                        "responseMessage": constants.CALL_BACK_MESSAGES.PLATE_NUMBER_EXISTS.MESSAGE,
                        "data": [3]
                    })
                }
            }
        }

        if (grayCardNumber) {
            if (oldCar.grayCardNumber != req.body.grayCardNumber) {
                const carPlateRows = await Car.findAll({ where: { grayCardNumber: req.body.grayCardNumber } })
                if (carPlateRows.length > 1) {
                    return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                        "responseCode": constants.CALL_BACK_MESSAGES.FILL_ALL_FIELDS.CODE,
                        "responseMessage": constants.CALL_BACK_MESSAGES.FILL_ALL_FIELDS.MESSAGE,
                        "data": [2]
                    })
                }
            }
        }

        if (req.body.chassisNumber?.length > 0 && oldCar.chassisNumber == req.body.chassisNumber) {
            const carPlateRows = await Car.findAll({ where: { chassisNumber: req.body.chassisNumber } })
            if (carPlateRows.length > 1) {
                return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                    "responseCode": constants.CALL_BACK_MESSAGES.FILL_ALL_FIELDS.CODE,
                    "responseMessage": constants.CALL_BACK_MESSAGES.FILL_ALL_FIELDS.MESSAGE,
                    "data": [1]
                })
            }
        }

        if (!req.user.id) {
            return res.status(constants.HTTP_CODES.VALIDATION_ERROR).json({
                "responseCode": constants.CALL_BACK_MESSAGES.FILL_ALL_FIELDS.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.FILL_ALL_FIELDS.MESSAGE,
                "data": [0]
            })
        }

        if (req.files?.carPhoto) {

            const dirY = 'db/cars/photos/' + new Date().getFullYear()

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

            const basePath = 'db/cars/photos/' + new Date().getFullYear() + "/" + (new Date().getMonth() + 1)

            if (req.files.carPhoto.length !== undefined) {
                req.files.carPhoto.forEach(async (element) => {
                    const uploadPath = basePath + "/" + time + element.name.replaceAll(' ', '')
                    element.mv(uploadPath, async function (err) {
                        if (err) return res.status(500).send({ err })
                    })
                    await CarPhoto.create({ carPhoto: uploadPath, carId: id })
                })
            } else {
                const uploadPath = basePath + "/" + time + req.files.carPhoto.name.replaceAll(' ', '')
                req.files.carPhoto.mv(uploadPath, async function (err) {
                    if (err) return res.status(500).send({ err })
                })

                await CarPhoto.create({ carPhoto: uploadPath, carId: id })
            }
        }

        await Car.update(req.body, { where: { id: id } })

        return res.status(constants.HTTP_CODES.RESULT_OK).json({
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

    try {

        return res.status(constants.HTTP_CODES.RESULT_OK).json({
            "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
            "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
            "data": await Car.findAll({
                attributes: ['id', 'carPlateSeries', 'carPlateNumber', 'brand', 'year', 'model'],
                order: [
                    ['id', 'DESC']
                ]
            })
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

        const { id } = req.params

        if (!await Car.findByPk(id)) {
            return res.status(constants.HTTP_CODES.NOT_FOUND).json({
                "responseCode": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.CODE,
                "responseMessage": constants.CALL_BACK_MESSAGES.RECORD_NOT_FOUND.MESSAGE,
                "data": []
            })
        }

        await Car.destroy({ where: { id: id } })

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

const popular = async (req, res) => {

    try {
        const categories = await Car.findAll({ where: { isPopular: true }, include: [CarPhoto] })

        return res.status(constants.HTTP_CODES.CREATED).json({
            "responseCode": constants.CALL_BACK_MESSAGES.SUCCESS.CODE,
            "responseMessage": constants.CALL_BACK_MESSAGES.SUCCESS.MESSAGE,
            "data": categories
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



module.exports = {
    create,
    read,
    update,
    list,
    remove,
    popular,
}
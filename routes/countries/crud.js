const express = require("express")
const {
    read,
    list,
    cars,
} = require("../../controllers/countries/crud")

const cities = require("../../controllers/countries/cities/crud")


const validateToken = require("../../middleware/validateTokenHandler")

const router = express.Router()

router.get("/:id", validateToken, read)
router.get("/", validateToken, list)

router.get("/:id/cars", validateToken, cars)
router.get("/cities/:id/cars", validateToken, cities.cars)

module.exports = router
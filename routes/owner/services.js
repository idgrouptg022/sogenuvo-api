const express = require("express")
const { 
    cars, documents
} = require("../../controllers/owner/services")
const validateToken = require("../../middleware/validateTokenHandler")

const router = express.Router()

router.get("/:id/cars", validateToken, cars)
router.get("/:id/documents", validateToken, documents)

module.exports = router
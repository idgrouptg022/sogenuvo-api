const express = require("express")
const {
    login,
} = require("../../controllers/agencies/auth")

const router = express.Router()

router.post("/login", login)

module.exports = router
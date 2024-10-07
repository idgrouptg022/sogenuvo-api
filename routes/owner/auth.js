const express = require("express")
const { 
    login,
} = require("../../controllers/owner/auth")

const router = express.Router()

router.post("/login", login)

module.exports = router
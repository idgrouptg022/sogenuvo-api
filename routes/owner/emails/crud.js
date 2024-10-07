const express = require("express")
const { 
    create, 
    update, 
    remove
} = require("../../../controllers/owner/email/crud")
const validateToken = require("../../../middleware/validateTokenHandler")

const router = express.Router()

router.post("/", validateToken, create)
router.put("/:id", validateToken, update)
router.delete("/:id", validateToken, remove)

module.exports = router
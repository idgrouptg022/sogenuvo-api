const express = require("express")

const { create, read, update, remove, list } = require('../../controllers/administrators/crud')

const validateToken = require("../../middleware/validateTokenHandler")

const router = express.Router()

router.post("/", validateToken, create)
router.get("/", validateToken, list)
router.get("/:id", validateToken, read)
router.put("/:id", validateToken, update)
router.delete("/:id", validateToken, remove)

module.exports = router
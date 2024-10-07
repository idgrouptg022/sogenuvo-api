const express = require("express")
const {
    create,
    read,
    update,
    list,
    remove,
    popular,
} = require("../../controllers/cars/crud")

const {
    search,
} = require("../../controllers/cars/services")


const validateToken = require("../../middleware/validateTokenHandler")

const router = express.Router()

router.post("/", validateToken, create)
router.get("/:id", validateToken, read)
router.put("/:id", validateToken, update)
router.get("/", validateToken, list)
router.delete("/:id", validateToken, remove)
router.get("/popular/list", validateToken, popular)

router.post("/services/search", validateToken, search)

module.exports = router
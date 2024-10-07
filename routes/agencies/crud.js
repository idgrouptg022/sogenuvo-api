const express = require("express")
const { 
    create, read, update, remove, list
} = require("../../controllers/agencies/crud")

const owner = require("../../controllers/owner/crud")
const ownerEmails = require("../../controllers/owner/email/crud")
const services = require("../../controllers/owner/services")

const validateToken = require("../../middleware/validateTokenHandler")

const router = express.Router()

router.post("/", validateToken, create)
router.get("/", validateToken, list)
router.get("/:id", validateToken, read)
router.put("/:id", validateToken, update)
router.delete("/:id", validateToken, remove)

router.post("/:id/owners", validateToken, owner.create)
router.get("/:id/owners/:ownerId", validateToken, owner.read)
router.put("/:id/owners/:ownerId", validateToken, owner.update)
router.delete("/:id/owners/:ownerId", validateToken, owner.remove)
router.get("/:id/owners", validateToken, owner.list)

router.get("/:id/owners/:ownerId/cars", validateToken, services.cars)
router.get("/:id/owners/:ownerId/documents", validateToken, services.documents)

router.post("/:id/owners/:ownerId/emails", validateToken, ownerEmails.create)
router.delete("/:id/owners/:ownerId/emails/:emailId", validateToken, ownerEmails.remove)

module.exports = router


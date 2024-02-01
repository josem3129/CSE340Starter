//Need Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController");
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildClassificationId));

// Route to build inventory by single view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildInventorySingleVIew));

// Route for error 500
router.get("/error", utilities.handleErrors(invController.buildErrorPage));




module.exports = router;
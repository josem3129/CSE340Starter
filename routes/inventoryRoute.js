//Need Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController");
const utilities = require("../utilities/")
const mangeUtilities = require("../utilities/manage-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildClassificationId));

// Route to build inventory by single view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildInventorySingleVIew));

// Route for error 500
router.get("/error", utilities.handleErrors(invController.buildErrorPage));

//inv route for changes 
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

//modify inventory 
router.get("/edit/:inventory_id", utilities.handleErrors(invController.getInventory))

//get delete
router.get("/delete/:inventory_id", utilities.handleErrors(invController.deleteInventoryView))

//modi fy post to SQL
router.post("/update", mangeUtilities.newVehicleRules(), mangeUtilities.checkUpdateData, utilities.handleErrors(invController.updateInventory))

//delete inventory
router.post("/delete", utilities.handleErrors(invController.deleteInventory))


module.exports = router;
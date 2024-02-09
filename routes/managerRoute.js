//Need Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController");
const utilities = require("../utilities/")
const regValidate = require('../utilities/manage-validation')



// Route for vehicle management
router.get("/", utilities.checkAccountType, utilities.handleErrors(invController.vehicleManagement));
//route for new classification
router.get("/addNewClassification", utilities.handleErrors(invController.buildAddClassification));

//route for new Vehicle
router.get("/addNewVehicle", utilities.handleErrors(invController.buildAddVehicle))

// post new classification
router.post("/addNewClassification", regValidate.classificationRules(), regValidate.checkRegClassificationData, utilities.handleErrors(invController.makeClassification));

// post new Vehicle
router.post("/addNewVehicle", regValidate.newVehicleRules(), regValidate.checkRegAddVehicleData, utilities.handleErrors(invController.makeNewVehicle))


module.exports = router;
//Need Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController");
const utilities = require("../utilities/")


// Route for vehicle management
router.get("/", utilities.handleErrors(invController.vehicleManagement));
//route for new classification
router.get("/addNewClassification", utilities.handleErrors(invController.buildAddClassification));

//route for new Vehicle
router.get("/addNewVehicle", utilities.handleErrors(invController.buildAddVehicle))

// post new classification
router.post("/addNewClassification", utilities.handleErrors(invController.makeClassification));

// post new Vehicle
router.post("/addNewVehicle", utilities.handleErrors(invController.makeNewVehicle))


module.exports = router;
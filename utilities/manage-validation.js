const utilities = require("./")
const { body, validationResult} = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {};

/*  **********************************
 *  classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
        //valid classification is require and cannot already exist in DB
        body("inv_make").matches(/^[a-zA-Z]*$/)
        .trim()
        .isAlpha()
        .isLength({min: 1})
        .withMessage('Classification must be alphabetic and no spaces.')
        .custom(async (inv_make) => {
            const classification = await invModel.checkExistingClassification(inv_make)
            if(classification){
                throw new Error("Classification already exist")
            }
        })
    ]
}

/* ******************************
 * Check data from classification 
 * ***************************** */

validate.checkRegClassificationData = async(req, res, next) => {
    const {inv_make} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/addNewClassification", {
            errors,
            title: "Vehicle management",
            nav,
            inv_make
        })
        return
    }
    next()
}


/*  **********************************
 *  Add Vehicle Data Validation Rules
 * ********************************* */

validate.newVehicleRules = () => {
    return [
        body("inv_make").trim().matches(/^[a-zA-Z]+$/).isLength({min:3}).withMessage("Please provide a make of the vehicle."),
        body("inv_model").trim().matches(/^[a-zA-Z]+$/).isLength({min:3}).withMessage("Please provide a model of the vehicle."),
        body("inv_description").trim().matches(/^[a-zA-Z ]*$/).withMessage("Please add a description of the vehicle."),
        body("inv_image").trim().matches(/.*/).withMessage("please add an image."),
        body("inv_thumbnail").trim().matches(/.*/).withMessage("please add an thumbnail image."),
        body("inv_year").trim().matches(/^[0-9]*$/).isLength({min: 4, max: 4}).withMessage("Please add a valid year."),
        body("inv_price").trim().matches(/[+-]?([0-9]*[.])?[0-9]+/).withMessage("Please add a valid price."),
        body("inv_miles").trim().matches(/^[0-9]*$/).withMessage("Please add valid miles."),
        body("inv_color").trim().matches(/^[a-zA-Z]+$/).withMessage("please add the color of the vehicle.")
    ]
}
/* ******************************
 * Check data from vehicle 
 * ***************************** */

validate.checkRegAddVehicleData = async(req, res, next) => {
    const {classification_id, 
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_year,
        inv_price,
        inv_miles,
        inv_color} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let select = await utilities.makeSelect()
        res.render("inventory/addNewVehicle.ejs", {
            errors,
            title: "Vehicle management",
            nav,
            select,
            classification_id, 
            inv_make, 
            inv_model, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_year,
            inv_price,
            inv_miles,
            inv_color
        })
        return
    }
    next()
}


module.exports = validate

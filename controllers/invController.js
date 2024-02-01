const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {title: className + " vehicle", nav, grid, errors: null})

}

/* ***************************
 *  Build inventory single view
 * ************************** */
invCont.buildInventorySingleVIew = async function (req, res, next){
    const inventory_id = req.params.inventoryId
    const data = await invModel.getInventorySingle(inventory_id)
    const div = await utilities.buildSingleVIewDiv(data)
    let nav = await utilities.getNav()
    let vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
    res.render("./inventory/singleVIew", {title: vehicleName, nav, div, errors: null})
}

/* ***************************
 *  error 500
 * ************************** */
invCont.buildErrorPage = async function (req, res, next){
    const inventory_id = req.params.inventoryId
    const data = await invModel.getInventorySingle(inventory_id)
    const div = await utilities.buildSingleVIewDiv(data)
    // let nav = await utilities.getNav()
    let vehicleName = data.inv_make
    res.render("./inventory/singleVIew", {title: vehicleName, nav, div, errors: null})
}

/* ***************************
 *  make classification and add vehicle
 * ************************** */
invCont.vehicleManagement = async function (req, res, next){
    const div = await utilities.vehicleManagementView()
    console.log(div)
    let nav = await utilities.getNav()
    let vehicleName = `Vehicle management`
    res.render("./inventory/vehicleManagement", {title: vehicleName, nav, div, errors: null})
}

/* ****************************************
*  Deliver make classification  view
* *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("inventory/addNewClassification", {title: "Vehicle management",nav,errors: null})
}

/* ****************************************
*  Deliver add Vehicle view
* *************************************** */
invCont.buildAddVehicle = async function (req, res, next) {
    let nav = await utilities.getNav()
    let select = await utilities.makeSelect()
    console.log(select)
    res.render("inventory/addNewVehicle", {title: "Vehicle management",nav,select,errors: null})
}

/* ***************************
 *  make classification 
 * ************************** */
invCont.makeClassification = async function (req, res, next){
    let nav = await utilities.getNav()
    const div = await utilities.vehicleManagementView()
    const { inv_make } = req.body
    console.log(`HERE ______ ${inv_make}`)
    const regResult = await invModel.addClassification(inv_make)
    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you're added ${inv_make}.`
        )
        res.render("inventory/vehicleManagement", {title: "Vehicle management", nav,div, errors: null})
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("inventory/vehicleManagement", {
        title: "Vehicle management",
        nav,
        div
        })
    }
}

/* ***************************
 *  add new vehicle
 * ************************** */
invCont.makeNewVehicle = async function (req, res, next){
    let nav = await utilities.getNav()
    const div = await utilities.vehicleManagementView()
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
    const regResult = await invModel.addVehicle(classification_id,
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail,
        inv_year, 
        inv_price,
        inv_miles,
        inv_color)
    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you're added ${inv_make}.`
        )
        res.render("inventory/vehicleManagement", {title: "Vehicle management", nav,div, errors: null})
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("inventory/addNewVehicle", {
        title: "Vehicle management",
        nav,
        })
    }
}
module.exports = invCont
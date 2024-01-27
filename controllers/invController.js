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
    res.render("./inventory/classification", {title: className + " vehicle", nav, grid})

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
    res.render("./inventory/singleVIew", {title: vehicleName, nav, div})
}

/* ***************************
 *  Build inventory single view
 * ************************** */
invCont.buildErrorPage = async function (req, res, next){
    const inventory_id = req.params.inventoryId
    const data = await invModel.getInventorySingle(inventory_id)
    const div = await utilities.buildSingleVIewDiv(data)
    // let nav = await utilities.getNav()
    let vehicleName = data.inv_make
    res.render("./inventory/singleVIew", {title: vehicleName, nav, div})
}

module.exports = invCont
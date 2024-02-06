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
    // const div = await utilities.vehicleManagementView()
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.makeSelect()
    let vehicleName = `Vehicle management`
    res.render("./inventory/vehicleManagement", {title: vehicleName, nav,classificationSelect, errors: null})
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
    res.render("inventory/addNewVehicle", {title: "Vehicle management",nav,select,errors: null})
}

/* ***************************
 *  make classification 
 * ************************** */
invCont.makeClassification = async function (req, res, next){
    let nav = await utilities.getNav()
    const div = await utilities.vehicleManagementView()
    const { inv_make } = req.body
    const regResult = await invModel.addClassification(inv_make)
    nav = await utilities.getNav()
    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you're added ${inv_make}.`
        )
        res.status(201).render("inventory/vehicleManagement", {title: "Vehicle management", nav,div, errors: null,})
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
    let classificationSelect = await utilities.makeSelect()
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
        res.status(201).render("inventory/vehicleManagement", {title: "Vehicle management", nav,classificationSelect, errors: null})
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).redirect("/inv/")
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
}

/* ****************************************
*  edit inventory view
* *************************************** */
invCont.getInventory = async function (req, res, next) {
    let inventory_id = parseInt(req.params.inventory_id)
    let nav = await utilities.getNav()
    let inventory = await invModel.getInventorySingle(inventory_id)
    let select = await utilities.makeSelect(inventory[0].classification_id)
    let name = `${inventory[0].inv_make} ${inventory[0].inv_model}`
    res.render("./inventory/edit-inventory", {
        title: `Edit ${name}`,
        nav,
        select: select,
        errors: null,
        inv_id: inventory[0].inv_id,
        inv_make: inventory[0].inv_make,
        inv_model: inventory[0].inv_model,
        inv_year: inventory[0].inv_year,
        inv_description: inventory[0].inv_description,
        inv_image: inventory[0].inv_image,
        inv_thumbnail: inventory[0].inv_thumbnail,
        inv_price: inventory[0].inv_price,
        inv_miles: inventory[0].inv_miles,
        inv_color: inventory[0].inv_color,
        classification_id: inventory[0].classification_id
      })
}

/* ***************************
 *  Update vehicle
 * ************************** */
invCont.updateInventory = async function (req, res, next){
    let nav = await utilities.getNav()
    const {classification_id, 
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_year,
        inv_price,
        inv_miles,
        inv_color,
        inv_id} = req.body
    const regResult = await invModel.updateInventory(classification_id,
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail,
        inv_year, 
        inv_price,
        inv_miles,
        inv_color,
        inv_id)
    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you're updated ${inv_make} ${inv_model}.`
        )
        res.redirect("/inv/")
    } else {
        const select = await utilities.makeSelect(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        select: select,
        errors: null,
        classification_id, 
        inv_make, 
        inv_model, 
        inv_description, 
        inv_image, 
        inv_thumbnail, 
        inv_year,
        inv_price,
        inv_miles,
        inv_color,
        inv_id
        })
    }
}

/* ****************************************
*  delete inventory view
* *************************************** */
invCont.deleteInventoryView = async function (req, res, next) {
    let inventory_id = parseInt(req.params.inventory_id)
    let nav = await utilities.getNav()
    let inventory = await invModel.getInventorySingle(inventory_id)
    let name = `${inventory[0].inv_make} ${inventory[0].inv_model}`
    res.render("./inventory/delete-confirm", {
        title: `Delete ${name}`,
        nav,
        errors: null,
        inv_id: inventory[0].inv_id,
        inv_make: inventory[0].inv_make,
        inv_model: inventory[0].inv_model,
        inv_year: inventory[0].inv_year,
        inv_price: inventory[0].inv_price,
      })
}

/* ***************************
 *  Update vehicle
 * ************************** */
invCont.deleteInventory = async function (req, res, next){
    let nav = await utilities.getNav()
    const {inv_id, inv_make, inv_model} = req.body
    const regResult = await invModel.deleteInventory(inv_id)
    if (regResult) {
        req.flash(
            "notice",
            `You deleted ${inv_make} ${inv_model}.`
        )
        res.redirect("/inv/")
    } else {
        const select = await utilities.makeSelect(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the delete failed.")
        res.status(501).render("inventory/delete-confirm", {
        title: "Edit " + itemName,
        nav,
        select: select,
        errors: null,
        inv_id
        })
    }
}
module.exports = invCont
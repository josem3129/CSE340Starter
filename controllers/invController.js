const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildClassificationId = async function (req, res, next) {
    let loggedin = res.locals
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const links = await utilities.linkLoginChange(loggedin)
    const className = data[0].classification_name
    res.render("./inventory/classification", {title: className + " vehicle", nav, links, grid, errors: null})

}

/* ***************************
 *  Build inventory single view
 * ************************** */
invCont.buildInventorySingleVIew = async function (req, res, next){
    let loggedin = res.locals
    let savedInv = 0
    const inventory_id = req.params.inventoryId
    const data = await invModel.getInventorySingle(inventory_id)
    loggedin.inv_id = inventory_id
    const div = await utilities.buildSingleVIewDiv(data)
    let nav = await utilities.getNav()
    const links = await utilities.linkLoginChange(loggedin)
    console.log(loggedin)
    if (loggedin.loggedin) {
        savedInv = await invModel.selectInv(loggedin.accountData.account_id)
    }
    const save = await utilities.checkIfSave(inventory_id, savedInv, loggedin)
    let vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
    res.render("./inventory/singleVIew", {title: vehicleName, nav, links, div, save,  errors: null})
}

/* ***************************
 *  error 500
 * ************************** */
invCont.buildErrorPage = async function (req, res, next){
    let loggedin = res.locals
    const inventory_id = req.params.inventoryId
    const data = await invModel.getInventorySingle(inventory_id)
    const div = await utilities.buildSingleVIewDiv(data)
    // let nav = await utilities.getNav()
    const links = await utilities.linkLoginChange(loggedin)
    let vehicleName = data.inv_make
    res.render("./inventory/singleVIew", {title: vehicleName, nav, links, div, errors: null})
}

/* ***************************
 *  make classification and add vehicle
 * ************************** */
invCont.vehicleManagement = async function (req, res, next){
    let loggedin = res.locals
    console.log(loggedin)
    // const div = await utilities.vehicleManagementView()
    let nav = await utilities.getNav()
    const links = await utilities.linkLoginChange(loggedin)
    let classificationSelect = await utilities.makeSelect()
    let vehicleName = `Vehicle management`
    res.render("./inventory/vehicleManagement", {title: vehicleName, nav, links, classificationSelect, errors: null})
}

/* ****************************************
*  Deliver make classification  view
* *************************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let loggedin = res.locals
    let nav = await utilities.getNav()
    const links = await utilities.linkLoginChange(loggedin)
    res.render("inventory/addNewClassification", {title: "Vehicle management",nav, links, errors: null})
}

/* ****************************************
*  Deliver add Vehicle view
* *************************************** */
invCont.buildAddVehicle = async function (req, res, next) {
    let loggedin = res.locals
    let nav = await utilities.getNav()
    const links = await utilities.linkLoginChange(loggedin)
    let select = await utilities.makeSelect(loggedin)
    res.render("inventory/addNewVehicle", {title: "Vehicle management",nav, links, select,errors: null})
}

/* ***************************
 *  make classification 
 * ************************** */
invCont.makeClassification = async function (req, res, next){
    let loggedin = res.locals
    let nav = await utilities.getNav()
    const links = await utilities.linkLoginChange(loggedin)
    const div = await utilities.vehicleManagementView()
    const { inv_make } = req.body
    const regResult = await invModel.addClassification(inv_make)
    nav = await utilities.getNav()
    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you're added ${inv_make}.`
        )
        res.status(201).render("inventory/vehicleManagement", {title: "Vehicle management", nav, links,div, errors: null,})
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("inventory/vehicleManagement", {
        title: "Vehicle management",
        nav, links,
        div
        })
    }
}

/* ***************************
 *  add new vehicle
 * ************************** */
invCont.makeNewVehicle = async function (req, res, next){
    let loggedin = res.locals
    let nav = await utilities.getNav()
    const links = await utilities.linkLoginChange(loggedin)
    let classificationSelect = await utilities.makeSelect(loggedin)
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
        res.status(201).render("inventory/vehicleManagement", {title: "Vehicle management", nav, links,classificationSelect, errors: null})
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
    let loggedin = res.locals
    let inventory_id = parseInt(req.params.inventory_id)
    let nav = await utilities.getNav()
    const links = await utilities.linkLoginChange(loggedin)
    let inventory = await invModel.getInventorySingle(inventory_id)
    let select = await utilities.makeSelect(inventory[0].classification_id)
    let name = `${inventory[0].inv_make} ${inventory[0].inv_model}`
    res.render("./inventory/edit-inventory", {
        title: `Edit ${name}`,
        nav, links,
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
    let loggedin = res.locals
    let nav = await utilities.getNav()
    const links = await utilities.linkLoginChange(loggedin)
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
        res.status(200).redirect("/inv/")
    } else {
        const select = await utilities.makeSelect(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav, links,
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
    let loggedin = res.locals
    let inventory_id = parseInt(req.params.inventory_id)
    let nav = await utilities.getNav()
    const links = await utilities.linkLoginChange(loggedin)
    let inventory = await invModel.getInventorySingle(inventory_id)
    let name = `${inventory[0].inv_make} ${inventory[0].inv_model}`
    res.render("./inventory/delete-confirm", {
        title: `Delete ${name}`,
        nav, links,
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
    let loggedin = res.locals
    let nav = await utilities.getNav()
    const links = await utilities.linkLoginChange(loggedin)
    const {inv_id, inv_make, inv_model} = req.body
    const regResult = await invModel.deleteInventory(inv_id)
    if (regResult) {
        req.flash(
            "notice",
            `You deleted ${inv_make} ${inv_model}.`
        )
        res.status(200).redirect("/inv/")
    } else {
        const select = await utilities.makeSelect(loggedin)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the delete failed.")
        res.status(501).render("inventory/delete-confirm", {
        title: "Edit " + itemName,
        nav, links,
        select: select,
        errors: null,
        inv_id
        })
    }
}

invCont.addFavorite = async function  (req, res, next) {
    const {inv_id} = req.body
    const account_id = res.locals.accountData.account_id
    const result = invModel.addFavorite(inv_id, account_id)
    if (result) {
        req.flash(
            "notice",
            "saved"
        )
        res.status(200).redirect(`/account/`)
    } else {
        req.flash(
            "notice",
            "Not Saved"
        )
        res.redirect(`inv/detail/${inv_id}`)
    }
}

invCont.removeFavorite = async function (req, res, next){
    const {inv_id} = req.body
    const result = invModel.removeFavorite(res.locals.accountData.account_id, inv_id)
    if (result) {
        req.flash(
            "notice",
            "Removed"
        )
        res.status(200).redirect(`/account/`)
    } else {
        req.flash(
            "notice",
            "Not Removed"
        )
        res.redirect(`inv/detail/${inv_id}`)
    }
}
module.exports = invCont
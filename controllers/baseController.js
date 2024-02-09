const utilities = require("../utilities/")
const baseController = {};

 baseController.buildHome = async function(req, res){
   let loggedin = res.locals
    const nav = await utilities.getNav()
    const links = await utilities.linkLoginChange(loggedin)
    res.render("index", {title: "Home", nav, links,  errors: null})
 }
 

 module.exports = baseController
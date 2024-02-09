const express = require("express");
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// deliver login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// deliver logout view
router.get("/logout", utilities.handleErrors(accountController.buildLout));

//register view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// default route
router.get("/",utilities.checkLogin, utilities.handleErrors(accountController.buildAccount))

//edit profile
router.get("/edit", utilities.handleErrors(accountController.getAccountEdit))

// Process the registration data 
router.post("/register", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// Process the login attempt 
router.post("/login", regValidate.loginRules(),regValidate.checkRegLoginData, utilities.handleErrors(accountController.accountLogin))
 //update account
router.post("/update", regValidate.updateRules(), regValidate.checkRegData, utilities.handleErrors(accountController.updateAccountInfo))
// update password
router.post("/password", regValidate.passwordRules(), regValidate.checkUpdatePassword, utilities.handleErrors(accountController.updatePassword))



module.exports = router;
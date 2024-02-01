const utilities = require("./")
const { body, validationResult} = require("express-validator")
const accountModule = require("../models/account-model")
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
    return [
        //first name is require and must be string 
        body("account_firstname").trim().isLength({min: 1}).withMessage("Please provide a first name."), // on error this message is sent 
        //Last name is require and must be a string
        body("account_firstname").trim().isLength({min: 1}).withMessage("Please provide a first name."), // on error this message is sent 
        //valid email is require and cannot already exist in DB
        body("account_email").trim().isEmail().normalizeEmail().withMessage("A valid email is required.").custom(async (account_email) =>{
            const emailExist = await accountModule.checkExistingEmail(account_email)
            if (emailExist) {
                throw new Error("Email exist. Please log in or use different email")
            }
        }), // on error this message is sent 
        //password is required and must be strong password 
        body("account_password").trim().isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        }).withMessage("Password does not meet requirements") // on error this message is sent 
    ]
}


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */

validate.checkRegData = async(req, res, next) => {
    const {account_firstname, account_lastname, account_email} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "registration",
            nav,
            account_email,
            account_firstname,
            account_lastname
        })
        return
    }
    next()
}

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
    return [
        //valid email is require and cannot already exist in DB
        body("account_email").trim().isEmail().normalizeEmail().withMessage("A valid email is required.").custom(async (account_email) =>{
            const emailExist = await accountModule.checkExistingEmail(account_email)
            if (!emailExist) {
                throw new Error("Email not found")
            }
        }), // on error this message is sent 
        //password is required and must be strong password 
        body("account_password").trim().isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        }).withMessage("Password does not meet requirements") // on error this message is sent 
    ]
}

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */

validate.checkRegLoginData = async(req, res, next) => {
    const {account_email, account_password} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
            account_password
        })
        return
    }
    next()
}
module.exports = validate
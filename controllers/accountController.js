const utilities = require("../utilities/")
const accountModule = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver account view
* *************************************** */
async function buildAccount (req, res, next) {
    let loggedin = res.locals
    let nav = await utilities.getNav()
    const links = await utilities.linkLoginChange(loggedin)
    const greeting = await utilities.accountGreeting(loggedin)
    res.render("account/account", {title: "Login", nav, links, greeting, errors: null})
    
}
/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin (req, res, next) {
    let loggedin = res.locals
    let nav = await utilities.getNav()
    const links = await utilities.linkLoginChange(loggedin)
    console.log({test1 : res.locals.loggedin})
    res.render("account/login", {title: "Login", nav, links, errors: null})
    
}

/* ****************************************
*  Deliver logout
* *************************************** */
async function buildLout (req, res, next) {
    
    if (req.cookies.jwt) {
        const accessToken = jwt.sign(process.env.ACCESS_TOKEN_SECRET, expires = "Thu, 01 Jan 1970 00:00:00 GMT")
        res.cookie("jwt", accessToken, {httpOnly: true})
        return res.redirect("//")
            
    } else {
        next()
    }       
    
    
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let loggedin = res.locals
    let nav = await utilities.getNav()
    const links = await utilities.linkLoginChange(loggedin)
    res.render("account/register", {title: "Register",nav, links,errors: null})
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let loggedin = res.locals
    let nav = await utilities.getNav()
    const links = await utilities.linkLoginChange(loggedin)
    
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    // hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav, links,
            errors: null,
        })
    }
    const regResult = await accountModule.registerAccount(account_firstname,account_lastname,account_email,hashedPassword)
    console.log(`1st ${regResult}`)
    if (regResult) {
        req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
        title: "Login",
        nav, links,
        errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
        title: "Registration",
        nav, links,
        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */

async function accountLogin(req, res){
    let loggedin = res.locals
    let nav = await utilities.getNav()
    const links = await utilities.linkLoginChange(loggedin)
    const {account_email, account_password} = req.body
    const accountData = await accountModule.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav, links,
            errors: null,
            account_email
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000})
            res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000})
            return res.redirect("/account/")
        }
    } catch (error) {
        return new Error('Access Forbidden')
    }
}

//edit profile 
async function getAccountEdit (req, res){
    const locals = res.locals
    console.log(locals.accountData)
    let nav = await utilities.getNav()
    const links = await utilities.linkLoginChange(locals)
    res.render("account/edit-account", {
        title: `Edit Account`,
        nav,
        links,
        errors: null,
        account_firstname: locals.accountData.account_firstname,
        account_lastname: locals.accountData.account_lastname,
        account_email: locals.accountData.account_email,
        account_id: locals.accountData.account_id
    })
}

/* ****************************************
*  Process Update
* *************************************** */
async function updateAccountInfo(req, res) {
    let loggedin = res.locals
    let nav = await utilities.getNav()
    const links = await utilities.linkLoginChange(loggedin)
    
    const { account_firstname, account_lastname, account_email, account_id} = req.body
    // hash the password before storing
    const regResult = await accountModule.UpdateAccount(account_firstname,account_lastname,account_email, account_id)
    // console.log(`1st ${regResult}`)
    if (regResult) {
        res.locals.accountData.account_firstname = account_firstname
        res.locals.accountData.account_lastname = account_lastname
        res.locals.accountData.account_email = account_email
        req.flash(
        "notice",
        `Congratulations, you're Updated your account.`
        )
        res.status(201).redirect("/account/")
    } else {
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).redirect("account/edit-account")
    }
}

/* ****************************************
*  Process Update password
* *************************************** */
async function updatePassword(req, res) {
    const { account_password, account_id} = req.body
    // hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav, links,
            errors: null,
        })
    }
    const regResult = await accountModule.UpdateAccountPassword(hashedPassword, account_id)
    // console.log(`1st ${regResult}`)
    if (regResult) {
        req.flash(
        "notice",
        `Congratulations, you're Updated your password.`
        )
        res.status(201).redirect("/account/")
    } else {
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).redirect("account/edit-account")
    }
}
module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccount, getAccountEdit, updateAccountInfo, buildLout, updatePassword }
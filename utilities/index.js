const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken");
const { cookie } = require("express-validator");
const { Cookie } = require("express-session");
require("dotenv").config()
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = `<button id="hamburgerBtn"><span>&#9776;</span><span>X</span></button>`;
    list += `<ul id="primaryNav">`;
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach(row => {
        list += "<li>"
        list += `<a href = "/inv/type/${row.classification_id}" title = "see our inventory of ${row.classification_name} vehicles"> ${row.classification_name} </a>`
        list += "</li>"
    }); 
    list += "</ul>"
    return list
}

/* ************************
 * Constructs log in links
 ************************** */
Util.linkLoginChange = async function ( locals) {
    
    let link
    if (locals.loggedin == 1) {
       
        link = `<a class="login" href="/account/" title="CLick to log in">Welcome ${locals.accountData.account_firstname}</a>
        <a class="login" href="/account/logout" title="CLick to log in">Logout</a>`
        
    }else{
        link = `<a class="login" href="/account/login" title="CLick to log in">My Account</a>`

    }
    
    return link
    
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data,req, res, next){
    let grid
    if(data.length > 0){
        grid = `<ul id = "inv-display">`
        data.forEach(vehicle => {
            grid += `<li>`
            grid += `<a href ="../../inv/detail/${vehicle.inv_id}" title = "View ${vehicle.inv_make} ${vehicle.inv_model} details"><img src ="${vehicle.inv_thumbnail}" alt = "Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors"></a>`
            grid += `<div class="namePrice">`
            grid += `<hr>`
            grid += `<h2>`
            grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">${vehicle.inv_make} ${vehicle.inv_model} </a>`
            grid += `</h2>`
            grid += `<span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>`
            grid += `</div>`
            grid += `</li>`
        })
        grid += `</ul>`
    }else{
        grid += `<p class="notice">Sorry, no matching vehicles could be found.</p>`
    }
    return grid;
    
}


/* ****************************************
 * single view function
 **************************************** */
Util.buildSingleVIewDiv = async function(data, req, res, next){
    let div
    let vehicle = data[0];
    if (data.length > 0) {
        div = `<div class ="vehicle">`
        div += `<img class ="vehicle" src="${vehicle.inv_image}" alt="${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}">`
        div += `<div class="mainInfo">`
        div += `<div class="information">`
        div += `<p>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</p>`
        div += `<span>Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>`
        div += `<p>Miles: ${vehicle.inv_miles}</p>`
        div += `<p>Color: ${vehicle.inv_color}</p>`
        div += `</div>`
        div += `<div class="information2">`
        div += `<h2>Description:</h2>`
        div += `<p> ${vehicle.inv_description}</p>`
        div += `</div>`
        div += `</div>`
        div += `</div>`
    }else{
        div = `<p class="notice"> Sorry, no matching vehicles could be found.</p>`
    }
    return div;
}

/* ****************************************
 * single view save function
 **************************************** */
Util.checkIfSave = async function(inv_id, data, locals, req, res, next){
    let div = `<form method="post" action="/inv/addFavorite">
    <input type="submit" value="save" class="submitBtn">
    `
    
    console.log(typeof data)
    if (locals.loggedin) {
        
        data.rows.forEach( itemId => {
            if (inv_id == itemId.inv_id) {
                return div = `<form method="post" action="/inv/removeFavorite">
                <input type="submit" value="Remove" class="submitBtn">
                `
            }
            
        })

        return div;
        
    }
    return div
}
/* ****************************************
 * Make classification and new vehicle
 **************************************** */
Util.vehicleManagementView = async function( req, res, next){
   return `
   <div class = "links">
     <a href="/inv/addNewClassification">Add New Classification</a>
     <a href="/inv/addNewVehicle">Add New Vehicle</a>
     <h2>Manage Inventory</h2>
     <p> select a classification from the list to see the items belonging to the classification.</p>
    </div>`
}

/* ************************
 * Constructs selection list
 ************************** */
Util.makeSelect = async function (classification_id) {
    let data = await invModel.getClassifications()
    let select = `<select name="classification_id" id="classificationList"> `;
    data.rows.forEach(row => {
        if (classification_id == row.classification_id) {
            select += `<option selected value="${row.classification_id}">`
            select += `${row.classification_name}`
            select += `</option>`
        }
        select += `<option value="${row.classification_id}">`
        select += `${row.classification_name}`
        select += `</option>`
        console.log(row.classification_id, classification_id)
    }); 
    select += "</select>"
    return select
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
            req.cookies.jwt,
            process.env.ACCESS_TOKEN_SECRET,
            function(err, accountData)  {
                if (err) {
                    req.flash("please login")
                    res.clearCookie("jwt")
                    return res.redirect("/account/login")
                }
                console.log(`IT WORKED!!!!!`)
                res.locals.accountData = accountData
                res.locals.loggedin = 1
                next()
            }
        )
            
    } else {
        next()
    }
}
    
/* ****************************************
*  Check Login
* ************************************ */
Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
        // console.log(res.locals.accountData)
        next()
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

/* ****************************************
*  Check Login
* ************************************ */
Util.checkAccountType = (req, res, next) => {

    let type = res.locals.accountData
    if (res.locals.loggedin) {

        if (type.account_type == "Employee" || type.account_type == "Admin") {
            console.log("Access Granted")
            next()
        }
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}

Util.accountGreeting = async function ( info ) {
    
    let greeting
    if (info.accountData.account_type == "Admin") {
       
        greeting = `<h2>Welcome ${info.accountData.account_firstname}</h2>
        <h3>Inventory Management</h3>
        <p><a href="/inv/">Manage Inventory</a></p>
        <a href="/account/edit">Update Info</a>
        <a href="/account/favorites"> Favorites </a>`
        
    }else if (info.accountData.account_type == "Employee"){
        
        greeting = `<h2>Welcome ${info.accountData.account_firstname}</h2>
        <h3>Inventory Management</h3>
        <p><a href="/inv/">Manage Inventory</a></p>
        <a href="/account/edit">Update Info</a>
        <a href="/account/favorites"> Favorites </a>`


    }else{
        greeting = `<h2>Welcome ${info.accountData.account_firstname}</h2>
        <a href="/account/edit">Update Info</a>
        <a href="/account/favorites"> Favorites </a>`
    }
    
    return greeting

    
}


/* ****************************************
    * Middleware For Handling Errors
    * Wrap other function in this for 
    * General Error Handling
    **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
module.exports = Util
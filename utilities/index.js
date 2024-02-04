const invModel = require("../models/inventory-model")
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach(row => {
        list += "<li>"
        list += `<a href = "/inv/type/${row.classification_id}" title = "see our inventory of ${row.classification_name} vehicles"> ${row.classification_name} </a>`
        list += "</li>"
    }); 
    list += "</ul>"
    return list
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
        div = `<div id="vehicle">`
        div += `<img id="vehicle" src="${vehicle.inv_image}" alt="${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}">`
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
 * Make classification and new vehicle
 **************************************** */
Util.vehicleManagementView = async function(data, req, res, next){
   return `
   <div class = "links">
     <a href="/inv/addNewClassification">Add New Classification</a>
     <a href="/inv/addNewVehicle">Add New Vehicle</a>
    </div>`
}

/* ************************
 * Constructs selection list
 ************************** */
Util.makeSelect = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let select = `<select name="classification_id" id="classId" value="<%= locals.classification_ide %>">`;
    data.rows.forEach(row => {
        select += `<option value="${row.classification_id}">`
        select += `${row.classification_name}`
        select += `</option>`
    }); 
    select += "</select>"
    return select
}
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util
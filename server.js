/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session")
const pool = require("./database")
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const invController = require("./controllers/invController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")
const { render } = require("ejs")

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true, pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId'
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next();
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true})) //for parsing applications

/* ***********************
* View Engine and template
*************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") //not at view roots



/* ***********************
* Routes
*************************/
app.use(static)
//index rout
app.get("/", utilities.handleErrors(baseController.buildHome))

//account route
app.use("/account", accountRoute)
// Inventory routes 
app.use("/inv", inventoryRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async(err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`error at: "${req.originalUrl}": ${err.message}`)
  if (err.status === 404) {
    message = err.message
  }else{
    message = `<div>
    <img src="data:image/jpeg;base64,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" alt="cat hanging ">
    <h2> Error- 500</h1>
    <p> Oh no! There was a crash. Maybe try a different route? </p>
    </div>`
  }
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
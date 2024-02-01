const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id){
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error(`getInventoryByClassificationId error ${error}`)
    }
}

/* ***************************
 *  Get all inventory item inventoryId
 * ************************** */
async function getInventorySingle(inventoryId){
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory WHERE inv_id = ${inventoryId};`
        )
        return data.rows
    } catch (error) {
        console.error(`buildInventorySingleView error ${error}`)
    
    }
}

/* *****************************
*   add classification to DB
* *************************** */
async function addClassification (inv_make){
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        return await pool.query(sql, [inv_make])
    } catch (error) {
        return error.message
    }
}

/* *****************************
*   add vehicle to DB
* *************************** */
async function addVehicle (classification_id,
    inv_make, 
    inv_model, 
    inv_description, 
    inv_image, 
    inv_thumbnail,
    inv_year, 
    inv_price,
    inv_miles,
    inv_color){
    try {
        console.log(classification_id,
            inv_make, 
            inv_model, 
            inv_description, 
            inv_image, 
            inv_thumbnail,
            inv_year, 
            inv_price,
            inv_miles,
            inv_color)
        const sql = "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_year, inv_price, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
        return await pool.query(sql, [classification_id,
            inv_make, 
            inv_model, 
            inv_description, 
            inv_image, 
            inv_thumbnail,
            inv_year, 
            inv_price,
            inv_miles,
            inv_color])
    } catch (error) {
        return error.message
    }
}
module.exports = {getClassifications, getInventoryByClassificationId,getInventorySingle, addClassification, addVehicle};
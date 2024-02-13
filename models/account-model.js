const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount (account_firstname, account_lastname, account_email, account_password){
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
        return error.message
    }
}

/* *****************************
*   update account
* *************************** */
async function UpdateAccount (account_firstname, account_lastname, account_email, account_id){
    try {
        const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *"
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
    } catch (error) {
        return error.message
    }
}


/* *****************************
*   update account password
* *************************** */
async function UpdateAccountPassword (account_password, account_id){
    try {
        const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
        return await pool.query(sql, [account_password, account_id])
    } catch (error) {
        return error.message
    }
}


/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
        const sql = "SELECT * FROM account WHERE account_email = $1"
        const email = await pool.query(sql, [account_email])
        console.log(email)
        return email.rowCount
    } catch (error) {
        return error.message
    }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email){
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
            [account_email]
        )
        return result.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}

/* ***************************
 *  Get all inventory items and classification_name by account_id
 * ************************** */
async function getInventoryByClassificationId(account_id){
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
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryBYaccountId(account_id){
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.userfavoriteitem AS c
            ON i.inv_id = c.inv_id
            WHERE c.account_id = $1`,
            [account_id]
        )
        return data.rows
    } catch (error) {
        console.error(`getInventoryByAccountId error ${error}`)
    }
}
module.exports = { registerAccount, checkExistingEmail, getAccountByEmail,UpdateAccount, UpdateAccountPassword, getInventoryBYaccountId};
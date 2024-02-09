'use strict'


 // Get a list of items in inventory based on the classification_id
 let classificationList = document.querySelector("#classificationList")
 classificationList.addEventListener("change", () =>{
    let classification_id = classificationList.value
    console.log(`classification_id is: ${classification_id}`)
    let classIdURL = `/inv/getInventory/${classification_id}`
    fetch(classIdURL)
        .then((response) => {
            if (response.ok) {
                return response.json();                
            }
            throw Error("Network response was not OK");
        })
        .then((data) =>{
            console.log(data);
            buildInventoryList(data); 
        })
        .catch((error) => {
            console.log('There was a problem: ', error.message)
        })
 })

 // Build inventory items into HTML table components and inject into DOM 
 function buildInventoryList(data){
    let inventoryDisplay = document.getElementById("inventoryDisplay");

    //set up the table labels 
    let dataTable = `<thead>
        <tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>
        </thead>`

    // Set up the table body 
    dataTable += `<tbody>`

    data.forEach(element => {
        console.log(`${element.inv_id}, ${element.inv_model}`)
        dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
        dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; 
        dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
    });

    dataTable += `</tbody>`

    // Display the contents in the Inventory Management view 
    
    inventoryDisplay.innerHTML = dataTable;
 }
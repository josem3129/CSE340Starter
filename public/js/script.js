const pswdBtn = document.querySelector("#pswdBtn");
console.log(pswdBtn)

pswdBtn.addEventListener("click", function() {
    console.log("it worked!")
  const pswdInput = document.getElementById("pword");
  const type = pswdInput.getAttribute("type");

  if (type == "password") {
    pswdInput.setAttribute("type", "text");
    pswdBtn.innerHTML = "Hide Password";
  } else {
    pswdInput.setAttribute("type", "password");
    pswdBtn.innerHTML = "Show Password";
  }
});

array.forEach(element => {
  
});
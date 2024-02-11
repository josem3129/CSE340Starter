const x = document.getElementById('hamburgerBtn')

function toggleMenu(){
    document.getElementById("primaryNav").classList.toggle("open");
    document.getElementById("hamburgerBtn").classList.toggle("open");
}
x.onclick = toggleMenu;
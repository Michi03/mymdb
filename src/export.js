var btn = document.createElement("a");
btn.setAttribute("class", "pop-up-menu-list-item-link");
btn.setAttribute("onclick", "getRatings");
btn.innerHTML = "Sync Mymdb";
document.querySelector(".pop-up-menu-list-items").appendChild(btn);

function getRatings(downloads) {
    alert("Function not implemented yet");
}

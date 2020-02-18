let menu = document.querySelector("#imdbHeader").children[1];
let mymdbLink = document.createElement("a");
mymdbLink.href = "/mymdb";
mymdbLink.innerHTML = "<b style='color:#E4CD17'>MyMDB</b>";
menu.appendChild(mymdbLink);

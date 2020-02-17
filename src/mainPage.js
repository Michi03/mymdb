let menu = document.querySelector("#navUserMenu-contents");
let mymdbLink = menu.children[0].children[2].cloneNode(true);
mymdbLink.href = "/mymdb";
mymdbLink.children[0].innerHTML = "<b style='color:#E4CD17'>MyMDB</b>";
menu.appendChild(mymdbLink);

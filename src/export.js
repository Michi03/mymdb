var btn = document.createElement("a");
btn.setAttribute("class", "pop-up-menu-list-item-link");
btn.innerHTML = "Sync Mymdb";
document.querySelector(".pop-up-menu-list-items").appendChild(btn);
var msg = ["Last warning: Press it again and you'll regret it!", "I am not kidding. Stop pressing the button!", "This button doesn't do anything yet. Please do not press it again", "This button doesn't do anything yet. Please do not press it again"];

function getRatings(e) {
    e.preventDefault();
    alert(msg.pop());
    if (msg.length === 0)
    {
        btn.setAttribute("href","http://goatse.info/");
        btn.removeEventListener("click", getRatings);
    }
}

btn.addEventListener("click", getRatings, false);

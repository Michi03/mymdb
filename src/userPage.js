// make all the necessary changes
document.head.innerHTML ='<meta charset="utf-8"><title>MyMDB User Page</title><link rel="icon" type="image/png" href="https://raw.githubusercontent.com/Michi03/mymdb/master/src/icon.png" /><style>body{font-family:Gothic,sans-serif;background-color:#CCC;}header{background-color:#111;display:flex;width:100%;justify-content:space-between;}a{text-decoration:none;}td{padding:1em;}tr{display:block;width:90%;}.inline{display:inline;}.container{display.flex;justify-content:center;width:75%;margin-left:12.5%;background-color:#FFF;}#mymdbIcon{font-family:Arial,Helvetica,sans-serif;display:inline-block;padding:0.2em;background-color:#E4CD17;color:#000;margin:25% 1em;border-radius:10px;cursor:pointer;}#headerText{color:#E4CD17;}#search{border-radius:20px;display:inline-block;margin:1.5em;}#stars{color:#FFF;cursor:pointer;}#filterDiv{width:10%}#imdbLink{padding:0;color:#E4CD17;font-family:Gothic,sans-serif;}</style>';
document.body.removeChild(document.body.children[0]);
let header = document.createElement("header");
header.innerHTML = '<div><div id="mymdbIcon"><h2 class="inline">MyMDB</h2></div></a><a href="/"><h2 id="imdbLink" class="inline">IMDB</h2></a></div><h1 class="inline" id="headerText">Your MyMDB Ratings</h1><div><input type="text" id="search" placeholder="Filter Directors"><div id="stars"><h1 class="inline">&#9734;</h1><h1 class="inline">&#9734;</h1><h1 class="inline">&#9734;</h1><h1 class="inline">&#9734;</h1><h1 class="inline">&#9734;</h1><h1 class="inline">&#9734;</h1><h1 class="inline">&#9734;</h1><h1 class="inline">&#9734;</h1><h1 class="inline">&#9734;</h1><h1 class="inline">&#9734;</h1></div></div>';
document.body.appendChild(header);
let container = document.createElement("div");
container.classList.add("container");
container.innerHTML = '<table id="dirList"></table>';
document.body.appendChild(container);
const list = document.querySelector("#dirList");
browser.storage.sync.get("username", gotUsername);
document.querySelector("#search").addEventListener("change", filter, false);
document.querySelector("#mymdbIcon").addEventListener("click", openLink, false);
reset();
addStars();

function gotUsername(data){
    // change heading and title if username is known
    let uName = data["username"];
    if (typeof uName !== "undefined" && uName.length > 0)
    {
        document.title = "MyMDB - " + uName;
        document.querySelector("#headerText").innerHTML = uName + "'s Ratings";
    }
}

function gotMovies(data) {
    if (typeof data !== "object" || data === null || Object.keys(data).length < 1)
    {
        list.innerHTML = "<tr><td><h2>No movies rated, yet. Watch my <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>YouTube guide</a> to learn how to use the addons :)</h2></td></tr>";
    }
    else
    {
        let keys = Object.keys(data);
        let directors = [];
        let movies = {};
        keys.forEach(function(key) {
            if (typeof key === "string" && key.length >= 2 && key !== "username")
            {
                if (key[0] === 't' && key[1] === 't')
                    // movie
                    movies[key] = {"title":data[key][0],"rating":data[key][1]};
                else
                    // director
                    directors.push({"name":key,"movies":data[key]});
            }
        });
        directors.forEach(function(dir) {
            // filter null elements
            let hasMovie = false;
            dir['movies'].forEach(function(movie) {
                if (typeof movie !== 'undefined' && movie !== null)
                    hasMovie = true;})
            if (typeof dir === "object" && hasMovie && dir['name'].length > 0)
            {
                let row = document.createElement("tr");
                row.innerHTML = "<td>" + dir["name"] + "</td><td></td>";
                list.appendChild(row);
                dir["movies"].forEach(function(movie) {
                    if (typeof movies[movie] !== 'undefined')
                    {
                        let item = document.createElement("td");
                        item.innerHTML += " <a href='/title/" + movie + "' target='_blank'>" + movies[movie].title + " (" + movies[movie].rating + ")</a>";
                        row.appendChild(item);
                    }
                });
            }
        });
    }
}

function filter() {
    let pattern = document.querySelector("#search").value;
    if (pattern.length < 1)
        if (document.querySelector("#resetBtn") !== null)
            reset();
        else
            return;
    let deleteRow = [];
    for (let n = 0; n < list.children.length; n++)
    {
        let row = list.children[n];
        let match = 0;
        if (typeof row.children[0] === "undefined")
            continue;
	let str = row.children[0].innerText;
        for (let i = 0; i < str.length; i++)
        {
            if (str[i].toLowerCase() === pattern[match].toLowerCase())
                match++;
            else
                match = 0;
            if (match >= pattern.length)
                break;
        }
        if (match < pattern.length)
            deleteRow.push(row);
    }
    for (let i = 0; i < deleteRow.length; i++)
        list.removeChild(deleteRow[i]);
    addReset();
}

function addReset() {
    if (document.querySelector("#resetBtn") !== null)
        return;
    let rstBtn = document.createElement("button");
    rstBtn.setAttribute("id", "resetBtn");
    rstBtn.innerHTML = "Reset Filter";
    list.insertBefore(rstBtn, list.firstChild);
    rstBtn.addEventListener("click", reset);
}

function addStars() {
    let stars = document.querySelector("#stars").children;
    for (let i = 0; i < stars.length; i++)
    {
        stars[i].setAttribute("id",i+1);
        stars[i].addEventListener("click", filterStars, false);
    }
}

function filterStars(e) {
    let rating = e.target.id;
    let stars = document.querySelector("#stars").children;
    let deleteRow = [];
    for (let i = 0; i < rating; i++)
        stars[i].innerHTML = "&#9733;";
    let pattern = "(" + rating + ")";
    if (pattern.length < 1)
        return;
    for (let n = 0; n < list.children.length; n++)
    {
        let row = list.children[n];
        let deleteItem = [];
        for (let j = 1; j < row.children.length; j++)
        {
            let match = 0;
            let str = row.children[j].innerText;
            for (let i = 0; i < str.length; i++)
            {
                if (str[i] === pattern[match])
                    match++;
                else
                    match = 0;
                if (match >= pattern.length)
                    break;
            }
            if (match < pattern.length)
                deleteItem.push(row.children[j]);
        }
        if (deleteItem.length >= row.children.length - 1)
            deleteRow.push(row);
        else
            for (let j = 0; j < deleteItem.length; j++)
                row.removeChild(deleteItem[j]);
    }
    for (let i = 0; i < deleteRow.length; i++)
        list.removeChild(deleteRow[i]);
    addReset();
}

function reset() {
    let btn = document.querySelector("#resetBtn");
    if (btn !== null)
        list.removeChild(btn);
    list.innerHTML = "";
    browser.storage.sync.get(null, gotMovies);
    document.querySelector("#search").value = "";
    let stars = document.querySelector("#stars").children;
    for (let i = 0; i < stars.length; i++)
        stars[i].innerHTML = "&#9734;";
}

function openLink() {
    window.open('https://github.com/Michi03/mymdb');
}

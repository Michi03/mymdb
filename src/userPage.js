// make all the necessary changes
document.head.innerHTML ='<meta charset="utf-8"><title>MyMDB User Page</title><link rel="icon" type="image/png" href="https://raw.githubusercontent.com/Michi03/mymdb/master/src/icon.png" /><style>body{font-family:Gothic,sans-serif;background-color:#CCC;}header{background-color:#111;display:flex;width:100%;justify-content:space-between;}a{text-decoration:none;}.inline{display:inline;}.container{display.flex;justify-content:center;width:75%;margin-left:12.5%;background-color:#FFF;}#mymdbIcon{font-family:Arial,Helvetica,sans-serif;display:inline-block;padding:0.2em;background-color:#E4CD17;color:#000;margin:25%1em;border-radius:10px;}#headerText{color:#E4CD17;}#search{border-radius:20px;width:10%;display:inline-block;margin:1.5em;}</style>';
document.body.removeChild(document.body.children[0]);
let header = document.createElement("header");
header.innerHTML = '<a href="https://imdb.com/"><div id="mymdbIcon"><h2 class="inline">MyMDB</h2></div></a><h1 class="inline" id="headerText">Your MyMDB Ratings</h1><input type="text" id="search" placeholder="Filter"></div>';
document.body.appendChild(header);
let container = document.createElement("div");
container.classList.add("container");
container.innerHTML = '<table id="dirList"></table>';
document.body.appendChild(container);
const list = document.querySelector("#dirList");
browser.storage.sync.get("username", gotUsername);
document.querySelector("#search").addEventListener("change", filter, false);
reset();

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
        list.innerHTML = "<tr><td><h2>No movies rated, yet. Watch my <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>YouTube guide</a> to learn how to use the addons :)";
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
            if (typeof dir === "object" && dir['movies'].length > 0 && dir['name'].length > 0)
            {
                let row = document.createElement("tr");
                row.innerHTML = "<td>" + dir["name"] + "</td><td></td>";
                list.appendChild(row);
                let first = true;
                dir["movies"].forEach(function(movie) {
                    if (!first)
                        row.children[1].innerHTML += ",";
                    first = false;
                    row.children[1].innerHTML += " <a href='https://www.imdb.com/title/" + movie + "'>" + movies[movie].title + " (" + movies[movie].rating + ")</a>";
                });
            }
        });
    }
}

function filter() {
    let pattern = document.querySelector("#search").value;
    if (pattern.length < 1)
        return;
    let result = "";
    for (let n = 0; n < list.children.length; n++)
    {
        let row = list.children[n];
        let match = 0;
        let str = row.innerHTML;
        let insideHtml = true;
        for (let i = 0; i < str.length; i++)
        {
            if (str[i] === '<')
            {
                insideHtml = true;
                continue;
            }
            if (str[i] === '>')
            {
                insideHtml = false;
                continue;
            }
            if (insideHtml)
                continue;
            if (str[i].toLowerCase() === pattern[match].toLowerCase())
                match++;
            else
                match = 0;
            if (match >= pattern.length)
            {
                result += "<tr>" + str + "</tr>";
                break;
            }
        }
    }
    let rstBtn = document.createElement("button");
    rstBtn.setAttribute("id", "resetBtn");
    rstBtn.innerHTML = "Reset Filter";
    list.innerHTML = result;
    list.appendChild(rstBtn);
    rstBtn.addEventListener("click", reset);
}

function reset() {
    browser.storage.sync.get(null, gotMovies);
    document.querySelector("#search").value = "";
    list.removeChild(document.querySelector("#resetBtn"));
}

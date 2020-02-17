var movieCount = 0;
var progress = 0;

function getRatings() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            parseRatings(this.responseText);
        }
    };
    xhttp.open("GET", "https://www.imdb.com/user/" + window.location.pathname.split('/')[2] + "/ratings/export", true);
    xhttp.send();
}

function parseRatings(dataString) {
    let lines = dataString.split(/\r\n|\n/);
    movieCount = lines.length - 2;
    let directors = [];
    let updateDiv = document.createElement("div");
    updateDiv.style = "width:30%;z-index:10;position:absolute;left:35%;top:35%;background-color:rgba(255,255,255,1);box-shadow:2px 2px 4px grey;padding:1em;";
    updateDiv.innerHTML = "<h1>Synching Ratings</h1><p id='progress'></p>";
    document.body.appendChild(updateDiv);
    for (let i = 1; i < lines.length; i++)
    {
        let multDirs = false;
        let fields = lines[i].split(',');
        let title = fields[3]
        // handle decimal points in title
        if (title[0] === "\"")
        {
            title = title.substr(1, title.length-1);
            for (let i = 4; i < fields.length; i++)
            {
                let part = fields[i];
                if (part[part.length-1] === "\"")
                {
                    title += part.substr(0, part.length-1);
                    break;
                }
                else
                    title += part;
            }
        }
        // store id, title and rating
        let movie = {"id": fields[0], "title": title, "rating": fields[1]};
        let store = {};
        store[movie.id] = [movie.title,movie.rating];
        browser.storage.sync.set(store,set);
        // get director(s)
        let curDir = fields[fields.length-1];
        if (curDir[curDir.length-1] === "\"")
        {
            // multiple directors
            curDir = curDir.substr(1,curDir.length-2);
            if (typeof directors[curDir] === "undefined")
                directors[curDir] = [movie.id];
            else
                directors[curDir].push(movie.id);
            for (let i = fields.length - 2; i > 0; i--)
            {
                curDir = fields[i].substr(1,fields[i].length-1);
                if (typeof directors[curDir] === "undefined")
                    directors[curDir] = [movie.id];
                else
                    directors[curDir].push(movie.id);
                if (fields[i][0] === "\"")
                    break;
            }
        }
        else
        {
            if (typeof directors[curDir] === "undefined")
                directors[curDir] = [movie.id];
            else
                directors[curDir].push(movie.id);
        }
    }
    let items = Object.keys(directors);
    progress = items.length;
    items.forEach(function(dir) {
        let store = {};
        store[dir] = directors[dir];
        browser.storage.sync.set(store);
    });
}

function set() {
    progress++;
    document.querySelector("#progress").innerHTML = progress + " / " + movieCount;
    if (progress >= movieCount)
        document.querySelector("#progress").innerHTML = "Done";
}

let btn = document.createElement("a");
btn.setAttribute("class", "pop-up-menu-list-item-link");
btn.setAttribute("id", "syncBtn");
btn.innerHTML = "Sync Mymdb";
document.querySelector(".pop-up-menu-list-items").appendChild(btn);
document.querySelector("#syncBtn").addEventListener("click", getRatings, false);

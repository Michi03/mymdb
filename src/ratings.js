var directors = [];
var movieCounter = 0;
var movieAmount = 0;

function readRatings(e) {
    e.preventDefault();
    let input = document.querySelector("#file").files[0];
    let reader = new FileReader();
    reader.onload = function(evt) {
        parseRatings(reader.result);
    }
    reader.readAsText(input);
}

function parseRatings(dataString) {
    let lines = dataString.split(/\r\n|\n/);
    document.querySelector("#output").innerHTML = "";
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
        // get director(s)
        let curDir = fields[fields.length-1];
        if (curDir[curDir.length-1] === "\"")
        {
            // multiple directors
            multDirs = true;
            curDir = curDir.substr(1,curDir.length-2);
            for (let i = fields.length - 2; i > 0; i--)
            {
                curDir += "," + fields[i].substr(1,fields[i].length-1);
                if (fields[i][0] === "\"")
                    break;
            }
        }
        if (multDirs)
        {
            curDir.split(',').forEach(function(dir) {
                if (typeof directors[dir] === "undefined")
                    directors[dir] = [movie];
                else
                    directors[dir].push(movie);
            });
        }
        else
        {
            if (typeof directors[curDir] === "undefined")
                directors[curDir] = [movie];
            else
                directors[curDir].push(movie);
        }
        // store director with movie array
        let item = document.createElement("li");
        item.innerHTML = curDir + " : " + JSON.stringify(movie);
        document.querySelector("#output").appendChild(item);
        movieAmount++;
    }
}

function storeRatings(e) {
    e.preventDefault();
    let items = Object.keys(directors);
    document.querySelector("#output").innerHTML = "Storing Ratings";
    items.forEach(function(dir) {
        let dirMovies = [];
        directors[dir].forEach(function(movie) {
            dirMovies.push(movie.id);
            let store = {};
            store[movie.id] = [movie.title,movie.rating];
            browser.storage.sync.set(store, progressBar);
        });
        let store = {};
        store[dir] = dirMovies;
        browser.storage.sync.set(store);
    });
}

function getStorage() {
    browser.storage.sync.get(null, outputRating);
}

function progressBar() {
    movieCounter++;
    if (movieCounter % 5 === 0)
        document.querySelector("#output").innerHTML = "Storing Ratings";
    document.querySelector("#output").innerHTML += ".";
    document.querySelector("#progress").innerHTML = "(" + (movieCounter-1) + "/" + (movieAmount-1) + ")";
    if (movieCounter >= movieAmount)
    {
        document.querySelector("#output").innerHTML = "Done";
        document.querySelector("#progress").innerHTML = "";
    }
}

function outputRating(elem) {
    let output = document.createElement("li");
    output.innerHTML = JSON.stringify(elem);
    document.querySelector("#output").appendChild(output);
}

document.addEventListener("DOMContentLoaded", getStorage);
document.querySelector("#file").addEventListener("change", readRatings, false);
document.querySelector("#submit").addEventListener("click", storeRatings, false);

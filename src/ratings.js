const directors = [];

function readRatings(e) {
    e.preventDefault();
    var input = document.querySelector("#file").files[0];
    var reader = new FileReader();
    reader.onload = function(evt) {
        parseRatings(reader.result);
    }
    reader.readAsText(input);
}

function parseRatings(dataString) {
    var lines = dataString.split(/\r\n|\n/);
    document.querySelector("#output").innerHTML = "";
    for (var i = 1; i < lines.length; i++)
    {
        var fields = lines[i].split(',');
        // store id, title and rating
        var movie = {"id": fields[0], "title": fields[3], "rating": fields[1]};
        // get director
        var curDir = fields[fields.length-1];
        if (curDir[curDir.length-1] === "\"")
            curDir = curDir.substr(0,curDir.length-1);
        if (typeof directors[curDir] === "undefined")
            directors[curDir] = [movie];
        else
            directors[curDir].push(movie);
        // store director with movie array
        var item = document.createElement("li");
        item.innerHTML = curDir + ", " + JSON.stringify(movie);
        document.querySelector("#output").appendChild(item);
    }
}

function storeRatings(e) {
    e.preventDefault();
    var items = Object.keys(directors);
    document.querySelector("#output").innerHTML = "";
    items.forEach(function(dir) {
        var dirMovies = [];
        directors[dir].forEach(function(movie) {
            dirMovies.push(movie.id);
            var store = {};
            store[movie.id] = [movie.title,movie.rating];
            browser.storage.sync.set(store, outputRating);
        });
        // MOST INFURIATING CRAP EVER!
        var store = {};
        store[dir] = dirMovies;
        browser.storage.sync.set(store, outputRating);
    });
}

function getStorage() {
    browser.storage.sync.get(null, outputRating);
}

function outputRating(elem) {
    var output = document.createElement("li");
    output.innerHTML = JSON.stringify(elem);
    document.querySelector("#output").appendChild(output);
}

document.addEventListener("DOMContentLoaded", getStorage);
document.querySelector("#file").addEventListener("change", readRatings, false);
document.querySelector("#submit").addEventListener("click", storeRatings, false);
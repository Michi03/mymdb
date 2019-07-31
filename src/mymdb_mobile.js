var directorName = "";
var title = "";
var id = "";
var rating = "0";
var storedRating = "0";
var dirMovies;
var rated = false;

(function() {
    if (window.hasRun === true)
        return;
    window.hasRun = true;
    var dirDiv = document.createElement("div");
    dirDiv.setAttribute("class", "ellipse");
    dirDiv.innerHTML = '<hr><h3>Other movies:</h3><ul id="mymdb"></ul>';
    document.querySelector("#cast-and-crew").appendChild(dirDiv);
    // get movies of director
    directorName = removeSpaces(document.querySelector("h3.inline-block").parentNode.children[1].innerHTML);
    browser.storage.sync.get(directorName, gotDir);
})();

function updateRating() {
    rating = removeSpaces(document.querySelector("#logged-in-user-rating").firstChild.data);
    if (rating !== "Rate" && storedRating !== rating && document.querySelector("#nblogout") !== null)
    {
        storedRating = rating;
        console.log("Change detected!");
        if (rating === "0")
        {
            // delte id from director movie array
            dirMovies.forEach(function(movie,idx) {
                if (movie === id)
                {
                    delete(dirMovies[idx]);
                    var store = {};
                    store[directorName] = dirMovies;
                    browser.storage.sync.set(store, onSet);
                }
            });
        }
        else
        {
            var store = {};
            store[id] = [title,rating];
            browser.storage.sync.set(store, onSet);
            if (typeof dirMovies === "undefined")
            {
                // add movie to rated movies
                dirMovies = [id]
                store = {};
                store[directorName] = dirMovies;
                browser.storage.sync.set(store, onSet);
            }
            else
            {
                for (var i = 0; i < dirMovies.length; i++)
                {
                    movie = dirMovies[i];
                    if (movie === id)
                        return;
                    if (movie !== id && i === dirMovies.length-1)
                    {
                        // add movie to rated movie
                        dirMovies.push(id);
                        store = {};
                        store[directorName] = dirMovies;
                        browser.storage.sync.set(store, onSet);
                    }
                }
            }
        }
    }
}

function gotDir(directorObj) {
    // get current movie
    id = window.location.href.split('/')[4];
    title = removeSpaces(document.querySelector("h1").firstChild.data);
    if (document.querySelector("#logged-in-user-rating") !== null)
    {
        if (document.querySelector("#logged-in-user-rating").firstChild.data === "Rate")
            rating = "0";
        else
            rating = removeSpaces(document.querySelector("#logged-in-user-rating").firstChild.data);
    }
    dirMovies = directorObj[directorName];
    if (typeof dirMovies !== "undefined")
    {
        // get other movies of director
        dirMovies.forEach(function(movie) {
            // movie = {id:[title,rating]}
            browser.storage.sync.get(movie, gotMovie);
        });
    }
    // periodically check if rating changed
    setInterval(updateRating, 1000);
}

function gotMovie(movieObj) {
    if (Object.keys(movieObj).length === 1)
    {
        var curId = Object.keys(movieObj)[0];
        var movie = movieObj[curId];
        if (typeof movie !== "undefined" && typeof movie[0] !== "undefined" && typeof movie[1] !== "undefined")
        {
            if (curId === id)
            {
                storedRating = movie[1];
                rated = true;
            }
            else
            {
                var movieLink = document.createElement("li");
                movieLink.innerHTML = `<a href="/title/${curId}">${movie[0]} (${movie[1]})</a>`;
                document.querySelector("#mymdb").appendChild(movieLink);
            }
        }
    }
}

function onErr(val) {
    console.log("ERROR");
    console.log(val);
}

function onSet(val) {
    console.log("STORED");
    console.log(val);
}

function removeSpaces(string) {
    var res = "";
    var i = 0;
    while (string[i] === ' ' || string[i] === '\n')
        i++;
    for (i; i < string.length;i++)
    {
        if (string[i] !== ' ' && string[i] !== '\n' || (string[i] === ' ' && (i+1 < string.length && string[i+1] !== ' ')))
            res += string[i];
        else if ((string[i] === ' ' || string[i] === '\n') && i+1 === string.length)
            return res;
    }
    return res;
}

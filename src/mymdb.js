var directorName = "";
var title = "";
var id = "";
var rating = "0";
var storedRating = "0";
var dirDiv = {};
var dirMovies;
var rated = false;

(function() {
    if (window.hasRun === true)
        return;
    window.hasRun = true;
    dirDiv = document.createElement("div");
    dirDiv.id = "mymdb";
    dirDiv.setAttribute("class", "credit_summary_item");
    dirDiv.innerHTML = '<h4 class="inline">Other movies:</h4>';
    document.querySelector(".plot_summary").appendChild(dirDiv);
    // get movies of director
    directorName = document.querySelector(".credit_summary_item").children[1].innerHTML;
    browser.storage.sync.get(directorName, gotDir);
})();

function updateRating() {
    rating = document.querySelector(".star-rating").getAttribute("value");
    if (storedRating !== rating && document.querySelector("#nbusername") !== null && document.querySelector(".star-rating-button").classList[1] !== "open")
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
    title = document.querySelector("h1").firstChild.data;
    rating = document.querySelector(".star-rating").getAttribute("value")
    var dirDiv = document.querySelector("#mymdb");
    var inStorage = false;
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
                if (dirDiv.children.length > 1)
                    dirDiv.innerHTML += ", ";
                var movieLink = document.createElement("a");
                movieLink.setAttribute("href", "/title/" + curId);
                movieLink.innerHTML = movie[0] + " (" + movie[1]+ ")";
                dirDiv.appendChild(movieLink);
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

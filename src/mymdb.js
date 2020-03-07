var directorName = "";
var secondDirector = "";
var title = "";
var id = "";
var rating = "0";
var storedRating = "0";
var dirDiv = {};
var dirMovies = {};
var addedMovies = [];

(function() {
    if (window.hasRun === true)
        return;
    window.hasRun = true;
    // get director(s)
    let dirList = document.querySelector(".credit_summary_item").children;
    directorName = dirList[1].innerHTML;
    dirDiv = document.createElement("div");
    dirDiv.id = "mymdb";
    dirDiv.setAttribute("class", "credit_summary_item");
    document.querySelector(".plot_summary").appendChild(dirDiv);
    browser.storage.sync.get(directorName, gotDir);
    if (dirList.length > 2)
    {
        secondDirector = dirList[2].innerHTML;
        browser.storage.sync.get(secondDirector, gotDir);
    }
})();

function appendList(name) {
    let divContent = document.createElement("h4");
    divContent.classList.add("inline");
    divContent.innerHTML = 'Other movies by ' + name + ':';
    dirDiv.appendChild(divContent);
    let movieList = document.createElement("ul");
    movieList.setAttribute("id", name);
    movieList.setAttribute("style", "margin: 0.5em");
    dirDiv.appendChild(movieList);
}

function updateRating() {
    rating = document.querySelector(".star-rating").getAttribute("value");
    if (storedRating !== rating && document.querySelector(".imdb-header__account-toggle--logged-in") !== null && document.querySelector(".star-rating-button").classList[1] !== "open")
    {
        console.log("RATING CHANGED");
        storedRating = rating;
        if (rating === "0" && typeof dirMovies[directorName] !== "undefined")
        {
            // delete id from director movie array
            dirMovies[directorName].forEach(function(movie,idx) {
                if (movie === id)
                {
                    delete(dirMovies[directorName][idx]);
                    let store = {};
                    store[directorName] = dirMovies[directorName];
                    browser.storage.sync.set(store, onSet);
                }
            });
            if (secondDirector !== "")
            {
                dirMovies[secondDirector].forEach(function(movie,idx) {
                    if (movie === id)
                    {   
                        delete(dirMovies[secondDirector][idx]);
                        let store = {};
                        store[secondDirector] = dirMovies[secondDirector];
                        browser.storage.sync.set(store, onSet);
                    }
                });
            }
        }
        else if (rating !== "0")
        {
            let store = {};
            store[id] = [title,rating];
            browser.storage.sync.set(store, onSet);
            for (let i = 0; true; i++)
            {
                movie = dirMovies[directorName][i];
                if (movie === id)
                    return;
                if (movie !== id && i >= dirMovies[directorName].length-1)
                {
                    // add movie to rated movie
                    dirMovies[directorName].push(id);
                    store = {};
                    store[directorName] = dirMovies[directorName];
                    browser.storage.sync.set(store, onSet);
                    break;
                }
            }
            if (secondDirector !== "")
            {
                for (let i = 0; true; i++)
                {
                    movie = dirMovies[secondDirector][i];
                    if (movie === id)
                        return;
                    if (movie !== id && i >= dirMovies[secondDirector].length-1)
                    {
                        // add movie to rated movie
                        dirMovies[secondDirector].push(id);
                        store = {};
                        store[secondDirector] = dirMovies[secondDirector];
                        browser.storage.sync.set(store, onSet);
                        return;
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
    if (document.querySelector(".star-rating") === null)
        rating = "0";
    else
        rating = document.querySelector(".star-rating").getAttribute("value")
    let key = "";
    if (typeof directorObj !== "undefined" && Object.keys(directorObj).length > 0)
    {
        key = Object.keys(directorObj)[0];
        let hasMovie = false;
        directorObj[key].forEach(function(movie) {
            if (typeof movie !== 'undefined' && movie !== null)
                hasMovie = true;
        });
        if (hasMovie && (directorObj[key].length > 1 || directorObj[key][0] !== id))
            appendList(key);
        // add other movies of director
        dirMovies[key] = directorObj[key];
        dirMovies[key].forEach(function(movie) {
            if (typeof movie !== "undefined" && movie !== null)
                browser.storage.sync.get(movie, gotMovie);
        });
    }
    else
    {
        dirMovies[directorName] = [];
        if (secondDirector !== "")
            dirMovies[secondDirector] = [];
    }
    // periodically check if rating changed
    setInterval(updateRating, 1000);
}

function gotMovie(movieObj) {
    if (Object.keys(movieObj).length === 1)
    {
        let curId = Object.keys(movieObj)[0];
        let movie = movieObj[curId];
        if (typeof movie !== "undefined" && typeof movie[0] !== "undefined" && typeof movie[1] !== "undefined")
        {
            if (curId === id)
                storedRating = movie[1];
            else if (!addedMovies.includes(curId))
            {
                Object.keys(dirMovies).forEach(function(dir) {
                    if (dirMovies[dir].includes(curId))
                    {
                        let movieItem = document.createElement("li");
                        movieItem.innerHTML = "<a href='/title/" + curId + "'>" + movie[0] + " (" + movie[1]+ ")";
                        document.getElementById(dir).appendChild(movieItem);
                        addedMovies.push(curId);
                    }
                });
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
}


//    Copyright (c) 2019-2020
//    This file is part of The MyMDb Firefox Web-Extension.
//
//    The MyMDb Firefox Web-Extension is free software: you can redistribute
//    it and/or modify it under the terms of the GNU General Public License
//    as published by the Free Software Foundation, either version 3 of the
//    License, or any later version.
//
//    The MyMDb Firefox Web-Extension is distributed in the hope that it
//    will be useful, but WITHOUT ANY WARRANTY; without even the implied
//    warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See
//    the GNU General Public License for more details.
//
//    You should have received a copy of the GNU General Public License


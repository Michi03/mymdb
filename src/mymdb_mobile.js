var directorName = "";
var hrAdded = false;
var secondDirector = "";
var title = "";
var id = "";
var rating = "0";
var storedRating = "Rate";
var dirDiv = {};
var dirMovies = {};
var addedMovies = [];
var disabled = false;
browser.storage.sync.get("username", gotUsername);

function gotUsername(data) {
    let username = document.querySelectorAll(".imdb-header__account-toggle--logged-in")[1].innerHTML;
    if (username !== data['username'])
    {
        dirDiv.parentElement.removeChild(dirDiv);
        disabled = true;
    }
}


(function() {
    if (window.hasRun === true)
        return;
    window.hasRun = true;
    // get director(s)
    let dirList = removeSpaces(document.querySelector("h3.inline-block").parentNode.children[1].innerHTML).split(',');
    directorName = dirList[0];
    dirDiv = document.createElement("div");
    dirDiv.id = "mymdb";
    dirDiv.setAttribute("class", "btn-full");
    document.querySelector("#cast-and-crew").appendChild(dirDiv);
    browser.storage.sync.get(directorName, gotDir);
    if (dirList.length > 1)
    {
        secondDirector = dirList[1];
        browser.storage.sync.get(secondDirector, gotDir);
    }
})();

function appendList(name) {
    let divContent = document.createElement("h4");
    divContent.classList.add("inline");
    divContent.innerHTML = 'Other movies by ' + name + ':';
    if (!hrAdded) {
        document.querySelector("#cast-and-crew").insertBefore((document.createElement("hr")),dirDiv);
        hrAdded = true;
    }
    dirDiv.appendChild(divContent);
    let movieList = document.createElement("ul");
    movieList.setAttribute("id", name);
    dirDiv.appendChild(movieList);
}

function updateRating() {
    rating = removeSpaces(document.querySelector("#logged-in-user-rating").firstChild.data);
    if (storedRating !== rating && document.querySelector("#nblogout") !== null)
    {
        console.log("RATING CHANGED:",storedRating,rating);
        storedRating = rating;
        if (rating === "Rate" && typeof dirMovies[directorName] !== "undefined")
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
        else if (rating !== "Rate")
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
        else
        {
            print(dirName)
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
            if (typeof movie !== "undefined" && movie !== null && typeof document.getElementById(key)  !== 'undefined' && document.getElementById(key) !== null)
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

function removeSpaces(string) {
    if (typeof string === 'undefined')
        return;
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


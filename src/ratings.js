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
        if (typeof title !== 'undefined' && title[0] === "\"")
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

function refreshRatings(e) {
    e.preventDefault();
    chrome.storage.sync.clear(storeRatings);
    updateUsername();
}

function storeRatings() {
    let items = Object.keys(directors);
    document.querySelector("#output").innerHTML = "Storing Ratings";
    items.forEach(function(dir) {
        let dirMovies = [];
        directors[dir].forEach(function(movie) {
            dirMovies.push(movie.id);
            let store = {};
            store[movie.id] = [movie.title,movie.rating];
            chrome.storage.sync.set(store, progressBar);
        });
        let store = {};
        store[dir] = dirMovies;
        chrome.storage.sync.set(store);
    });
}

function updateUsername(e) {
    if (e)
        e.preventDefault();
    let store = {'username':document.querySelector('#username').value};
    chrome.storage.sync.set(store);
}

function getStorage() {
    chrome.storage.sync.get(null, outputRating);
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

function outputRating(data) {
    let output = [];
    Object.keys(data).forEach(function(key) {
        if (key === 'username')
            document.querySelector("#username").value = data[key]
        else
            output.push(key + ": " + data[key]);
    });
    output.forEach(function(line) {
        let elem = document.createElement("p");
        elem.innerHTML = line;
        document.querySelector('#output').appendChild(elem);
    });
}

document.addEventListener("DOMContentLoaded", getStorage);
document.querySelector("#file").addEventListener("change", readRatings, false);
document.querySelector("#submit").addEventListener("click", refreshRatings, false);
document.querySelector("#usernameBtn").addEventListener("click", updateUsername, false);


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


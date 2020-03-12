var movieCount = 0;
var dirCount = 0;
var progress = 0;
var directors = [];
var updateDiv = {};
var success = false;
chrome.storage.sync.get("username", gotUsername);

function gotUsername(data) {
    let username = document.querySelectorAll(".imdb-header__account-toggle--logged-in")[1].innerHTML;
    if (data['username'] && username !== data['username'])
        document.querySelector("#syncBtn").parentElement.removeChild(document.querySelector("#syncBtn"));
}


function getRatings() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            success = true;
            parseRatings(this.responseText);
            removeAlert(document.body);
        }
        else if (this.status >= 300) {
            if (document.querySelector("#alertDiv") !== null || success)
                return;
            let alertDiv = document.createElement('div');
            alertDiv.setAttribute('id','alertDiv');
            alertDiv.style = "width:80%;position:fixed;top:40%;left:10%;z-index:10;padding:1em;background-color:#FFF;box-shadow: 2px 2px 4px grey";
            alertDiv.innerHTML = "<h2>Oops, somebody's careful</h2><p>This action does not work due to your Firefox settings! Please check out <a style='color:blue' href='https://mymdb.org/#synchronize_without_cookies' target='_blank'>this alternate method</a> of synchronizing your ratings.</p>";
            document.body.addEventListener('click',removeAlert,false);
            document.body.appendChild(alertDiv);
        }
    };
    let url =  "https://" + window.location.host + window.location.pathname + "/export";
    xhttp.open("GET", url, true);
    xhttp.withCredentials = true;
    xhttp.send();
}

function parseRatings(dataString) {
    // add Username to store
    let store = {};
    store["username"] = document.querySelectorAll(".imdb-header__account-toggle--logged-in")[1].innerHTML;
    chrome.storage.sync.set(store);
    let lines = dataString.split(/\r\n|\n/);
    movieCount = lines.length - 2;
    updateDiv = document.createElement("div");
    updateDiv.style = "width:30%;z-index:10;position:absolute;left:35%;top:35%;background-color:rgba(255,255,255,1);box-shadow:2px 2px 4px grey;padding:1em;";
    updateDiv.innerHTML = "<h1>Synching Ratings</h1><p id='progress'></p>";
    document.body.appendChild(updateDiv);
    for (let i = 1; i < lines.length; i++)
    {
        let multDirs = false;
        let fields = lines[i].split(',');
        let title = fields[3]
        if (typeof title === "undefined")
            continue;
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
        chrome.storage.sync.set(store,set);
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
}

function updateDirs() {
    let items = Object.keys(directors);
    items.forEach(function(dir) {
        let store = {};
        store[dir] = directors[dir];
	    dirCount++;
        chrome.storage.sync.set(store,set);
    });
}

function removeDiv() {
    document.body.removeChild(updateDiv);
    document.body.removeEventListener("click", removeDiv);
}

function set() {
    if (progress >= movieCount - 1)
    {
        if (dirCount === 0)
            updateDirs();
        if (dirCount < directors.length - 1)
            document.querySelector("#progress").innerHTML = "Wait until directors are updated";
        else
        {
            document.querySelector("#progress").innerHTML = "Done";
            document.body.addEventListener("click", removeDiv, false);
        }
    }
    else
    {
        progress++;
        document.querySelector("#progress").innerHTML = progress + " / " + movieCount;
    }
}
function removeAlert(e){
    if (e.target.tagName !== 'A')
        document.body.removeChild(document.querySelector('#alertDiv'));
}

let btn = {}
if (document.querySelector(".pop-up-menu-list-items") !== null) {
    btn = document.createElement("a");
    btn.setAttribute("class", "pop-up-menu-list-item-link");
    btn.setAttribute("id", "syncBtn");
    btn.innerHTML = "Sync Mymdb";
    document.querySelector(".pop-up-menu-list-items").appendChild(btn);
}
else { 
    // mobile version
    btn = document.createElement("div");
    btn.setAttribute("class", "pop-up-menu-list-item-link");
    btn.setAttribute("id", "syncBtn");
    btn.innerHTML = "<b>Sync Mymdb</b>";
    document.querySelector(".nav-left").appendChild(btn);
    document.querySelector(".nav-left").style["display"] = "block ruby";
    btn.innerHTML = "<b>Sync Mymdb</b>";
    btn.style["background-color"] = "#EDCA24";
    btn.style["padding"] = "0.5em";
    btn.style["margin"] = "1em";
    btn.style["width"] = "8em";
    btn.style["font-family"] = "Arial, helvetica, sans-serif";
    btn.style["text-align"] = "center";
    btn.style["border-radius"] = "5px";
    btn.style["cursor"] = "pointer";
    if (document.querySelector(".lister-header") !== null && document.querySelector(".lister-header").children[0] !== null)
        document.querySelector(".lister-header").children[0].removeAttribute("href");
}
document.querySelector("#syncBtn").addEventListener("click", getRatings, false);


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

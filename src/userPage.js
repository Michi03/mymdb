// make all the necessary changes
document.head.innerHTML ='<meta charset="utf-8"><title>MyMDb User Page</title><link rel="icon" type="image/png" href="https://mymdb.org/icons/mymdb.png" /><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{font-family:Gothic,sans-serif;background-color:#CCC;}hr{margin:0;padding:0}header{background-color:#111;display:flex;width:100%;justify-content:space-between;}a{text-decoration:none;}li{display:block;padding:.15em 0 0 .15em}h3{margin:0;padding:.5em .2em;}ul{margin:0;padding:0 0 .5em 1.5em;transition:max-height .2s;overflow:hidden;}.dir{cursor:pointer;transition:.4s;padding:1em;background-color:#fff;}.dir:hover{background-color:#F8FA7E;padding-left:2em}.inline{display:inline;}.active{padding-left:2em;}.container{width:75%;margin-left:12.5%;background-color:#FFF;}.appears{display:none;}.dropdown{width:200px;}#dropdown{position:absolute;z-index:5;}#mymdbIcon{font-family:Arial,Helvetica,sans-serif;display:inline-block;padding:0.2em;background-color:#E4CD17;color:#000;margin:25% 1em;border-radius:10px;cursor:pointer;}#headerText{color:#E4CD17;margin-top:35px}#search{border-radius:20px;display:inline-block;margin:1.5em;}#stars{color:#FFF;cursor:pointer;}#filterDiv{width:10%}#burgerMenu{cursor:pointer;padding:0 1em;}#imdbLink{padding:0;color:#E4CD17;font-family:Gothic,sans-serif;}@media screen and (max-width: 870px){.disappears{display:none;}.appears{display:inline-block;}#headerText{margin-top:10px;}header{display:block;}}</style>';
document.body.removeChild(document.body.children[0]);
const header = document.createElement("header");
header.innerHTML = '<div id="burgerMenu" class="appears"><img height=30px width=40px src="https://mymdb.org/imgs/burger.png" /><div id="dropdown" style="display:none;"><div class="dir dropdown" style="transition:0s;">Expand All</div></div></div><div class="disappears"><a href="https://mymdb.org/" target="_blank"><div id="mymdbIcon"><h2 class="inline">MyMDb</h2></div></a><a href="/list/ratings" target="_blank"><h2 id="imdbLink" class="inline">IMDB</h2></a></div><h1 class="inline" id="headerText">Your MyMDb Ratings</h1><div class="disappears"><input type="text" id="search" placeholder="Filter Directors"><div id="stars"><h1 class="inline">&#9734;</h1><h1 class="inline">&#9734;</h1><h1 class="inline">&#9734;</h1><h1 class="inline">&#9734;</h1><h1 class="inline">&#9734;</h1><h1 class="inline">&#9734;</h1><h1 class="inline">&#9734;</h1><h1 class="inline">&#9734;</h1><h1 class="inline">&#9734;</h1><h1 class="inline">&#9734;</h1></div><div id="btnDiv"></div></div>';
document.body.appendChild(header);
const list = document.createElement("div");
list.classList.add("container");
document.body.appendChild(list);
browser.storage.sync.get("username", gotUsername);
document.querySelector("#search").addEventListener("change", filter, false);
reset();
addStars();
var expand = true;
document.querySelector("#burgerMenu").addEventListener("click", openDropdown, false);
document.querySelector("#dropdown").children[0].addEventListener("click", toggleExpanded, false);


function gotUsername(data){
    // change heading and title if username is known
    let uName = data["username"];
    if (typeof uName !== "undefined" && uName.length > 0)
    {
        document.title = "MyMDb - " + uName;
        document.querySelector("#headerText").innerHTML = uName + "'s Ratings";
    }
}

function gotMovies(data) {
    if (typeof data !== "object" || data === null || Object.keys(data).length < 1)
    {
        list.innerHTML = "<h2>No movies rated, yet. Watch my <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>YouTube guide</a> to learn how to use the addons :)</h2>";
    }
    else
    {
        if (!document.querySelector('#expBtn'))
        {
            let expBtn = document.createElement("div");
            expBtn.setAttribute("id", "expBtn");
            expBtn.innerHTML = "Expand All";
            expBtn.setAttribute('style','display:inline-block;padding:0;width:50%;');
            document.querySelector('#btnDiv').appendChild(expBtn);
            expBtn.classList.add('dir');
            expBtn.addEventListener("click", toggleExpanded);
        }
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
            // filter null elements
            let hasMovie = false;
            dir['movies'].forEach(function(movie) {
                if (typeof movie !== 'undefined' && movie !== null)
                    hasMovie = true;})
            if (typeof dir === "object" && hasMovie && dir['name'].length > 0)
            {
                let dirItem = document.createElement("div");
                dirItem.addEventListener("click", toggleHidden, false);
                dirItem.classList.add('dir');
                dirItem.innerHTML = "<h3>" + dir["name"] + "</h3>";
                list.appendChild(dirItem);
                let dirList = document.createElement('ul');
                dirItem.appendChild(dirList);
                dirList.style.maxHeight = '0px';
                dir["movies"].forEach(function(movie) {
                    if (typeof movies[movie] !== 'undefined')
                    {
                        let item = document.createElement("li");
                        item.innerHTML += " <a href='/title/" + movie + "' target='_blank'>" + movies[movie].title + " (" + movies[movie].rating + ")</a>";
                        dirList.appendChild(item);
                    }
                });
                dirItem.parentElement.appendChild(document.createElement('hr'));
            }
        });
    }
}

function filter() {
    let pattern = document.querySelector("#search").value;
    if (pattern.length < 1)
        if (document.querySelector("#resetBtn") !== null)
        {
            reset();
            return;
        }
        else
            return;
    let deleteRow = [];
    for (let n = 0; n < list.children.length; n++)
    {
        let row = list.children[n];
        let match = 0;
        if (typeof row.children[0] === "undefined")
            continue;
	let str = row.children[0].innerText;
        for (let i = 0; i < str.length; i++)
        {
            if (str[i].toLowerCase() === pattern[match].toLowerCase())
                match++;
            else
                match = 0;
            if (match >= pattern.length)
                break;
        }
        if (match < pattern.length)
        {
            deleteRow.push(row);
            deleteRow.push(row.nextSibling);
        }
    }
    for (let i = 0; i < deleteRow.length; i++)
        list.removeChild(deleteRow[i]);
    addReset();
}

function addReset() {
    if (document.querySelector("#resetBtn") !== null)
        return;
    let rstBtn = document.createElement("div");
    rstBtn.setAttribute("id", "resetBtn");
    rstBtn.innerHTML = "Reset Filter";
    rstBtn.setAttribute('style','display:inline-block;padding:0;width:50%;');
    document.querySelector('#btnDiv').appendChild(rstBtn);
    rstBtn.classList.add('dir');
    rstBtn.addEventListener("click", reset);
}

function addStars() {
    let stars = document.querySelector("#stars").children;
    for (let i = 0; i < stars.length; i++)
    {
        stars[i].setAttribute("id",i+1);
        stars[i].addEventListener("click", filterStars, false);
    }
}

function filterStars(e) {
    let rating = e.target.id;
    let stars = document.querySelector("#stars").children;
    let deleteRow = [];
    for (let i = 0; i < rating; i++)
        stars[i].innerHTML = "&#9733;";
    let pattern = "(" + rating + ")";
    if (pattern.length < 1)
        return;
    for (let n = 0; n < list.children.length; n++)
    {
        let row = list.children[n];
        if (row.tagName === 'HR' || row.tagName === 'BUTTON')
            continue;
        let deleteItem = [];
        let movieList = row.children[1].children
        for (let j = 0; j < movieList.length; j++)
        {
            let match = 0;
            let str = movieList[j].innerText;
            for (let i = 0; i < str.length; i++)
            {
                if (str[i] === pattern[match])
                    match++;
                else
                    match = 0;
                if (match >= pattern.length)
                    break;
            }
            if (match < pattern.length)
                deleteItem.push(movieList[j]);
        }
        if (deleteItem.length >= movieList.length)
        {
            deleteRow.push(row);
            deleteRow.push(row.nextSibling);
        }
        else
            for (let j = 0; j < deleteItem.length; j++)
                deleteItem[j].parentElement.removeChild(deleteItem[j]);
    }
    for (let i = 0; i < deleteRow.length; i++)
        deleteRow[i].parentElement.removeChild(deleteRow[i]);
    expand = true;
    toggleExpanded();
    addReset();
}

function reset() {
    let btn = document.querySelector("#resetBtn");
    if (btn !== null)
        btn.parentElement.removeChild(btn);
    list.innerHTML = "";
    browser.storage.sync.get(null, gotMovies);
    document.querySelector("#search").value = "";
    let stars = document.querySelector("#stars").children;
    for (let i = 0; i < stars.length; i++)
        stars[i].innerHTML = "&#9734;";
    if (document.querySelector('#expBtn'))
    {
        expand = false;
        toggleExpanded();
    }
}

function toggleHidden(e) {
    let hiddenElement = e.target;
    while (hiddenElement.tagName !== 'DIV')
        hiddenElement = hiddenElement.parentElement;
    hiddenElement.classList.toggle('active');
    hiddenElement = hiddenElement.children[1];
    if (hiddenElement.style.maxHeight === '0px')
    {
        hiddenElement.style.maxHeight = hiddenElement.scrollHeight + 'px';
    }
    else
    {
        hiddenElement.style.maxHeight = '0px';
    }
}

function toggleExpanded() {
    let lists = document.querySelectorAll('ul');
    lists.forEach(function(elem) {
        if (!expand)
        {
            elem.style.maxHeight = '0px';
        }
        else
        {
            elem.style.maxHeight = elem.scrollHeight + 'px';
        }
    });
    if (expand)
    {
        document.querySelector('#expBtn').innerHTML = 'Collapse All';
        document.querySelector('#dropdown').children[0].innerHTML = 'Collapse All';
    }
    else
    {
        document.querySelector('#expBtn').innerHTML = 'Expand All';
        document.querySelector('#dropdown').children[0].innerHTML = 'Expand All';
    }
    expand = !expand;
}

function openDropdown(e) {
    e.stopPropagation();
    document.querySelector("#dropdown").style.display = 'block';
    document.body.addEventListener("click", closeDropdown, false);
}

function closeDropdown(e) {
    e.stopPropagation();
    document.querySelector("#dropdown").style.display = 'none';
    document.body.removeEventListener("click", closeDropdown);
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


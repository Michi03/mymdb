(function() {
    if (window.hasRun === true)
        return;
    window.hasRun = true;
    var dirDiv = document.createElement("div");
    dirDiv.id = "mymdb";
    dirDiv.setAttribute("class", "credit_summary_item");
    dirDiv.innerHTML = '<h4 class="inline">Other movies:</h4>';
    document.querySelector(".plot_summary").appendChild(dirDiv);
    // get director
    var director = document.querySelector(".credit_summary_item").children[1].innerHTML;
    // add other movies
    var getRatings = browser.storage.local.get(director, function(res) {
        alert("The director object:" + JSON.stringify(res.key));
    });

})();

function addRating(id,title,director) {

    browser.storage.local.set({key: directors[key]});
}

function onGot(director) {
    console.log("SUCCESS");
    console.log(director);
    // get current movie
    var url = window.location.href;
    var id = url.split('/')[4];
    var title = document.querySelector("h1").firstChild.data;
    var rating = document.querySelector(".star-rating-value").innerHTML;
    var dirDiv = document.querySelector("#mymdb");
    var inStorage = false;
    for (var i = 0; i < director.length; i++) {
        var movie = director[i];
        if (movie.id === id)
            continue;
        if (dirDiv.children.length > 1)
            dirDiv.innerHTML += ", ";
        var movieLink = document.createElement("a");
        movieLink.setAttribute("href", "/title/" + movie.id);
        movieLink.innerHTML = movie.title + " (" + movie.rating + ")";
        dirDiv.appendChild(movieLink);
    }
    // if movie is rated store rating
    if (inStorage === false)
    {
        if (rating === 0)
            return;
        director.push({"id":id, "title": title, "rating": rating});
        directorName = document.querySelector(".credit_summary_item").children[1].innerHTML;
        browser.storage.local.set({directorName: director});
    }
}

function onErr(val) {
    console.log("ERROR");
    console.log(val);
}

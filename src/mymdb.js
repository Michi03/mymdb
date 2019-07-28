(function() {
    if (window.hasRun === true)
        return;
    window.hasRun = true;
    var dirDiv = document.createElement("div");
    dirDiv.setAttribute("class", "credit_summary_item");
    dirDiv.innerHTML = '<h4 class="inline">Other movies:</h4>';
    document.querySelector(".plot_summary").appendChild(dirDiv);

    // get array of rated movies
    var rated = parseRatings();
    // get current movie
    var title = window.location.href;
    var id = title.split('/')[4];

    if (typeof id !== "undefined")
    {
        // check if movie has been rated
        console.log(rated.ids[id]);
        if (typeof rated.ids[id] !== "undefined")
        {
            // get information about movie
            /*var httpReq = new XMLHttpRequest();
            // url for omdb request
            var url = "https://www.omdbapi.com/?apikey=6058aaab&i=" + id;
            httpReq.open("GET",url,false);
            httpReq.send(null);
            // object with movie info
            var movieInfo = JSON.parse(httpReq.responseText);*/
            var director = document.querySelector(".credit_summary_item").children[1].innerHTML;

            // add links to other movies from director
            console.log(director);
            console.log(Object.keys(rated.directors));
            if (typeof rated.directors[director] !== "undefined")
            {
                var dirMovies = rated.directors[director];
                console.log(dirMovies);
                dirMovies.forEach(function(dirId,idx) {
                    if (dirId !== id)
                    {
                        if (idx > 0)
                            dirDiv.innerHTML += ", ";
                        var movieLink = document.createElement("a");
                        movieLink.setAttribute("href", "/title/" + dirId);
                        movieLink.innerHTML = rated.ids[dirId];
                        dirDiv.appendChild(movieLink);
                    }
                });
            }
        }
    }
})();
// res = [ movie_object_1 , ... , movie_object_n ]
// movie_object_i = { directors , writers , actors }
// directors / writers / actors = [ person_id_1 , ... , person_id_n ]

function parseRatings() {
    var ids = [];
    var directors = [];
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET",browser.extension.getURL("data/ratings.csv"),false);
    xmlHttp.send(null);
    var text = xmlHttp.responseText;
    var lines = text.split(/\r\n|\n/);
    console.log(lines);
    for (var i = 1; i < lines.length; i++)
    {
        var fields = lines[i].split(',');
        console.log(fields);
        var curId = fields[0];
        ids[curId] = fields[3]; // store id with title
        var curDir = fields[fields.length-1];
        if (typeof directors[curDir] === "undefined")
            directors[curDir] = [curId];
        else
            directors[curDir].push(curId);
    }
    return {"directors": directors, "ids": ids};
}

// movieInfo = { Title , Year , Rated (PG/R/etc) , Released , Runtime , Genre , Director , Writer , Actors , imdbRating , imdbID , Metascore } */

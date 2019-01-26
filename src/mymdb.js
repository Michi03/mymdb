(function() {
    if (window.hasRun)
        return;
    window.hasRun = true;

    // get array of rated movies
    var rated = parseRatings();
    // get current movie
    var title = window.location.href;
    var id = title.split('/')[4];

    if (typeof id !== "undefined")
    {
        // check if movie has been rated
        if (typeof rated[id] !== "undefined")
        {
            // get information about movie
            var httpReq = new XMLHttpRequest();
            // url for omdb request
            var url = "https://www.omdbapi.com/?apikey=BanMePlz&i=" + id;
            httpReq.open("GET",url,false);
            httpReq.send(null);
            // object with movie info
            var movieInfo = JSON.parse(httpReq.responseText);

            // add links to other movies from director

        }
    }
})();

// res = [ movie_object_1 , ... , movie_object_n ]
// movie_object_i = { directors , writers , actors }
// directors / writers / actors = [ person_id_1 , ... , person_id_n ]

function parseRatings() {
    var res = [];
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET",browser.extension.getURL("data/ratings.csv"),false);
    xmlHttp.send(null);
    var text = xmlHttp.responseText;
    var lines = text.split(/\r\n|\n/);
    for (var i = 1; i < lines.length; i++)
    {
        var curId = lines[i].split(',')[0];
        res[curId] = 1;
    }
    return res;
}

// movieInfo = { Title , Year , Rated (PG/R/etc) , Released , Runtime , Genre , Director , Writer , Actors , imdbRating , imdbID , Metascore }

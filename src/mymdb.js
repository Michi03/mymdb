(function() {
    if (window.hasRun)
        return;
    window.hasRun = true;

    var watched = parseRatings();
    var title = window.location.href;
    var id = title.split('/')[4];
    if (typeof id !== "undefined")
    {
        if (typeof watched[id] !== "undefined")
            document.body.style.border = "5px solid green";
        else
            document.body.style.border = "5px solid red";
    }
})();

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

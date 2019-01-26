import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-input/paper-textarea.js";

class InitializationWidget extends PolymerElement {
    static get template() {
        return html`
            <iron-ajax
               id="ajaxUploadRatings"
               url = '127.0.0.1:8549/uploadRatings'
               method="POST"
               params='{}'
               handle-as="text"
               on-response="_finInit"
               on-error="_handleError"
               with-credentials="true"
               >
            </iron-ajax>

            <paper-dialog opened="true" id="initUser" style="width:400px">
                <h4>Upload your Movie List</h4>
                <p>
                    <div style="width:50%;margin:auto">
                        <p id="fileState"></p>
                        <input type="file" accept="text/plain" id="file" on-change="onChangeFile" />
                    </div>
                </p>
                <div class="buttons">
                    <paper-button dialog-confirm raised on-click="_uploadMovies">Upload</paper-button>
                    <paper-button dialog-dismiss>Cancel</paper-button>
                </div>
            </paper-dialog>`
    }

    static get properties() {
        return {
            movieList: {
                type: Array,
                value: []
            },
            validFile: {
                type: Boolean,
                value: false
            },
            omdbKey: {
                type: String,
                value: "6058aaab"
            }
        }
    }

    // parse file and store locally
    onChangeFile(e) {
        this.$.fileState.innerHTML = "Choose ratings file";
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = function() { this.movieList = parseRatings(reader.result) };
        reader.readAsText(file);
    }

    // send post with file content
    _uploadMovies() {
        this.$.ajaxUploadRatings.body = movieList;
        this.$.ajaxUploadRatings.contentType = null;
        this.$.ajaxUploadRatings.generateRequest();
    }

    _finInit(event) {
//        userImage = event.detail.response;
//        document.getElementById('userImage').setAttribute('value', userImage);
//        if(userImage.length>0){
//          document.getElementsByClassName("dropdown-button").css("background-image", "url('"+this.baseUrl+"/fileservice/files/" + userImage + "')");
//          document.querySelector("#preview").style.backgroundImage = "url('"+this.baseUrl+"/fileservice/files/" + userImage + "')";
//        }
    }

    // function for parsing content of ratings.csv file to the movie list array
    // TODO replace identification of people from name to IMDB IDs
    // TODO add some error detection for missing or faulty elements
    function parseRatings(text) {
        this.$.fileState.innerHTML = "Loading input file";
        let lines = text.split('\n');
        var res = [];
        for (let i = 1; i < lines.length; i++)
        {
            let entries = lines[i].split(',');
            let movId = entries[0];
            this.$.fileState.innerHTML = "Process movie " + movId;
            let movObj = { "id" : movId , "userRating" : entries[1]};
            // get information about movie
            let httpReq = new XMLHttpRequest();
            // url for omdb request
            let url = "https://www.omdbapi.com/?apikey=" + this.omdbKey + "&i=" + movId;
            httpReq.open("GET",url,false);
            httpReq.send(null);
            let movInfo = JSON.parse(httpReq.responseText);
            let actors = parsePeople(movInfo["Actors"]);
            movObj["actors"] = actors;
            let writer = parsePeople(movInfo["Writer"]);
            movObj["writer"] = writer;
            let director = parsePeople(movInfo["Director"]);
            movObj["director"] = writer;
            movObj["imdbRating"] = movInfo["imdbRating"];
            // maybe more to come
            res.push(movObj);
        }
        return res;
    }

    // OMDB returns actors,writers,directors,etc as a comma sperated string with space
    function parsePeople(str) {
        var res = [];
        let entries = str.split(',');
        if (entries.length <= 1)
            return entries;
        for (let i = 1; i < entries.length; i++)
            res.push(entries[i].substring(1));
        return res;
    }
}

window.customElements.define("initialization-widget", InitializationWidget);

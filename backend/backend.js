//Bring in environment variables
require('dotenv').config()

const API_KEY = process.env.API_KEY;
const express = require('express');
const app = express();

const fetchJsonOrUndefined = async (url, res) => {
    return fetch(url).then(resp => {

        //If the response was bad - send it along with the error message
        if(!resp.ok) {
            //Pass along whatever the status was
            res.status(resp.status);
            res.send(resp.statusText);

            //Return nothing if we get an error
            return;
        } else {

            //Populate playlist_json
            return resp.json();
        }
    })
};

const toNumberDuration = (duration) => {
    const youtube_duration_re = /^PT((\d*)H)?(([0-5]?[0-9]|60)M)?(([0-5]?[0-9]|60)S)?$/;
    var matches = duration.match(youtube_duration_re);

    var hours = 60 * 60 * parseInt(matches[2]);
    var minutes = 60 * parseInt(matches[4]);
    var seconds = parseInt(matches[6]);

    var total_time = 0;

    if (hours) total_time += hours;
    if (minutes) total_time += minutes;
    if (seconds) total_time += seconds;

    return total_time;
}

app.get("/api", async (req, res) => {
    const playlist_id = req.query.list;

    //TODO - create logic to call this until the maximum calls have been made - or we run out of videos
    const playlist_url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${playlist_id}&key=${API_KEY}`;

    //Only set playlists_json if we get a good response
    var playlist_json = await fetchJsonOrUndefined(playlist_url, res);

    //If we have a playlist_json - turn it into a pomodoro
    if(playlist_json) {
        //Get the items from the JSON response - map them to an array of strings - then join together to make a string of IDs
        const playlist_string = playlist_json['items'].map(item => item['contentDetails']['videoId']).join();

        //Plug this list of IDs into YouTube API and send back to the user
        const videos_url = `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails&key=${API_KEY}&id=${playlist_string}`;
        var videos_json = await fetchJsonOrUndefined(videos_url, res);
        
        

        if(videos_json) {
            var pomodoro = [];

            videos_json["items"].forEach(item => {
                var video_obj = {
                    "ID": item["id"],
                    "Duration": toNumberDuration(item["contentDetails"]["duration"])
                };

                
                pomodoro.push(video_obj);
            });
            
            res.send(pomodoro);
        }
    }
});

app.listen(5000, () => {console.log("Server started on port 5000")});
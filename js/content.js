console.log("hi");

let ytmusicPlayerBar
let webSocket = null;
let currData = {};
let currSong = ``;

let keepAliveIntervalId = null;

let retryTimeoutId = null;
const retryInterval = 5000; // Retry every 5 seconds

function connect(){
    webSocket = new WebSocket('ws://localhost:3030');
    
    webSocket.onopen = (event) => {
        console.log("websocket open");
        keepAlive();
        if (retryTimeoutId) {
            clearTimeout(retryTimeoutId);
            retryTimeoutId = null;
        }
    
    };

    webSocket.onmessage = (event) => {
        console.log(`websocket received message: ${event.data}`);
    };

    webSocket.onclose = (event) => {
        console.log("websocket connection closed");
        webSocket = null;
        if (keepAliveIntervalId) {
            clearInterval(keepAliveIntervalId);
            keepAliveIntervalId = null;
        }
        scheduleReconnect();
    };

    webSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        webSocket.close();
    };
}

function disconnect(){
    if(webSocket == null){
        console.log("disconnecting");
        return;
    }
    webSocket.close();
}


function keepAlive() {
    keepAliveIntervalId = setInterval(
        () => {
            if (webSocket && webSocket.readyState === WebSocket.OPEN) {
                webSocket.send(JSON.stringify(currData));
            } else {
                clearInterval(keepAliveIntervalId);
                keepAliveIntervalId = null;
            }
        },
        1000
    );
}

function scheduleReconnect() {
    if (!retryTimeoutId) {
        retryTimeoutId = setTimeout(() => {
            console.log("Attempting to reconnect...");
            connect();
        }, retryInterval);
    }
}

connect();

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        console.log("Page is visible again");
        if (!webSocket || webSocket.readyState === WebSocket.CLOSED) {
            connect();
        }
    }
});

let waitForPlayerBarInterval = setInterval(() => {

    if (document.querySelector("ytmusic-player-bar")) {
        ytmusicPlayerBar = document.querySelector("ytmusic-player-bar")
        clearInterval(waitForPlayerBarInterval)
        getInfo()
    }

}, 1000)

function getInfo() {
    console.log("hiitsworking")
    let getInfoInterval = setInterval(() => {

        if (ytmusicPlayerBar.querySelector(".title").innerText) {
            let title = ""
            if(ytmusicPlayerBar.querySelector(".title").innerText){
                title = ytmusicPlayerBar.querySelector(".title").innerText
            }
            let artist = ""
            if(ytmusicPlayerBar.querySelectorAll("a")[0].innerText){
                artist = ytmusicPlayerBar.querySelectorAll("a")[0].innerText
            }
            // console.log(ytmusicPlayerBar.querySelectorAll("a")[1].innerText)
            let albumName = ""
            try{
                albumName = ytmusicPlayerBar.querySelectorAll("a")[1].innerText
            }catch(e){
                //console.log("trycatch working?")
            }
            // console.log(ytmusicPlayerBar.querySelector(".image").src)
            let albumCover = ""
            if(ytmusicPlayerBar.querySelector(".image").src != undefined){
                albumCover = ytmusicPlayerBar.querySelector(".image").src
            }
            //console.log(ytmusicPlayerBar.querySelector(".time-info").innerText)
            let time = ""
            if(ytmusicPlayerBar.querySelector(".time-info").innerText != undefined){
                time = ytmusicPlayerBar.querySelector(".time-info").innerText
            }

            let info = {
                song: title,
                artist: artist,
                albumName: albumName,
                albumCover: albumCover,
                time: time
            }
            currSong = info.song;
            currData = info;
            console.log(info)
            //console.log("changes working?")

        } 
        else {
            console.log("Nothing is playing.")
        }

    }, 1000)

}

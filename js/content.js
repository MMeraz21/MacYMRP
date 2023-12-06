

console.log("hi");

let ytmusicPlayerBar

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
            //console.log(ytmusicPlayerBar.querySelector(".title").innerText)
            let title = ""
            if(ytmusicPlayerBar.querySelector(".title").innerText){
                title = ytmusicPlayerBar.querySelector(".title").innerText
            }
            //console.log(ytmusicPlayerBar.querySelectorAll("a")[0].innerText)
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
        
            console.log(info)

        } 
        else {
            console.log("Nothing is playing.")
        }

    }, 1000)

}

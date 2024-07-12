console.log("hi from index.js")
import { WebSocketServer } from "ws";
import { EasyPresence } from "easy-presence";

const client = new EasyPresence("1182852142210494464");
const wss = new WebSocketServer({port:3000});
let currSong = ``;

wss.on('connection', function connection(ws){
    ws.on('error', console.error);

    ws.on('message', function message(data){
        //console.log('received: %s', data);
        currSong = data;
        const message = JSON.parse(data);
        if(!message){
            return;
        }
        console.log(message);
        client.setActivity({
            details: message.song,
            state: "by " + message.artist,
            assets: {
                large_image: message.albumCover//,
                //large_text: message.albumName,
            },
        });
    });
    ws.send('something');
});

//const client = new (require("easy-presence").EasyPresence)("1182067397805486120"); // replace this with your Discord Client ID.
//const client = new EasyPresence("1182067397805486120");



client.on("connected", () => {
    //client.activity.name = "hi";
});

// This will be logged when the presence was sucessfully updated on Discord.
client.on("activityUpdate", (activity) => {
    //activity.name = "nothing!";
    console.log("UPDATED");
    //console.log("Now you're playing", activity ? activity.name : "nothing!")
});

// setInterval(() => {
//     client.setActivity({
//         details: "Youtube Music",
//         state: currSong,
//         assets: {
//             large_image: "https://i.ytimg.com/vi/ATQuWI5Kqeo/sddefault.jpg?s%E2%80%A6EGHgg6AJIWg&rs=AMzJL3mWIJbIlAJ6SC-tZnehx8VjZkSisQ",
//             large_text: "EasyPresence",
//             small_image: "octocat",
//             small_text: "https://github.com/rblxrp/easypresence"
//         },
//         buttons: [
//             {
//                 label: "Visit on GitHub",
//                 url: "https://github.com/rblxrp/easypresence"
//             }
//         ],
//         party: {
//             id: "1234567890",
//             size: [1, 10]
//         },
//         timestamps: { start: new Date() }
//     });
// }, 1000);
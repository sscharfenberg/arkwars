const mongoose = require("mongoose");
const {playerSetup} = require("../../server/cron/game/setup");

const go = async () => {
    try {
        await playerSetup(game);
        process.exit(0);
    } catch(e) {
        console.error(e);
    }
};


const game = {
    "active": true,
    "canEnlist": false,
    "processing": false,
    "turn": 0,
    "turnDuration": 15,
    "created": "2018-04-08T11:12:32.207Z",
    "_id": mongoose.Types.ObjectId("598b652d0404e604046bd35e"),
    "startDate": "2018-04-08T12:56:21.355Z",
    "turnDue": "2018-04-08T13:26:00.486Z",
    "number": 2,
    "__v": 0,
    "dimensions": 40,
    "seededMap": null,
    "maxPlayers": 31
};




/*
 * connect and prepare MongoDB
 */
mongoose.connect("mongodb://localhost:27017/arkwars"); // Connect to our MongoDB
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection
    .on("error", err => {
        console.error(err.message);
    })
    .on("connected", async () => {
        console.log("[cron] Successfully connected to MongoDB.");
        await go();
    });







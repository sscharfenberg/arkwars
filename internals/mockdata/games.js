const moment = require("moment");

module.exports = [
    {
        "number": 1,
        "active": true,
        "processing": false,
        "canEnlist": false,
        "turn": 22,
        "turnDue": moment().add(5, "minutes").toISOString(),
        "turnDuration": 5
    },
    {
        "number": 2,
        "active": true,
        "processing": false,
        "canEnlist": false,
        "turn": 125,
        "turnDue": moment().add(1, "minutes").toISOString(),
        "turnDuration": 15
    },
    {
        "number": 3,
        "active": true,
        "processing": true,
        "canEnlist": false,
        "turn": 9865,
        "turnDue": moment().add(10, "minutes").toISOString(),
        "turnDuration": 10
    },
    {
        "number": 4,
        "active": false,
        "processing": true,
        "canEnlist": true,
        "turn": 0,
        "turnDuration": 30
    }
];



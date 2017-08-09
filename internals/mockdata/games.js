const moment = require("moment");

module.exports = [
    {
        "number": 1,
        "active": true,
        "canEnlist": false,
        "processing": false,
        "turn": 22,
        "turnDue": moment().add(5, "minutes").toISOString(),
        "startDate": "2017-06-19T03:15:05.654Z",
        "turnDuration": 5
    },
    {
        "number": 2,
        "active": true,
        "canEnlist": false,
        "processing": false,
        "turn": 125,
        "turnDue": moment().add(1, "minutes").toISOString(),
        "startDate": "2017-05-02T11:15:05.654Z",
        "turnDuration": 15
    },
    {
        "number": 3,
        "active": true,
        "canEnlist": false,
        "processing": true,
        "turn": 9865,
        "turnDue": moment().add(10, "minutes").toISOString(),
        "startDate": "2017-07-29T21:15:05.654Z",
        "turnDuration": 10
    },
    {
        "number": 4,
        "active": false,
        "canEnlist": true,
        "processing": true,
        "turn": 0,
        "startDate": "2017-12-31T09:00:00.654Z",
        "turnDuration": 30
    }
];



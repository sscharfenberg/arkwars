const moment = require("moment");

module.exports = [
    {
        "number": 1,
        "active": true,
        "processing": false,
        "turn": 22,
        "turnDue": moment().add(5, "minutes").toISOString(),
        "turnDuration": 5
    },
    {
        "number": 2,
        "active": true,
        "processing": false,
        "turn": 125,
        "turnDue": moment().add(1, "minutes").toISOString(),
        "turnDuration": 15
    },
    {
        "number": 3,
        "active": true,
        "processing": true,
        "turn": 9865,
        "turnDue": moment().add(10, "minutes").toISOString(),
        "turnDuration": 10
    }
];



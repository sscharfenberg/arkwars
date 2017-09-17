const moment = require("moment");

module.exports = [
    {
        _id: "598b652d0404e604046bd35b",
        number: 1,
        active: true,
        canEnlist: false,
        processing: false,
        turn: 22,
        turnDuration: 5,
        turnDue: moment().add(5, "minutes").toISOString(),
        //maxPlayers: 20,
        startDate: "2017-06-19T03:15:05.654Z"
    },
    {
        _id : "598b652d0404e604046bd35c",
        number: 2,
        active: true,
        canEnlist: false,
        processing: false,
        turn: 125,
        turnDuration: 15,
        turnDue: moment().add(1, "minutes").toISOString(),
        //maxPlayers: 10,
        startDate: "2017-05-02T11:15:05.654Z"
    },
    {
        _id: "598b652d0404e604046bd35d",
        number: 3,
        active: true,
        canEnlist: false,
        processing: true,
        turn: 9865,
        turnDuration: 10,
        turnDue: moment().add(10, "minutes").toISOString(),
        //maxPlayers: 500,
        startDate: "2017-07-29T21:15:05.654Z"
    },
    {
        _id: "598b652d0404e604046bd35e",
        number: 4,
        active: false,
        canEnlist: true,
        processing: false,
        turn: 0,
        turnDuration: 30,
        //maxPlayers: 50,
        startDate: moment().add(6, "months").toISOString()
    }
];



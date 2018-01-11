const moment = require("moment");

module.exports = [
    {
        _id: "598b652d0404e604046bd35b",
        number: 1,
        active: true,
        canEnlist: false,
        processing: false,
        turn: 22,
        turnDuration: 10,
        dimensions: 10,
        turnDue: moment()
            .add(10, "minutes")
            .toISOString(),
        startDate: moment()
            .subtract(1, "days")
            .toISOString()
    },
    {
        _id: "598b652d0404e604046bd35e",
        number: 2,
        active: false,
        canEnlist: true,
        processing: false,
        turn: 0,
        turnDuration: 15,
        dimensions: 20,
        startDate: moment()
            .add(2, "months")
            .toISOString(),
        turnDue: moment()
            .add(2, "months")
            .toISOString()
    }
];

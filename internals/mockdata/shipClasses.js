const mongoose = require("mongoose");
const names = require("../../server/config/game/names");

const shipClasses = [
    {
        _id: mongoose.Types.ObjectId(),
        game: mongoose.Types.ObjectId("598b652d0404e604046bd35b"),
        player: mongoose.Types.ObjectId("5990c7871e8258089436d748"),
        hullType: "medium",
        name: names.randomShipClassName(),
        ftl: true,
        speed: 4,
        kto: 80,
        modules: ["LASER_SMALL", "LASER_SMALL", "ARMOUR_SMALL"]
    },
    {
        _id: mongoose.Types.ObjectId(),
        game: mongoose.Types.ObjectId("598b652d0404e604046bd35b"),
        player: mongoose.Types.ObjectId("5990c7871e8258089436d748"),
        hullType: "medium",
        name: names.randomShipClassName(),
        ftl: true,
        speed: 6,
        kto: 60,
        modules: ["LASER_SMALL", "LASER_SMALL", "ARMOUR_SMALL"]
    },
    {
        _id: mongoose.Types.ObjectId(),
        game: mongoose.Types.ObjectId("598b652d0404e604046bd35b"),
        player: mongoose.Types.ObjectId("5990c7871e8258089436d748"),
        hullType: "small",
        name: names.randomShipClassName(),
        ftl: true,
        speed: 8,
        kto: 10,
        modules: ["LASER_SMALL", "LASER_SMALL", "ARMOUR_SMALL"]
    },
    {
        _id: mongoose.Types.ObjectId(),
        game: mongoose.Types.ObjectId("598b652d0404e604046bd35b"),
        player: mongoose.Types.ObjectId("5990c7871e8258089436d748"),
        hullType: "small",
        name: names.randomShipClassName(),
        ftl: true,
        speed: 9,
        kto: 20,
        modules: ["LASER_SMALL", "LASER_SMALL", "ARMOUR_SMALL"]
    },
    {
        _id: mongoose.Types.ObjectId(),
        game: mongoose.Types.ObjectId("598b652d0404e604046bd35b"),
        player: mongoose.Types.ObjectId("5990c7871e8258089436d748"),
        hullType: "ark",
        name: names.randomShipClassName(),
        ftl: true,
        speed: 1,
        kto: 25,
        modules: ["COLONY"]
    }
];

module.exports = shipClasses;

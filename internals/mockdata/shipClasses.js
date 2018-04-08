const mongoose = require("mongoose");
const names = require("../../server/config/game/names");

const shipClasses = [
    {
        _id: mongoose.Types.ObjectId(),
        game: mongoose.Types.ObjectId("598b652d0404e604046bd35b"),
        player: mongoose.Types.ObjectId("5990c7871e8258089436d748"),
        hullType: "medium",
        name: names.randomShipClassName(),
        jumpDrive: true,
        speed: 8,
        modules: ["LASER_SMALL", "LASER_SMALL", "ARMOUR_SMALL"]
    },
    {
        _id: mongoose.Types.ObjectId(),
        game: mongoose.Types.ObjectId("598b652d0404e604046bd35b"),
        player: mongoose.Types.ObjectId("5990c7871e8258089436d748"),
        hullType: "medium",
        name: names.randomShipClassName(),
        jumpDrive: true,
        speed: 8,
        modules: ["LASER_SMALL", "LASER_SMALL", "ARMOUR_SMALL"]
    },
    {
        _id: mongoose.Types.ObjectId(),
        game: mongoose.Types.ObjectId("598b652d0404e604046bd35b"),
        player: mongoose.Types.ObjectId("5990c7871e8258089436d748"),
        hullType: "small",
        name: names.randomShipClassName(),
        jumpDrive: true,
        speed: 8,
        modules: ["LASER_SMALL", "LASER_SMALL", "ARMOUR_SMALL"]
    },
    {
        _id: mongoose.Types.ObjectId(),
        game: mongoose.Types.ObjectId("598b652d0404e604046bd35b"),
        player: mongoose.Types.ObjectId("5990c7871e8258089436d748"),
        hullType: "small",
        name: names.randomShipClassName(),
        jumpDrive: true,
        speed: 8,
        modules: ["LASER_SMALL", "LASER_SMALL", "ARMOUR_SMALL"]
    },
    {
        _id: mongoose.Types.ObjectId(),
        game: mongoose.Types.ObjectId("598b652d0404e604046bd35b"),
        player: mongoose.Types.ObjectId("5990c7871e8258089436d748"),
        hullType: "ark",
        name: names.randomShipClassName(),
        jumpDrive: true,
        speed: 8,
        modules: ["COLONY"]
    }
];

module.exports = shipClasses;

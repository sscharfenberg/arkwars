const mongoose = require("mongoose");

const shipyards = [
    {
        _id: mongoose.Types.ObjectId(),
        game: mongoose.Types.ObjectId("598b652d0404e604046bd35b"),
        owner: mongoose.Types.ObjectId("5990c7871e8258089436d748"),
        hullTypes: ["small", "medium"]
    },
    {
        _id: mongoose.Types.ObjectId(),
        game: mongoose.Types.ObjectId("598b652d0404e604046bd35e"),
        owner: mongoose.Types.ObjectId("59904696a7dba10320d3a092"),
        hullTypes: ["small"]
    }
];

module.exports = shipyards;

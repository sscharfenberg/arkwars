/***********************************************************************************************************************
 *
 * userController
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const User = mongoose.model("User");


exports.showEmail = async (req, res) => {
    const user =  await User.findOne({ email: "ashaltiriak@gmail.com" });
    res.render(`email/${req.params.template}`, {
        user,
        session: req.session,
        confirmURL: "http://localhost:7777/auth/confirm/25d2c65a073d40ebe5c34848f5282862b4d73cec" // does not work.
    });
};

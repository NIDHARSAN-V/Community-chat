const UserModel = require("../models/User.js");

const Login = async function(req, res) {
    const { email, password } = req.body;
    console.log(`Email: ${email}, Password: ${password}, Type of Password: ${typeof password}`);
    try {
        const user = await UserModel.findByCredentials(email, password);
        user.status = 'online';
        await user.save();

        res.status(200).send(user);
    } catch (error) {
        console.error(error);
        return res.status(400).send("An error occurred during login.");
    }
}

module.exports = { Login }

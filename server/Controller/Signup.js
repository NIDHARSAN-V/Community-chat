// const UserModel = require("../models/User.js");

// const Signup = async function(req, res) {
//     const { name, email, password, picture } = req.body;
//     console.log(req.body);

//     try {
//         const existingUser = await UserModel.findOne({ email });
//         if (existingUser) {
//             return res.status(409).send("User already exists");
//         }

//         const user = new UserModel({ name, email, password, picture });
//         await user.save();
//         res.status(201).send(user);
//     } catch (error) {
//         console.log(error);

//         let msg;
//         if (error.code === 11000) {
//             msg = "User already exists";
//         } else {
//             msg = error.message;
//         }
//         return res.status(400).send(msg);
//     }
// };

// module.exports = { Signup };



const UserModel = require("../models/User.js");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'user_images',
        allowedFormats: ['jpeg', 'png', 'jpg'],
    },
});

const upload = multer({ storage: storage });

const Signup = async function (req, res) {
    const { name, email, password } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).send("User already exists");
        }

        const user = new UserModel({
            name,
            email,
            password,
            picture: req.file.path, // Cloudinary image URL
        });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.log(error);
        let msg = error.code === 11000 ? "User already exists" : error.message;
        return res.status(400).send(msg);
    }
};

module.exports = { Signup, upload };

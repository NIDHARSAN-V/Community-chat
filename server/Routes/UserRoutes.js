const express = require("express")
const { Signup } = require("../Controller/Signup")
const { Login } = require("../Controller/Login")



const Router = express.Router()

Router.post("/" , Signup)
Router.post("/login" , Login)

module.exports = Router
const userRoutes = require("express").Router();
const { authUser } = require("../middlewares/authmiddleware");
const { getUser, signup, login } = require("../controllers/userController");

userRoutes.get("/", authUser, getUser);
userRoutes.post("/signup", signup);
userRoutes.post("/signin", login);

module.exports = userRoutes;

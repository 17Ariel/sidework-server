const savedRoutes = require("express").Router();
const { authUser } = require("../middlewares/authmiddleware");
const {
  addSavedpost,
  getOnesaved,
  getSaved,
  unSaved,
} = require("../controllers/savedController");

savedRoutes.post("/:id", authUser, addSavedpost);
savedRoutes.get("/", authUser, getSaved);
savedRoutes.get("/:id", authUser, getOnesaved);
savedRoutes.delete("/:id", authUser, unSaved);

module.exports = savedRoutes;

const listingRoutes = require("express").Router();
const { authUser } = require("../middlewares/authmiddleware");
const {
  getAvailablelistings,
  getOnelistings,
  getYourlisting,
  addListings,
  deleteListing,
  updateListing,
  searchListing,
  setnotAvailable,
} = require("../controllers/listingController");

listingRoutes.post("/", authUser, addListings);
listingRoutes.get("/", getAvailablelistings);
listingRoutes.get("/mylisting", authUser, getYourlisting);
listingRoutes.get("/query/:id", authUser, searchListing);
listingRoutes.get("/:id", getOnelistings);
listingRoutes.delete("/:id", authUser, deleteListing);
listingRoutes.put("/status/:id", authUser, setnotAvailable);
listingRoutes.put("/:id", authUser, updateListing);

module.exports = listingRoutes;

const express = require("express");
const port = process.env.PORT || 4000;
const cors = require("cors");
const { errorHandler } = require("./middlewares/errormiddlewares");
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/listings", require("./routes/listingRoutes"));
app.use("/api/saved", require("./routes/savedRoutes"));

app.get("*", (req, res) => {
  res.status(400).json({ msg: "404 status" });
});

app.use(errorHandler);

app.listen(port, () => console.log(`You are running port ${port}`));

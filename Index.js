require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const router = express.Router();
const app = express();

app.use(cors());
app.use(express.json());

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
});

// app.use(bodyParser.json());
// const jsonParser = bodyParser.json();
app.use(express.urlencoded({ extended: true }));

//
mongoose.connect(
  "mongodb+srv://antissocial:Tchol%40ntissocial28%24%24@antissocial-cluster.rxa2m.mongodb.net/rede_anti_social?authSource=admin&replicaSet=atlas-yik2zh-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"
);

const feed = require("./Routers/feed");
const user = require("./Routers/user");
const criticas = require("./Routers/criticas");

app.use("/api/feed", feed);
app.use("/api/user", user);
app.use("/api/criticas", criticas);

app.listen(4322, () => {
  console.log("Server Running...");
});

// include modules to project
const express = require("express");
const app = express();
const cors = require("cors");
var admin = require("firebase-admin");

var serviceAccount = require("./api/firebase-credentials.json");

// initalize firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// lets frontend access backend resources from same origin
app.use(cors());

// middleware to parse HTML requests and store JSON content in req.body
app.use(express.json());

// router for handling reservations
const reservationsRouter = require("./routes/reserve");
app.use("/api/reservations", reservationsRouter);
console.log("reservations router started");

// router for nominatim
const nominatimRouter = require("./routes/search");
app.use("/api/search", nominatimRouter);
console.log("nominatim router started");

// router for handling stored canchas
const canchasRouter = require("./routes/canchas");
app.use("/api/canchas", canchasRouter);
console.log("canchas router started");

// router for handling user settings
const settingsRouter = require("./routes/user");
app.use("/user/settings", settingsRouter);
console.log("settings router started");

// router for handling comments
const commentsRouter = require("./routes/comment");
app.use("/api/comments", commentsRouter);
console.log("settings router started");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));

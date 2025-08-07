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

app.listen(3000, () => {
  console.log("app listening on port 3000");
});

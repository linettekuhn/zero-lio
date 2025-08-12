const express = require("express");
const router = express.Router();
const logger = require("../middleware/logger");
const authUser = require("../middleware/authUser");
const admin = require("firebase-admin");
const database = admin.firestore();

router.use(logger);

router.get("/info", authUser, async (req, res) => {
  try {
    // get settings collection from firestore database
    const settingsRef = database
      .collection("users")
      .doc(req.user.uid)
      .collection("settings")
      .doc("userProfile");

    // get snapshot of settings collection
    const snapshot = await settingsRef.get();
    // return profile
    const profile = snapshot.data();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch saved settings." });
  }
});

router.post("/edit", authUser, async (req, res) => {
  const { profile } = req.body;
  try {
    // get settings collection from firestore database
    const settingsRef = database
      .collection("users")
      .doc(req.user.uid)
      .collection("settings")
      .doc("userProfile");

    // reset the settings
    await settingsRef.set(profile, { merge: false });
    res.status(200).json({ message: "Settings updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to save or delete settings." });
  }
});

module.exports = router;

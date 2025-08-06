const express = require("express");
const router = express.Router();
const logger = require("../middleware/logger");
const authUser = require("../middleware/authUser");
const database = firebase.firestore();

router.use(logger);

router.get("/saved", authUser, async (req, res) => {
  try {
    // get reservations collection from firestore database
    const reservationsRef = database
      .collection("users")
      .doc(req.user.uid)
      .collection("reservations");
    // get snapshot of reservations collection
    const snapshot = await reservationsRef.get();

    // loop through saved reservations and return reservations array in response
    const reservations = [];
    snapshot.forEach((doc) => {
      if (doc.data() && doc.data().reservation) {
        reservations.push(doc.data().reservation);
      }
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch saved reservations." });
  }
});

router.post("/store", authUser, async (req, res) => {
  const { reservationsToUpdate, idsToDelete } = req.body;
  try {
    // get reservations collection from firestore database
    const reservationsRef = database
      .collection("users")
      .doc(req.user.uid)
      .collection("reservations");
    const batch = database.batch();

    // reservations to update
    reservationsToUpdate.forEach((reservation) => {
      // create document ID
      const docId = `reservation-${reservation.date}-${reservation.time}`;
      // search for document in database
      const doc = reservationsRef.doc(docId);
      // update reservation on that doc
      batch.set(doc, { reservation: reservation });
    });

    // reservations to remove
    idsToDelete.forEach((docId) => {
      const doc = reservationsRef.doc(docId);
      batch.delete(doc);
    });

    // commit changes in batch to avoid unnecessary api calls
    await batch.commit();
  } catch (error) {
    res.status(500).json({ error: "Failed to save or delete reservations." });
  }
});

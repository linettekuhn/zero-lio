const express = require("express");
const router = express.Router();
const logger = require("../middleware/logger");
const authUser = require("../middleware/authUser");
const admin = require("firebase-admin");
const database = admin.firestore();

router.use(logger);

router.get("/saved", authUser, async (req, res) => {
  try {
    // get canchas collection from firestore database
    const canchasRef = database
      .collection("users")
      .doc(req.user.uid)
      .collection("canchas");

    // get snapshot of canchas collection
    const snapshot = await canchasRef.get();

    // loop through saved canchas and return canchas array in response
    const canchas = [];
    snapshot.forEach((doc) => {
      if (doc.data() && doc.data().cancha) {
        canchas.push(doc.data().cancha);
      }
    });
    res.json(canchas);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch saved canchas." });
  }
});

router.post("/store", authUser, async (req, res) => {
  const { canchasToUpdate, idsToDelete } = req.body;
  try {
    // get canchas collection from firestore database
    const canchasRef = database
      .collection("users")
      .doc(req.user.uid)
      .collection("canchas");
    const batch = database.batch();

    // canchas to update
    canchasToUpdate.forEach((cancha) => {
      // create document ID
      const docId = `cancha-${cancha.id}`;
      // search for document in database
      const doc = canchasRef.doc(docId);
      // update cancha on that doc
      batch.set(doc, { cancha: cancha });
    });

    // canchas to remove
    idsToDelete.forEach((docId) => {
      const doc = canchasRef.doc(docId);
      batch.delete(doc);
    });

    // commit changes in batch to avoid unnecessary api calls
    await batch.commit();
    res.status(200).json({ message: "Canchas updated successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to save or delete canchas." });
  }
});

module.exports = router;

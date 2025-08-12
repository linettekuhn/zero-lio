const express = require("express");
const router = express.Router();
const logger = require("../middleware/logger");
const authUser = require("../middleware/authUser");
const admin = require("firebase-admin");
const database = admin.firestore();

router.use(logger);

router.post("/post", authUser, async (req, res) => {
  const { comment } = req.body;

  try {
    // get comments collection from firestore database
    const commentsRef = database.collection("comments");

    // create doc id
    const docId = `comment-${comment.id}`;
    // create document in database
    const doc = commentsRef.doc(docId);

    await doc.set(comment, { merge: false });
    res.status(200).json({ message: "Comment successfully posted." });
  } catch (error) {
    res.status(500).json({ error: "Failed to post comment." });
  }
});

router.post("/reply", authUser, async (req, res) => {
  const { reply } = req.body;
  try {
    // get comments collection from firestore database
    const commentsRef = database.collection("comments");

    // create doc id
    const docId = `comment-${comment.id}`;
    // create document in database
    const doc = commentsRef.doc(docId);

    await doc.set({ ...reply, parentId: reply.parentId }, { merge: false });
    res.status(200).json({ message: "Comment successfully posted." });
  } catch (error) {
    res.status(500).json({ error: "Failed to post comment." });
  }
});

module.exports = router;

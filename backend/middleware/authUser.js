const firebase = require("firebase-admin");

// middleware function to authenticate user. throws error if user is unauthorized
async function authUser(req, res, next) {
  const header = req.header.authorization;

  // skip token verification if authorization header is missing/incomplete
  if (!header || !header.startsWith("Bearer ")) {
    req.user = null;
    next();
  } else {
    const idToken = header.split("Bearer ")[1];

    // try to verify token with firebase
    try {
      const decoded = await firebase.auth().verifyIdToken(idToken);
      req.user = decoded;
      next();
    } catch (error) {
      // return response with error if user is unauthenticated
      return res.status(401).json({ error: "Unauthenticated user." });
    }
  }
}

module.exports = authUser;

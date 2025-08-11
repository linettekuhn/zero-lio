const express = require("express");
const router = express.Router();
const logger = require("../middleware/logger");
const rateLimit = require("express-rate-limit");

router.use(logger);

// limit requests to Nominatim max 1/sec per IP
const limiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 1,
  message: { error: "Too many reverse geocode requests" },
});
router.use("/reverse-geocode", limiter);

// reverse geocode route
router.get("/reverse-geocode", async (req, res) => {
  // get latitude and longitude
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res
      .status(400)
      .json({ error: "Missing 'lat' or 'lon' query parameters" });
  }

  try {
    // make api request to nominatim
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=es`,
      {
        headers: { "User-Agent": "ZeroLioApp/1.0 (contact@example.com)" },
        timeout: 10000,
      }
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Error from Nominatim API" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Reverse geocode error:", error);
    res.status(500).json({ error: "Reverse geocoding failed" });
  }
});

module.exports = router;

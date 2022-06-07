const express = require("express");
const router = express.Router();
const artwork = require("../services/artwork");

router.get("/all", async function (req, res, next) {
  try {
    res.json(await artwork.getAllArtwork());
  } catch (err) {
    console.error(`Error while getting artwork collection`, err.message);
    next(err);
  }
});

router.get("/:artworkId", async function (req, res, next) {
  try {
    res.json(await artwork.getArtworkInfo(req.params.artworkId));
  } catch (err) {
    console.error(`Error while getting artwork info`, err.message);
    next(err);
  }
});

module.exports = router;

const express = require("express");
const app = express();
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { uploadFile, getFileStream } = require("./services/s3");

const artworkRouter = require("./routes/artwork");
const db = require("./services/db");
const cors = require("cors");
const artworkService = require("./services/artwork");
const port = process.env.PORT || 8080;

db.initDb();

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

app.use("/artwork", artworkRouter);

app.get("/images/:key", async (req, res) => {
  const key = req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

app.post("/images", upload.single("image"), async (req, res) => {
  const file = req.file;
  const { title, description, lead_image, artwork_id } = req.body;

  const result = await uploadFile(file);
  let dbResult;

  if (lead_image === "true") {
    dbResult = await artworkService.createArtwork({
      title: title,
      url: `/images/${result.Key}`,
    });
  } else {
    dbResult = await artworkService.createImageDetails({
      artwork_id,
      description,
      title,
      url: `/images/${result.Key}`,
    });
  }

  await unlinkFile(file.path);
  res.send(dbResult);
});

//error handling 
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

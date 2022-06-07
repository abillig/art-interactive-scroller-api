const db = require("./db");

async function getImageDetails(artwork_id) {
  const images = await db.query(
    `SELECT artwork_id, header, description, url
    FROM image_details WHERE artwork_id = ${artwork_id}`
  );

  return { images };
}

async function getArtworkInfo(artwork_id) {
  const info = await db.query(
    `SELECT title as description, url FROM artworks WHERE artwork_id = ${artwork_id}`
  );

  return { info: info, images: await getImageDetails(artwork_id) };
}

async function getAllArtwork() {
  const artworkCollection = await db.query(
    `SELECT artwork_id, title, url FROM artworks`
  );

  return { artworkCollection };
}

async function createArtwork({ title, url }) {
  const result = await db.query(
    `INSERT INTO artworks (title, url) VALUES ("${title}", "${url}")`
  );

  let message = "Error storing artwork in db";

  if (result.affectedRows) {
    message = "Artwork stored successfully";
    return result;
  }

  return { message };
}

async function createImageDetails({ artwork_id, title, description, url }) {
  const result = await db.query(
    `INSERT INTO image_details (artwork_id, header, description, url) 
    VALUES ("${artwork_id}", "${title}", "${description}", "${url}")`
  );

  let message = "Error in storing image details in db";

  if (result.affectedRows) {
    message = "image details stored successfully";
  }

  return { message };
}

module.exports = {
  getArtworkInfo,
  getAllArtwork,
  createArtwork,
  createImageDetails,
};

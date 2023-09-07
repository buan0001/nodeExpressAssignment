import fs from "fs/promises";

async function readArtistsFile(res) {
    try {
      const artists = await fs.readFile("../users/artists.json");
      return JSON.parse(artists)
    } catch (err) {
     return res.status(500).json(err)
    }
  }
  
  async function writeArtistsFile(fileToWrite,res) {
    try {
      fs.writeFile("../users/artists.json", JSON.stringify(fileToWrite));
      res.status(200).end()
    } catch (err) {
      res.status(500).end()
    }
  }

  export {writeArtistsFile, readArtistsFile}
import express from "express";
import cors from "cors";
import fs from "fs/promises";

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

async function readArtistsFile() {
  try {
    const artists = await fs.readFile("users/artists.json");
    return JSON.parse(artists);
  } catch (err) {
    return err;
  }
}

async function writeArtistsFile(fileToWrite) {
  try {
    await fs.writeFile("users/artists.json", JSON.stringify(fileToWrite));
    return "Succesful request";
  } catch (err) {
    return err;
  }
}

app.get("/artists", async (req, res) => {
  const artists = await readArtistsFile();
  res.status(200).json(artists);
});

app.get("/artists/:artistId", async (req, res) => {
  const artists = await readArtistsFile();
  if (artists instanceof Error) {
    return res.status(500).json(artists);
  }
  const correctArtist = artists.find((task) => Number(req.params.artistId) == Number(task.id));
  if (!correctArtist) {
    return res.status(404).json("User not found");
  }
  res.status(200).json(correctArtist);
});

app.put("/artists/:artistId", async (req, res) => {
  const artists = await readArtistsFile();
  if (artists instanceof Error) {
    return res.status(500).json(artists);
  }
  const idToLookFor = Number(req.params.artistId);
  let foundArtist = artists.find((artist) => idToLookFor == artist.id);
  if (foundArtist == undefined) {
    return res.status(404).json("Couldn't find an artist with that ID!");
  }
  const listOfArtistsWithoutTheFoundOne = artists.filter((artist) => artist.name != foundArtist.name);
  const body = req.body;
  foundArtist.name = body.name;
  foundArtist.birthdate = body.birthdate;
  foundArtist.activeSince = body.activeSince;
  foundArtist.genres = body.genres;
  foundArtist.labels = body.labels;
  foundArtist.website = body.website;
  foundArtist.image = body.image;
  foundArtist.shortDescription = body.shortDescription;
  foundArtist.id = idToLookFor;

  let stillUniqueUser = true;
  for (const artist of listOfArtistsWithoutTheFoundOne) {
    if (artist.name.toLowerCase() == foundArtist.name.toLowerCase()) {
      stillUniqueUser = false;
      break;
    }
  }
  if (stillUniqueUser) {
    try {
      await writeArtistsFile(artists);
      res.status(200).json(`Succesfully updated artist with ID ${req.params.artistID}`);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(400).json("Cannot update the user to have the given name; it's already taken");
  }
});

app.post("/artists", async (req, res) => {
  const artists = await readArtistsFile();
  if (artists instanceof Error) {
    return res.status(500).json(artists);
  }
  const newArtist = req.body;
  console.log("new artist!:", newArtist);
  newArtist.id = new Date().getTime();
  let uniqueUser = true;
  for (const artist of artists) {
    if (artist.name === newArtist.name || artist.id === newArtist.id) {
      uniqueUser = false;
      break;
    }
  }
  if (uniqueUser) {
    artists.push(newArtist);
    try {
      await writeArtistsFile(artists);
      res.status(200).json(`Succesfully created artist with ID ${newArtist.id}`);
    } catch (err) {
      res.json(err);
    }
  } else {
    res.status(400).json("Artist already exists!");
  }
});

app.delete("/artists/:artistID", async (req, res) => {
  const artists = await readArtistsFile();
  if (artists instanceof Error) {
    return res.status(500).json(artists);
  }
  const filteredList = artists.filter((artist) => artist.id != req.params.artistID);
  if (filteredList.length == artists.length) {
    res.status(400).json("Couldn't find an artist with that ID");
  } else {
    try {
      await writeArtistsFile(filteredList);
      res.status(200).json(`Succesfully deleted artist with ID ${req.params.artistID}`);
    } catch (err) {
      res.json(err);
    }
  }
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

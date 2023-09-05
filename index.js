import express from "express";
import cors from "cors";
import fs from "fs/promises";

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

async function readArtistsFile() {
  const artists = await fs.readFile("users/artists.json");
  return JSON.parse(artists);
}

app.get("/", (req, res) => {
  res.json("teanstkj");
});

app.get("/artists", async (request, response) => {
  response.json(await readArtistsFile());
});

app.get("/artists/:artistId", async (request, response) => {
  const artists = await readArtistsFile();
  const correctartist = artists.find(task => Number(request.params.artistId) == Number(task.id));
  if (!correctartist) {
    return response.status(404).json("User not found");
  }
  response.json(correctartist);
});

app.put("/artists/:artistId", async (req, res) => {
  const artists = await readArtistsFile();
  const idToLookFor = Number(req.params.artistId);
  console.log(idToLookFor);
  const body = req.body;
  let foundArtist = artists.find(artist => idToLookFor == artist.id);
  console.log("FOUND ARTIST:", foundArtist);
  if (foundArtist == undefined) {
    return res.status(404).json("Couldn't find an artist with that ID!");
  }
  foundArtist.name = body.name;
  foundArtist.birthdate = body.birthdate;
  foundArtist.activeSince = body.activeSince;
  foundArtist.genres = body.genres;
  foundArtist.labels = body.labels;
  foundArtist.website = body.website;
  foundArtist.image = body.image;
  foundArtist.shortDescription = body.shortDescription;
  foundArtist.id = idToLookFor;
  try {
    await fs.writeFile("users/artists.json", JSON.stringify(artists));
    res.json(artists);
  } catch {
    return res.status(500).json("Internal server error; couldn't update the artist");
  }
});

app.post("/artists", async (request, response) => {
  const artist = await readArtistsFile;
  const newartist = request.body;
  newartist.id = new Date().getTime();
  artists.push(newartist);
  response.json(artists);
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

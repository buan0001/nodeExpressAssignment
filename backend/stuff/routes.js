import express from "express";
import cors from "cors";

import { getArtist,deleteArtist, getAllArtists,updateArtist,createNewArtist } from "./callbacks.js";

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;


app.get("/artists",getAllArtists);

app.get("/artists/:artistId", getArtist);

app.put("/artists/:artistId", updateArtist);

app.post("/artists", createNewArtist);

app.delete("/artists/:artistID", deleteArtist);

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});


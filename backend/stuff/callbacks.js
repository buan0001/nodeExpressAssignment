import { writeArtistsFile, readArtistsFile } from "./fileHandlers.js";
import fs from "fs/promises";

async function getAllArtists(req, res) {
  const artists = await readArtistsFile(res);
  if (artists instanceof Error) {
    return
  }
  res.status(200).json(artists);
}

async function getArtist(req, res) {
  const artists = await readArtistsFile(res);
  if (artists instanceof Error) {
    return
  }
  const correctArtist = artists.find(task => Number(req.params.artistId) == Number(task.id));
  if (!correctArtist) {
    return res.status(404).json("User not found");
  }
  res.status(200).json(correctArtist);
}

async function updateArtist(req, res) {
  const idToLookFor = Number(req.params.artistId);
  const body = req.body;
  const artists = await readArtistsFile();
  if (artists instanceof Error) {
    return
  }
  const updatedArtistList = updateArtistObject(artists, idToLookFor, body);
  const checkUniqueness = checkForUniqueArtist(updatedArtistList);

  if (checkUniqueness) {
    writeArtistsFile(updatedArtistList[0], res);
  } else {
    console.log("DUPLICATE USER");
    res.status(400).json("Cannot update the user to have the given name; it's already taken");
  }
}

function updateArtistObject(artists, idToLookFor, body) {
    const foundArtist = artists.find(artist => idToLookFor == artist.id);
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
    return [artists,foundArtist]
  }

function checkForUniqueArtist(updatedArtistList) {
  const listOfArtistsWithoutTheFoundOne = updatedArtistList[0].filter(artist => artist.id != updatedArtistList[1].id);
  let stillUniqueUser = true;
  for (const artist of listOfArtistsWithoutTheFoundOne) {
    if (artist.name.toLowerCase() == updatedArtistList[1].name.toLowerCase()) {
      stillUniqueUser = false;
      break;
    }
  }
  return stillUniqueUser
}



async function createNewArtist(req, res) {
  const artists = await readArtistsFile(res);
  if (artists instanceof Error) {
    return
  }
  const newArtist = req.body;
  newArtist.id = new Date().getTime();
  const artistPackage = [artists,newArtist]
  const uniqueCheck = checkForUniqueArtist(artistPackage)
  if (uniqueCheck) {
    artists.push(newArtist);
    writeArtistsFile(artists,res);
  } else {
    console.log("DUPLICATE USER");
    res.status(400).json("Artist already exists!");
  }
}

async function deleteArtist(req, res) {
  const artists = await readArtistsFile(res);
  const id = req.params.artistID;
  const filteredList = artists.filter(artist => artist.id != id);
  if (filteredList.length == artists.length) {
    res.status(400).json("Couldn't find an artist with that ID");
  } else {
    writeArtistsFile(filteredList, res);
  }
}


export { getArtist, deleteArtist, getAllArtists, updateArtist, createNewArtist };

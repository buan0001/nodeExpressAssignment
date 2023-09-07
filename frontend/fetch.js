"use strict";
const host = "http://localhost:3000";

async function getArtists(params) {
  const rawArtists = await fetch(`${host}/artists`);
  console.log("raw artists");
  return await rawArtists.json();
}

async function updateArtist(updatedArtist, id) {
  // Convert the object to json-format and use "put" to the appropriate source
  const promise = await fetch(`${host}/artists/${id}`, {
    method: "PUT",
    body: JSON.stringify(updatedArtist),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (promise.ok) {
    console.log("successfully UPDATED artist!");
    return true;
  } else {
    console.error("failed to UPDATE artist");
    return false;
  }
}

async function deleteArtist(artistToDelete) {
  console.log("DELETING");
  const promise = await fetch(`${host}/artists/${artistToDelete.id}`, {
    method: "DELETE",
  });
  if (promise.ok) {
    console.log("successfully DELETED!");
    return true;
  } else {
    console.error("something went wrong when DELETING");
    return false;
  }
}

async function createNewArtist(newArtist) {
  console.log("new artist:", newArtist);
  const promise = await fetch(`${host}/artists`, {
    method: "POST",
    body: JSON.stringify(newArtist),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(promise);
  if (promise.ok) {
    console.log("successfully CREATED a new artist!");
    return true;
  } else {
    console.error("failed CREATING artist");
    return false;
  }
}

export { getArtists, updateArtist, deleteArtist, createNewArtist };

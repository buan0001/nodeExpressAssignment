"use strict";
const host = "http://localhost:3000";

async function getArtists(params) {
  const rawArtists = await fetch(`${host}/artists`);
  return await rawArtists.json();
}

async function updateArtist(updatedArtist, id) {
  // Convert the object to json-format and use "put" to the appropriate source
  return await fetch(`${host}/artists/${id}`, {
    method: "PUT",
    body: JSON.stringify(updatedArtist),
    headers: {
      "Content-Type": "application/json",
    },
  });
  // if (promise.ok) {
  //   console.log("successfully UPDATED artist!");
  //   return true;
  // } else {
  //   console.error("failed to UPDATE artist");
  //   return false;
  // }
}

async function deleteArtist(artistToDelete) {
  console.log("DELETING");
  return await fetch(`${host}/artists/${artistToDelete.id}`, {
    method: "DELETE",
  });
  // if (promise.ok) {
  //   console.log("successfully DELETED!");
  //   return true;
  // } else {
  //   console.error("something went wrong when DELETING");
  //   return false;
  // }
}

async function createNewArtist(newArtist) {
  console.log("new artist:", newArtist);
  return await fetch(`${host}/artists`, {
    method: "POST",
    body: JSON.stringify(newArtist),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export { getArtists, updateArtist, deleteArtist, createNewArtist };

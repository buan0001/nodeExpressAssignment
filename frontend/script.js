"use strict";

window.addEventListener("load", start);

const host = "http://localhost:3000";

async function start(params) {
  console.log("så er vi sgu tilbage asdasdasd");
  const artists = await getArtists();
  showArtists(artists);
  addListeners();
}

function addListeners(params) {
  document.querySelector("#create-btn").addEventListener("click", createNewArtistClicked);
  document.querySelector("#exit-btn").addEventListener("click", () => document.querySelector("#submit-dialog").close());
}

async function getArtists(params) {
  const rawArtists = await fetch(`${host}/artists`);
  return await rawArtists.json();
}

function showArtists(listOfArtists) {
  const grid = document.querySelector("#artists-grid");
  for (const artist of listOfArtists) {
    grid.insertAdjacentHTML(
      `beforeend`,
      `
    <article class="artist">
    <div>Artist name: <b>${artist.name}</b></div>
    <div><img src="${artist.image}"></div>
    <div>Birthdate: <b>${artist.birthdate}</b> </div>
    <div>Active since: <b>${artist.activeSince}</b></div>
    <div>Genres: <b>${artist.genres}</b></div>
    <div>Labels: <b>${artist.labels}</b></div>
    <div>Website:${artist.website}</div>
    <div>About the artist: <b> ${artist.shortDescription}</b></div>
    <button class="update-btn">Update the artist</button>
    <button class="red delete-btn">DELETE THIS artist</button>
    </article>
    `
    );
    document.querySelector("article:last-child .update-btn").addEventListener("click", () => updateArtistClicked(artist));
    document.querySelector("article:last-child .delete-btn").addEventListener("click", () => deleteArtistClicked(artist));
  }
}

function createNewArtistClicked(event) {
  prepareDialog();
  console.log("create new artist clicked");
  document.querySelector("#submit-form").addEventListener("submit", createNewArtist);
}

async function createNewArtist(event) {
  const form = event.target;
  const fixedGenres = splitAndProperCase(form.genres.value);
  const fixedLabels = splitAndProperCase(form.labels.value);
  const newArtist = {
    name: form.name.value,
    birthdate: form.birthdate.value,
    activeSince: form.activeSince.value,
    genres: fixedGenres,
    labels: fixedLabels,
    website: form.website.value,
    image: form.image.value,
    shortDescription: form.shortDescription.value,
  };

  console.log(JSON.stringify(newArtist));

  const promise = await fetch(`${host}/artists`, {
    method: "POST",
    body: JSON.stringify(newArtist),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (promise.ok) {
    console.log("successfully created a new artist!");
  }
}

function splitAndProperCase(genres) {
  const seperatedGenres = genres.split(",");
  const semiProperGenres = [];
  for (const genre of seperatedGenres) {
    const trimmed = genre.trim();
    semiProperGenres.push(trimmed.charAt(0).toUpperCase() + trimmed.toLowerCase().slice(1));
  }
  return semiProperGenres;
}

function updateArtistClicked(artist) {
  console.log("update artist clicked", artist);
  const form = document.querySelector("#submit-form");
  form.name.value = artist.name;
  form.birthdate.value = artist.birthdate;
  form.activeSince.value = artist.activeSince;
  form.genres.value = artist.genres;
  form.labels.value = artist.labels;
  form.website.value = artist.website;
  form.image.value = artist.image;
  form.shortDescription.value = artist.shortDescription;
  prepareDialog();
  document.querySelector("#submit-form").addEventListener("submit", (event) => {
    event.preventDefault();
    updateArtist(artist.id);
  });
}

async function updateArtist(id) {
  const form = document.querySelector("#submit-form");
  const fixedGenres = splitAndProperCase(form.genres.value);
  const fixedLabels = splitAndProperCase(form.labels.value);
  const updatedArtist = {
    name: form.name.value,
    birthdate: form.birthdate.value,
    activeSince: form.activeSince.value,
    genres: fixedGenres,
    labels: fixedLabels,
    website: form.website.value,
    image: form.image.value,
    shortDescription: form.shortDescription.value,
  };
  const promise = await fetch(`${host}/artists/${id}`, {
    method: "PUT",
    body: JSON.stringify(updatedArtist),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (promise.ok) {
    console.log("successfully created a new artist!");
  }
}

function prepareDialog(params) {
  const form = document.querySelector("#submit-form");
  const node = document.querySelector("#submit-btn");
  const clone = node.cloneNode(true);
  node.remove();
  form.appendChild(clone);
  // form.reset();
  document.querySelector("#submit-dialog").showModal();
}

function deleteArtistClicked(artist) {
  if (window.confirm("Do you REALLY wish to delete this artist?")) {
    deleteArtist(artist);
  }
}

async function deleteArtist(artistToDelete) {
  console.log("idk????");
  const promise = await fetch(`${host}/artists/${artistToDelete.id}`, {
    method: "DELETE",
  });
  console.log("return promise", promise);
  if (promise.ok) {
    console.log("successfully deleted!");
  } else {
    console.log("something went wrong when deleting");
  }
}

function test(params) {
  console.log("testing!");
}

"use strict";

window.addEventListener("load", start);

async function start(params) {
  console.log("så er vi sgu tilbage asdasdasd");
  const artists = await getArtists();
  showArtists(artists);
  addListeners();
}

function addListeners(params) {
  document.querySelector("#create-btn").addEventListener("click", createNewArtist);
}

async function getArtists(params) {
  const rawArtists = await fetch("http://localhost:3000/artists");
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

function createNewArtist(params) {
  console.log("create new artist clicked");
  document.querySelector("#submit-dialog").showModal();
}

function updateArtistClicked(artist) {
  console.log("update artist", artist);
  const form = document.querySelector("#submit-form");
  let node = document.querySelector("#submit-btn");
  node.addEventListener("click", test);
  let clone = node.cloneNode(true);
  form.appendChild(clone);
  form.reset();
  document.querySelector("#submit-dialog").showModal();
}

function deleteArtistClicked(artist) {
  console.log("delete artist", artist);
}

function test(params) {
  console.log("testing!");
}

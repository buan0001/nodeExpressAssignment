"use strict";

import { getArtists, updateArtist, deleteArtist, createNewArtist } from "./fetch.js";
import { prepareDialog, splitAndProperCase } from "./helpers.js";

window.addEventListener("load", start);

const host = "http://localhost:3000";
let artists;

async function start(params) {
  artists = await getArtists();
  console.log("artists:", artists);
  applyFavorites();
  addListeners();
  applySortAndFilter();
}

function applyFavorites(params) {
  const currentStash = localStorage.getItem("favorites");
  if (currentStash) {
    for (const artist of artists) {
      if (currentStash.includes(artist.id)) {
        artist.favorite = true;
      } else {
        artist.favorite = false;
      }
    }
  }
}

function addListeners(params) {
  document.querySelector("#create-btn").addEventListener("click", createNewArtistClicked);
  document.querySelector("#exit-btn").addEventListener("click", () => document.querySelector("#submit-dialog").close());
  document.querySelector("#filter-select").addEventListener("change", filterChanged);
  document.querySelector("#sort-select").addEventListener("change", sortChanged);
}

function filterChanged(event) {
  const filterValue = event.target.value;
  console.log(filterValue);
  applySortAndFilter(filterValue, this);
}

function sortChanged(event) {
  const sortValue = event.target.value;
  console.log(sortValue);
  applySortAndFilter(sortValue, this);
}

function applySortAndFilter(sortOrFilterValue, whoCalledThisFunction) {
  // Set an intial value to account for values selected before a refresh
  let sortValue = document.querySelector("#sort-select").value;
  let filterValue = document.querySelector("#filter-select").value;

  // Avoiding global variables and using the same function to handle calls from different functions!
  if (whoCalledThisFunction) {
    if (whoCalledThisFunction.id === "sort-select") {
      sortValue = sortOrFilterValue;
    } else if (whoCalledThisFunction.id === "filter-select") {
      filterValue = sortOrFilterValue;
    }
  }

  const sortedArray = applySort(sortValue);
  const filteredArray = applyFilter(sortedArray, filterValue);
  showArtists(filteredArray);
}

function applySort(sortValue) {
  // Create a copy of the original array to keep it intact; sort overrides the orginal array.
  const arrayToSort = Array.from(artists);
  // Since our sortValue looks like this: "type-value-reverseOrNot"
  // we need to extract the "value" to a variable so we can use it in the sort functions
  let valueToCompare = sortValue.split("-")[1];
  if (sortValue.startsWith("string")) {
    arrayToSort.sort((artist1, artist2) => artist1[valueToCompare].localeCompare(artist2[valueToCompare]));
  } else if (sortValue.startsWith("time")) {
    arrayToSort.sort((artist1, artist2) => new Date(artist1[valueToCompare]).getTime() - new Date(artist2[valueToCompare]).getTime());
  } else if (sortValue.startsWith("bool")) {
    arrayToSort.sort((artist1, artist2) => {
      if (artist2[valueToCompare] == "undefined") {
        artist2[valueToCompare] = false;
      }
      if (artist1[valueToCompare] == "undefined") {
        artist1[valueToCompare] = false;
      }
      return artist2[valueToCompare] - artist1[valueToCompare];
    });
  }
  if (sortValue.endsWith("2")) {
    arrayToSort.reverse();
  }
  // Return the sorted array. If no sort-value was set, return an unchanged copy of the original artist array
  return arrayToSort;
}

function applyFilter(arrayToFilter, filterValue) {
  // If no filter value is set, ignore and return
  if (filterValue != "") {
    if (filterValue == "favorite") {
      return arrayToFilter.filter((artist) => artist.favorite);
    }
    const possibleGenres = ["rock", "punk", "country", "drum and bass", "pop"];
    return arrayToFilter.filter((artist) => {
      for (const genre of artist.genres) {
        if (genre.toLowerCase() == filterValue) {
          return true;
        } else if (filterValue == "other") {
          if (!possibleGenres.includes(genre.toLowerCase())) {
            return true;
          }
        }
      }
    });
  } else {
    return arrayToFilter;
  }
}

function showArtists(listOfArtists) {
  const grid = document.querySelector("#artists-grid");
  grid.innerHTML = "";
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
    <button class="yellow favorite-btn">Add to favorites!</button>
    </article>
    `
    );
    if (artist.favorite) {
      const button = document.querySelector("article:last-child .favorite-btn");
      button.innerHTML = "Remove from favorites";
      button.classList.add("favorite");
    }
    document.querySelector("article:last-child .update-btn").addEventListener("click", () => updateArtistClicked(artist));
    document.querySelector("article:last-child .delete-btn").addEventListener("click", () => deleteArtistClicked(artist));
    document.querySelector("article:last-child .favorite-btn").addEventListener("click", () => changeFavoriteStatus(artist));
  }
}

function changeFavoriteStatus(artist) {
  let currentStash = localStorage.getItem("favorites");
  artist.favorite = !artist.favorite;

  if (artist.favorite) {
    if (currentStash) {
      localStorage.setItem("favorites", currentStash + ", " + artist.id);
    } else {
      localStorage.setItem("favorites", artist.id);
    }
  } else {
    const thingToSend = currentStash.split(",").filter((entry) => entry != artist.id);
    localStorage.setItem("favorites", thingToSend);
  }
  console.log("changed stash:", localStorage.getItem("favorites"));
  applySortAndFilter();
}

function createNewArtistClicked(event) {
  prepareDialog();
  console.log("create new artist clicked");
  document.querySelector("#submit-form").addEventListener("submit", extractNewArtistFromForm);
}

async function extractNewArtistFromForm(event) {
  console.log("CREATING");
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
  const promise = await createNewArtist(newArtist);
  console.log(promise);
  if (promise.ok) {
    applySortAndFilter();
  }
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
  document.querySelector("#submit-form").addEventListener("submit", () => extractUpdatedArtistFromForm(artist.id));
}

async function extractUpdatedArtistFromForm(artistID) {
  console.log("UPDATING");
  // Extract values from form and create a new object
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

  const promise = await updateArtist(updatedArtist, artistID);
  if (promise.ok) {
    applySortAndFilter();
  } else {
    console.error(promise);
  }
}

async function deleteArtistClicked(artist) {
  console.log("we deleting? 11111");
  if (window.confirm("Do you REALLY wish to delete this artist?")) {
    console.log("we deleting? 22222");
    const promise = await deleteArtist(artist);
    if (promise.ok) {
      applySortAndFilter();
    }
  } else {
    console.log("we in here now");
  }
}

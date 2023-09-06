"use strict";

function prepareDialog(params) {
  // Re-creates the submit button so the same dialog can be used for both create and update
  // The re-creation is done in order to remove any previous event-listeners
  // so the new, appropriate event-listener can be added instead
  const form = document.querySelector("#submit-form");
  const node = document.querySelector("#submit-btn");
  const clone = node.cloneNode(true);
  node.remove();
  form.appendChild(clone);
  document.querySelector("#submit-dialog").showModal();
}

function splitAndProperCase(genresOrLabels) {
  // A sorry attempt at "validating" genres and labels without limiting the selection to a list of <option>'s in a <select>
  // ... please introduce us to proper regex at some point
  const seperatedArray = genresOrLabels.split(",");
  const semiProperArray = [];
  for (const element of seperatedArray) {
    const trimmed = element.trim();
    semiProperArray.push(trimmed.charAt(0).toUpperCase() + trimmed.toLowerCase().slice(1));
  }
  return semiProperArray;
}

export { splitAndProperCase, prepareDialog };

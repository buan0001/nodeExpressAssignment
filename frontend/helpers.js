"use strict";

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

export { splitAndProperCase };

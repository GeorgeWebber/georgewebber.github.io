import { highlightSearchTerm } from "./highlight-search-term.js";

document.addEventListener("DOMContentLoaded", function () {
  // actual bibsearch logic
  // Replace your existing filterItems function with this corrected version.
  const filterItems = (searchTerm) => {
    document.querySelectorAll(".bibliography, .unloaded").forEach((element) => element.classList.remove("unloaded"));

    // highlight-search-term
    if (CSS.highlights) {
      let nonMatchingElements = highlightSearchTerm({ search: searchTerm, selector: ".bibliography > li" });
      if (nonMatchingElements == null) {
        return;
      }
      // ---- START of MODIFICATION ----
      // After finding elements that don't match the text, we do a second pass.
      // We remove an element from the "non-matching" list if its internal bib key (ID) matches the search term.
      nonMatchingElements = nonMatchingElements.filter((element) => {
        // CORRECTLY find the div with an ID inside the <li> element
        const idElement = element.querySelector("div[id]");
        const bibKey = idElement ? idElement.id.toLowerCase() : "";
        return !bibKey.includes(searchTerm);
      });
      // ---- END of MODIFICATION ----

      nonMatchingElements.forEach((element) => {
        element.classList.add("unloaded");
      });
    } else {
      // Simply add unloaded class to all non-matching items if Browser does not support CSS highlights
      document.querySelectorAll(".bibliography > li").forEach((element, index) => {
        const text = element.innerText.toLowerCase();
        // ---- START of MODIFICATION ----
        // CORRECTLY find the div with an ID inside the <li> element
        const idElement = element.querySelector("div[id]");
        const bibKey = idElement ? idElement.id.toLowerCase() : "";
        // Hide the element only if the search term is NOT in the text AND NOT in the bib key.
        if (text.indexOf(searchTerm) == -1 && bibKey.indexOf(searchTerm) == -1) {
          element.classList.add("unloaded");
        }
        // ---- END of MODIFICATION ----
      });
    }

    // This part of the function remains the same.
    document.querySelectorAll("h2.bibliography").forEach(function (element) {
      let iterator = element.nextElementSibling;
      let hideFirstGroupingElement = true;
      while (iterator && iterator.tagName !== "H2") {
        if (iterator.tagName === "OL") {
          const ol = iterator;
          const unloadedSiblings = ol.querySelectorAll(":scope > li.unloaded");
          const totalSiblings = ol.querySelectorAll(":scope > li");
          if (unloadedSiblings.length === totalSiblings.length) {
            ol.previousElementSibling.classList.add("unloaded");
            ol.classList.add("unloaded");
          } else {
            hideFirstGroupingElement = false;
          }
        }
        iterator = iterator.nextElementSibling;
      }
      if (hideFirstGroupingElement) {
        element.classList.add("unloaded");
      }
    });
  };

  const updateInputField = () => {
    const hashValue = decodeURIComponent(window.location.hash.substring(1)); // Remove the '#' character
    document.getElementById("bibsearch").value = hashValue;
    filterItems(hashValue);
  };

  // Sensitive search. Only start searching if there's been no input for 300 ms
  let timeoutId;
  document.getElementById("bibsearch").addEventListener("input", function () {
    clearTimeout(timeoutId); // Clear the previous timeout
    const searchTerm = this.value.toLowerCase();
    timeoutId = setTimeout(filterItems(searchTerm), 300);
  });

  window.addEventListener("hashchange", updateInputField); // Update the filter when the hash changes

  updateInputField(); // Update filter when page loads
});

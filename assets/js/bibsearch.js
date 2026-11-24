import { highlightSearchTerm } from "./highlight-search-term.js";

document.addEventListener("DOMContentLoaded", () => {
  const results = document.getElementById("publication-results");
  if (!results) return;

  const search = document.getElementById("bibsearch");
  const type = document.getElementById("publication-type");
  const firstAuthor = document.getElementById("publication-first-author");
  const count = document.getElementById("publication-count");
  const empty = document.getElementById("publication-empty");
  const records = Array.from(results.querySelectorAll(".bibliography > li"), (item) => ({
    item,
    metadata: item.querySelector("[data-publication-type]"),
    // Include collapsed abstracts and author lists in search results.
    text: item.textContent.toLocaleLowerCase(),
  }));

  function filterItems() {
    const term = search?.value.trim().toLocaleLowerCase() || "";
    let visible = 0;
    for (const { item, metadata, text } of records) {
      const key = metadata?.querySelector("div[id]")?.id.toLocaleLowerCase() || "";
      const matchesSearch = !term || text.includes(term) || key.includes(term);
      const matchesType = !type || type.value === "all" || metadata?.dataset.publicationType === type.value;
      const matchesAuthor = !firstAuthor?.checked || metadata?.dataset.firstAuthor === "true";
      const matches = matchesSearch && matchesType && matchesAuthor;
      item.hidden = !matches;
      if (matches) visible += 1;
    }

    // Jekyll Scholar emits a year heading followed by an ordered list.
    for (const list of results.querySelectorAll("ol.bibliography")) {
      list.hidden = !Array.from(list.children).some((item) => !item.hidden);
    }
    for (const heading of results.querySelectorAll("h2.bibliography")) {
      let sibling = heading.nextElementSibling;
      let hasResults = false;
      while (sibling && sibling.tagName !== "H2") {
        if (sibling.matches("ol.bibliography") && !sibling.hidden) hasResults = true;
        sibling = sibling.nextElementSibling;
      }
      heading.hidden = !hasResults;
    }

    if (count) count.textContent = `${visible} ${visible === 1 ? "publication" : "publications"}`;
    if (empty) empty.hidden = visible !== 0;
    if (window.CSS?.highlights) {
      highlightSearchTerm({ search: term, selector: "#publication-results .bibliography > li:not([hidden])" });
    }
  }

  function readHash() {
    let hash = window.location.hash.slice(1);
    try {
      hash = decodeURIComponent(hash);
    } catch {
      // Treat malformed URL escapes as literal search text.
    }
    if (search) search.value = hash;
    filterItems();
  }

  document.querySelector(".publication-filters")?.removeAttribute("hidden");
  search?.addEventListener("input", filterItems);
  type?.addEventListener("change", filterItems);
  firstAuthor?.addEventListener("change", filterItems);
  window.addEventListener("hashchange", readHash);
  readHash();
});

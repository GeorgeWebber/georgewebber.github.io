---
layout: page
permalink: /publications/
title: publications
description: A comprehensive record of journal articles, conference papers, workshop papers, preprints and conference abstracts, newest first.
nav: true
nav_order: 2
scholar:
  query: "@*"
  sort_by: [year, month]
  order: descending
  group_by: year
  group_order: descending
---

<!-- _pages/publications.md -->

<!-- Bibsearch Feature -->

{% include bib_search.liquid %}

<fieldset class="publication-filters" hidden>
  <legend class="sr-only">Filter publications</legend>
  <div class="publication-type-filter">
    <label for="publication-type">Publication type</label>
    <select id="publication-type" aria-controls="publication-results">
      <option value="all">All publications</option>
      <option value="journal">Journal articles</option>
      <option value="conference">Conference papers</option>
      <option value="workshop">Workshops &amp; preprints</option>
      <option value="abstract">Conference abstracts</option>
    </select>
  </div>
  <label class="publication-authorship-filter" for="publication-first-author">
    <input type="checkbox" id="publication-first-author" aria-controls="publication-results">
    First- and co-first-author only
  </label>
</fieldset>
<p id="publication-count" class="publication-count" role="status" aria-live="polite" aria-atomic="true"></p>

<div class="publications" id="publication-results">

{% bibliography %}

</div>
<p id="publication-empty" hidden>No publications match the selected filters.</p>
{% unless site.bib_search %}
  <script src="{{ '/assets/js/bibsearch.js' | relative_url | bust_file_cache }}" type="module"></script>
{% endunless %}

---
layout: page
title: presentations
permalink: /presentations/
nav: true
nav_order: 3
---

{% assign talks = site.presentations | sort: "date" | reverse %}
{% assign groups = talks | group_by_exp: "t", "t.date | date: '%Y'" %}

{% for g in groups %}
## {{ g.name }}
{% for t in g.items %}
<h3 id="{{ t.slug | slugify }}">{{ t.title }} <small>({% if t.date_precision == 'month' %}{{ t.date | date: "%b %Y" }}{% else %}{{ t.date | date: "%d %b %Y" }}{% endif %})</small></h3>

**{{ t.type }}** · {{ t.venue }}{% if t.location %} — {{ t.location }}{% endif %}

{{ t.content | markdownify }}

{% if t.slides or t.poster or t.video or t.paper or t.links %}
<p class="presentation-links">
  {% if t.slides %}<a href="{{ t.slides | relative_url }}">Slides</a> {% endif %}
  {% if t.poster %}<a href="{{ t.poster | relative_url }}">Poster</a> {% endif %}
  {% if t.video %}<a href="{{ t.video }}">Video</a> {% endif %}
  {% if t.paper %}<a href="{{ t.paper }}">Paper</a> {% endif %}
  {% for L in t.links %}<a href="{{ L.url }}">{{ L.text }}</a> {% endfor %}
</p>
{% endif %}

<hr>
{% endfor %}
{% endfor %}

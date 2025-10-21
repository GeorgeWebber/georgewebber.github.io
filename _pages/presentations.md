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
### <a href="{{ t.url | relative_url }}">{{ t.title }}</a> <small>({{ t.date | date: "%b %Y" }})</small>

**{{ t.type }}** · {{ t.venue }}{% if t.location %} — {{ t.location }}{% endif %}

<ul>
  {% if t.slides %}<li><a href="{{ t.slides | relative_url }}">Slides</a></li>{% endif %}
  {% if t.poster %}<li><a href="{{ t.poster | relative_url }}">Poster</a></li>{% endif %}
  {% if t.video %}<li><a href="{{ t.video }}">Video</a></li>{% endif %}
  {% if t.paper %}<li><a href="{{ t.paper }}">Paper</a></li>{% endif %}
  {% for L in t.links %}<li><a href="{{ L.url }}">{{ L.text }}</a></li>{% endfor %}
</ul>

<hr>
{% endfor %}
{% endfor %}

---
layout: default
comments: true
published: true
title: Electronics For Developers
---

<img src="/assets/blog/2021-02-14/RPI+NJS.png" style="text-align: center; display: block; margin-left: auto; margin-right: auto;max-width: 80%;" />

# Articles Written

{% for post in site.posts %}

<h2 style="margin-block-end: 0em;">
    <a href="{{ post.url }}">{{ post.title }}</a>
</h2>
{{post.date | date_to_string}}<br/>
<p>{{ post.excerpt }}</p>

{% endfor %}

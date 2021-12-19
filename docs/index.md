---
layout: default
comments: true
title: JavaScript Developers Working on IoT Projects !
---

<img src="/assets/blog/2021-02-14/RPI+NJS.png" style="text-align: center; display: block; margin-left: auto; margin-right: auto;max-width: 80%;" />

Thanks to the power of the <a href="https://www.raspberrypi.org/">Raspberry Pi</a>, and <a href="https://nodejs.org/en/">Node.js</a>, JavaScript developers can build any IoT project they desire without having to learn new technologies!

# Articles Written

{% for post in site.posts %}

<h2 style="margin-block-end: 0em;">
    <a href="{{ post.url }}">{{ post.title }}</a>
</h2>
{{post.date | date_to_string}}<br/>
<p>{{ post.excerpt }}</p>

{% endfor %}

---
layout: default
published: true
title: My Raspberry Pi + NodeJS Journey
---

_Are you looking for the articles? You can find them [here](#Articles)_

> “When you learn, teach, when you get, give.”
> ― Maya Angelou

You may have read some of my blogs on Salesforce development and architecture, but this year I decided to embark on a new hobby: Robotics! So this blog will be a bit different than the ones you regularly read from me.

To start learning about this fantastic new world, I decided to purchase a few things on Christmas 2020 from Amazon. If you want to join me in this journey, you may want to read the [**getting started**]({% link _posts/2021-02-28-GettingStarted.md %}) article.

Once I had acquired these items, I was ready to start my journey and, let me tell you; it has been an incredible ride!

The Freenove kit that I acquired has a great set of components, and the projects are simple and work quite well. The concepts are incremental, starting with a simple LED and evolving to add switches and more advanced components.

I decided that if I wanted to learn, I would have to challenge myself, so I came up with a great idea: I will build the circuits they have in the book, but I will write the code using JavaScript (NodeJS). The kit comes with code samples in C++ and Python, and I can use those samples as guides.

This idea was great because I have to fully understand the sample code they provide to rewrite it using JavaScript. The book has some essential explanations of how things work, but it does not go into depth. Sometimes they do oversimplify things, but having to translate the code to another language requires me to go much deeper into the information provided and learn not only how it’s done but why it’s done. So the book, together with Google, has been a great educational experience!

But it was easier said than done, especially at the beginning of my journey. After a lot of research (trial and error and plenty of googling), I found a couple of good npm libraries named [RPIO](https://www.npmjs.com/package/rpio) and [PIGPIO](https://www.npmjs.com/package/pigpio) that work pretty well with Raspberry Pi and Javascript. So far, they have everything I need.

If I had to choose just one of those libraries, I would use PIGPIO because it has a few more features. For example, I have noticed that RPIO does hardware-based PWM, but PIGPIO does software-based PWM. Why is this important? It allows me to use more pins on the Raspberry Pi.

There are other npm libraries. For example, [Johny-Five](https://www.npmjs.com/package/johnny-five) allows you to write simpler NodeJS code because it has one more abstraction layer. But this is precisely the reason I have stayed away from that library: it does too much hand-holding. I feel this would not help me learn as much, but it could help me later in some projects.

I want to start a series of blogs, sharing the knowledge I have gained while working on some projects. So stay tuned, and join me in the discovery of this new fascinating world.

# Articles Written

<a name="Articles"></a>

{% for post in site.posts %}

<h2 style="margin-block-end: 0em;">
    <a href="{{ post.url }}">{{ post.title }}</a>
</h2>
{{post.date | date_to_string}}<br/>
<p>{{ post.excerpt }}</p>

{% endfor %}

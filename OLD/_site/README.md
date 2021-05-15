You may have read some of my blogs on Salesforce development/architecture, but this year I decided to embark on a new hobby: **Robotics and IoT**! So this blog series will be a bit different than the ones you regularly read on Salesforce development, hopefully you enjoy these ones too.

In order to start learning about this awesome new world, I decided to purchase a few things on Christmas 2020 from Amazon including a kit with a ton of parts and a good book to guide me. The Freenove kit that I acquired has a great set of components, and the projects are simple and work quite well. The concepts are incremental, starting with a simple LED and evolving to add switches and more advanced components. Once I had acquired those items, I was ready to start my journey, and let me tell you, it has been an awesome ride!

I decided that if I really wanted to learn, I was going to have to challenge myself, so I came up with a great idea: I am going to build the circuits they have in the book but I am going to write the code using JavaScript (nodeJS). The kit comes with code samples in C++ and Python, so I can use those samples as guides.

This was a great idea because I have to fully understand the sample code they have so that I can translate it to JavaScript. The book has some basic explanations of how things work but it does not go into a lot of depth and sometimes they oversimplify things... but having to translate the code to another language requires me to go into a lot of depth on the information provided and learn not only how it’s done but why it’s done. So the book, together with Google, has been a great educational experience.

But it was easier said than done, especially at the beginning of my journey. After a lot of research (trial and error, and plenty of googling) I found a couple of good npm libraries named [RPIO](https://www.npmjs.com/package/rpio) and [PIGPIO](https://www.npmjs.com/package/pigpio) that work quite well with the Raspberry PI and Javascript, and so far it has everything I need.

If I had to choose just one of those libraries, I think I would use **PIGPIO** because it’s more complete, for example **RPIO** only does hardware based PWM but **PIGPIO** does software based PWM which allows me to use more pins with PWM. I will write a blog later on this later.

There is another interesting npm library named [Johny-Five](https://www.npmjs.com/package/johnny-five) which seems promising because it simplifies a lot of the code that needs to be written, but that is precisely the reason I have stayed away from that... it does too much hand-holding and I feel that at this stage it would not help me learn as much.

I will start the new series of blogs sharing some of the knowledge I have acquired while working on some of the projects.So stay tuned, and join in the discovery of this new fascinating world.

These are the posts that I have written:

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>

---
layout: default
title: Debouncing A Button
---

On a previous article ([**Hello IoT (RPIO)**]({% link _posts/2021-03-28-HelloIoT-RPIO.md %})) you may remember we had to define the button state has to be stable for 500ms before we actually take action. Let's understand why this is important.

Debouncing a button is required because when a push-button switch is pressed or released, it will not change immediately between states. Actually, there could be some noise introduced by the mechanical vibrations. We have to account for this in our code by waiting for the button to stabilize.

This diagram illustrates this concept:

![Noise Diagram](/assets/blog/2021-04-04/NoiseDiagram.png)

When I was reading about this, I did not think it was correct. I remember thinking: That would not be noticeable! And I remove that part of the code to see what would happen, I started getting weird results. So I decided to put the oscilloscope to use and see if I would understand what is actually happening. Reading about somehting and seeing something working is a big difference.

To make the issue more obvious, I did replaced the switch for a pair of cables I manually joined, this would simulate a faulty button. As you can see below, this issue is real, and we need to account for it!

<p style="text-align:center">
    <video src="/assets/blog/2021-04-04/NoisyButton.mov" autoplay controls loop></video>
</p>

If we had a different project, where the LED stays ON only while the button is being pressed, then we would not worry because it would be too fast for your eyes.

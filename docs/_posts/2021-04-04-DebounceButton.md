---
layout: default
published: true
title: Debouncing A Button
---

Electricity is too fast! What are noisy buttons, and why do we have to account for them?

In a previous article ([Hello IoT (RPIO)]({% link _posts/2021-03-28-HelloIoT-RPIO.md %})), you may remember we had to define the button state has to be stable for 500ms before we take action.

Debouncing a button is required because when a push-button switch is pressed or released, it does not change immediately between states. Actually, mechanical vibrations can introduce noise. We have to account for this in our code by waiting for the button to stabilize.

This diagram illustrates this concept:

![Noise Diagram](/assets/blog/2021-04-04/NoiseDiagram.png)

When I first read about this, I could not believe this would be an issue; how could this be noticeable? I remove that part of the code to see what would happen. I started getting weird results. So I decided to put the oscilloscope to use and see if I would understand what is happening. Reading about something and seeing something working is a big difference!

To make the issue more obvious, I replaced the switch for a pair of cables I manually joined, simulating a faulty button. As you can see below, this issue is very real, and we need to account for it!

<p style="text-align:center; max-width: 100%;">
    <video src="/assets/blog/2021-04-04/NoisyButton.mov" autoplay controls loop></video>
</p>

If we had a different project, where the LED stays ON only while holding down the button, then we would not worry because it would be too fast for your eyes.

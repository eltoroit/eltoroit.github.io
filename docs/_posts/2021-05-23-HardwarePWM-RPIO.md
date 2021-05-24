---
layout: default
comments: true
published: true
title: Hardware-based PWM with RPIO
---

This project builds a simple circuit that uses Hardware-based Pulse-Width Modulation (PWM).

In the previous article ([Pulse-Width Modulation (PWM) - Theory]({% link _posts/2021-05-22-PWM.md %})), we reviewed why PWM works. Let's now take a look at how we can get PWM working on Raspberry Pi using JavaScript. The project described here today uses Hardware-based PWM via the [RPIO](https://www.npmjs.com/package/rpio) library.

# How does the project work?

We are going to build a simple circuit with an LED and a resistor as shown on this schematic:

![Schematic](/assets/blog/2021-05-23/Schematic.png)

BTW, The 220 Ω resistor is needed to protect the LED. When I build this circuit, I connected the oscilloscope to see the Pulse-Width Modulation (PWM) in action and a multimeter to measure the current going through the LED.

<p style="text-align:center;">
    <video src="/assets/blog/2021-05-23/ProjectOverview.mov" style="max-width: 100%;" autoplay controls loop></video>
</p>

# Hardware-based PWM (RPIO)

The code below uses Hardware-based PWM via the [RPIO](https://www.npmjs.com/package/rpio) npm package.

<script src="https://gist.github.com/eltoroit/21ac1e7de8709aab41b8c6f6967e3f7a.js"></script>

Although this is a simple project, I have decided to write the code using two classes: **LedRPIO** handles the hardware, and **LedLogic** handles the logic. This separation allows me to separate the usage of RPIO and swap this part for another class that uses PIGPIO in the following article. The logic is quite simple. An infinite loop varies the duty cycle by 20%, either increasing or decreasing the percentage. Each iteration of the loop occurs every second.

There are some numbers that we need to discuss:

As shown on the oscilloscope in the video above, the PWM frequency (duty cycle) is 6.75 kHz or a period of 148 microseconds. This frequency does not indicate how often the data changes, which in the code above is once per second. This formula helps calculate the PWM frequency: `CLOCK / (range \* ClockDivider)` taking into consideration these values:

- CLOCK: The Raspberry Pi 4B has a PWM input clock that runs at 54 MHz.
- ClockDivider: Must be a power of two, for example, 2, 4, 8, 16, 32, 64, 128, and so on up to a maximum of 1024.

With a range of 1000 and a ClockDivider equals 8, we get a PWM frequency of 6.75 kHz.

Let's take a look at other parts of this code.

- `1` Import the [RPIO](https://www.npmjs.com/package/rpio) library
- `2` Import the pins library. See the article [GPIO Pins]({% link _posts/2021-04-18-GPIO-pins.md %}) to understand why this is required.
- `3-23` This class isolates the hardware implementation using RPIO from the part that controls the duty cycle percentage. Notice we are using - a promise which never resolves or rejects, so we never end it. That's how we are making an infinite loop.
- `79-80` This is just the invocation of the main code.

- `5` ClockDivider helps define the frequency or period of the duty cycle.
- `6` We are using GPIO18, but we need the physical number of the pin. We use [GPIO Pins]({% link _posts/2021-04-18-GPIO-pins.md %}) to - calculate the value.
- `10` Opens the GPIO18 pin for PWM functionality.
- `11` Sets the clock divider for the duty cycle.
- `12` Sets the range of values. In our case, we are using values from 0 to 1000 (range passed as a parameter to the constructor)
- `16` Writes the value when it changes. In our case, this happens once per second, and it's not related to the duty cycle frequency.
- `20` Close the application by resetting the pin and turning the LED off at the end of the application.

- `35` The duty cycle is divided into 1000 pieces, so when we increase 20%, we are increasing by 200 points.
- `36` We are going to update the percentages once per second (1000 ms).
- `39` Instantiate the class that handles the hardware.
- `41-51` Detect and handle the events when the NodeJS process terminates
- `55-75` A promise that never success or fails to create a process that never ends.
- `56-64` Update values when we reach the extremes
- `66-69` If the data is within the correct range, then call the hardware (`68`) to update the LED.
- `72-74` The infinite loop

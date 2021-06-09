---
layout: default
comments: true
published: true
title: Hardware-based PWM with RPIO
---

This project builds a simple circuit that uses Hardware-based Pulse-Width Modulation (PWM) with RPIO.

> Pulse-Width Modulation (PWM) series of articles:
>
> - Read [Pulse-Width Modulation (PWM) - Theory]({% link _posts/2021-05-29-PWM.md %}) to understand the theory behind
> - Build a simple circuit with [RPIO](https://www.npmjs.com/package/rpio) using [Hardware-based PWM with RPIO]({% link _posts/2021-05-30-HardwarePWM-RPIO.md %})
> - Build a simple circuit using [PIGPIO](https://www.npmjs.com/package/pigpio) using [Sofware-based PWM with PIGPIO]({% link _posts/2021-06-04-SoftwarePWM-PIGPIO.md %})

In the previous article ([Pulse-Width Modulation (PWM) - Theory]({% link _posts/2021-05-29-PWM.md %})), we reviewed why PWM works. Let's now take a look at how we can get PWM working on Raspberry Pi using JavaScript. The project described here today uses Hardware-based PWM via the [RPIO](https://www.npmjs.com/package/rpio) library.

# How does the project work?

We are going to build a simple circuit with an LED and a resistor as shown on this schematic:

![Schematic](/assets/blog/2021-05-30/Schematic.png)

BTW, The 220 Ω resistor is needed to protect the LED. When I build this circuit, I connected the oscilloscope to see the Pulse-Width Modulation (PWM) in action and a multimeter to measure the current going through the LED.

<p style="text-align:center;">
    <video src="/assets/blog/2021-05-30/ProjectOverview.mov" style="max-width: 100%;" autoplay controls loop></video>
</p>

# Hardware-based PWM (RPIO)

> Hardware-based PWM does not require CPU resources, and it has a more precise time control. Even if the CPU is busy, the Raspberry Pi updates the correct values at the correct time. But on the Raspberry Pi 4, we only have four pins that we can use: GPIO18 (pin 12), GPIO12 (pin 32), GPIO13 (pin 33), and GPIO19 (pin 35).

<p><s>Suppose we were building a circuit with an RGB LED (which requires 3 PWM pins - one for each colour) and one switch; we would run out of pins!</s></p>_UPDATE_ [Bogusław Kempny](http://kempny.stanpol.com.pl/index_en.php) has indicated, on a [comment for this article](https://github.com/eltoroit/eltoroit.github.io/issues/2), that the Raspberry Pi only has 2 channels. Pins GPIO12 (pin 32) and GPIO18 (pin 12) share channel 0, and pins GPIO13 (pin 33) and GPIO19 (pin 35) share channel 1.

That means that we can't drive an RGB LED because it requires three PWM signals! (one for each colour). In that case, we may want to consider using [Sofware-based PWM with PIGPIO]({% link _posts/2021-06-04-SoftwarePWM-PIGPIO.md %})

The code below uses Hardware-based PWM via the [RPIO](https://www.npmjs.com/package/rpio) npm package.

<script src="https://gist.github.com/eltoroit/21ac1e7de8709aab41b8c6f6967e3f7a.js"></script>

Although this is a simple project, I have decided to write the code using two classes: **LedRPIO** handles the hardware, and **LedLogic** handles the logic. Organizing the code this way allows me to separate the usage of RPIO and swap this part for another class that uses PIGPIO in the following article. The logic is quite simple. An infinite loop varies the duty cycle by 20%, either increasing or decreasing the percentage. Each iteration of the loop occurs every second.

There are some numbers that we need to discuss:

As shown on the oscilloscope in the video above, the PWM frequency (duty cycle) is 6.75 kHz or a period of 148 microseconds. This frequency does not indicate how often the data changes, which in the code above is once per second. This formula helps calculate the PWM frequency: `CLOCK / (range \* ClockDivider)` taking into consideration these values:

- CLOCK: The Raspberry Pi 4B has a PWM input clock that runs at 54 MHz.
- ClockDivider: Must be a power of two, for example, 2, 4, 8, 16, 32, 64, 128, and so on up to a maximum of 1024.

With a range of 1000 and a ClockDivider equals 8, we get a PWM frequency of 6.75 kHz.

Let's take a look at other parts of this code.

- `1` Import the [RPIO](https://www.npmjs.com/package/rpio) library
- `2` Import the pins library. See the article [GPIO Pins]({% link _posts/2021-04-18-GPIO-pins.md %}) to understand why this is required.
- `4-25` This class isolates the hardware implementation using RPIO from the part that controls the duty cycle percentage.
- `27-75` We are controlling the duty cycle percentage.
- `77-78` This is just the invocation of the main code.

- `5` The duty cycle is divided into 1000 pieces, so when we increase 20%, we are increasing by 200 points.
- `6` ClockDivider helps define the frequency or period of the duty cycle.
- `7` We are using GPIO18, but we need the physical number of the pin. We use [GPIO Pins]({% link _posts/2021-04-18-GPIO-pins.md %}) to - calculate the value.
- `11` Opens the GPIO18 pin for PWM functionality.
- `12` Sets the clock divider for the duty cycle.
- `13` Sets the range of values. In our case, we are using values from 0 to 1000 (range passed as a parameter to the constructor)
- `16-19` Receives the percentage, a value greater than 0 and less than or equals 1, indicating the duty cycle percentage.
- `18` Writes the value when it changes. In our case, this happens once per second, and it's not related to the duty cycle frequency.
- `22` Close the application by resetting the pin and turning the LED off at the end of the application.

- `36` We are going to update the percentages once per second (1000 ms).
- `39` Instantiate the class that handles the hardware.
- `41-51` Detect and handle the events when the Node.js process terminates
- `54-63` Update values when we reach the extremes
- `65-68` If the data is within the correct range, call the hardware (`67`) to update the LED.
- `71-73` The infinite loop
